<script>
	import WikiArticleGrid from '../components/WikiArticleGrid.svelte';
	import WikiApiClient from '../WikiApiClient';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	//
	export let searchResults = [];
	export let featuredArticles = [];
	WikiApiClient.searchResults.subscribe((data) => {
		// console.log('new data', data);
		searchResults = data;
	});
	WikiApiClient.featuredArticles.subscribe((data) => {
		// console.log('app:featured', data);
		featuredArticles = data.sort((a, b) => {
			const va = a.views;
			const vb = b.views;
			if (va < vb) return 1;
			else if (va === vb) return 0;
			else return -1;
		});
		for (let i = 0; i < featuredArticles.length; i++) {
			console.log(i, featuredArticles[i].title);
			featuredArticles[i].i = 1 + i;
		}
	});
	onMount(async () => {
		console.log('app mounted!');
		await WikiApiClient.getFeaturedPosts();
	});
</script>

{#if searchResults.length > 0}
	<WikiArticleGrid articles={searchResults} />
{/if}
{#if searchResults.length == 0}
	{#if featuredArticles.length > 0}
		<WikiArticleGrid articles={featuredArticles} />
	{/if}
	{#if featuredArticles.length == 0}
		<section class="h-full" in:fade out:fade>
			<h1 class="text-center dark:text-white text-gray-800 text-8xl mt-10">
				Welcome to Wiki Search <aside class="mt-5 italic text-4xl dark:text-cyan-300 text-blue-500">
					Loading popular articles...
				</aside>
			</h1>
		</section>
	{/if}
{/if}
