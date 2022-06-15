import { writable, derived } from 'svelte/store';
let apiData = writable({});
const WikiApiClient = {
	language: 'en',
	BASE_URL: 'https://:lang.wikipedia.org/w/api.php',
	apiUrl: '',
	REQUEST_OPTIONS: {
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
	searchResults: derived(apiData, ($apiData) => {
		let itens = [];
		console.log("data changed:", $apiData);
		if ($apiData.query) {
			Object.entries($apiData.query.pages).forEach((p) => {
				const [pageId, page] = p;
				const item = {
					title: page.title,
					text: page.extract ? page.extract : '',
					tags: page.terms.alias ? page.terms.alias : [],
					link: page.canonicalurl,
					image: page.thumbnail ? page.thumbnail.source : ''
				};
				itens.push(item);
			});
		}
		return itens;
	}),
	search: (searchTerm) => {
		console.log('searching for ', searchTerm);
		WikiApiClient.apiUrl = WikiApiClient.getSearchApiUrl(searchTerm);
		WikiApiClient.fetch();
	},
	fetch: () => {
		console.log("fecthing from:", WikiApiClient.apiUrl);
		fetch(WikiApiClient.apiUrl)
			.then((response) => response.json())
			.then((data) => {
				// console.log(data);
				apiData.set(data);
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
			Object.entries(WikiApiClient.REQUEST_OPTIONS).reduce((total, pair) => {
				const [key, value] = pair;
				return total + '&' + key + '=' + value;
			}, '');
		return WikiApiClient.getApiBaseURL() + options;
	},
	getApiBaseURL: () => {
		console.log('language', WikiApiClient.language);
		return WikiApiClient.BASE_URL.replaceAll(':lang', WikiApiClient.language);
	},
	setLanguage: (lang) => {
		// getting the previous api url
		const pApiUrl = WikiApiClient.getApiBaseURL();
		// setting the current language
		WikiApiClient.language = lang;
		// calling the method again to get the update language url
		const cApiUrl = WikiApiClient.getApiBaseURL();
		// if we already perform a search, let's refresh with the new language settings
		if (WikiApiClient.apiUrl) {
			WikiApiClient.apiUrl = WikiApiClient.apiUrl.replaceAll(pApiUrl, cApiUrl);
			WikiApiClient.fetch();
		}
	}
};
export default WikiApiClient;
