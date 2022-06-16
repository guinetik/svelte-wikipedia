import { writable, derived } from 'svelte/store';
let searchResultsStore = writable([]);
let featuredResultsStore = writable([]);
const WikiApiClient = {
	language: 'en',
	SEARCH_BASE_URL: 'https://:lang.wikipedia.org/w/api.php',
	FEATURED_BASE_URL:
		'https://wikimedia.org/api/rest_v1/metrics/pageviews/top/:lang.wikipedia.org/all-access/:date',
	searchApiUrl: '',
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
	searchResults: derived(searchResultsStore, ($res) => {
		let itens = [];
		console.log('new search results:', $res);
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
		console.log('featured articles:', $res);
		return $res.sort((a, b) => a.tags[0] - b.tags[0]);
	}),
	search: (searchTerm) => {
		console.log('searching for ', searchTerm);
		WikiApiClient.searchApiUrl = WikiApiClient.getSearchApiUrl(searchTerm);
		WikiApiClient.fetch(WikiApiClient.searchApiUrl, searchResultsStore);
	},
	getFeaturedPosts: async () => {
		let url = WikiApiClient.FEATURED_BASE_URL.replaceAll(
			':lang',
			WikiApiClient.language
		).replaceAll(
			':date',
			new Date(Date.now() - 86400000).toJSON().slice(0, 10).replaceAll('-', '/')
		);
		//
		fetch(url)
			.then((response) => response.json())
			.then(async (data) => {
				const result = [];
				if (data.items && data.items.length > 0) {
					const apiItems = data.items;
					const articles = apiItems[0].articles;
					if (articles) {
						// I'm putting some less-relevant pages in a ban list so it displays better
						let banned = [
							'Main_Page',
							'Special:Search',
							'Wikipédia:Página_principal',
							'Especial:Pesquisar',
							'Wikipedia:Featured pictures'
						];
						let rank = 1;
						await articles
							.filter((i) => !banned.includes(i.article)) // filtering out banned articles
							.slice(0, 100) //getting the top itens
							.forEach(async (item) => {
								const pageDetails = await WikiApiClient.getPageDetails(item.article);
								//console.log("pageDetails", pageDetails);
								if (!pageDetails.title.toLowerCase().includes('not found')) {
									let image = pageDetails.thumbnail ? pageDetails.thumbnail.source : null;
									if (image) {
										if (image.includes('px-')) {
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
										}
									}
									result.push({
										i: rank,
										title: pageDetails.title,
										tags: ['Top {}'.replace('{}', rank), '{} views'.replace('{}', item.views)],
										link: pageDetails.content_urls ? pageDetails.content_urls.desktop.page : '/',
										image: image,
										text: pageDetails.extract || pageDetails.description
									});
								}
								//update the store as itens are being loaded
								featuredResultsStore.set(result);
								rank++;
							});
					} else {
						featuredResultsStore.set([]);
					}
				} else {
					featuredResultsStore.set([]);
				}
			})
			.catch((error) => {
				console.log(error);
				return [];
			});
	},
	getPageDetails: async (page) => {
		let url = 'https://:lang.wikipedia.org/api/rest_v1/page/summary/:page?origin=*'
			.replaceAll(':lang', WikiApiClient.language)
			.replaceAll(':page', page);
		//
		const itemDetails = await fetch(url);
		const data = await itemDetails.json();
		return data;
	},
	fetch: (url, store) => {
		console.log('fecthing from:', url);
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				store.set(data);
			})
			.catch((error) => {
				console.log(error);
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
		console.log('language', WikiApiClient.language);
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
		WikiApiClient.getFeaturedPosts();
	}
};
export default WikiApiClient;
