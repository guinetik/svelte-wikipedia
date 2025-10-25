/**
 * @file Search API - Handles Wikipedia search functionality
 * @module api/searchApi
 */

import { SEARCH_CONFIG } from './apiConfig';
import { buildQueryString } from './apiUtils';

/**
 * Creates a search request handler for a specific language
 * Returns closures that maintain language state
 * 
 * @param {string} language - Two-letter language code (e.g., 'en', 'es')
 * @returns {Object} Search API object with methods
 * 
 * @example
 * const search = createSearchApi('en');
 * const url = search.buildSearchUrl('javascript');
 * const results = await search.search('javascript');
 */
export function createSearchApi(language = 'en') {
	let currentLanguage = language;
	let lastSearchUrl = null;

	return {
		/**
		 * Get the current language
		 * @returns {string} Current language code
		 */
		getLanguage: () => currentLanguage,

		/**
		 * Set the current language
		 * @param {string} lang - New language code
		 * @returns {void}
		 */
		setLanguage: (lang) => {
			currentLanguage = lang;
		},

		/**
		 * Build a complete search URL with query parameters
		 * 
		 * @param {string} searchTerm - The search query
		 * @returns {string} Complete API URL
		 */
		buildSearchUrl: (searchTerm) => {
			const baseUrl = SEARCH_CONFIG.baseUrl.replace(':lang', currentLanguage);
			const queryString = buildQueryString({
				gsrsearch: searchTerm,
				...SEARCH_CONFIG.defaultParams
			});
			return `${baseUrl}?${queryString}`;
		},

		/**
		 * Perform a Wikipedia search
		 * 
		 * @param {string} searchTerm - The term to search for
		 * @returns {Promise<Object>} API response with search results
		 * @throws {Error} If fetch fails or response is not ok
		 */
		search: async (searchTerm) => {
			if (!searchTerm || searchTerm.trim() === '') {
				throw new Error('Search term cannot be empty');
			}

			const url = this.buildSearchUrl(searchTerm);
			lastSearchUrl = url;

			try {
				const response = await fetch(url);
				
				if (!response.ok) {
					throw new Error(`HTTP ${response.status}: ${response.statusText}`);
				}

				const data = await response.json();
				return data;
			} catch (error) {
				console.error('Search API error:', error);
				throw error;
			}
		},

		/**
		 * Get the last search URL that was built
		 * Useful for refreshing searches when language changes
		 * 
		 * @returns {string|null} Last search URL or null if no search performed
		 */
		getLastSearchUrl: () => lastSearchUrl,

		/**
		 * Update the last search URL with a new language
		 * Used when switching languages to maintain search term
		 * 
		 * @param {string} oldLanguage - Previous language code
		 * @returns {string|null} Updated URL with new language, or null
		 */
		updateSearchUrlLanguage: (oldLanguage) => {
			if (!lastSearchUrl) return null;

			const oldBaseUrl = SEARCH_CONFIG.baseUrl.replace(':lang', oldLanguage);
			const newBaseUrl = SEARCH_CONFIG.baseUrl.replace(':lang', currentLanguage);
			lastSearchUrl = lastSearchUrl.replace(oldBaseUrl, newBaseUrl);
			return lastSearchUrl;
		}
	};
}


