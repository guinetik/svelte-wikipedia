<script>
	import dayjs from 'dayjs';
	import { onMount, onDestroy } from 'svelte';
	import { Datepicker } from 'svelte-calendar';
	import { _, locale } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import WikiArticleGrid from '../components/WikiArticleGrid.svelte';
	import Spinner from '../components/Spinner.svelte';
	import DatePickerTheme from '../lib/theme';
	import { fix } from '../lib/utils';
	import { searchStore, featuredStore } from '../lib/stores';
	import dateFormats from '../i18n/date.js';
	import { addToast } from '../components/toast/store';
	
	// Search results and loading state from the API
	let searchResults = [];
	let isSearching = false;
	let localeStore; // Unsubscribe function for language changes
	let currentFormat = null; // Current date format based on language
	let lastLang = null; // Track language changes
	
	let datepickerStore; // Datepicker internal store - $datepickerStore?.selected only changes on actual selection
	let lastFetchedDate = null; // Track the last date we fetched
	let featuredArticles = []; // Featured articles from API
	let featuredStatus = 'idle'; // Status: 'idle' | 'loading' | 'success' | 'no_data' | 'error'
	let noDataDate = null; // Date that had no data (for display)
	let isFeaturedLoading = false; // Loading state for featured
	let isInitialLoad = true; // Track if this is the initial page load
	
	// Threshold for "old date" warning (in days)
	const OLD_DATE_THRESHOLD_DAYS = 30;
	
	// Minimum date for Wikipedia pageviews API (started July 2015)
	const MIN_DATE = new Date('2015-07-01');
	
	onMount(async () => {
		// Get featured articles for today (initial load)
		const today = new Date();
		lastFetchedDate = today;
		featuredStore.fetchForDate(today, false);
		
		// Initialize format based on current language
		currentFormat = dateFormats[$locale];
		
		// Subscribe to language changes
		localeStore = locale.subscribe((lang) => {
			currentFormat = dateFormats[lang] || dateFormats.en;
			
			// Update language in stores when i18n locale changes
			const langCode = lang?.split('-')[0] || 'en';
			if (langCode !== lastLang) {
				lastLang = langCode;
				searchStore.setLanguage(langCode);
				featuredStore.setLanguage(langCode);
			}
		});
	});
	
	onDestroy(() => {
		localeStore?.();
	});
	
	// Subscribe to search results
	searchStore.results.subscribe((data) => {
		searchResults = data;
	});
	
	// Subscribe to search loading state
	searchStore.isLoading.subscribe((loading) => {
		isSearching = loading;
	});
	
	// Subscribe to featured loading state
	featuredStore.isLoading.subscribe((loading) => {
		isFeaturedLoading = loading;
	});
	
	/**
	 * Check if a date is considered "old" and may take longer to load
	 * @param {Date} date - The date to check
	 * @returns {boolean} True if the date is older than the threshold
	 */
	function isOldDate(date) {
		const now = dayjs();
		const selected = dayjs(date);
		const daysDiff = now.diff(selected, 'day');
		return daysDiff > OLD_DATE_THRESHOLD_DAYS;
	}
	
	/**
	 * Check if two dates are the same day
	 * @param {Date} date1 
	 * @param {Date} date2 
	 * @returns {boolean}
	 */
	function isSameDay(date1, date2) {
		if (!date1 || !date2) return false;
		return dayjs(date1).format('YYYY-MM-DD') === dayjs(date2).format('YYYY-MM-DD');
	}
	
	/**
	 * Track the calendar open state (try both 'open' and 'isOpen' property names)
	 * @type {boolean}
	 */
	$: isPickerOpen = $datepickerStore?.open ?? $datepickerStore?.isOpen ?? false;
	
	/**
	 * The selected date from the store
	 * @type {Date|null}
	 */
	$: selectedDate = $datepickerStore?.selected;
	
	/**
	 * Track previous open state to detect close events
	 */
	let wasOpen = false;
	
	/**
	 * React when open state or selected date changes
	 * Only fetch when calendar CLOSES with a different date
	 */
	$: if (isPickerOpen !== undefined) {
		// Detect close: was open, now closed
		if (wasOpen && !isPickerOpen && !isInitialLoad) {
			// Calendar just closed - check if date changed
			if (selectedDate && !isSameDay(selectedDate, lastFetchedDate)) {
				handleDateSelection(selectedDate);
			}
		}
		// Update tracking
		wasOpen = isPickerOpen;
	}
	
	/**
	 * Handle when user selects a new date
	 * @param {Date} newDate - The newly selected date
	 */
	function handleDateSelection(newDate) {
		if (isFeaturedLoading) return;
		
		// Check if date is before minimum (Wikipedia API limit)
		if (newDate < MIN_DATE) {
			addToast({
				message: $_('date_too_old') || 'Wikipedia pageview data is only available from July 2015 onwards.',
				type: 'info',
				dismissible: true,
				timeout: 3000
			});
			return;
		}
		
		// Show info toast for older dates
		if (isOldDate(newDate)) {
			addToast({
				message: $_('old_date_warning') || 'Older dates may take a bit longer to load...',
				type: 'info',
				dismissible: true,
				timeout: 3000
			});
		}
		
		// Update tracking and fetch
		lastFetchedDate = newDate;
		featuredStore.fetchForDate(newDate, true);
	}
	
	// Handle API response from featured store
	const rawFeaturedStore = featuredStore.getRawStore();
	rawFeaturedStore.subscribe((result) => {
		// Ensure result is an object
		if (!result || typeof result !== 'object') {
			return;
		}
		
		featuredStatus = result.status || 'idle';
		
		// Handle no data for user-selected date
		if (result.status === 'no_data') {
			noDataDate = result.requestedDate;
			featuredArticles = [];
			addToast({
				message: $_('wiki_no_data'),
				type: 'info',
				dismissible: true,
				timeout: 2000
			});
			return;
		}
		
		// Handle error state
		if (result.status === 'error') {
			addToast({
				message: result.message || $_('wiki_no_data'),
				type: 'error',
				dismissible: true,
				timeout: 2000
			});
			featuredArticles = [];
			return;
		}
		
		// If the API call was successful, update the state
		if (result.status === 'success' && result.data && Array.isArray(result.data)) {
			noDataDate = null;
			// Sort and map the articles by views
			featuredArticles = result.data
				.sort((a, b) => b.views - a.views)
				.map((article, i) => ({ ...article, i: i + 1 }));
			
			// Only update dates on initial load when API found an earlier date with data
			if (isInitialLoad && result.resolvedDate && result.requestedDate) {
				if (!isSameDay(result.requestedDate, result.resolvedDate)) {
					// Initial load found data for an earlier date, update picker to show that date
					lastFetchedDate = result.resolvedDate;
					// Update the datepicker's selected date via store
					if (datepickerStore) {
						datepickerStore.set({ selected: result.resolvedDate });
					}
				}
				// Mark initial load as complete
				isInitialLoad = false;
			}
		}
	});
	
	/**
	 * Format a date for display
	 * @param {Date} date - Date to format
	 * @returns {string} Formatted date string
	 */
	function formatDateForDisplay(date) {
		if (!date) return '';
		return dayjs(date).format(currentFormat || 'MM/DD/YYYY');
	}
</script>

<!-- Search Results with Loading State -->
{#if isSearching}
	<section class="flex flex-col items-center justify-center min-h-[40vh] py-16">
		<Spinner size="lg" />
		<p class="mt-4 text-gray-400 text-lg">{$_('searching') || 'Searching...'}</p>
	</section>
{:else if searchResults.length > 0}
	<WikiArticleGrid articles={searchResults} />
{:else}
	<!-- Featured Articles Section -->
	<header class="flex flex-col items-center justify-center gap-4 pt-6 pb-8 px-4 mb-8">
		<h1 class="page-title mb-0 text-center">
			{$_('home_featured_header')}
		</h1>
		<div class="datepicker-wrapper relative z-30 mt-2">
			<Datepicker
				format={currentFormat}
				bind:store={datepickerStore}
				start={MIN_DATE}
				end={dayjs().subtract(1, 'day').toDate()}
				theme={DatePickerTheme}
			/>
		</div>
	</header>
	
	<!-- Loading State for Featured -->
	{#if isFeaturedLoading}
		<section class="flex flex-col items-center justify-center min-h-[40vh] py-16" in:fix(fade) out:fix(fade)>
			<Spinner size="lg" />
			<p class="mt-4 text-gray-400 text-lg">{$_('loading') || 'Loading articles...'}</p>
		</section>
	<!-- No Data State for Selected Date -->
	{:else if featuredStatus === 'no_data' && noDataDate}
		<section class="flex flex-col items-center justify-center min-h-[40vh] py-16" in:fix(fade) out:fix(fade)>
			<div class="text-center max-w-md px-4">
				<div class="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
					<svg class="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
				</div>
				<h2 class="text-2xl font-semibold text-white mb-3">
					{$_('no_data_for_date') || 'No articles for this date'}
				</h2>
				<p class="text-gray-400">
					{$_('no_data_for_date_desc') || 'There are no featured articles available for'} 
					<span class="text-cyan-400 font-medium">{formatDateForDisplay(noDataDate)}</span>. 
					{$_('try_another_date') || 'Try selecting a different date.'}
				</p>
			</div>
		</section>
	<!-- Success State with Articles -->
	{:else if featuredArticles && featuredArticles.length > 0}
		<WikiArticleGrid articles={featuredArticles} />
	<!-- Initial/Empty State -->
	{:else}
		<section class="h-full flex flex-col items-center justify-center min-h-[50vh]" in:fix(fade) out:fix(fade)>
			<h1 class="text-center text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6">
				{$_('home_header')}
			</h1>
			<aside class="text-2xl md:text-3xl font-light text-cyan-400 tracking-wide">
				{$_('home_aside')}
			</aside>
		</section>
	{/if}
{/if}
