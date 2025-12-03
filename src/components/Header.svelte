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
	class="navbar w-full flex flex-col md:flex-row justify-between md:items-center p-4 shadow-lg"
>
	<!-- Logo and title -->
	<div class="flex items-center justify-between mb-4 md:mb-0 md:flex-shrink-0">
		<div class="flex items-center cursor-pointer align-middle" on:click={goHome}>
			<img
				alt="logo"
				width="40"
				height="40"
				class="pr-3"
				src="logo.png"
			/>
			<h1 class="leading-none text-xl font-bold tracking-tight text-white flex-grow">
				<a
					class="no-underline text-white hover:text-white/80 transition-colors"
					href={getLink('/')}
				>
					Wiki Search
				</a>
			</h1>
		</div>

		<!-- Mobile menu button -->
		<div class="md:hidden">
			<button class="outline-none mobile-menu-button text-white/70 hover:text-white transition-colors" on:click={toggleMenu}>
				<svg
					class="w-6 h-6"
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
	<div class="flex-1 flex justify-center md:px-8 mb-2 md:mb-0 max-w-2xl mx-auto w-full">
		<div class="w-full">
			<Searchbar on:wiki-search bind:this={searchbar} />
		</div>
	</div>

	<!-- Language selector - right side -->
	<div class="flex justify-end md:flex-shrink-0 md:ml-4">
		<LanguageSelector on:lang-change={handleLanguageChange} />
	</div>
</header>
