# Migration to Modular Stores Architecture

## Overview

This document describes the migration from the monolithic `WikiApiClient` to a modern, modular architecture using decoupled API factories and unified Svelte stores.

**Status**: ✅ Completed in Phase 1  
**Date**: October 2025  
**Impact**: Components now use pure, testable API factories wrapped with Svelte reactivity

---

## Architecture Changes

### Before: WikiApiClient Pattern

```javascript
// OLD: Monolithic, hard to test, mixes logic with state management
import WikiApiClient from '../lib/WikiApiClient';

WikiApiClient.search(searchTerm);
WikiApiClient.getFeaturedPosts(date);
WikiApiClient.setLanguage(lang);

// Subscribing to internal stores
WikiApiClient.searchResults.subscribe(data => { ... });
WikiApiClient.featuredArticles.subscribe(data => { ... });
```

**Issues**:
- Prototype pollution (`Array.prototype.forEachAsyncParallel`)
- Hard to test (mixes API logic with state management)
- Tight coupling between components and API
- Language switching required manual refresh logic
- State management hidden inside singleton object

### After: Modular Stores Pattern

```javascript
// NEW: Clean separation of concerns
import { searchStore, featuredStore } from '../lib/stores';

// Pure API usage
await searchStore.search(searchTerm);
await featuredStore.fetchForDate(date);
searchStore.setLanguage(lang);

// Reactive store subscriptions
searchStore.results.subscribe(data => { ... });
featuredStore.articles.subscribe(data => { ... });
```

**Benefits**:
- Pure API factories for testing
- Unified stores layer for Svelte reactivity
- Automatic language switching with search refresh
- Consistent error handling
- Easy to mock for tests

---

## Architecture Layers

```
Components (UI Layer)
    ↓
Stores (Reactive Layer) - src/lib/stores.js
    ↓
API Factories (Business Logic) - src/lib/api/
    ├── searchApi.js
    ├── featuredApi.js
    ├── apiConfig.js
    └── apiUtils.js
```

### Layer Responsibilities

**Stores** (`src/lib/stores.js`):
- Wraps API factories with Svelte stores
- Manages derived stores (transformed data)
- Handles language synchronization across APIs
- Provides subscription methods for components

**API Factories** (`src/lib/api/`):
- Pure functions (no side effects)
- Handle API communication
- Language state management (per-factory)
- Easily testable and mockable

---

## Migration Guide

### For Components

#### ❌ Old Way
```javascript
import WikiApiClient from '../lib/WikiApiClient';

export function clear() {
  WikiApiClient.searchApiUrl = null;  // Accessing internals
}

WikiApiClient.search(term);
```

#### ✅ New Way
```javascript
import { searchStore } from '../lib/stores';

export function clear() {
  searchStore.clear();  // Clean public API
}

await searchStore.search(term);
```

### Search Store API

```javascript
import { searchStore } from '../lib/stores';

// Perform search
await searchStore.search('javascript');

// Subscribe to results
searchStore.results.subscribe(articles => {
  console.log('Found', articles.length, 'articles');
});

// Change language
await searchStore.setLanguage('es');

// Clear results
searchStore.clear();

// Get current language
const lang = searchStore.getLanguage();
```

### Featured Store API

```javascript
import { featuredStore } from '../lib/stores';

// Fetch featured articles for a date
await featuredStore.fetchForDate(new Date('2024-10-24'));

// Subscribe to articles
featuredStore.articles.subscribe(articles => {
  console.log('Featured articles:', articles);
});

// Get status and error info (raw store)
const rawStore = featuredStore.getRawStore();
rawStore.subscribe(result => {
  if (result.status === 'error') {
    console.error('Failed:', result.message);
  }
});

// Change language
featuredStore.setLanguage('fr');

// Get current language
const lang = featuredStore.getLanguage();
```

---

## Files Changed

### Created
- ✨ `src/lib/stores.js` - New unified stores module

### Modified
- 🔄 `src/components/Searchbar.svelte` - Replaced WikiApiClient with searchStore
- 🔄 `src/components/Header.svelte` - Replaced WikiApiClient with searchStore
- 🔄 `src/routes/index.svelte` - Replaced WikiApiClient with stores, added language sync
- 🔄 `src/routes/__layout.svelte` - Replaced WikiApiClient with stores, simplified

### Deprecated (but kept for reference)
- 📦 `src/lib/WikiApiClient.js` - No longer used, can be deleted after verification

---

## Key Improvements in stores.js

### 1. Separation of Concerns

**Stores** handle Svelte integration:
- Raw stores for API responses
- Derived stores for transformed data
- Subscription management

**APIs** handle business logic:
- HTTP requests
- Data transformation
- Language state

### 2. Automatic Language Switching

Before: Components had to manually refresh search when language changed
```javascript
// OLD (complicated)
WikiApiClient.setLanguage('es');  // Manual call
WikiApiClient.fetch(...);  // Manual refresh
```

After: Automatic refresh on language change
```javascript
// NEW (automatic)
searchStore.setLanguage('es');  // Automatically refreshes current search
```

### 3. Better Error Handling

```javascript
// Subscribe to raw store for status info
const raw = featuredStore.getRawStore();
raw.subscribe(result => {
  if (result.status === 'error') {
    // Handle error
    console.error(result.message);
  } else if (result.status === 'wiki_no_data') {
    // Handle no data
    console.log('No articles for this date');
  } else if (result.status === 'success') {
    // Handle success
    console.log(result.data);
  }
});
```

### 4. Consistent Loading State

Global loading store for spinners:
```javascript
import { loadingStore } from '../lib/stores';

// In layout or component
loadingStore.subscribe(isLoading => {
  // Show spinner when true
});
```

---

## Testing Implications

### Before: Difficult to Test
```javascript
// Hard to mock WikiApiClient singleton
import WikiApiClient from './WikiApiClient';
// Can't easily inject test data
// Prototype pollution makes testing fragile
```

### After: Easy to Test
```javascript
// Can import and mock API factories directly
import { createSearchApi } from './api/searchApi';

// Create test instance with mocked fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

const search = createSearchApi('en');
// Test in isolation
```

---

## Migration Checklist

- [x] Create `stores.js` with unified stores
- [x] Migrate `Searchbar.svelte`
- [x] Migrate `Header.svelte`
- [x] Migrate `index.svelte` (main featured articles page)
- [x] Migrate `__layout.svelte` (root layout)
- [ ] Create unit tests for API factories
- [ ] Add integration tests for stores
- [ ] Delete `WikiApiClient.js` (after verification)
- [ ] Update component documentation

---

## Performance Impact

✅ **Positive Changes**:
- No more `Array.prototype.forEachAsyncParallel` pollution
- Pure functions easier to optimize
- Language switching is more efficient
- Better tree-shaking in build

⚠️ **Same Performance**:
- Same number of API calls
- Same data transformation logic
- Stores add minimal overhead (Svelte handles optimization)

---

## Rollback Plan

If issues arise:

1. Keep `WikiApiClient.js` as-is
2. Each component import is isolated
3. Can revert individual components:
   ```javascript
   // Switch back to old pattern if needed
   import WikiApiClient from '../lib/WikiApiClient';
   WikiApiClient.search(term);
   ```

4. No breaking changes to other systems

---

## Future Improvements

1. **Caching Layer** (Phase 3)
   - Memoize search results
   - Cache featured articles by date
   - Add TTL for cache invalidation

2. **Request Deduplication**
   - Don't fetch same search twice in 3 seconds
   - Abort duplicate requests

3. **Offline Support**
   - Serve cached data offline
   - Queue requests for online

4. **TypeScript**
   - Add type definitions for stores
   - Better IDE support

---

## Support & Questions

For questions about the migration:
- See `docs/API_ARCHITECTURE.md` - API factory details
- See `src/lib/stores.js` - Store implementation
- See component files - Real-world usage examples
