<script>
	import { createEventDispatcher } from 'svelte';
	import { _, locale } from 'svelte-i18n';
	const dispatch = createEventDispatcher();
	let languages = [
		{ name: 'English', value: 'en' },
		{ name: 'Português', value: 'pt' },
		{ name: 'Español', value: 'es' },
		{ name: 'Français', value: 'fr' },
		{ name: 'Italiano', value: 'it' },
		{ name: 'Deutsch', value: 'de' }
	];
	let language = null;
	let showDropdown = false;
	locale.subscribe((l) => (language = l != null ? l.split('-')[0] : 'en'));
	const selectLanguage = (e) => {
		language = e.target.attributes['data-lang'].nodeValue;
		//console.log('Language Changed', language);
		locale.set(language);
		dispatch('lang-change', language);
		handleDropdown();
	};
	const handleDropdown = () => {
		showDropdown = !showDropdown;
	};
	const handleWindowClick = () => {
		if (showDropdown) handleDropdown();
	};
</script>

<button
	id="dropdown-button"
	on:click={handleDropdown}
	class="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
	type="button"
	>{$_('lang')}
	<svg
		class="ml-1 w-4 h-4"
		fill="currentColor"
		viewBox="0 0 20 20"
		xmlns="http://www.w3.org/2000/svg"
		><path
			fill-rule="evenodd"
			d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
			clip-rule="evenodd"
		/></svg
	></button
>
<div
	id="dropdown"
	on:pointerleave={handleWindowClick}
	class="{showDropdown
		? ''
		: 'hidden'} z-50 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 top-16 -ml-8 absolute"
>
	<ul class="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
		{#if language}
			{#each languages as l}
				<li>
					<button
						type="button"
						on:click={selectLanguage}
						data-lang={l.value}
						class="{language === l.value
							? 'font-bold'
							: 'font-normal'} inline-flex py-2 px-4 w-full hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{l.name}</button
					>
				</li>
			{/each}
		{/if}
	</ul>
</div>
<svelte:body on:keydown={handleWindowClick} />
