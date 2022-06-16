<script>
	import Searchbar from './Searchbar.svelte';
	import Nav from './Nav.svelte';
	

	const toggleMenu = () => {
		const menu = document.querySelector(".mobile-menu");
		menu.classList.toggle("hidden");
	};
</script>

<header class="border-b md:flex justify-between md:items-center p-4 pb-0 shadow-lg md:pb-4 dark:bg-gray-800">
	<!-- Logo text or image -->
	<div class="flex items-center mb-4 md:mb-0">
		<img
			alt="logo"
			width="54"
			height="54"
			class="pr-2"
			src="https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/155px-Wikipedia-logo-v2.svg.png"
		/>
		<h1 class="leading-none text-2xl text-grey-darkest flex-grow">
			<a class="no-underline text-grey-darkest hover:text-black dark:text-white dark:hover:text-cyan-300" href="#">
				Wiki Search
			</a>
		</h1>
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
	<Searchbar
		on:wiki-search
		on:lang-change
	/>
	<div class="mobile-menu hidden md:flex items-center space-x-3 ">
		<Nav />
	</div>
</header>
