<script>
	import * as easingFunctions from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import { fix } from '../lib/utils';
	export let article = {
		title: 'Title',
		text: 'text',
		tags: ['tags'],
		link: 'https://en.wikipedia.org/wiki/JavaScript',
		image:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/JavaScript_screenshot.png/450px-JavaScript_screenshot.png'
	};

	/**
	 * Ensure tags is always an array
	 */
	$: tagsToDisplay = Array.isArray(article.tags) ? article.tags : [];
</script>

<article
	class="rounded overflow-hidden shadow-lg 
	bg-white h-full flex flex-col
	dark:bg-gray-700 dark:border-l-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
	in:fix(fly)={{
		y: 100 * article.i,
		duration: 1000,
		delay: (100 * article.i) % 10,
		easing: easingFunctions.cubicInOut
	}}
	out:fix(fade)={{
		duration: 500,
		easing: easingFunctions.expoInOut
	}}
>
	{#if article.image}
		<div class="w-full bg-gray-200 dark:bg-gray-600 overflow-hidden flex-shrink-0">
			<a href={article.link} target="_blank" class="dark:text-cyan-300 text-blue-600 block w-full">
				<img 
					alt={article.title} 
					src={article.image} 
					class="w-full h-auto object-cover object-top" 
				/>
			</a>
		</div>
	{/if}
	<div class="px-4 py-3 flex-1 flex flex-col">
		<a href={article.link} target="_blank" class="hover:underline">
			{#if article.image}
				<h2 class="font-bold text-lg leading-tight text-cyan-400 dark:text-cyan-300 line-clamp-2">{article.title}</h2>
			{:else}
				<h2 class="font-bold text-xl leading-tight text-cyan-400 dark:text-cyan-300 line-clamp-3">{article.title}</h2>
			{/if}
		</a>
		{#if article.text}
			<p class="{article.image ? 'article-description' : 'article-description-expanded'}">
				{article.text}
			</p>
		{/if}
	</div>
	<div class="px-4 pb-3 pt-2 flex-shrink-0 flex flex-wrap gap-1.5">
		{#each tagsToDisplay as tag}
			<a
				target="_blank"
				href={article.link && (tag.includes('views')
					? article.link
					: article.link.replace(article.link.split('/').pop(), tag)) || '#'}
			>
				<span
					class="article-tag inline-block bg-blue-100 dark:bg-blue-900 rounded-full px-3 py-1 text-gray-800 dark:text-blue-200"
					>{tag}</span
				>
			</a>
		{/each}
	</div>
</article>

<style>
	/* Utilities for expanded layouts */
	:global(.article-title-large) {
		@apply font-bold text-xl leading-tight text-gray-900 dark:text-white line-clamp-3;
	}

	:global(.article-description-expanded) {
		@apply text-sm leading-snug text-gray-700 dark:text-gray-300 flex-1 overflow-hidden;
	}
</style>
