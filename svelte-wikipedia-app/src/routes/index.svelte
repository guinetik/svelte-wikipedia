<script>
	import WikiArticleGrid from '../components/WikiArticleGrid.svelte';
	import WikiApiClient from '../WikiApiClient';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import {getTomorrow, getYesterday} from '../utils'
	//
	let searchResults = [];
	let featuredArticles = [];
	let featuredDate = new Date();
	let isFeaturedDateToday = true;
	WikiApiClient.searchResults.subscribe((data) => {
		// console.log('new data', data);
		searchResults = data;
	});
	WikiApiClient.featuredArticles.subscribe((result) => {
		if (result.data) {
			featuredDate = result.featuredDate;
			isFeaturedDateToday = checkDayBeforeTomorrow();
			featuredArticles = result.data.sort((a, b) => {
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
		}
	});
	onMount(async () => {
		console.log('app mounted!');
		await WikiApiClient.getFeaturedPosts(new Date());
	});
	const getFeaturedYesterday = () => {
		WikiApiClient.getFeaturedPosts(getYesterday(featuredDate));
	}
	const getFeaturedTomorrow = () => {
		if(checkDayBeforeTomorrow()) WikiApiClient.getFeaturedPosts(getTomorrow(featuredDate));
	}
	const checkDayBeforeTomorrow = () => {
		const t = new Date();
		t.setHours(0);
		const tomorrow = getTomorrow(featuredDate)
		return tomorrow.getTime() < t.getTime();
	}
</script>

{#if searchResults.length > 0}
	<WikiArticleGrid articles={searchResults} />
{/if}
{#if searchResults.length == 0}
	{#if featuredArticles.length > 0}
		<h1 class="text-center dark:text-white text-gray-800 text-5xl mt-4 italic">
			<span on:click={getFeaturedYesterday} class="dark:text-cyan-300 dark:hover:text-cyan-500 dark:active:text-cyan-700 hover:underline cursor-pointer">⇜</span>
			Most viewed articles for {featuredDate.toLocaleDateString()}
			<span on:click={getFeaturedTomorrow} class="{!isFeaturedDateToday ? 'text-gray-400' : 'dark:text-cyan-300 dark:hover:text-cyan-500 dark:active:text-cyan-700 hover:underline cursor-pointer'}">⇝</span>
		</h1>

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
