<script>
	import dayjs from 'dayjs';
	import { onMount, onDestroy } from 'svelte';
	import { Datepicker } from 'svelte-calendar';
	import { _, locale } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import WikiArticleGrid from '../components/WikiArticleGrid.svelte';
	import Spinner from '../components/Spinner.svelte';
	import DatePickerTheme from '../lib/theme';
	import { fix } from '../lib/utils';
	import { searchStore, featuredStore } from '../lib/stores';
	import dateFormats from '../i18n/date.js';

	// Search results and loading state
	let searchResults = [];
	let isSearching = false;
	let localeStore;
	let currentFormat = null;
	let lastLang = null;

	// Featured articles state
	const yesterday = dayjs().subtract(1, 'day').toDate();
	let datepickerStore;
	let currentFetchedDate = null; // Track what date we last fetched
	let featuredArticles = [];
	let featuredStatus = 'idle';
	let isFeaturedLoading = false;
	let wasOpen = false; // Track picker open/close

	// Minimum date for Wikipedia pageviews API (started July 2015)
	const MIN_DATE = new Date('2015-07-01');

	/**
	 * Parse date from URL query param
	 */
	function parseDateParam(dateParam) {
		if (!dateParam) return null;

		const parsed = dayjs(dateParam, 'YYYY-MM-DD');
		if (!parsed.isValid()) return null;

		const date = parsed.toDate();
		// Validate date is within allowed range
		if (date < MIN_DATE || date > yesterday) return null;

		return date;
	}

	// Valid language codes
	const VALID_LANGS = ['en', 'es', 'pt', 'de', 'fr', 'it'];

	// Get initial date and lang from URL
	$: urlDateParam = $page.url.searchParams.get('date');
	$: urlLangParam = $page.url.searchParams.get('lang');
	$: initialDate = parseDateParam(urlDateParam) || yesterday;
	$: initialLang = VALID_LANGS.includes(urlLangParam) ? urlLangParam : null;

	/**
	 * Update URL with current date and language (without page reload)
	 */
	function updateUrl(date, lang) {
		const dateStr = dayjs(date).format('YYYY-MM-DD');
		const url = new URL(window.location.href);
		url.searchParams.set('date', dateStr);
		if (lang) url.searchParams.set('lang', lang);
		goto(url.pathname + url.search, { replaceState: true, noScroll: true });
	}

	onMount(async () => {
		// Set language from URL if present
		if (initialLang) {
			locale.set(initialLang);
		}

		// Get current lang code
		const currentLang = initialLang || $locale?.split('-')[0] || 'en';
		lastLang = currentLang;

		// Use date from URL or default to yesterday
		currentFetchedDate = initialDate;
		featuredStore.fetchForDate(initialDate);

		// Update URL to reflect current state
		updateUrl(initialDate, currentLang);

		// Initialize format based on current language
		currentFormat = dateFormats[$locale];

		// Subscribe to language changes
		localeStore = locale.subscribe((lang) => {
			currentFormat = dateFormats[lang] || dateFormats.en;
			const langCode = lang?.split('-')[0] || 'en';
			if (langCode !== lastLang && lastLang !== null) {
				lastLang = langCode;
				searchStore.setLanguage(langCode);
				featuredStore.setLanguage(langCode);
				// Refetch for current date in new language
				if (currentFetchedDate) {
					featuredStore.fetchForDate(currentFetchedDate);
				}
				// Update URL with new language
				updateUrl(currentFetchedDate || initialDate, langCode);
			}
			lastLang = langCode;
		});
	});

	onDestroy(() => {
		localeStore?.();
	});

	// Subscribe to search results
	searchStore.results.subscribe((data) => {
		searchResults = data;
	});

	// Subscribe to loading states
	searchStore.isLoading.subscribe((loading) => {
		isSearching = loading;
	});

	featuredStore.isLoading.subscribe((loading) => {
		isFeaturedLoading = loading;
	});

	/**
	 * Check if two dates are the same day
	 */
	function isSameDay(date1, date2) {
		if (!date1 || !date2) return false;
		return dayjs(date1).format('YYYY-MM-DD') === dayjs(date2).format('YYYY-MM-DD');
	}

	/**
	 * Format a date for display
	 */
	function formatDateForDisplay(date) {
		if (!date) return '';
		return dayjs(date).format(currentFormat || 'MM/DD/YYYY');
	}

	// Get values from datepicker store
	$: selectedDate = $datepickerStore?.selected ?? initialDate;
	$: isOpen = $datepickerStore?.open ?? false;

	// Fetch when picker CLOSES with a different date
	$: {
		if (wasOpen && !isOpen) {
			// Picker just closed - check if date changed
			if (!isSameDay(selectedDate, currentFetchedDate) && !isFeaturedLoading) {
				currentFetchedDate = selectedDate;
				featuredStore.fetchForDate(selectedDate);
				updateUrl(selectedDate, lastLang);
			}
		}
		wasOpen = isOpen;
	}

	// Handle API response from featured store
	const rawFeaturedStore = featuredStore.getRawStore();
	rawFeaturedStore.subscribe((result) => {
		if (!result || typeof result !== 'object') return;

		featuredStatus = result.status || 'idle';

		if (result.status === 'no_data' || result.status === 'error') {
			featuredArticles = [];
			return;
		}

		if (result.status === 'success' && result.data && Array.isArray(result.data)) {
			featuredArticles = result.data
				.sort((a, b) => b.views - a.views)
				.map((article, i) => ({ ...article, i: i + 1 }));
		}
	});
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
				selected={initialDate}
				bind:store={datepickerStore}
				format={currentFormat}
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
	{:else if featuredStatus === 'no_data' && currentFetchedDate}
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
					<span class="text-cyan-400 font-medium">{formatDateForDisplay(currentFetchedDate)}</span>.
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
