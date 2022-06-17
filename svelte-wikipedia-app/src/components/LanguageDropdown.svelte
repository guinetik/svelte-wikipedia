<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	let languages = [
		{ name: 'English', value: 'en' },
		{ name: 'Português', value: 'pt' },
		{ name: 'Español', value: 'es' },
		{ name: 'Français', value: 'fr' },
		{ name: 'Italiano', value: 'it' },
		{ name: 'Deutsch', value: 'de' }
	];
	let language = 'en';
	const selectLanguage = (e) => {
		language = e.target.attributes['data-lang'].nodeValue;
		console.log('Language Changed', language);
		dispatch('lang-change', language);
		//this ugly ass line closes the dropdown.
		// I couldnt find another way since the flowbite-svelte only works for dropdown links <a>,
		// I had to use the vanilla flowbite
		document.getElementById('dropdown-button').click();
	};
</script>

<button
	id="dropdown-button"
	data-dropdown-toggle="dropdown"
	class="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
	type="button"
	>Language <svg
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
	class="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700"
	data-popper-reference-hidden="true"
	data-popper-escaped=""
	data-popper-placement="top"
	style="position: absolute; inset: auto auto 0px 0px; margin: 0px; transform: translate3d(897px, 5637px, 0px);"
>
	<ul class="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
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
	</ul>
</div>
