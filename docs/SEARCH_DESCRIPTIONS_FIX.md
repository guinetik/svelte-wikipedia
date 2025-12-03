# Search Descriptions Fix

## Problem

Search results don't consistently show descriptions, while featured articles always do.

## Root Cause Analysis

### Featured Articles (Working ✓)
- Uses Wikipedia REST API `/page/summary/` endpoint
- Endpoint: `https://en.wikipedia.org/api/rest_v1/page/summary/:page`
- Returns structured data with `extract` and `description` fields
- **Always includes Wikibase short descriptions**

### Search Results (Missing Descriptions ✗)
- Uses MediaWiki Action API
- Endpoint: `https://en.wikipedia.org/w/api.php`
- Current parameters:
  ```
  prop: 'pageimages|extracts|pageterms|info'
  ```
- **Problem**: 
  - `extracts` returns full text extracts, not short descriptions
  - `pageterms` returns Wikidata terms (aliases, labels) but NOT short descriptions
  - Short descriptions are stored in page properties as `wikibase-shortdesc`

## Solution

Two changes needed:

1. Add `pageprops` to the `prop` parameter to fetch page properties (includes Wikibase short descriptions as fallback)
2. Fix boolean parameters (`exintro`, `explaintext`) to actually be sent to API

### API Configuration Changes

**Before:**
```javascript
prop: 'pageimages|extracts|pageterms|info',
exintro: '',
explaintext: '',
exlimit: 1
```

**After:**
```javascript
prop: 'pageimages|extracts|pageterms|info|pageprops',
exintro: 1,
explaintext: 1,
exlimit: 'max'
```

**Why this matters:**
- Empty string values (`''`) get filtered out by `buildQueryString()`, so they were never sent to the API
- `explaintext: 1` - Returns **plain text** instead of HTML markup
- `exintro: 1` - Returns only the intro section (cleaner excerpts)
- `exlimit: 'max'` - Allows extracts for all search results, not just 1

### Data Processing Change

**Before:**
```javascript
text: stripHtmlTags(page.extract || page.terms?.description || '')
```

**After:**
```javascript
// Priority: extract > short description > fallback
// Matches featured articles style (longer, more informative descriptions)
text: stripHtmlTags(page.extract) || page.pageprops?.['wikibase-shortdesc'] || ''
```

## Technical Details

### Wikibase Short Description
- Stored in page properties as `wikibase-shortdesc`
- One-line summary of the article (e.g., "American actor", "Capital of France")
- Displayed below article titles in search results
- Same description shown in Wikipedia mobile app and Google search snippets

### MediaWiki API Parameters
- `prop=pageprops`: Returns page properties including Wikibase data
- `prop=extracts`: Returns article text (first few sentences)
- `prop=pageterms`: Returns Wikidata terms (labels, aliases) but NOT descriptions

## Implementation

1. Update `apiConfig.js` to include `pageprops` in search parameters
2. Update `stores.js` to prioritize `pageprops['wikibase-shortdesc']` over extracts
3. Test with various search terms to verify descriptions appear

## References

- [MediaWiki API:Query/pageprops](https://www.mediawiki.org/wiki/API:Properties#pageprops_/_pp)
- [Wikibase Short Descriptions](https://www.wikidata.org/wiki/Wikidata:Short_descriptions)
- [Wikipedia REST API](https://www.mediawiki.org/wiki/API:REST_API)

