<script>
	import { createEventDispatcher } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { searchStore } from '../lib/stores';

	const dispatch = createEventDispatcher();
	let searchTerm = '';
	let isLoading = false;

	// Subscribe to loading state from search store
	searchStore.isLoading.subscribe((loading) => {
		isLoading = loading;
	});

	/**
	 * Handle search form submission
	 * @param {Event} e - Form submit event
	 */
	const handleSearch = (e) => {
		if (searchTerm.trim() && !isLoading) {
			searchStore.search(searchTerm);
		}
		dispatch('wiki-search', searchTerm);
	};

	/**
	 * Clear the search term and reset search state
	 * Used when navigating home
	 */
	export function clear() {
		searchTerm = '';
		searchStore.clear();
	}
</script>

<!-- Search field -->
<form class="w-full searchbar" on:submit|preventDefault={handleSearch}>
	<div class="relative w-full group">
		<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 group-focus-within:text-cyan-400 transition-colors">
			{#if isLoading}
				<!-- Loading spinner -->
				<svg class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
			{:else}
				<!-- Search icon -->
				<svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
					<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
				</svg>
			{/if}
		</div>
		<input
			type="search"
			bind:value={searchTerm}
			id="search-field"
			class="search-input pl-10 pr-12 block w-full p-2.5"
			class:opacity-70={isLoading}
			placeholder={isLoading ? ($_('searching') || 'Searching...') : $_('search_placeholder')}
			disabled={isLoading}
			required
		/>
		<button
			type="submit"
			class="absolute top-0 right-0 h-full px-4 text-sm font-medium text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
			disabled={isLoading}
		>
			<span class="sr-only">Search</span>
			{#if isLoading}
				<svg class="w-4 h-4 animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
				</svg>
			{:else}
				<svg class="w-4 h-4 transform rotate-0 hover:rotate-90 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
				</svg>
			{/if}
		</button>
	</div>
</form>
