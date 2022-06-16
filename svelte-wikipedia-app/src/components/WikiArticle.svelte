<script>
	import { fade, fly } from 'svelte/transition';
	import * as easingFunctions from 'svelte/easing';
	export let article = {
		title: 'Title',
		text: 'text',
		tags: ['tags'],
		link: 'https://en.wikipedia.org/wiki/JavaScript',
		image:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/JavaScript_screenshot.png/450px-JavaScript_screenshot.png'
	};
</script>

<article
	class="rounded overflow-hidden shadow-lg dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
	in:fly={{
		y: 500 * article.i,
		duration: 1000,
		delay: 100 * article.i,
		easing: easingFunctions.cubicInOut
	}}
	out:fade
>
	{#if article.image}
		<div class="bg-white">
			<img alt={article.title} src={article.image} class="w-full z-10 object-center object-cover max-h-80" />
		</div>
	{/if}
	<div class="px-6 py-4">
		<a href={article.link} target="_blank" class="dark:text-cyan-300">
			<h2 class="font-bold text-xl mb-2 hover:underline">{article.title}</h2>
		</a>
		{#if article.text}
			<p class="dark:text-gray-300 text-gray-700 text-base article-text text-ellipsis">{article.text}</p>
		{/if}
	</div>
	<div class="px-6 pt-4 pb-2">
		{#each article.tags as tag}
			<a target="_blank" href="https://en.wikipedia.org/w/index.php?search={tag}">
				<span
					class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
					>{tag}</span
				>
			</a>
		{/each}
	</div>
</article>

<style>
	.article-text {
		display: -webkit-box;
		height: 109.2px;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.625;
	}
</style>
