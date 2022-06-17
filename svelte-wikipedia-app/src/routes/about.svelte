<script>
	import { fade } from 'svelte/transition';
</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<section class="grid" in:fade out:fade>
	<article class="flex justify-center">
		<div class="mt-2">
			<h1 class="dark:text-white text-gray-800 text-6xl">Svelte Wikipedia Search</h1>
			<p class="mt-3 dark:text-gray-300 leading-10">
				A small app I build to study the <a
					class="text-blue-500 dark:text-cyan-300 hover:text-blue-700 dark:hover:text-cyan-500 hover:underline"
					href="https://svelte.dev/">Svelte</a
				>
				frontend framework.
				<br />
				It uses
				<a
					class="text-blue-500 dark:text-cyan-300 hover:text-blue-700 dark:hover:text-cyan-500 hover:underline"
					href="https://www.mediawiki.org/wiki/API:Main_page/pt-br">Wikimedia API</a
				>
				to fetch searched pages.
				<br />
				Also the most visited pages are displayed once the app loads.
				<br />
				For styling I used
				<a
					class="text-blue-500 dark:text-cyan-300 hover:text-blue-700 dark:hover:text-cyan-500 hover:underline"
					href="https://tailwindcss.com/">TailwindCSS</a
				>
				with some pre-build components by
				<a
					class="text-blue-500 dark:text-cyan-300 hover:text-blue-700 dark:hover:text-cyan-500 hover:font-bold"
					href="https://flowbite.com/">Flowbite</a
				>.
			</p>
		</div>
	</article>
</section>
