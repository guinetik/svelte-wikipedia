# 010 - Architecture

## Layer Pattern

```
┌─────────────────────────────────────┐
│  Components (Svelte)                │  UI layer
│  Header, Searchbar, WikiArticle...  │
└──────────────┬──────────────────────┘
               │ subscribe / call methods
┌──────────────▼──────────────────────┐
│  Stores (src/lib/stores.js)         │  State management
│  searchStore, featuredStore         │
└──────────────┬──────────────────────┘
               │ use factories
┌──────────────▼──────────────────────┐
│  API Factories (src/lib/api/)       │  HTTP layer
│  searchApi, featuredApi             │
└──────────────┬──────────────────────┘
               │ use
┌──────────────▼──────────────────────┐
│  Config & Utils                     │  Shared logic
│  apiConfig.js, apiUtils.js          │
└─────────────────────────────────────┘
```

## File Locations

```
src/
├── components/          # UI components
├── routes/
│   ├── __layout.svelte  # Global layout, event handling
│   └── index.svelte     # Home page (search + featured)
└── lib/
    ├── stores.js        # Svelte stores wrapping APIs
    ├── utils.js         # General utilities
    └── api/
        ├── apiConfig.js   # Endpoints, banned pages, languages
        ├── apiUtils.js    # URL normalization, text extraction
        ├── searchApi.js   # Wikipedia search factory
        └── featuredApi.js # Trending articles factory
```

## Why This Pattern

- **Testable**: API factories are pure, can mock stores
- **Separation**: Each layer has one job
- **Language switching**: Stores sync language across all APIs
- **Error handling**: Consistent patterns in API layer

---

See: [[020-the-refactor]], [[040-api-modules]], [[050-stores]]
