# 030 - Key Fixes

Bugs fixed during the refactor.

## 1. 404 Retry Logic

**Problem**: Wikimedia pageviews API has ~24h delay. Today's data often returns 404.

**Fix**: Auto-retry with earlier dates (up to 10 retries, exponential backoff).

```javascript
// In featuredApi.js
if (response.status === 404 && retries < maxRetries) {
  retries++;
  const earlierDate = getYesterday(fetchDate);
  return attemptFetch(earlierDate);  // Recursive
}
```

**Key**: Silent retries - no error toasts until all retries exhausted.

## 2. Context Binding (`this` issue)

**Problem**: `this.parseFeatured()` failed in recursive retry function.

**Fix**: Moved `parseFeatured` to closure scope, call without `this`.

```javascript
// Define in closure, not on return object
const parseFeatured = async (data) => { ... };

// Call directly
const articles = await parseFeatured(data);
```

## 3. Array Safety

**Problem**: Components crashed when receiving `null` or `undefined` instead of arrays.

**Fix**: Defensive checks in components.

```javascript
// In WikiArticleGrid.svelte
$: articlesToDisplay = Array.isArray(articles) ? articles : [];

// In WikiArticle.svelte
$: tagsToDisplay = Array.isArray(article.tags) ? article.tags : [];
```

## 4. Search Descriptions

**Problem**: Search results missing short descriptions.

**Fix**: Added `pageprops` parameter to MediaWiki API call.

```javascript
// In apiConfig.js SEARCH_CONFIG
prop: 'extracts|pageimages|pageprops',  // Added pageprops
```

---

See: [[020-the-refactor]], [[040-api-modules]]
