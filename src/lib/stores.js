/**
 * @file Unified Stores - Bridge between API factories and Svelte stores
 * @module lib/stores
 */

import { writable, derived } from 'svelte/store';
import { createSearchApi } from './api/searchApi';
import { createFeaturedApi } from './api/featuredApi';
import { DEFAULT_LANGUAGE } from './api/apiConfig';
import { stripHtmlTags } from './api/apiUtils';

/**
 * Initialize search store and API
 */
function createSearchStore() {
	const rawResults = writable({});
	const isLoading = writable(false);
	let searchApi = createSearchApi(DEFAULT_LANGUAGE);

	const results = derived(rawResults, ($res) => {
		let items = [];
		if ($res && $res.query && $res.query.pages) {
			let i = 0;
			Object.entries($res.query.pages).forEach((p) => {
				const [pageId, page] = p;
				if (!page || !page.title) return;

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
		isLoading,

		search: async (searchTerm) => {
			isLoading.set(true);
			try {
				const data = await searchApi.search(searchTerm);
				rawResults.set(data);
			} catch (error) {
				console.error('Search failed:', error);
				rawResults.set({ error: true, message: error.message });
			} finally {
				isLoading.set(false);
			}
		},

		setLanguage: async (lang) => {
			const oldLanguage = searchApi.getLanguage();
			searchApi.setLanguage(lang);

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

		clear: () => { rawResults.set({}); },
		getLanguage: () => searchApi.getLanguage()
	};
}

/**
 * Initialize featured store and API
 */
function createFeaturedStore() {
	const rawFeatured = writable({
		status: 'idle',
		data: null,
		requestedDate: null,
		message: null
	});

	const isLoading = writable(false);
	let featuredApi = createFeaturedApi(DEFAULT_LANGUAGE);

	const articles = derived(rawFeatured, ($res) => {
		if ($res.data && Array.isArray($res.data)) {
			return $res.data;
		}
		return [];
	});

	return {
		articles,
		isLoading,

		/**
		 * Fetch featured articles for a specific date
		 */
		fetchForDate: async (date) => {
			isLoading.set(true);
			rawFeatured.update(state => ({
				...state,
				status: 'loading',
				requestedDate: date,
				data: null
			}));

			try {
				const result = await featuredApi.fetchFeatured(date);

				rawFeatured.set({
					status: result.status,
					data: result.data,
					requestedDate: date,
					message: result.message || null
				});
			} catch (error) {
				console.error('Failed to fetch featured articles:', error);
				rawFeatured.set({
					status: 'error',
					message: error.message,
					requestedDate: date,
					data: null
				});
			} finally {
				isLoading.set(false);
			}
		},

		setLanguage: (lang) => { featuredApi.setLanguage(lang); },
		getLanguage: () => featuredApi.getLanguage(),
		getRawStore: () => rawFeatured
	};
}

/**
 * Create global loading state store
 */
function createLoadingStore() {
	return writable(false);
}

// Export singleton instances
export const searchStore = createSearchStore();
export const featuredStore = createFeaturedStore();
export const loadingStore = createLoadingStore();
