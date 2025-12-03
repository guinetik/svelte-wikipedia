<script>
	/**
	 * @file Footer - Application footer with navigation and links
	 */

	import { _ } from 'svelte-i18n';
	import { getLink } from '../lib/utils';
</script>

<footer class="bg-transparent border-t border-white/[0.06] text-gray-400 py-12 mt-12">
	<div class="max-w-7xl mx-auto px-4">
		<div class="flex flex-col md:flex-row justify-between items-center gap-6">
			<!-- Left: About link -->
			<nav class="flex gap-6">
				<a
					href={getLink('about')}
					class="text-sm font-medium hover:text-white transition-colors"
				>
					{$_('nav_about')}
				</a>
			</nav>

			<!-- Center: Description -->
			<p class="text-xs text-gray-500 text-center font-mono">
				{$_('app_description') || 'Wikipedia Search - Discover trending articles'}
			</p>

			<!-- Right: Credits -->
			<div class="text-xs text-gray-500 text-right font-mono">
				<p>Built with <span class="text-cyan-500">♥</span> using Svelte</p>
			</div>
		</div>

		<!-- Bottom: Copyright -->
		<div class="mt-8 text-center text-gray-600 text-xs font-mono">
			<p>&copy; 2024 Wiki Search. All rights reserved.</p>
		</div>
	</div>
</footer>
