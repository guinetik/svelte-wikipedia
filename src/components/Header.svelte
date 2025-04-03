<script>
	import Searchbar from './Searchbar.svelte';
	import Nav from './Nav.svelte';
	import { getLink } from '../lib/utils';
	import { searchResultsStore } from '../lib/WikiApiClient';
	import { page } from '$app/stores';
	import { redirectHome } from '../lib/utils';
	let searchbar;
	let currentPage;
	page.subscribe((data) => (currentPage = data));
	const toggleMenu = () => {
		const menu = document.querySelector('.mobile-menu');
		menu.classList.toggle('hidden');
	};

	const goHome = () => {
		searchResultsStore.set([]);
		searchbar.clear();
		redirectHome(currentPage);
	};
</script>

<header
	class="w-full border-b md:flex justify-between md:items-center p-4 pb-0 shadow-lg md:pb-4 dark:bg-gray-800 bg-white"
>
	<!-- Logo text or image -->
	<div class="flex items-center mb-4 md:mb-0">
		<div class="flex justify-center cursor-pointer align-middle" on:click={goHome}>
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
		<div class="md:hidden sm:flex">
			<button class="outline-none mobile-menu-button" on:click={toggleMenu}>
				<svg
					class=" w-6 h-6 text-white hover:text-green-500 "
					x-show="!showMenu"
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
	<Searchbar on:wiki-search on:lang-change bind:this={searchbar} />
	<div class="mobile-menu hidden md:flex items-center space-x-3 ">
		<Nav />
	</div>
</header>
