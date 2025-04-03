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
</script>

<article
	class="rounded overflow-hidden shadow-lg 
	bg-white
	dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
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
		<div class="bg-white">
			<a href={article.link} target="_blank" class="dark:text-cyan-300 text-blue-600">
				<img alt={article.title} src={article.image} class="w-full z-10 object-top object-covers" />
			</a>
		</div>
	{/if}
	<div class="px-6 py-4">
		<a href={article.link} target="_blank" class="dark:text-cyan-300 text-blue-600">
			<h2 class="font-bold text-xl mb-2 hover:underline">{article.title}</h2>
		</a>
		{#if article.text}
			<p
				class="dark:text-gray-300 text-gray-700 text-base text-ellipsis {article.image
					? 'article-text'
					: 'article-text-expanded'}"
			>
				{article.text}
			</p>
		{/if}
	</div>
	<div class="px-6 pb-2">
		{#each article.tags as tag}
			<a
				target="_blank"
				href={tag.includes('views')
					? article.link
					: article.link.replace(article.link.split('/').pop(), tag)}
			>
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
		max-height: 109.2px;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.625;
	}
	.article-text-expanded {
		display: -webkit-box;
		max-height: 300;
		-webkit-line-clamp: 16;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.625;
	}
</style>
