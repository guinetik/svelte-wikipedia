/**
 * @file API Configuration - Centralized configuration for all Wikipedia/Wikimedia APIs
 * @module api/apiConfig
 */

/**
 * Wikipedia Search API configuration
 * Uses the Wikipedia MediaWiki query API for full-text search
 * @type {Object}
 */
export const SEARCH_CONFIG = {
	/** Base URL for Wikipedia search API (language placeholder :lang) */
	baseUrl: 'https://:lang.wikipedia.org/w/api.php',
	
	/** Default parameters for search requests */
	defaultParams: {
		format: 'json',
		action: 'query',
		generator: 'search',
		gsrnamespace: 0,
		gsrlimit: 10,
		prop: 'pageimages|extracts|pageterms|info|pageprops',
		pilimit: 'max',
		exintro: 1,
		explaintext: 1,
		exsentences: 2,
		exlimit: 'max',
		origin: '*',
		pithumbsize: 500
	}
};

/**
 * Wikipedia REST API configuration
 * Used for fetching detailed page information
 * @type {Object}
 */
export const REST_API_CONFIG = {
	/** Base URL for page summary endpoint (language and page placeholders) */
	summaryUrl: 'https://:lang.wikipedia.org/api/rest_v1/page/summary/:page?origin=*',
	
	/** Request timeout in milliseconds */
	timeout: 10000
};

/**
 * Wikimedia API configuration
 * Used for fetching trending articles and page view statistics
 * @type {Object}
 */
export const WIKIMEDIA_CONFIG = {
	/** Base URL for pageviews API (language and date placeholders) */
	pageviewsUrl: 'https://wikimedia.org/api/rest_v1/metrics/pageviews/top/:lang.wikipedia.org/all-access/:date',
	
	/** Maximum retries when data isn't available (due to API lag) */
	maxRetries: 10,
	
	/** Initial retry backoff in milliseconds (exponentially increases) */
	retryBackoff: 1000,
	
	/** Maximum articles to process */
	maxArticles: 50
};

/**
 * Pages to exclude from results - not relevant for display
 * Includes meta pages, help pages, and technical articles
 * @type {string[]}
 */
export const BANNED_PAGES = [
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
];

/**
 * Supported languages for Wikipedia/Wikimedia APIs
 * Each has a language code and display name
 * @type {Array<{name: string, value: string}>}
 */
export const SUPPORTED_LANGUAGES = [
	{ name: 'English', value: 'en' },
	{ name: 'Português', value: 'pt' },
	{ name: 'Español', value: 'es' },
	{ name: 'Français', value: 'fr' },
	{ name: 'Italiano', value: 'it' },
	{ name: 'Deutsch', value: 'de' }
];

/**
 * Default language
 * @type {string}
 */
export const DEFAULT_LANGUAGE = 'en';


