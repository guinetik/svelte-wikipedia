# 020 - The Refactor

**This is the main "wtf did I do" note.**

## Before

Had a monolithic `WikiApiClient.js` (~247 lines):
- Singleton pattern
- Mixed concerns: HTTP, state, parsing, utilities
- Hard to test
- Language switching required manual refresh
- Inconsistent error handling

## After

Modular structure:

```
src/lib/
├── stores.js           # NEW - Svelte stores layer
└── api/
    ├── apiConfig.js    # Config extracted
    ├── apiUtils.js     # Utilities extracted
    ├── searchApi.js    # Search logic extracted
    └── featuredApi.js  # Featured logic extracted
```

## What Changed

| Aspect | Before | After |
|--------|--------|-------|
| Pattern | Singleton | Factory functions |
| State | Mixed with logic | Separated in stores |
| Language | Manual refresh | Auto-sync via stores |
| Errors | Inconsistent | Standardized |
| Testing | Hard | Easy to mock |

## Key Decisions

1. **Factory pattern** for APIs - `createSearchApi(lang)` returns object with methods
2. **Stores wrap factories** - Components never touch APIs directly
3. **Derived stores** for data transformation - Raw response → Clean data
4. **Callbacks for async** - `fetchFeatured(date, {onSuccess, onError, onRetry})`

## Status

- **Phase 1 (done)**: Refactor to modular architecture
- **Phase 2 (todo)**: Add unit tests (Vitest)
- **Phase 3 (todo)**: Add caching layer

---

See: [[010-architecture]], [[030-key-fixes]], [[040-api-modules]]
