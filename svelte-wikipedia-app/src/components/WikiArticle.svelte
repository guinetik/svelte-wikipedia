<script>
	export let article = {
		title: 'Title',
		text: 'text',
		tags: ['tags'],
		link: 'https://en.wikipedia.org/wiki/JavaScript',
		image:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/JavaScript_screenshot.png/450px-JavaScript_screenshot.png'
	};
</script>

<article class="rounded overflow-hidden shadow-lg">
	<a href={article.link} target="_blank">
		{#if article.image}
			<img alt={article.title} src={article.image} class="w-full overflow-hidden bg-cover" />
		{/if}
		<div class="px-6 py-4">
			<h2 class="font-bold text-xl mb-2 hover:underline">{article.title}</h2>
			{#if article.text}
				<p class="text-gray-700 text-base">{article.text}</p>
			{/if}
		</div>
	</a>
	<div class="px-6 pt-4 pb-2">
		{#each article.tags as tag}
			<a target="_blank" href="https://en.wikipedia.org/w/index.php?search={tag}">
				<span
					class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
					>{tag}</span
				>
			</a>
		{/each}
	</div>
</article>
