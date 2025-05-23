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
	import { addToast } from '../components/toast/store';
	//
	let searchResults = []; // Search results from the API
	let localeStore; // Unsubscribe function for language changes
	let currentFormat = null; // Current date format based on language
	//
	onMount(async () => {
		//console.log('app mounted!');
		// Get featured articles for today
		WikiApiClient.getFeaturedPosts(selectedDate);
		// Initialize format based on current language
		currentFormat = dateFormats[$locale];
		// Subscribe to language changes
		localeStore = locale.subscribe((lang) => {
			currentFormat = dateFormats[lang] || dateFormats.en;
		});
	});
	onDestroy(() => {
		localeStore?.();
	});
	//
	WikiApiClient.searchResults.subscribe((data) => {
		searchResults = data;
	});
	//
	let selectedDate = new Date(); // Default to today
	let resolvedDate = null; // Resolved date from API
	let featuredArticles = null; // Featured articles from API
	let loading = false; // Loading state for API calls
	let datepickerStore; // Datepicker store for internal state
	let isUserSelection = false; // Track if the user has selected a date
	// Bind to Datepicker's internal store
	$: if (datepickerStore) {
		datepickerStore.subscribe((state) => {
			// Track if the user has selected a date
			isUserSelection = state.hasChosen;
		});
	}
	// Handle date changes
	const getFeaturedByDate = () => {
		// Check if the date is valid
		if (loading) return;
		// Check if the selected date is today
		if (resolvedDate && selectedDate.getTime() === resolvedDate.getTime()) return;
		// Load featured articles for the selected date
		loading = true;
		featuredArticles = null;
		WikiApiClient.getFeaturedPosts(selectedDate);
	};
	// Only react to user selections, not calendar opens
	$: {
		// Only react if the user has selected a date
		if (selectedDate && isUserSelection) {
			getFeaturedByDate();
			isUserSelection = false; // Reset for next interaction
		}
	}
	// Handle API response
	WikiApiClient.featuredArticles.subscribe((result) => {
		// Check if the API call was successful
		if (result.status == 'wiki_no_data') {
			// Give feedback to the user
			addToast({
				message: $_('wiki_no_data'),
				type: 'info',
				dismissible: true,
				timeout: 1000
			});
			loading = false;
			return;
		}
		// If the API call was successful, update the state
		if (result.data) {
			// Update the dates
			resolvedDate = result.featuredDate;
			selectedDate = result.featuredDate; // Keep UI in sync
			// Sort and map the articles by views
			featuredArticles = result.data
				.sort((a, b) => b.views - a.views)
				.map((article, i) => ({ ...article, i: i + 1 }));
			loading = false;
		}
	});
</script>

{#if searchResults.length > 0}
	<WikiArticleGrid articles={searchResults} />
{/if}
{#if searchResults.length == 0}
	<header
		class="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 py-4 px-2 sm:px-0"
	>
		<h1 class="dark:text-white text-gray-800 text-3xl sm:text-5xl italic text-center sm:text-left">
			{$_('home_featured_header')}
		</h1>
		<div class="scale-90 sm:scale-100">
			<!-- Container for responsive scaling -->
			<Datepicker
				format={currentFormat}
				bind:selected={selectedDate}
				bind:store={datepickerStore}
				end={dayjs().subtract(1, 'day').toDate()}
				theme={{
					...DatePickerTheme,
					input: `${DatePickerTheme.input} text-sm sm:text-base` // Responsive text
				}}
			/>
		</div>
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
