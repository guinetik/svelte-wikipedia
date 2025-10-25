<script>
	/**
	 * WikiArticleGrid - Responsive grid layout for displaying Wikipedia articles
	 * Adapts column count based on screen size
	 */
	import WikiArticle from '../components/WikiArticle.svelte';
	
	/**
	 * Array of articles to display
	 * @type {Array}
	 */
	export let articles = [];
</script>

<section class="w-full">
	<div
		class="px-4 md:px-6 lg:px-8 grid gap-4 md:gap-6 
		grid-cols-1 
		sm:grid-cols-2 
		md:grid-cols-3 
		lg:grid-cols-4 
		xl:grid-cols-4 
		2xl:grid-cols-4"
	>
		{#each articles as wikiArticle (wikiArticle.i)}
			<WikiArticle article={wikiArticle} />
		{/each}
	</div>
</section>

<style>
	/* Grid items will fill available space */
	:global(.grid > *) {
		min-height: 0;
	}
</style>
