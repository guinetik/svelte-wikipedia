<script>
	import dayjs from 'dayjs';
	import { onMount, onDestroy } from 'svelte';
	import { Datepicker } from 'svelte-calendar';
	import { _, locale } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import WikiArticleGrid from '../components/WikiArticleGrid.svelte';
	import DatePickerTheme from '../lib/theme';
	import { fix } from '../lib/utils';
	import WikiApiClient from '../lib/WikiApiClient';
	import dateFormats from '../i18n/date.js';
	//
	let searchResults = [];
	let languageUnsubscribe;
	let currentFormat = null;
	//
	onMount(async () => {
		//console.log('app mounted!');
		WikiApiClient.getFeaturedPosts(selectedDate);
		// Initialize format based on current language
		currentFormat = dateFormats[$locale];
		// Subscribe to language changes
		languageUnsubscribe = locale.subscribe(lang => {
			currentFormat = dateFormats[lang] || dateFormats.en;
		});
	});
	onDestroy(() => {
		languageUnsubscribe?.();
	});
	//
	WikiApiClient.searchResults.subscribe((data) => {
		searchResults = data;
	});
	//
	let selectedDate = new Date();
	let resolvedDate = null;
	let featuredArticles = null;
	let loading = false;
	let datepickerStore;

	// Track if we're in "user selection mode"
	let isUserSelection = false;

	// Bind to Datepicker's internal store
	$: if (datepickerStore) {
		datepickerStore.subscribe((state) => {
			isUserSelection = state.hasChosen;
		});
	}

	const getFeaturedByDate = () => {
		if (loading) return;
		if (resolvedDate && selectedDate.getTime() === resolvedDate.getTime()) return;

		loading = true;
		featuredArticles = null;
		WikiApiClient.getFeaturedPosts(selectedDate);
	};

	// Only react to user selections, not calendar opens
	$: {
		if (selectedDate && isUserSelection) {
			getFeaturedByDate();
			isUserSelection = false; // Reset for next interaction
		}
	}

	// Handle API response
	WikiApiClient.featuredArticles.subscribe((result) => {
		if (result.data) {
			resolvedDate = result.featuredDate;
			selectedDate = result.featuredDate; // Keep UI in sync
			featuredArticles = result.data
				.sort((a, b) => b.views - a.views)
				.map((article, i) => ({ ...article, i: i + 1 }));
		}
		loading = false;
	});
</script>

{#if searchResults.length > 0}
	<WikiArticleGrid articles={searchResults} />
{/if}
{#if searchResults.length == 0}
	<header class="flex flex-row items-center justify-center gap-4 py-4">
		<h1 class="dark:text-white text-gray-800 text-5xl italic">
			{$_('home_featured_header')}
		</h1>
		<Datepicker
			format={currentFormat}
			bind:selected={selectedDate}
			bind:store={datepickerStore}
			end={dayjs().subtract(1, 'day').toDate()}
			theme={DatePickerTheme}
		/>
	</header>
	{#if featuredArticles && featuredArticles.length > 0}
		<WikiArticleGrid articles={featuredArticles} />
	{/if}
	{#if !featuredArticles}
		<section class="h-full" in:fix(fade) out:fix(fade)>
			<h1 class="text-center dark:text-white text-gray-800 text-8xl mt-10">
				{$_('home_header')}
				<aside class="mt-5 italic text-4xl dark:text-cyan-300 text-blue-500">
					{$_('home_aside')}
				</aside>
			</h1>
		</section>
	{/if}
{/if}
