<script>
	import Searchbar from './Searchbar.svelte';
	import Nav from './Nav.svelte';
</script>

<header
	class="border-b md:flex md:items-center md:justify-between p-4 pb-0 shadow-lg md:pb-4 dark:bg-gray-800"
>
	<!-- Logo text or image -->
	<div class="flex items-center justify-between mb-4 md:mb-0">
		<img
			alt="logo"
			width="54"
			height="54"
			class="pr-2"
			src="https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/155px-Wikipedia-logo-v2.svg.png"
		/>
		<h1 class="leading-none text-2xl text-grey-darkest">
			<a class="no-underline text-grey-darkest hover:text-black dark:text-white" href="#">
				Wiki Search
			</a>
		</h1>
		<a class="text-black hover:text-orange md:hidden" href="#">
			<i class="fa fa-2x fa-bars" />
		</a>
	</div>
	<!-- END Logo text or image -->
	<Searchbar on:wiki-search on:lang-change/>
	<!-- END Search field -->
	<!-- Global navigation -->
	<Nav />
	<!-- END Global navigation -->
</header>
