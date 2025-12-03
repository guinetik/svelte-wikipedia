# 050 - Stores

Svelte stores in `src/lib/stores.js`.

## Pattern

```
Raw Writable Store → Derived Store → Component
     (API response)    (clean data)    (subscribe)
```

## searchStore

Wraps `searchApi`.

```javascript
// Internal
rawResults    // writable - raw API response
results       // derived - processed articles array

// Methods
searchStore.search(term)      // Fetch and update rawResults
searchStore.setLanguage(lang) // Change language, refresh search
searchStore.clear()           // Clear results
searchStore.getLanguage()     // Get current language
```

**Derived transform**: Extracts `query.pages`, normalizes to `{title, text, tags, link, image}`.

## featuredStore

Wraps `featuredApi`.

```javascript
// Internal
rawFeatured   // writable - {data, status, message, featuredDate}
articles      // derived - just the articles array

// Methods
featuredStore.fetchForDate(date) // Fetch with callbacks
featuredStore.setLanguage(lang)  // Change language
featuredStore.getLanguage()      // Get current language
featuredStore.getRawStore()      // Access raw store for status/errors
```

## loadingStore

Simple boolean for global loading state.

```javascript
import { loadingStore } from '$lib/stores';
loadingStore.set(true);  // Show spinner
loadingStore.set(false); // Hide spinner
```

Used by `__layout.svelte` to show/hide spinner overlay.

---

See: [[040-api-modules]], [[060-data-flow]]
