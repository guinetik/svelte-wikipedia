<script>
	import * as easingFunctions from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import { fix } from '../lib/utils';

	/**
	 * Article data object containing Wikipedia article details
	 * @type {{title: string, text: string, tags: string[], link: string, image: string, i: number}}
	 */
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
	 * @type {string[]}
	 */
	$: tagsToDisplay = Array.isArray(article.tags) ? article.tags : [];

	/**
	 * Extract views tag from the tags array (for separate display)
	 * @type {string|null}
	 */
	$: viewsTag = tagsToDisplay.find(tag => tag.includes('views'));
</script>

<a 
	href={article.link} 
	target="_blank" 
	rel="noopener noreferrer"
	class="wiki-card group relative overflow-hidden !p-0 block h-[550px] hover:no-underline"
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
		<div class="absolute inset-0 z-0 h-full">
			<img 
				alt={article.title} 
				src={article.image} 
				class="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110 opacity-100" 
			/>
		</div>
	{/if}
	
	<!-- Compact gradient overlay at bottom -->
	<div class="absolute bottom-0 w-full z-20 bg-gradient-to-t from-black via-black to-transparent pt-20 pb-5 px-5">
		<h2 class="card-title font-bold text-2xl leading-tight text-white group-hover:text-cyan-400 transition-colors drop-shadow-lg mb-2">
			{article.title}
		</h2>
		
		{#if article.text}
			<p class="card-description text-sm text-gray-300 leading-snug mb-3 drop-shadow-sm">
				{article.text}
			</p>
		{/if}
		
		{#if viewsTag}
			<span class="inline-block bg-cyan-500/20 border border-cyan-400/30 rounded px-2.5 py-1 text-xs font-semibold text-cyan-300 backdrop-blur-sm">
				{viewsTag}
			</span>
		{/if}
	</div>
</a>

<style>
	/* Allow multiline title wrapping */
	.card-title {
		line-height: 1.3;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}
	
	.card-description {
		display: -webkit-box !important;
		-webkit-line-clamp: 4 !important;
		-webkit-box-orient: vertical !important;
		overflow: hidden !important;
		text-overflow: ellipsis !important;
		max-height: 5.5em;
		line-height: 1.4;
	}
</style>
