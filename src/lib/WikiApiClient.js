import { writable, derived } from 'svelte/store';
import { getYesterday } from './utils';

/**
 * Store for search results from Wikipedia API
 * @type {import('svelte/store').Writable<Object>}
 */
export let searchResultsStore = writable([]);

/**
 * Store for featured results from Wikimedia API
 * @type {import('svelte/store').Writable<Object>}
 */
export let featuredResultsStore = writable({});

/**
 * Extends Array prototype with async parallel forEach
 * WARNING: This modifies the prototype. Consider using Promise.allSettled() instead.
 * @deprecated Use Promise.allSettled() for better practice
 */
Array.prototype.forEachAsyncParallel = async function (fn) {
	await Promise.all(this.map(fn));
};

/**
 * WikiApiClient - Handles all Wikipedia and Wikimedia API interactions
 * 
 * Features:
 * - Search across Wikipedia in multiple languages
 * - Fetch trending/featured articles with historical date support
 * - Automatic language switching
 * - Retry logic for API failures
 * - Store subscriptions for reactive updates
 * 
 * TODO: Refactor into separate modules (search, featured, utils)
 */
const WikiApiClient = {
	retries: 0,
	maxRetries: 10,
	language: 'en',
	SEARCH_BASE_URL: 'https://:lang.wikipedia.org/w/api.php',
	FEATURED_BASE_URL:
		'https://wikimedia.org/api/rest_v1/metrics/pageviews/top/:lang.wikipedia.org/all-access/:date',
	searchApiUrl: null,

	/**
	 * Search request parameters for Wikipedia API
	 * @type {Object}
	 */
	SEARCH_REQUEST_OPTIONS: {
		format: 'json',
		action: 'query',
		generator: 'search',
		gsrnamespace: 0,
		gsrlimit: 10,
		prop: 'pageimages|extracts|pageterms|images|info|extracts&inprop=url',
		pilimit: 'max',
		exintro: '',
		explaintext: '',
		exsentences: 1,
		exlimit: 'max',
		origin: '*',
		pithumbsize: 500
	},

	/**
	 * List of pages to filter out from results (not relevant for display)
	 * @type {string[]}
	 */
	banned: [
		'Wikipedia:Portada',
		'Main_Page',
		'Special:Search',
		'Wikipédia:Página_principal',
		'Especial:Pesquisar',
		'Wikipedia:Featured_pictures',
		'Wikipédia:Accueil_principal',
		'Portal:Current_events',
		'Wikipedia:Hauptseite',
		'Pagina_principale',
		'Help:IPA/English',
		'CEO',
		'Video_hosting_service',
		'F5_Networks',
		'File:',
		'Ficheiro:',
		'Help',
		'Ajuda'
	],

	/**
	 * Current date for featured articles
	 * @type {Date}
	 */
	featuredDate: new Date(),

	/**
	 * Loading state for API operations
	 * @type {import('svelte/store').Writable<{loading: boolean}>}
	 */
	state: writable({ loading: false }),

	/**
	 * Derived store - transforms raw search API response into article objects
	 * @type {import('svelte/store').Readable<Array>}
	 */
	searchResults: derived(searchResultsStore, ($res) => {
		let itens = [];
		if ($res.query) {
			let i = 0;
			Object.entries($res.query.pages).forEach((p) => {
				const [pageId, page] = p;
				const item = {
					i: i,
					title: page.title,
					text: page.extract ? page.extract : '',
					tags: page.terms?.alias ? page.terms.alias : [],
					link: page.canonicalurl,
					image: page.thumbnail ? page.thumbnail.source : ''
				};
				itens.push(item);
				i++;
			});
		}
		return itens;
	}),

	/**
	 * Derived store - transforms featured API response into article objects
	 * @type {import('svelte/store').Readable<Array>}
	 */
	featuredArticles: derived(featuredResultsStore, ($res) => {
		return $res;
	}),

	/**
	 * Search Wikipedia for articles matching a search term
	 * @param {string} searchTerm - The term to search for
	 * @returns {void}
	 */
	search: (searchTerm) => {
		WikiApiClient.searchApiUrl = WikiApiClient.getSearchApiUrl(searchTerm);
		WikiApiClient.fetch(WikiApiClient.searchApiUrl, searchResultsStore);
	},

	/**
	 * Fetch featured articles for a specific date
	 * 
	 * Note: Wikimedia API has a delay - data for a given date is available the next day.
	 * If data isn't available, automatically retries with exponential backoff.
	 * 
	 * @param {Date} searchDate - The date to fetch featured articles for
	 * @returns {Promise<void>}
	 */
	getFeaturedPosts: async (searchDate) => {
		/**
		 * Retry handler - uses exponential backoff if data isn't available yet
		 * @returns {void}
		 */
		function retry() {
			if (WikiApiClient.retries < WikiApiClient.maxRetries) {
				setTimeout(WikiApiClient.getFeaturedPosts, (1000 * WikiApiClient.retries) + 1, getYesterday(searchDate));
				WikiApiClient.retries++;
			} else {
				console.warn("MAX RETRIES REACHED! GIVING UP!");
			}
		}

		let url = WikiApiClient.FEATURED_BASE_URL.replaceAll(
			':lang',
			WikiApiClient.language
		).replaceAll(':date', searchDate.toJSON().slice(0, 10).replaceAll('-', '/'));

		WikiApiClient.state.set({ ...WikiApiClient.state, loading: true });

		fetch(url)
			.catch((error) => {
				WikiApiClient.state.set({ ...WikiApiClient.state, loading: false });
				console.error('API ERROR - Featured posts fetch failed:', error);
			})
			.then((response) => {
				WikiApiClient.state.set({ ...WikiApiClient.state, loading: false });
				if (response && response.status == 200) return response.json();
				else {
					featuredResultsStore.set({ data: null, status: 'wiki_no_data', featuredDate: searchDate });
					return null;
				}
			})
			.then(async (data) => (data ? WikiApiClient.parseFeatured(data, searchDate) : retry()));
	},

	/**
	 * Parse featured articles from API response and enrich with page details
	 * 
	 * This is the most complex function. For each featured article:
	 * 1. Fetch full page details from REST API
	 * 2. Filter out banned pages
	 * 3. Process and normalize image URLs (change image size)
	 * 4. Build article objects with all necessary data
	 * 
	 * @param {Object} data - Raw response from Wikimedia pageviews API
	 * @param {Date} searchDate - The date these articles are from
	 * @returns {Promise<void>}
	 */
	parseFeatured: async (data, searchDate) => {
		featuredResultsStore.set([]);
		const result = [];

		if (data.items && data.items.length > 0) {
			const articles = data.items[0].articles;
			if (articles) {
				let rank = 1;
				await articles
					.filter((page) => !WikiApiClient.banned.includes(page.article))
					.slice(0, 50)
					.forEachAsyncParallel(async (item) => {
						const pageDetails = await WikiApiClient.getPageDetails(item.article);
						
						// FIX: Check if pageDetails and title exist before accessing
						if (!pageDetails || !pageDetails.title) {
							console.warn(`Failed to fetch details for article: ${item.article}`);
							return;
						}

						// FIX: Add defensive check for toLowerCase
						if (pageDetails.title.toLowerCase().includes('not found')) {
							return;
						}

						let image = pageDetails.thumbnail ? pageDetails.thumbnail.source : null;

						// Process image URLs to standardize width
						if (image && image.includes('px-')) {
							try {
								const s = image;
								image =
									s
										.split('/')
										.splice(0, s.split('/').length - 1)
										.join('/') +
									'/' +
									'400px' +
									s
										.split('/')
										.pop()
										.slice(s.split('/').pop().indexOf('px') + 2);
							} catch (err) {
								console.warn(`Failed to process image URL: ${image}`, err);
								image = pageDetails.thumbnail.source;
							}
						}

						let article = {
							i: rank,
							title: pageDetails.title,
							tags: ['{} views'.replace('{}', item.views.toLocaleString())],
							link: pageDetails.content_urls ? pageDetails.content_urls.desktop.page : '/',
							image: image,
							views: item.views,
							text: pageDetails.extract || pageDetails.description
						};
						result.push(article);
						rank++;
					});
			}
		}

		WikiApiClient.featuredDate = searchDate;
		if (result.length > 0) {
			featuredResultsStore.set({ data: result, featuredDate: searchDate });
		} else {
			featuredResultsStore.set({ data: null, status: 'wiki_no_data', featuredDate: searchDate });
		}
	},

	/**
	 * Fetch page details from Wikipedia REST API
	 * 
	 * @param {string} page - The Wikipedia page title to fetch
	 * @returns {Promise<Object>} Page details object or error response
	 */
	getPageDetails: async (page) => {
		let url = 'https://:lang.wikipedia.org/api/rest_v1/page/summary/:page?origin=*'
			.replaceAll(':lang', WikiApiClient.language)
			.replaceAll(':page', page);

		WikiApiClient.state.set({ ...WikiApiClient.state, loading: true });
		
		try {
			const itemDetails = await fetch(url);
			WikiApiClient.state.set({ ...WikiApiClient.state, loading: false });
			
			// FIX: Check response status before parsing JSON
			if (!itemDetails.ok) {
				console.warn(`Failed to fetch page details for ${page}: ${itemDetails.status}`);
				return { error: true, status: itemDetails.status };
			}
			
			const data = await itemDetails.json();
			return data;
		} catch (error) {
			WikiApiClient.state.set({ ...WikiApiClient.state, loading: false });
			console.error(`Error fetching page details for ${page}:`, error);
			return { error: true, message: error.message };
		}
	},

	/**
	 * Generic fetch function for API calls
	 * Updates store with response data and manages loading state
	 * 
	 * @param {string} url - The URL to fetch from
	 * @param {import('svelte/store').Writable} store - The store to update with results
	 * @returns {void}
	 */
	fetch: (url, store) => {
		WikiApiClient.state.set({ ...WikiApiClient.state, loading: true });
		fetch(url)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP ${response.status}: ${response.statusText}`);
				}
				return response.json();
			})
			.then((data) => {
				store.set(data);
				WikiApiClient.state.set({ ...WikiApiClient.state, loading: false });
			})
			.catch((error) => {
				console.error('Fetch error:', error);
				WikiApiClient.state.set({ ...WikiApiClient.state, loading: false });
				// Optionally set error state in store
				store.set({ error: true, message: error.message });
			});
	},

	/**
	 * Build Wikipedia search API URL with query parameters
	 * 
	 * @param {string} searchTerm - The search term to encode in URL
	 * @returns {string} Complete API URL with all parameters
	 */
	getSearchApiUrl: (searchTerm) => {
		const options =
			'?gsrsearch=' +
			searchTerm +
			Object.entries(WikiApiClient.SEARCH_REQUEST_OPTIONS).reduce((total, pair) => {
				const [key, value] = pair;
				return total + '&' + key + '=' + value;
			}, '');
		return WikiApiClient.getApiBaseURL() + options;
	},

	/**
	 * Get the base URL for Wikipedia search API for the current language
	 * 
	 * @returns {string} Base API URL for current language
	 */
	getApiBaseURL: () => {
		return WikiApiClient.SEARCH_BASE_URL.replaceAll(':lang', WikiApiClient.language);
	},

	/**
	 * Change the current language and refresh all cached API calls
	 * 
	 * @param {string} lang - Two-letter language code (e.g., 'en', 'es', 'fr')
	 * @returns {void}
	 */
	setLanguage: (lang) => {
		const pApiUrl = WikiApiClient.getApiBaseURL();
		WikiApiClient.language = lang;
		const cApiUrl = WikiApiClient.getApiBaseURL();

		// Refresh search results if any exist
		if (WikiApiClient.searchApiUrl) {
			WikiApiClient.searchApiUrl = WikiApiClient.searchApiUrl.replaceAll(pApiUrl, cApiUrl);
			WikiApiClient.fetch(WikiApiClient.searchApiUrl, searchResultsStore);
		}

		// Refresh featured articles
		WikiApiClient.getFeaturedPosts(WikiApiClient.featuredDate);
	}
};

export default WikiApiClient;
