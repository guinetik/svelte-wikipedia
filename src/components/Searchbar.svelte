<script>
	import { createEventDispatcher } from 'svelte';
	import { _ } from 'svelte-i18n';
	import WikiApiClient from '../lib/WikiApiClient';
	import LanguageDropdown from './LanguageDropdown.svelte';
	const dispatch = createEventDispatcher();
	let searchTerm = '';
	const handleSearch = (e) => {
		dispatch('wiki-search', searchTerm);
	};
	export function clear() {
		searchTerm = '';
		WikiApiClient.searchApiUrl = null;
	}
</script>

<!-- Search field -->
<form class="mb-2 max-w-3xl sm:w-full searchbar" on:submit|preventDefault={handleSearch}>
	<div class="flex">
		<LanguageDropdown on:lang-change />
		<div class="relative w-full">
			<input
				type="search"
				bind:value={searchTerm}
				id="search-dropdown"
				class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
				placeholder={$_('search_placeholder')}
				required
			/>
			<button
				type="submit"
				class="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				><svg
					class="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/></svg
				></button
			>
		</div>
	</div>
</form>
