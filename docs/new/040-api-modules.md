# 040 - API Modules

Quick reference for `src/lib/api/`.

## apiConfig.js

Central configuration.

| Export | Purpose |
|--------|---------|
| `SEARCH_CONFIG` | MediaWiki search API params |
| `REST_API_CONFIG` | Wikipedia REST API settings |
| `WIKIMEDIA_CONFIG` | Pageviews API + retry settings |
| `BANNED_PAGES` | Articles to exclude (Main_Page, Help, etc.) |
| `SUPPORTED_LANGUAGES` | `['en', 'pt', 'es', 'fr', 'it', 'de']` |
| `DEFAULT_LANGUAGE` | `'en'` |

## apiUtils.js

Pure utility functions.

| Function | Purpose |
|----------|---------|
| `normalizeImageUrl(url, width)` | Standardize Wikipedia image sizes |
| `stripHtmlTags(html)` | Clean HTML entities and tags |
| `buildQueryString(params)` | URL-safe encoding |
| `isErrorResponse(response)` | Detect error responses |
| `extractArticleText(page)` | Get text with fallbacks |
| `extractArticleUrl(page)` | Normalize URLs |
| `formatViewCount(views)` | Locale-aware number format |

## searchApi.js

Factory: `createSearchApi(language) => object`

| Method | Purpose |
|--------|---------|
| `search(term)` | Execute Wikipedia search |
| `setLanguage(lang)` | Change language |
| `getLanguage()` | Get current language |
| `buildSearchUrl(term)` | Build API URL |

## featuredApi.js

Factory: `createFeaturedApi(language) => object`

| Method | Purpose |
|--------|---------|
| `fetchFeatured(date, callbacks)` | Fetch trending articles with retry |
| `setLanguage(lang)` | Change language |
| `getLanguage()` | Get current language |
| `parseFeatured(data)` | Parse API response |

**Callbacks**: `{ onSuccess, onError, onRetry }`

---

See: [[010-architecture]], [[050-stores]]
