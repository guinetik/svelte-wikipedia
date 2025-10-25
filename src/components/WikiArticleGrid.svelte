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

	/**
	 * Ensure articles is always an array
	 */
	$: articlesToDisplay = Array.isArray(articles) ? articles : [];
</script>

<section class="w-full">
	<div
		class="px-4 md:px-6 lg:px-8 gap-4 md:gap-6
		columns-1 
		sm:columns-2 
		md:columns-3 
		lg:columns-4 
		xl:columns-4 
		2xl:columns-4"
	>
		{#each articlesToDisplay as wikiArticle (wikiArticle.i)}
			<div class="break-inside-avoid mb-4 md:mb-6">
				<WikiArticle article={wikiArticle} />
			</div>
		{/each}
	</div>
</section>

<style>
	/* Prevent card breaking across columns */
	:global(.break-inside-avoid) {
		break-inside: avoid;
	}
</style>
