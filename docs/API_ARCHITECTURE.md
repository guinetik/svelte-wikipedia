# API Architecture Guide

## Overview

The API layer has been refactored into modular, composable units that separate concerns and improve maintainability. This document explains the architecture and how to use it.

## Modules

### `apiConfig.js` - Configuration & Constants

**Purpose**: Centralize all API configuration, endpoints, and constants.

**Key Exports**:
- `SEARCH_CONFIG` - Wikipedia search API configuration
- `REST_API_CONFIG` - Wikipedia REST API for page details
- `WIKIMEDIA_CONFIG` - Wikimedia pageviews API configuration
- `BANNED_PAGES` - Array of pages to exclude from results
- `SUPPORTED_LANGUAGES` - Available language options
- `DEFAULT_LANGUAGE` - Default language ('en')

**Usage**:
```javascript
import { SEARCH_CONFIG, BANNED_PAGES } from './api/apiConfig';

// Access API endpoints
const searchUrl = SEARCH_CONFIG.baseUrl; // https://en.wikipedia.org/w/api.php

// Check if article is banned
if (BANNED_PAGES.includes(pageTitle)) {
  console.log('This page is excluded');
}
```

### `apiUtils.js` - Common Utilities

**Purpose**: Provide reusable utility functions for data processing and API interaction.

**Key Functions**:
- `normalizeImageUrl(imageUrl, targetWidth)` - Standardize Wikipedia image URLs to consistent width
- `isErrorResponse(response)` - Check if API response indicates an error
- `extractArticleText(pageDetails)` - Extract text from various API response formats
- `extractArticleUrl(pageDetails)` - Get article URL from different API formats
- `buildQueryString(params)` - Build URL query strings safely
- `formatViewCount(views)` - Format large numbers for display

**Usage**:
```javascript
import { normalizeImageUrl, extractArticleText } from './api/apiUtils';

const pageDetails = await fetch(url).then(r => r.json());
const image = normalizeImageUrl(pageDetails.thumbnail.source, 400);
const text = extractArticleText(pageDetails);
```

### `searchApi.js` - Wikipedia Search

**Purpose**: Handle Wikipedia search functionality with language support.

**Factory Function**: `createSearchApi(language)`
- Creates a search instance for a specific language
- Maintains language state internally

**Methods**:
- `search(searchTerm)` - Perform search, returns Promise<Object>
- `buildSearchUrl(searchTerm)` - Build search URL without fetching
- `setLanguage(lang)` - Switch to different language
- `getLanguage()` - Get current language
- `updateSearchUrlLanguage(oldLanguage)` - Update existing search URL for new language

**Usage**:
```javascript
import { createSearchApi } from './api/searchApi';

const search = createSearchApi('en');

// Perform search
const results = await search.search('javascript');

// Switch language and refresh
search.setLanguage('es');

// Build URL without searching
const url = search.buildSearchUrl('python');
```

**Error Handling**:
```javascript
try {
  const results = await search.search('');
} catch (error) {
  // Empty search term error, or network error
  console.error(error.message);
}
```

### `featuredApi.js` - Featured/Trending Articles

**Purpose**: Fetch and process trending Wikipedia articles with intelligent retry logic.

**Factory Function**: `createFeaturedApi(language)`
- Creates a featured articles instance
- Manages retry state for handling API delays

**Methods**:
- `fetchFeatured(date, options)` - Fetch featured articles for a date with optional callbacks
- `parseFeatured(data)` - Parse Wikimedia API response into article objects
- `setLanguage(lang)` - Switch language
- `getLanguage()` - Get current language
- `getLastFeaturedDate()` - Get last requested date

**Parameters**:
- `date` (Date) - Date to fetch featured articles for
- `options` (Object, optional):
  - `onSuccess(articles)` - Callback when articles are loaded
  - `onError(error)` - Callback on error
  - `onRetry(newDate)` - Callback for retry attempts

**Usage**:
```javascript
import { createFeaturedApi } from './api/featuredApi';

const featured = createFeaturedApi('en');

// Fetch with callbacks
const articles = await featured.fetchFeatured(
  new Date('2024-10-24'),
  {
    onSuccess: (articles) => {
      console.log(`Loaded ${articles.length} articles`);
    },
    onError: (error) => {
      console.error('Failed to load featured articles:', error);
    }
  }
);

// Fetch directly
const articles = await featured.fetchFeatured(new Date());

// Parse pre-fetched data
const parsed = await featured.parseFeatured(rawApiData);
```

**Retry Logic**:
- Wikimedia API has a 24-hour delay - data for a given date is available the next day
- If no data is available, automatically retries with exponential backoff
- Maximum 10 retries (configurable in `WIKIMEDIA_CONFIG.maxRetries`)
- Initial backoff: 1000ms, increases with each retry

## Migration from Old WikiApiClient

If you're migrating from the old monolithic `WikiApiClient`, here's how:

### Old Way:
```javascript
import WikiApiClient from './lib/WikiApiClient';

WikiApiClient.search('javascript');
WikiApiClient.getFeaturedPosts(new Date());
WikiApiClient.setLanguage('es');
```

### New Way:
```javascript
import { createSearchApi } from './lib/api/searchApi';
import { createFeaturedApi } from './lib/api/featuredApi';

const search = createSearchApi('en');
const featured = createFeaturedApi('en');

// Search
await search.search('javascript');

// Featured posts
await featured.fetchFeatured(new Date());

// Language switching
search.setLanguage('es');
featured.setLanguage('es');
```

## Key Improvements

### 1. **Separation of Concerns**
- Configuration separate from logic
- Each API concern has its own module
- Utilities isolated and reusable

### 2. **Better Error Handling**
- Defensive checks for undefined properties
- HTTP status validation
- Graceful fallbacks for missing data
- Proper try-catch blocks

### 3. **Cleaner API Interop**
- Consistent error objects across APIs
- Utility functions normalize different API response formats
- Type safety through JSDoc annotations

### 4. **Testability**
- Pure functions in utils
- Factory functions for API instances (easier to mock)
- Clear input/output contracts

### 5. **Performance**
- Replaced Array.prototype.forEachAsyncParallel with Promise.all()
- Better resource cleanup
- Configurable limits (max articles, retries)

## Future Improvements

- [ ] Add response caching layer
- [ ] Implement request deduplication
- [ ] Add rate limiting
- [ ] TypeScript migration
- [ ] Add comprehensive unit tests
- [ ] Add abort signal support for fetch cancellation


