/**
 * @file Unified Stores - Bridge between new API factories and Svelte stores
 * @module lib/stores
 * 
 * This module wraps the modular API factories (searchApi, featuredApi) with Svelte stores
 * to provide reactive state management for components.
 */

import { writable, derived } from 'svelte/store';
import { createSearchApi } from './api/searchApi';
import { createFeaturedApi } from './api/featuredApi';
import { DEFAULT_LANGUAGE } from './api/apiConfig';
import { stripHtmlTags } from './api/apiUtils';

/**
 * Initialize search store and API
 * @type {Object}
 */
function createSearchStore() {
	// Raw API response
	const rawResults = writable({});
	
	// API instance
	let searchApi = createSearchApi(DEFAULT_LANGUAGE);
	
	// Processed results (derived store)
	const results = derived(rawResults, ($res) => {
		let items = [];
		// Ensure we have a valid response with query and pages
		if ($res && $res.query && $res.query.pages) {
			let i = 0;
			Object.entries($res.query.pages).forEach((p) => {
				const [pageId, page] = p;
				// Skip pages without required data
				if (!page || !page.title) {
					return;
				}
				
				// Priority: Extract > Wikibase short description > fallback
				// Extracts are longer text snippets from the article (like featured articles)
				// Short descriptions are concise one-liners (e.g., "American actor", "Capital of France")
				// We keep pageprops as fallback in case extract is not available
				const text = stripHtmlTags(page.extract) || page.pageprops?.['wikibase-shortdesc'] || '';
				
				const item = {
					i: i,
					title: page.title || '',
					text: text,
					tags: (page.terms?.alias && Array.isArray(page.terms.alias)) ? page.terms.alias : [],
					link: page.canonicalurl || '/',
					image: page.thumbnail?.source || ''
				};
				items.push(item);
				i++;
			});
		}
		return items;
	});

	return {
		results,
		
		/**
		 * Perform a Wikipedia search
		 * @param {string} searchTerm - Term to search for
		 * @returns {Promise<void>}
		 */
		search: async (searchTerm) => {
			try {
				const data = await searchApi.search(searchTerm);
				rawResults.set(data);
			} catch (error) {
				console.error('Search failed:', error);
				rawResults.set({ error: true, message: error.message });
			}
		},
		
		/**
		 * Change language and refresh search if results exist
		 * @param {string} lang - Language code
		 * @returns {Promise<void>}
		 */
		setLanguage: async (lang) => {
			const oldLanguage = searchApi.getLanguage();
			searchApi.setLanguage(lang);
			
			// Refresh current search with new language
			const lastUrl = searchApi.getLastSearchUrl();
			if (lastUrl) {
				const updatedUrl = searchApi.updateSearchUrlLanguage(oldLanguage);
				if (updatedUrl) {
					try {
						const response = await fetch(updatedUrl);
						if (!response.ok) throw new Error(`HTTP ${response.status}`);
						const data = await response.json();
						rawResults.set(data);
					} catch (error) {
						console.error('Failed to refresh search with new language:', error);
					}
				}
			}
		},
		
		/**
		 * Clear search results
		 * @returns {void}
		 */
		clear: () => {
			rawResults.set({});
		},
		
		/**
		 * Get current language
		 * @returns {string}
		 */
		getLanguage: () => searchApi.getLanguage()
	};
}

/**
 * Initialize featured store and API
 * @type {Object}
 */
function createFeaturedStore() {
	// Raw API response
	const rawFeatured = writable({});
	
	// API instance
	let featuredApi = createFeaturedApi(DEFAULT_LANGUAGE);
	
	// Processed articles (derived store)
	const articles = derived(rawFeatured, ($res) => {
		if ($res.data && Array.isArray($res.data)) {
			return $res.data;
		}
		return [];
	});

	return {
		articles,
		
		/**
		 * Fetch featured articles for a specific date
		 * @param {Date} date - Date to fetch articles for
		 * @returns {Promise<void>}
		 */
		fetchForDate: async (date) => {
			try {
				const data = await featuredApi.fetchFeatured(date, {
					onSuccess: (articles) => {
						rawFeatured.set({ 
							data: articles, 
							featuredDate: date,
							status: 'success'
						});
					},
					onError: (error) => {
						// Only show error on final failure (after all retries exhausted)
						rawFeatured.set({ 
							status: 'error', 
							message: error.message,
							featuredDate: date
						});
					},
					onRetry: (newDate) => {
						// Silently retry with new date - don't show error toast
						console.log('Retrying featured articles for:', newDate.toISOString().split('T')[0]);
					}
				});
			} catch (error) {
				console.error('Failed to fetch featured articles:', error);
				rawFeatured.set({ 
					status: 'error', 
					message: error.message,
					featuredDate: date
				});
			}
		},
		
		/**
		 * Change language
		 * @param {string} lang - Language code
		 * @returns {void}
		 */
		setLanguage: (lang) => {
			featuredApi.setLanguage(lang);
		},
		
		/**
		 * Get current language
		 * @returns {string}
		 */
		getLanguage: () => featuredApi.getLanguage(),
		
		/**
		 * Get raw featured store for accessing status and error info
		 * @returns {import('svelte/store').Writable}
		 */
		getRawStore: () => rawFeatured
	};
}

/**
 * Create global loading state store
 * @returns {import('svelte/store').Writable}
 */
function createLoadingStore() {
	return writable(false);
}

// Export singleton instances
export const searchStore = createSearchStore();
export const featuredStore = createFeaturedStore();
export const loadingStore = createLoadingStore();
