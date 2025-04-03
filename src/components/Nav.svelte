<script>
	import { _ } from 'svelte-i18n';
	import { getLink } from '../lib/utils';
</script>

<nav class="">
	<ul class="list-reset md:flex md:items-center">
		<li class="md:ml-2">
			<a
				href={getLink('about')}
				class="block py-2 pr-4 pl-3 dark:text-gray-500 dark:hover:text-white font-bold"
				aria-current="page">{$_('nav_about')}</a
			>
		</li>
		<li class="md:ml-2" />
	</ul>
</nav>
