/**
 * @file API Utilities - Common helper functions for API operations
 * @module api/apiUtils
 */

/**
 * Standardizes Wikipedia image URLs to a consistent width
 * 
 * Wikipedia returns images with URLs like: 
 * https://upload.wikimedia.org/wikipedia/.../320px-ImageName.png
 * 
 * This function changes the width prefix (320px) to a standard size (400px)
 * 
 * @param {string} imageUrl - The original image URL
 * @param {number} [targetWidth=400] - The desired image width in pixels
 * @returns {string} The modified image URL with new width, or original if processing fails
 * 
 * @example
 * // Returns: https://upload.wikimedia.org/wikipedia/.../400px-ImageName.png
 * normalizeImageUrl('https://upload.wikimedia.org/wikipedia/.../320px-ImageName.png', 400)
 */
export function normalizeImageUrl(imageUrl, targetWidth = 400) {
	if (!imageUrl || !imageUrl.includes('px-')) {
		return imageUrl;
	}

	try {
		const urlParts = imageUrl.split('/');
		const filename = urlParts.pop();
		const pxIndex = filename.indexOf('px');
		
		if (pxIndex === -1) {
			return imageUrl;
		}

		const newFilename = `${targetWidth}px${filename.slice(pxIndex + 2)}`;
		return [...urlParts, newFilename].join('/');
	} catch (error) {
		console.warn(`Failed to normalize image URL: ${imageUrl}`, error);
		return imageUrl;
	}
}

/**
 * Validates if an API response contains an error
 * Checks for common error indicators in Wikipedia API responses
 * 
 * @param {Object} response - The API response object
 * @returns {boolean} True if response indicates an error
 */
export function isErrorResponse(response) {
	if (!response) return true;
	if (response.error === true) return true;
	if (response.title && response.title.toLowerCase().includes('not found')) return true;
	return false;
}

/**
 * Extracts article text from different possible API response formats
 * Wikipedia APIs can return extract, description, or other text fields
 * 
 * @param {Object} pageDetails - Page details object from API
 * @returns {string} The best available text excerpt
 */
export function extractArticleText(pageDetails) {
	if (!pageDetails) return '';
	return pageDetails.extract || pageDetails.description || '';
}

/**
 * Extracts the article URL from different response formats
 * Handles both Wikipedia search API and REST API formats
 * 
 * @param {Object} pageDetails - Page details object from API
 * @returns {string} The Wikipedia page URL or fallback
 */
export function extractArticleUrl(pageDetails) {
	if (!pageDetails) return '/';
	
	// REST API format (page/summary)
	if (pageDetails.content_urls?.desktop?.page) {
		return pageDetails.content_urls.desktop.page;
	}
	
	// Search API format
	if (pageDetails.canonicalurl) {
		return pageDetails.canonicalurl;
	}
	
	return '/';
}

/**
 * Safely builds query parameters for URL
 * Filters out empty values and properly encodes parameters
 * 
 * @param {Object} params - Object with key-value pairs
 * @returns {string} Query string (without leading ?)
 */
export function buildQueryString(params) {
	return Object.entries(params)
		.filter(([, value]) => value !== undefined && value !== null && value !== '')
		.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
		.join('&');
}

/**
 * Formats view count for display
 * Example: 1000 -> "1,000", 1000000 -> "1,000,000"
 * 
 * @param {number} views - The view count
 * @returns {string} Formatted view count string
 */
export function formatViewCount(views) {
	if (typeof views !== 'number') return '0';
	return views.toLocaleString();
}


