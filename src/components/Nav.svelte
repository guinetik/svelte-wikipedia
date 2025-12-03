<script>
	import { _ } from 'svelte-i18n';
	import { getLink } from '../lib/utils';
</script>

<nav class="navbar">
	<div class="navbar-inner">
		<div class="navbar-brand">
			<!-- Logo is in Header.svelte, but we could put something here if Nav was independent -->
		</div>
		<ul class="navbar-menu">
			<li>
				<a
					href={getLink('about')}
					class="navbar-link"
					aria-current="page">{$_('nav_about')}</a
				>
			</li>
		</ul>
	</div>
</nav>
