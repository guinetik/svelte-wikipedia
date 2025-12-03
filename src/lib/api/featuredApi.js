/**
 * @file Featured API - Handles fetching and processing trending Wikipedia articles
 * @module api/featuredApi
 */

import { REST_API_CONFIG, WIKIMEDIA_CONFIG, BANNED_PAGES } from './apiConfig';
import { normalizeImageUrl, isErrorResponse, extractArticleText, extractArticleUrl } from './apiUtils';
import { getCachedArticles, setCachedArticles } from './cacheUtils';

/**
 * Creates a featured articles handler for a specific language
 * @param {string} language - Two-letter language code
 * @returns {Object} Featured articles API object with methods
 */
export function createFeaturedApi(language = 'en') {
	let currentLanguage = language;

	/**
	 * Convert a date to the format expected by Wikimedia API (YYYY/MM/DD)
	 */
	function formatDateForApi(date) {
		const iso = date.toJSON().slice(0, 10);
		return iso.replace(/-/g, '/');
	}

	/**
	 * Build the Wikimedia pageviews API URL for a specific date
	 */
	function buildFeaturedUrl(date) {
		return WIKIMEDIA_CONFIG.pageviewsUrl
			.replace(':lang', currentLanguage)
			.replace(':date', formatDateForApi(date));
	}

	/**
	 * Fetch page details from Wikipedia REST API
	 */
	async function fetchPageDetails(pageTitle) {
		const url = REST_API_CONFIG.summaryUrl
			.replace(':lang', currentLanguage)
			.replace(':page', encodeURIComponent(pageTitle));

		try {
			const response = await fetch(url);
			if (!response.ok) {
				return { error: true, status: response.status };
			}
			return await response.json();
		} catch (error) {
			return { error: true, message: error.message };
		}
	}

	/**
	 * Process a single featured article
	 */
	async function processArticle(viewsItem) {
		if (!viewsItem || !viewsItem.article) return null;
		if (BANNED_PAGES.includes(viewsItem.article)) return null;

		const pageDetails = await fetchPageDetails(viewsItem.article);
		if (isErrorResponse(pageDetails) || !pageDetails.title) return null;

		let image = null;
		if (pageDetails.thumbnail?.source) {
			image = normalizeImageUrl(pageDetails.thumbnail.source, 400);
		}

		return {
			title: pageDetails.title,
			text: extractArticleText(pageDetails),
			link: extractArticleUrl(pageDetails),
			image: image,
			views: viewsItem.views,
			tags: [viewsItem.views.toLocaleString() + ' views']
		};
	}

	/**
	 * Parse featured articles from Wikimedia API response
	 */
	const parseFeatured = async (data) => {
		if (!data.items || data.items.length === 0) return [];

		const articles = data.items[0].articles;
		if (!articles || articles.length === 0) return [];

		const processedArticles = await Promise.all(
			articles
				.slice(0, WIKIMEDIA_CONFIG.maxArticles)
				.map((item) => processArticle(item))
		);

		return processedArticles
			.filter((article) => article !== null)
			.map((article, index) => ({
				...article,
				rank: index + 1,
				views_formatted: article.views.toLocaleString()
			}));
	};

	return {
		getLanguage: () => currentLanguage,
		setLanguage: (lang) => { currentLanguage = lang; },

		/**
		 * Fetch featured articles for a specific date
		 * No retry logic - if no data, returns empty with no_data status
		 *
		 * @param {Date} date - Date to fetch featured articles for
		 * @param {Object} options - Configuration options
		 * @returns {Promise<Object>} Result with status and data
		 */
		fetchFeatured: async (date, options = {}) => {
			const { onSuccess, onError } = options;

			// Check cache first
			const cachedArticles = getCachedArticles(currentLanguage, date);
			if (cachedArticles && cachedArticles.length > 0) {
				if (onSuccess) onSuccess(cachedArticles);
				return { status: 'success', data: cachedArticles };
			}

			const url = buildFeaturedUrl(date);

			try {
				const response = await fetch(url);

				// No data for this date
				if (response.status === 404) {
					if (onError) onError(new Error('No data available for this date'));
					return { status: 'no_data', data: [] };
				}

				if (!response.ok) {
					throw new Error(`HTTP ${response.status}: ${response.statusText}`);
				}

				const data = await response.json();
				const articles = await parseFeatured(data);

				if (articles.length === 0) {
					if (onError) onError(new Error('No articles found'));
					return { status: 'no_data', data: [] };
				}

				// Cache the results
				setCachedArticles(currentLanguage, date, articles);

				if (onSuccess) onSuccess(articles);
				return { status: 'success', data: articles };

			} catch (error) {
				console.error('Featured articles fetch error:', error);
				if (onError) onError(error);
				return { status: 'error', data: [], message: error.message };
			}
		},

		parseFeatured: parseFeatured
	};
}
