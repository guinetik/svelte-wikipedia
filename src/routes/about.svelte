<script>
	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import { fix } from '../lib/utils';
</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<section class="grid" in:fix(fade) out:fix(fade)>
	<article class="flex justify-center">
		<div class="mt-2">
			<h1 class="dark:text-white text-gray-800 text-6xl">{$_('title')}</h1>
			<p class="mt-3 dark:text-gray-300 leading-10">
				🙋‍♂️ Hi everyone, <a href="http://guinetik.com">Guinetik</a> here,
				This is a small app I built to study the <a
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
					class="text-blue-500 dark:text-cyan-300 hover:text-blue-700 dark:hover:text-cyan-500 hover:underline"
					href="https://flowbite.com/">Flowbite</a
				>.
				<br />
				Check out the code on
				<a
					class="text-blue-500 dark:text-cyan-300 hover:text-blue-700 dark:hover:text-cyan-500 hover:underline"
					href="https://github.com/guinetik/svelte-wikipedia/">Github</a
				>!
				<br />
				<i
					>I know the app has internationalization but I'm not translating this about into 5
					languages lmao</i
				>
			</p>
		</div>
	</article>
</section>
