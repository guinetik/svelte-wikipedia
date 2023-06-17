<script>
    import WikiArticle from '../components/WikiArticle.svelte';
    export let articles = [];
</script>
<section>
    <div
        class="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5"
    >
        {#each articles as wikiArticle(wikiArticle.i)}
            <WikiArticle article={wikiArticle} />
        {/each}
    </div>
</section>