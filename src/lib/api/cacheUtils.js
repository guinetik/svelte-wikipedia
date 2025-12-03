/**
 * @file Cache Utilities - localStorage-based caching for API results
 * @module api/cacheUtils
 */

/**
 * Cache key prefix for featured articles
 * @type {string}
 */
const CACHE_PREFIX = 'wiki_featured_';

/**
 * Check if localStorage is available
 * @returns {boolean} True if localStorage is supported and accessible
 */
function isLocalStorageAvailable() {
	try {
		const test = '__localStorage_test__';
		localStorage.setItem(test, test);
		localStorage.removeItem(test);
		return true;
	} catch (e) {
		return false;
	}
}

/**
 * Generate cache key for a language and date combination
 * Format: wiki_featured_{language}:{YYYY-MM-DD}
 * 
 * @param {string} language - Two-letter language code (e.g., 'en', 'es')
 * @param {Date} date - The date to generate cache key for
 * @returns {string} Cache key string
 */
export function getCacheKey(language, date) {
	if (!language || !date) {
		throw new Error('Language and date are required for cache key');
	}
	
	const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
	return `${CACHE_PREFIX}${language}:${dateStr}`;
}

/**
 * Retrieve cached articles for a specific language and date
 * Returns null if cache miss or error occurs
 * 
 * @param {string} language - Two-letter language code
 * @param {Date} date - The date to retrieve cache for
 * @returns {Array|null} Cached articles array or null if not found/invalid
 */
export function getCachedArticles(language, date) {
	if (!isLocalStorageAvailable()) {
		return null;
	}

	try {
		const cacheKey = getCacheKey(language, date);
		const cachedData = localStorage.getItem(cacheKey);
		
		if (!cachedData) {
			return null;
		}

		const parsed = JSON.parse(cachedData);

		// Validate cached data structure
		if (!Array.isArray(parsed)) {
			console.warn(`Invalid cache data format for ${cacheKey}, clearing...`);
			localStorage.removeItem(cacheKey);
			return null;
		}

		return parsed;
	} catch (error) {
		// Handle JSON parse errors or other issues
		console.warn(`Error reading cache for ${language}:${date.toISOString().split('T')[0]}:`, error);
		return null;
	}
}

/**
 * Store articles in localStorage cache
 * Uses the resolved date (the date that actually had data) for cache key
 * 
 * @param {string} language - Two-letter language code
 * @param {Date} date - The resolved date (date that actually had data)
 * @param {Array} articles - Processed articles array to cache
 * @returns {boolean} True if cache was stored successfully, false otherwise
 */
export function setCachedArticles(language, date, articles) {
	if (!isLocalStorageAvailable()) {
		return false;
	}

	if (!Array.isArray(articles)) {
		console.warn('Cannot cache non-array articles data');
		return false;
	}

	try {
		const cacheKey = getCacheKey(language, date);
		const serialized = JSON.stringify(articles);
		localStorage.setItem(cacheKey, serialized);
		return true;
	} catch (error) {
		// Handle quota exceeded or other localStorage errors
		if (error.name === 'QuotaExceededError' || error.code === 22) {
			console.warn('localStorage quota exceeded, cannot cache articles');
		} else {
			console.warn(`Error storing cache for ${language}:${date.toISOString().split('T')[0]}:`, error);
		}
		return false;
	}
}

/**
 * Clear all featured articles cache entries
 * Useful for cache invalidation or debugging
 * 
 * @returns {number} Number of cache entries cleared
 */
export function clearCache() {
	if (!isLocalStorageAvailable()) {
		return 0;
	}

	let clearedCount = 0;
	try {
		const keysToRemove = [];
		
		// Find all cache keys with our prefix
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key && key.startsWith(CACHE_PREFIX)) {
				keysToRemove.push(key);
			}
		}

		// Remove all matching keys
		keysToRemove.forEach(key => {
			localStorage.removeItem(key);
			clearedCount++;
		});
	} catch (error) {
		console.warn('Error clearing cache:', error);
	}

	return clearedCount;
}

