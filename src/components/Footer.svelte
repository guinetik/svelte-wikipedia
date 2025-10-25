<script>
	/**
	 * @file Footer - Application footer with navigation and links
	 */

	import { _ } from 'svelte-i18n';
	import { getLink } from '../lib/utils';
</script>

<footer class="bg-gray-900 dark:bg-gray-950 text-gray-300 py-8">
	<div class="max-w-7xl mx-auto px-4">
		<div class="flex flex-col md:flex-row justify-between items-center gap-6">
			<!-- Left: About link -->
			<nav class="flex gap-6">
				<a
					href={getLink('about')}
					class="text-gray-300 hover:text-white transition-colors font-medium"
				>
					{$_('nav_about')}
				</a>
			</nav>

			<!-- Center: Description -->
			<p class="text-sm text-gray-400 text-center">
				{$_('app_description') || 'Wikipedia Search - Discover trending articles'}
			</p>

			<!-- Right: Credits -->
			<div class="text-sm text-gray-400 text-right">
				<p>Built with <span class="text-red-400">♥</span> using Svelte</p>
			</div>
		</div>

		<!-- Bottom: Copyright -->
		<div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500 text-sm">
			<p>&copy; 2024 Wiki Search. All rights reserved.</p>
		</div>
	</div>
</footer>
