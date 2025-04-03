import { writable, derived } from 'svelte/store';
import { getYesterday } from './utils';
export let searchResultsStore = writable([]);
export let featuredResultsStore = writable({});
Array.prototype.forEachAsyncParallel = async function (fn) {
	await Promise.all(this.map(fn));
};
const WikiApiClient = {
	retries:0,
	maxRetries:10,
	language: 'en',
	SEARCH_BASE_URL: 'https://:lang.wikipedia.org/w/api.php',
	FEATURED_BASE_URL:
		'https://wikimedia.org/api/rest_v1/metrics/pageviews/top/:lang.wikipedia.org/all-access/:date',
	searchApiUrl: null,
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
	// I'm putting some less-relevant pages in a ban list so it displays better
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
	featuredDate: new Date(),
	state: writable({ loading: false }),
	searchResults: derived(searchResultsStore, ($res) => {
		let itens = [];
		//console.log('new search results:', $res);
		if ($res.query) {
			let i = 0;
			Object.entries($res.query.pages).forEach((p) => {
				const [pageId, page] = p;
				const item = {
					i: i,
					title: page.title,
					text: page.extract ? page.extract : '',
					tags: page.terms.alias ? page.terms.alias : [],
					link: page.canonicalurl,
					image: page.thumbnail ? page.thumbnail.source : ''
				};
				itens.push(item);
				i++;
			});
		}
		return itens;
	}),
	featuredArticles: derived(featuredResultsStore, ($res) => {
		//console.log('featured articles:', $res);
		return $res;
	}),
	search: (searchTerm) => {
		//console.log('searching for ', searchTerm);
		WikiApiClient.searchApiUrl = WikiApiClient.getSearchApiUrl(searchTerm);
		WikiApiClient.fetch(WikiApiClient.searchApiUrl, searchResultsStore);
	},
	getFeaturedPosts: async (searchDate) => {
		// From the Wikimedia API Docs:
		/* 
		The data is loaded at the end of the timespan in question. 
		So data for 2015-12-01 will be loaded on 2015-12-02 00:00:00 UTC; 
		Data for 2015-11-10 18:00:00 UTC will be loaded on 2015-11-10 19:00:00 UTC; and so on. 
		The loading can take a long time 
		*/
		//This presents an interesting challenge because we want to get the featured articles from yesterday.
		// but there's no garantee that the api will have results depending on the time the user accesses the site
		//
		function retry() {
			if(WikiApiClient.retries < WikiApiClient.maxRetries) {
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
		//
		WikiApiClient.state.set({ ...WikiApiClient.state, loading: true });
		//
		fetch(url)
			.catch((error) => {
				WikiApiClient.state.set({ ...WikiApiClient.state, loading: false });
				console.error('API ERROR', error);
				
			})
			.then((response, a) => {
				//console.log("aaaa", a);
				WikiApiClient.state.set({ ...WikiApiClient.state, loading: false });
				if (response && response.status == 200) return response.json();
				else {
					return null;
				}
			})
			.then(async (data) => (data ? WikiApiClient.parseFeatured(data, searchDate) : retry()));
	},
	parseFeatured: async (data, searchDate) => {
		// resetting the store so the items disapear
		featuredResultsStore.set([]);
		// lets brace ourselves, this code is procedural AF
		const result = [];
		if (data.items && data.items.length > 0) {
			//checking if we have items
			const articles = data.items[0].articles;
			if (articles) {
				let rank = 1;
				await articles
					.filter((page) => !WikiApiClient.banned.includes(page.article)) // filtering out banned articles
					.slice(0, 50) //getting the top articles
					.forEachAsyncParallel(async (item) => {
						// here we use a modified forEach that awaits so we can fetch the details of an article and have the function wait for all entries to be filled
						const pageDetails = await WikiApiClient.getPageDetails(item.article);
						//console.log("pageDetails", pageDetails);
						if (!pageDetails.title.toLowerCase().includes('not found')) {
							let image = pageDetails.thumbnail ? pageDetails.thumbnail.source : null;
							// We get this thumbnail object, that sometimes have very low res images.
							// Thankfuly the images in Wikipedia have a paramerter to specify the width of the image
							// Example: 320px-Stack_Overflow_Home.png. Here I can change the 320 to something else
							// and the APi will try to return an image of that width
							if (image) {
								// but sometimes images don't have this px attribute so we need to check for that
								if (image.includes('px-')) {
									const s = image;
									image =
										s
											.split('/')
											.splice(0, s.split('/').length - 1)
											.join('/') +
										'/' +
										'400px' + //specifing a default width for all images
										s
											.split('/')
											.pop()
											.slice(s.split('/').pop().indexOf('px') + 2);
								}
							}
							//
							let article = {
								i: rank, //temporary "id" that will be reset later
								title: pageDetails.title,
								tags: ['{} views'.replace('{}', item.views.toLocaleString())],
								link: pageDetails.content_urls ? pageDetails.content_urls.desktop.page : '/',
								image: image,
								views: item.views,
								text: pageDetails.extract || pageDetails.description
							};
							result.push(article);
						}
						rank++;
					});
			}
		}
		WikiApiClient.featuredDate = searchDate;
		featuredResultsStore.set({ data: result, featuredDate: searchDate });
	},
	getPageDetails: async (page) => {
		let url = 'https://:lang.wikipedia.org/api/rest_v1/page/summary/:page?origin=*'
			.replaceAll(':lang', WikiApiClient.language)
			.replaceAll(':page', page);
		//
		WikiApiClient.state.set({ ...WikiApiClient.state, loading: true });
		const itemDetails = await fetch(url);
		WikiApiClient.state.set({ ...WikiApiClient.state, loading: false });
		const data = await itemDetails.json();
		return data;
	},
	fetch: (url, store) => {
		//console.log('fecthing from:', url);
		WikiApiClient.state.set({ ...WikiApiClient.state, loading: true });
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				store.set(data);
				WikiApiClient.state.set({ ...WikiApiClient.state, loading: false });
			})
			.catch((error) => {
				//console.log(error);
				WikiApiClient.state.set({ ...WikiApiClient.state, loading: false });
				return [];
			});
	},
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
	getApiBaseURL: () => {
		//console.log('language', WikiApiClient.language);
		return WikiApiClient.SEARCH_BASE_URL.replaceAll(':lang', WikiApiClient.language);
	},
	setLanguage: (lang) => {
		// getting the previous api url
		const pApiUrl = WikiApiClient.getApiBaseURL();
		// setting the current language
		WikiApiClient.language = lang;
		// calling the method again to get the update language url
		const cApiUrl = WikiApiClient.getApiBaseURL();
		// if we already perform a search, let's refresh with the new language settings
		if (WikiApiClient.searchApiUrl) {
			WikiApiClient.searchApiUrl = WikiApiClient.searchApiUrl.replaceAll(pApiUrl, cApiUrl);
			WikiApiClient.fetch(WikiApiClient.searchApiUrl, searchResultsStore);
		}
		// also lets refresh the featured posts
		WikiApiClient.getFeaturedPosts(WikiApiClient.featuredDate);
	}
};
export default WikiApiClient;
