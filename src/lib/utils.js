import { dev } from '$app/env';
import { goto } from '$app/navigation';
// something about svelte doesnt let me use links if i set a base
// https://github.com/sveltejs/kit/issues/4528
// so I created this little function that checks if it's dev, if not it appends the base path.
// I tried fetching the base path from the svelte.config.js but it complained in runtime since it needs nojs deps
// So this is the best I got so far, which is not bad, but I have to edit this path should I change the hosting for production

/**
 * Base path for routing in production
 * In production, should be updated if hosting path changes
 * @type {string}
 */
const basePath = '/';

/**
 * Get the correct link path for routing
 * Handles dev vs production path routing differences
 * 
 * TODO: Extract base path from svelte.config.js at runtime
 * 
 * @param {string} page - The page path to link to
 * @returns {string} The full path for the link
 */
export function getLink(page) {
	return page;
	/* if (dev) return page;
	else {
		return page !== '/' ? basePath + '/' + page : basePath;
	} */
}

/**
 * Redirect user to home page if on any other page
 * Used in layout to enforce single-page structure
 * 
 * @param {Object} currentPage - The current page object from SvelteKit
 * @param {Object} currentPage.url - URL object with pathname property
 * @returns {void}
 */
export function redirectHome(currentPage) {
	if(dev) {
		if (currentPage.url.pathname !== '/') goto('/');
	} else {
		//console.log("c", currentPage.url.pathname);
		if(currentPage.url.pathname.includes != basePath + '/') goto(basePath + '/');
	}
}
// A small function to fix the transitions on svelte
// https://github.com/sveltejs/svelte/issues/4735

/**
 * Fix Svelte transitions by ensuring proper ownerDocument property
 * 
 * Workaround for Svelte issue: https://github.com/sveltejs/svelte/issues/4735
 * Some transition libraries expect DOM elements to have ownerDocument,
 * which may not be available during SSR or in certain contexts.
 * 
 * @param {Function} transtion - The transition function to wrap
 * @returns {Function} Wrapped transition function with ownerDocument fix
 */
export function fix(transtion) {
	return function (node, params) {
		if (!node.hasOwnProperty('ownerDocument')) {
			Object.defineProperty(node, 'ownerDocument', {
				get: function () {
					return node.parentElement;
				}
			});
			let elem = node;
			while (elem.parentElement) {
				elem = elem.parentElement;
			}
			node.parentElement.head = elem;
		}
		return transtion(node, params);
	};
}

/**
 * Get yesterday's date at 00:00:00 UTC
 * Used for fetching featured articles from the previous day
 * 
 * @param {Date} d - The reference date
 * @returns {Date} Yesterday's date at 00:00 UTC
 */
export function getYesterday(d) {
    const yesterday = new Date();
    yesterday.setDate(d.getDate() - 1);
    yesterday.setHours(0);
    return yesterday;
}

/**
 * Get tomorrow's date at 00:00:00 UTC
 * Utility function for date calculations
 * 
 * @param {Date} d - The reference date
 * @returns {Date} Tomorrow's date at 00:00 UTC
 */
export function getTomorrow(d) {
    const tomorrow = new Date();
    tomorrow.setDate(d.getDate() + 1);
    tomorrow.setHours(0);
    return tomorrow;
}