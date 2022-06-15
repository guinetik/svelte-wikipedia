<script>
	import Header from './components/Header.svelte';
	import WikiArticle from './components/WikiArticle.svelte';
    import WikiApiClient from './WikiApiClient';
	let searchResults = [];
    WikiApiClient.searchResults.subscribe((data) => {
        console.log("new data", data);
        searchResults = data;
    });
    const handleSearch = (e) => {
        WikiApiClient.search(e.detail);
    }
    const handleLangChange = (e) => {
        WikiApiClient.setLanguage(e.detail);
    }
</script>

<Header on:wiki-search={handleSearch} on:lang-change={handleLangChange}/>
<main>
	{#if searchResults.length > 0}
		<section>
			<div
				class="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5"
			>
				<!--Card 1-->
				{#each searchResults as wikiArticle}
                    <WikiArticle article={wikiArticle}/>
                {/each}
			</div>
		</section>
	{/if}
    {#if searchResults.length == 0}
        <section>
            <h1 class="text-center">Welcome to Wiki Search</h1>
        </section>
    {/if}
</main>
