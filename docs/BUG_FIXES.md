# Bug Fixes & Improvements

## Issue: "can't access property 'toLowerCase', pageDetails.title is undefined"

### Root Cause
When fetching featured articles, the code assumed that `pageDetails.title` would always exist:

```javascript
// OLD - BUGGY CODE
if (!pageDetails.title.toLowerCase().includes('not found')) {
  // Process article...
}
```

However, when the Wikipedia REST API fails or returns an incomplete response, `pageDetails` might not have a `title` property, causing:
```
TypeError: can't access property "toLowerCase", pageDetails.title is undefined
```

### Scenarios That Trigger The Bug
1. **Network timeout** - Fetch fails partway through
2. **Invalid response** - API returns malformed JSON
3. **Page not found** - REST API returns error response without `title`
4. **Rate limiting** - Wikipedia returns 429 response

### Solution Implemented

#### 1. **Added Defensive Checks**
```javascript
// NEW - SAFE CODE
if (!pageDetails || !pageDetails.title) {
  console.warn(`Failed to fetch details for article: ${item.article}`);
  return;  // Skip this article
}
```

#### 2. **Improved Error Response Handling**
```javascript
// getPageDetails() now validates response before parsing
try {
  const itemDetails = await fetch(url);
  
  if (!itemDetails.ok) {
    console.warn(`Failed to fetch page details for ${page}: ${itemDetails.status}`);
    return { error: true, status: itemDetails.status };
  }
  
  const data = await itemDetails.json();
  return data;
} catch (error) {
  console.error(`Error fetching page details for ${page}:`, error);
  return { error: true, message: error.message };
}
```

#### 3. **Created Validation Utilities**
New `isErrorResponse()` function in `apiUtils.js`:
```javascript
export function isErrorResponse(response) {
  if (!response) return true;
  if (response.error === true) return true;
  if (response.title && response.title.toLowerCase().includes('not found')) return true;
  return false;
}
```

Use before accessing properties:
```javascript
const pageDetails = await fetchPageDetails(item.article);
if (isErrorResponse(pageDetails)) {
  console.warn(`Skipping invalid article: ${item.article}`);
  return null;
}
```

## Additional Improvements

### Image URL Processing Safety
**Problem**: The image URL processing code could throw errors on malformed URLs

**Solution**: Wrapped in try-catch:
```javascript
if (image && image.includes('px-')) {
  try {
    image = normalizeImageUrl(image, 400);
  } catch (err) {
    console.warn(`Failed to process image URL: ${image}`, err);
    image = pageDetails.thumbnail.source;  // Fallback
  }
}
```

### Better Property Access
**Problem**: Used direct property access which fails on undefined objects

**Solution**: Used optional chaining (`?.`):
```javascript
// OLD
tags: page.terms.alias ? page.terms.alias : []

// NEW
tags: page.terms?.alias ? page.terms.alias : []
```

### HTTP Status Validation
**Problem**: Code didn't check HTTP response status before parsing JSON

**Solution**: Added status checking in all fetch operations:
```javascript
const response = await fetch(url);
if (!response.ok) {
  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
}
const data = await response.json();
```

## Prevention Strategies

### 1. **Always Validate API Responses**
```javascript
// ❌ BAD
const title = response.title.toLowerCase();

// ✅ GOOD
if (response && response.title) {
  const title = response.title.toLowerCase();
}
```

### 2. **Use Utility Functions**
```javascript
// ✅ Use the provided utilities
const text = extractArticleText(pageDetails);
const url = extractArticleUrl(pageDetails);
```

### 3. **Handle Errors Explicitly**
```javascript
// ✅ GOOD
try {
  const data = await fetch(url).then(r => r.json());
  if (isErrorResponse(data)) throw new Error('Invalid response');
  return data;
} catch (error) {
  console.error('Error:', error);
  return { error: true, message: error.message };
}
```

### 4. **Log Warnings During Processing**
```javascript
// ✅ GOOD - helps debug production issues
if (!article.title) {
  console.warn(`Article missing required field: ${article.id}`);
  continue;
}
```

### 5. **Filter Out Invalid Results**
```javascript
// ✅ GOOD - skip problematic items instead of crashing
const validArticles = results
  .filter(article => article && article.title)
  .map(article => normalizeArticle(article));
```

## Testing Recommendations

When testing API integrations, simulate these failure scenarios:

```javascript
// Simulate missing fields
const mockBrokenResponse = { title: undefined, extract: 'text' };

// Simulate network error
fetch.mockRejectedValue(new Error('Network error'));

// Simulate HTTP error
fetch.mockResolvedValue({ ok: false, status: 404 });

// Simulate invalid JSON
fetch.mockResolvedValue({
  ok: true,
  json: () => Promise.reject(new Error('Invalid JSON'))
});
```

## Summary

| Issue | Old Behavior | New Behavior |
|-------|-------------|-------------|
| Undefined title | Crash with TypeError | Log warning, skip article |
| Missing response | Parse undefined | Return error object |
| Invalid images | Fail silently or crash | Try to normalize, fallback |
| Bad HTTP status | Parse error response | Check status, throw error |

The refactored API is now **robust**, **observable**, and **debuggable**.


