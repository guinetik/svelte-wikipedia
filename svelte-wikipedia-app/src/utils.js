import { dev } from '$app/env';
// something about svelte doesnt let me use links if i set a base
// https://github.com/sveltejs/kit/issues/4528
// so I created this little function that checks if it's dev, if not it appends the base path.
// I tried fetching the base path from the svelte.config.js but it complained in runtime since it needs nojs deps
// So this is the best I got so far, which is not bad, but I have to edit this path should I change the hosting for production
const basePath = '/vanguard-js/svelte-wikipedia-app';
export function getLink(page) {
	if (dev) return page;
	else {
		return page !== '/' ? basePath + '/' + page : basePath;
	}
}
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
export function getYesterday(d) {
    // I'm not installing a dependency for this, so lets just do it in vanilla js
    const yesterday = new Date();
    yesterday.setDate(d.getDate() - 1);
    yesterday.setHours(0);
    return yesterday;
}

export function getTomorrow(d) {
    const yesterday = new Date();
    yesterday.setDate(d.getDate() + 1);
    yesterday.setHours(0);
    return yesterday;
}