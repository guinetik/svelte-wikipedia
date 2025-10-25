<script>
	import Searchbar from './Searchbar.svelte';
	import LanguageSelector from './LanguageSelector.svelte';
	import { getLink } from '../lib/utils';
	import { searchStore } from '../lib/stores';
	import { page } from '$app/stores';
	import { redirectHome } from '../lib/utils';

	let searchbar;
	let currentPage;
	page.subscribe((data) => (currentPage = data));

	/**
	 * Toggle mobile menu visibility
	 */
	const toggleMenu = () => {
		const menu = document.querySelector('.mobile-menu');
		menu.classList.toggle('hidden');
	};

	/**
	 * Navigate to home page and clear search
	 */
	const goHome = () => {
		searchStore.clear();
		searchbar.clear();
		redirectHome(currentPage);
	};

	/**
	 * Handle language changes
	 * @param {CustomEvent} event - Language change event
	 */
	const handleLanguageChange = (event) => {
		const newLanguage = event.detail;
		// Language change is handled in LanguageSelector itself
		// but we can bubble it up if needed for other components
	};
</script>

<header
	class="w-full border-b md:flex justify-between md:items-center p-4 pb-0 shadow-lg md:pb-4 dark:bg-gray-800 bg-white"
>
	<!-- Logo and title -->
	<div class="flex items-center justify-between mb-4 md:mb-0 md:flex-shrink-0">
		<div class="flex items-center cursor-pointer align-middle" on:click={goHome}>
			<img
				alt="logo"
				width="54"
				height="54"
				class="pr-2"
				src="logo.png"
			/>
			<h1 class="leading-none text-2xl text-grey-darkest flex-grow mt-2">
				<a
					class="no-underline text-grey-darkest hover:text-black dark:text-white dark:hover:text-cyan-300"
					href={getLink('/')}
				>
					Wiki Search
				</a>
			</h1>
		</div>

		<!-- Mobile menu button -->
		<div class="md:hidden">
			<button class="outline-none mobile-menu-button" on:click={toggleMenu}>
				<svg
					class="w-6 h-6 text-gray-900 dark:text-white hover:text-blue-500"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
		</div>
	</div>

	<!-- Search bar - centered -->
	<div class="flex-1 flex justify-center md:px-4 mb-2 md:mb-0">
		<Searchbar on:wiki-search bind:this={searchbar} />
	</div>

	<!-- Language selector - right side -->
	<div class="flex justify-end md:flex-shrink-0">
		<LanguageSelector on:lang-change={handleLanguageChange} />
	</div>
</header>
