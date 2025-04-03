<script>
	import { page } from '$app/stores';
	import { getLocaleFromNavigator, init, isLoading as isi8nLoading, locale, register } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import '../app.css';
	import Header from '../components/Header.svelte';
	import Spinner from '../components/Spinner.svelte';
	import { fix, redirectHome } from '../lib/utils';
	import WikiApiClient from '../lib/WikiApiClient';
	//
	register('de', () => import('../i18n/de.json'));
	register('en', () => import('../i18n/en.json'));
	register('es', () => import('../i18n/es.json'));
	register('fr', () => import('../i18n/fr.json'));
	register('it', () => import('../i18n/it.json'));
	register('pt', () => import('../i18n/pt.json'));
	//
	let lang = getLocaleFromNavigator();
	init({
		fallbackLocale: 'en',
		initialLocale: lang
	});
	isi8nLoading.subscribe((r) => {
		if(!r) {
			let lowcale = $locale
			if(lowcale) {
				WikiApiClient.language = lowcale.split("-")[0];
				//console.log("WikiApiClient.language", WikiApiClient.language);
			}
		}
	});
	//
	let searchResults = [];
	let featuredArticles = [];
	//
	let pageScrollY = 0;
	let currentPage = {};
	page.subscribe((data) => (currentPage = data));
	//
	let wikiStatus = { loading: false };
	WikiApiClient.state.subscribe((s) => (wikiStatus = s));
	//
	const handleSearch = (e) => {
		handleUi();
		WikiApiClient.search(e.detail);
	};
	//
	const handleLangChange = (e) => {
		handleUi();
		WikiApiClient.setLanguage(e.detail);
	};
	//
	const scroll2Top = () => {
		document.body.scrollIntoView();
	};
	//
	const handleUi = () => {
		scroll2Top();
		// if we're not home, redirect there to display search results
		redirectHome(currentPage);
	};
</script>

{#if wikiStatus.loading || $isi8nLoading}
	<div class="fixed w-screen h-screen z-40" in:fix(fade)>
		<div class="w-full h-full bg-slate-800 opacity-80" />
		<Spinner />
	</div>
{/if}
{#if !$isi8nLoading}
	<main class="dark:bg-gray-800 bg-gray-100 min-h-screen">
		<div class="{pageScrollY > 120 ? 'fixed top-0' : 'relative'} w-full transition-transform">
			<Header on:wiki-search={handleSearch} on:lang-change={handleLangChange} />
		</div>
		<slot class="h-full" />
		<button
			type="button"
			data-mdb-ripple="true"
			data-mdb-ripple-color="light"
			on:click={scroll2Top}
			class="{pageScrollY > 100 ? 'inline-block' : 'hidden'} p-3 fixed
      bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out bottom-5 right-5 
      dark:bg-cyan-500 dark:hover:bg-cyan-700 dark:focus:bg-cyan-700 dark:active:bg-cyan-800"
			id="btn-back-to-top"
		>
			<svg
				aria-hidden="true"
				focusable="false"
				data-prefix="fas"
				class="w-4 h-4"
				role="img"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 448 512"
				><path
					fill="currentColor"
					d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"
				/></svg
			>
		</button>
	</main>
{/if}
<svelte:window bind:scrollY={pageScrollY} />
<svelte:body class="dark:bg-gray-800 bg-gray-100 h-screen" />
<svelte:head><title>Svelte Wikipedia Search</title></svelte:head>
