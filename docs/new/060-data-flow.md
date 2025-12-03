# 060 - Data Flow

How data moves through the app.

## Search Flow

```
User types in Searchbar
        │
        ▼
Searchbar dispatches 'wiki-search' event
        │
        ▼
__layout.svelte catches event
        │
        ▼
Calls searchStore.search(term)
        │
        ▼
searchApi.search() → Wikipedia API
        │
        ▼
Response → rawResults (writable)
        │
        ▼
Derived → results (processed)
        │
        ▼
index.svelte subscribes → WikiArticleGrid
```

## Featured Articles Flow

```
Page loads / User picks date
        │
        ▼
index.svelte calls featuredStore.fetchForDate(date)
        │
        ▼
featuredApi.fetchFeatured(date, callbacks)
        │
        ▼
Wikimedia Pageviews API
        │
        ├─ 404? → Retry with earlier date (silent)
        │
        ▼
For each article: fetch page details from REST API
        │
        ▼
Filter banned pages, validate responses
        │
        ▼
Response → rawFeatured (writable)
        │
        ▼
Derived → articles (array)
        │
        ▼
index.svelte subscribes → WikiArticleGrid
```

## Language Change Flow

```
User selects language in LanguageSelector
        │
        ▼
Dispatches 'lang-change' event
        │
        ▼
__layout.svelte catches event
        │
        ├─► searchStore.setLanguage(lang)
        │         └─► Refreshes current search if active
        │
        └─► featuredStore.setLanguage(lang)
                  └─► Updates API language for next fetch
```

## Key Points

- **Events bubble up** to `__layout.svelte`
- **Layout orchestrates** store method calls
- **Components only subscribe** to derived stores
- **Silent retries** for 404s (no error spam)

---

See: [[010-architecture]], [[050-stores]]
