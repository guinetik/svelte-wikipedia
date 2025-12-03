<script>
	/**
	 * @file LanguageSelector - Standalone language selector component
	 * Decoupled from search functionality
	 */

	import { createEventDispatcher } from 'svelte';
	import { _ } from 'svelte-i18n';

	const dispatch = createEventDispatcher();

	/**
	 * Available languages with display names and codes
	 * @type {Array<{name: string, value: string}>}
	 */
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

	// Subscribe to locale changes to keep UI in sync
	import { locale } from 'svelte-i18n';
	locale.subscribe((l) => (language = l != null ? l.split('-')[0] : 'en'));

	/**
	 * Handle language selection
	 * @param {Event} e - Click event from language button
	 */
	const selectLanguage = (e) => {
		language = e.target.attributes['data-lang'].nodeValue;
		locale.set(language);
		dispatch('lang-change', language);
		handleDropdown();
	};

	/**
	 * Toggle dropdown visibility
	 */
	const handleDropdown = () => {
		showDropdown = !showDropdown;
	};

	/**
	 * Close dropdown when clicking away
	 */
	const handleWindowClick = () => {
		if (showDropdown) handleDropdown();
	};
</script>

<div class="flex-shrink-0 z-10">
	<button
		id="dropdown-button"
		on:click={handleDropdown}
		class="inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 focus:ring-4 focus:outline-none focus:ring-white/5 transition-colors backdrop-blur-sm"
		type="button"
	>
		{$_('lang')}
		<svg
			class="ml-1 w-4 h-4"
			fill="currentColor"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill-rule="evenodd"
				d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
				clip-rule="evenodd"
			/>
		</svg>
	</button>

	<div
		id="dropdown"
		on:pointerleave={handleWindowClick}
		class="{showDropdown
			? ''
			: 'hidden'} z-50 w-44 bg-[#111]/95 border border-white/10 backdrop-blur-xl rounded-lg shadow-xl top-16 absolute"
	>
		<ul class="py-1 text-sm text-gray-300" aria-labelledby="dropdown-button">
			{#if language}
				{#each languages as l}
					<li>
						<button
							type="button"
							on:click={selectLanguage}
							data-lang={l.value}
							class="{language === l.value
								? 'font-semibold text-white bg-white/10'
								: 'font-normal'} inline-flex py-2 px-4 w-full hover:bg-white/10 hover:text-white transition-colors"
						>
							{l.name}
						</button>
					</li>
				{/each}
			{/if}
		</ul>
	</div>
</div>

<svelte:body on:keydown={handleWindowClick} />
