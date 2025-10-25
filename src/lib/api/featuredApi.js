/**
 * @file Featured API - Handles fetching and processing trending Wikipedia articles
 * @module api/featuredApi
 */

import { REST_API_CONFIG, WIKIMEDIA_CONFIG, BANNED_PAGES } from './apiConfig';
import { normalizeImageUrl, isErrorResponse, extractArticleText, extractArticleUrl } from './apiUtils';
import { getYesterday } from '../utils';

/**
 * Creates a featured articles handler for a specific language
 * Manages state for featured article requests with retry logic
 * 
 * @param {string} language - Two-letter language code
 * @returns {Object} Featured articles API object with methods
 */
export function createFeaturedApi(language = 'en') {
	let currentLanguage = language;
	let retries = 0;
	let lastFeaturedDate = new Date();

	/**
	 * Convert a date to the format expected by Wikimedia API (YYYY/MM/DD)
	 * @param {Date} date - The date to format
	 * @returns {string} Formatted date
	 */
	function formatDateForApi(date) {
		const iso = date.toJSON().slice(0, 10);
		return iso.replace(/-/g, '/');
	}

	/**
	 * Build the Wikimedia pageviews API URL for a specific date
	 * @param {Date} date - The date to fetch data for
	 * @returns {string} Complete API URL
	 */
	function buildFeaturedUrl(date) {
		return WIKIMEDIA_CONFIG.pageviewsUrl
			.replace(':lang', currentLanguage)
			.replace(':date', formatDateForApi(date));
	}

	/**
	 * Fetch page details from Wikipedia REST API
	 * Provides fallback if REST API is unavailable
	 * 
	 * @param {string} pageTitle - Wikipedia page title
	 * @returns {Promise<Object>} Page details or error object
	 */
	async function fetchPageDetails(pageTitle) {
		const url = REST_API_CONFIG.summaryUrl
			.replace(':lang', currentLanguage)
			.replace(':page', encodeURIComponent(pageTitle));

		try {
			const response = await fetch(url);

			if (!response.ok) {
				console.warn(`Failed to fetch page ${pageTitle}: ${response.status}`);
				return { error: true, status: response.status };
			}

			const data = await response.json();
			return data;
		} catch (error) {
			console.error(`Error fetching page details for ${pageTitle}:`, error);
			return { error: true, message: error.message };
		}
	}

	/**
	 * Process a single featured article
	 * Enriches with full page details, images, and text
	 * 
	 * @param {Object} viewsItem - Item from pageviews API with article name and views
	 * @returns {Promise<Object|null>} Processed article object or null if invalid
	 */
	async function processArticle(viewsItem) {
		if (!viewsItem || !viewsItem.article) {
			return null;
		}

		// Check if article is in ban list
		if (BANNED_PAGES.includes(viewsItem.article)) {
			return null;
		}

		// Fetch full page details
		const pageDetails = await fetchPageDetails(viewsItem.article);

		// Validate response
		if (isErrorResponse(pageDetails)) {
			console.warn(`Skipping invalid article: ${viewsItem.article}`);
			return null;
		}

		// Ensure title exists
		if (!pageDetails.title) {
			console.warn(`Article missing title: ${viewsItem.article}`);
			return null;
		}

		// Process image URL
		let image = null;
		if (pageDetails.thumbnail?.source) {
			image = normalizeImageUrl(pageDetails.thumbnail.source, 400);
		}

		// Build article object
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
	 * Retry handler with exponential backoff
	 * Wikimedia API has delay - data is available next day
	 * 
	 * @param {Date} date - Date to retry for
	 * @param {Function} onRetry - Callback to invoke retry
	 * @returns {void}
	 */
	function handleRetry(date, onRetry) {
		if (retries < WIKIMEDIA_CONFIG.maxRetries) {
			const delay = WIKIMEDIA_CONFIG.retryBackoff * (1 + retries);
			console.log(`Retrying featured posts (attempt ${retries + 1}/${WIKIMEDIA_CONFIG.maxRetries}) with earlier date...`);
			retries++;
			if (onRetry) onRetry(getYesterday(date));
		} else {
			console.warn('Max retries reached for featured posts');
		}
	}

	/**
	 * Parse featured articles from Wikimedia API response
	 * Fetches details for each article and normalizes data
	 * 
	 * @param {Object} data - Raw response from Wikimedia pageviews API
	 * @returns {Promise<Array>} Processed articles array
	 */
	const parseFeatured = async (data) => {
		if (!data.items || data.items.length === 0) {
			return [];
		}

		const articles = data.items[0].articles;
		if (!articles || articles.length === 0) {
			return [];
		}

		// Process articles in parallel
		const processedArticles = await Promise.all(
			articles
				.slice(0, WIKIMEDIA_CONFIG.maxArticles)
				.map((item) => processArticle(item))
		);

		// Filter out nulls (invalid articles) and add rank
		return processedArticles
			.filter((article) => article !== null)
			.map((article, index) => ({
				...article,
				rank: index + 1,
				views_formatted: article.views.toLocaleString()
			}));
	};

	return {
		/**
		 * Get current language
		 * @returns {string} Language code
		 */
		getLanguage: () => currentLanguage,

		/**
		 * Set current language
		 * @param {string} lang - New language code
		 * @returns {void}
		 */
		setLanguage: (lang) => {
			currentLanguage = lang;
		},

		/**
		 * Fetch featured articles for a specific date
		 * Automatically retries with earlier dates if data isn't available yet
		 * Wikimedia API has a 24-hour delay - data for a given date is available the next day
		 * 
		 * @param {Date} date - Date to fetch featured articles for
		 * @param {Object} options - Configuration options
		 * @param {Function} [options.onSuccess] - Callback with articles array
		 * @param {Function} [options.onError] - Callback with error (only on max retries)
		 * @param {Function} [options.onRetry] - Callback for retry attempts
		 * @returns {Promise<Array>} Array of featured articles
		 */
		fetchFeatured: async (date, options = {}) => {
			const { onSuccess, onError, onRetry } = options;
			
			retries = 0;
			lastFeaturedDate = date;
			
			const attemptFetch = async (fetchDate) => {
				const url = buildFeaturedUrl(fetchDate);

				try {
					const response = await fetch(url);

					// 404 = no data available yet, try earlier date
					if (response.status === 404) {
						console.log(`No data for ${formatDateForApi(fetchDate)}, trying earlier date...`);
						
						if (retries < WIKIMEDIA_CONFIG.maxRetries) {
							retries++;
							const earlierDate = getYesterday(fetchDate);
							if (onRetry) onRetry(earlierDate);
							// Recursive retry with earlier date
							return attemptFetch(earlierDate);
						} else {
							// Max retries reached
							const error = new Error('No featured articles data available after maximum retries');
							console.warn(error.message);
							if (onError) onError(error);
							return [];
						}
					}

					// Other HTTP errors
					if (!response.ok) {
						throw new Error(`HTTP ${response.status}: ${response.statusText}`);
					}

					const data = await response.json();

					// Parse and process articles
					const articles = await parseFeatured(data);

					if (articles.length === 0) {
						// No articles in response, try earlier date
						if (retries < WIKIMEDIA_CONFIG.maxRetries) {
							retries++;
							const earlierDate = getYesterday(fetchDate);
							if (onRetry) onRetry(earlierDate);
							return attemptFetch(earlierDate);
						} else {
							const error = new Error('No articles found after maximum retries');
							console.warn(error.message);
							if (onError) onError(error);
							return [];
						}
					}

					if (onSuccess) onSuccess(articles);
					return articles;
				} catch (error) {
					// Network or parsing errors - don't retry, fail immediately
					console.error('Featured articles fetch error:', error);
					if (onError) onError(error);
					return [];
				}
			};

			return attemptFetch(date);
		},

		/**
		 * Parse featured articles from Wikimedia API response
		 * Fetches details for each article and normalizes data
		 * 
		 * @param {Object} data - Raw response from Wikimedia pageviews API
		 * @returns {Promise<Array>} Processed articles array
		 */
		parseFeatured: parseFeatured,

		/**
		 * Get the last featured date that was requested
		 * @returns {Date} Last featured date
		 */
		getLastFeaturedDate: () => lastFeaturedDate
	};
}


