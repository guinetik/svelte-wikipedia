# Hotfix: Featured Articles Retry Logic

## Problem

After migrating to the new stores architecture, the featured articles API was broken:

**Symptoms**:
- 404 errors from Wikimedia API (no data available for today's date)
- Error toasts appearing instead of silent retries
- App stuck in infinite loading state
- Retry logic not functioning

**Root Cause**:
The retry mechanism for handling the Wikimedia API 24-hour delay was not properly implemented in the new `featuredApi.js`. When a 404 occurred, the code would:
1. Call `onError` immediately (showing error toast)
2. Attempt to retry asynchronously without awaiting
3. This left the app in a loading state indefinitely

## Solution

### How Wikimedia API Works

Wikimedia API has a **24-hour delay**:
- Data for date X is available starting the next day (X+1)
- If you request today's data, you get a 404
- Solution: automatically try yesterday, then day before, etc.

### Changes Made

#### 1. `src/lib/api/featuredApi.js`

**Key Changes**:
```javascript
// BEFORE: Threw error immediately and tried to retry async
if (!response.ok) {
  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
}

// AFTER: Handle 404 specially - retry silently
if (response.status === 404) {
  console.log(`No data for ${formatDateForApi(fetchDate)}, trying earlier date...`);
  
  if (retries < WIKIMEDIA_CONFIG.maxRetries) {
    retries++;
    const earlierDate = getYesterday(fetchDate);
    if (onRetry) onRetry(earlierDate);
    // Recursively fetch with earlier date
    return attemptFetch(earlierDate);
  } else {
    // Max retries reached - NOW call onError
    const error = new Error('No featured articles data available after maximum retries');
    if (onError) onError(error);
    return [];
  }
}
```

**Benefits**:
- ✅ 404s are handled silently (no error toast during retries)
- ✅ Automatically tries yesterday's date
- ✅ Continues until data is found or max retries reached
- ✅ Only calls `onError` after all retries exhausted
- ✅ Uses recursion to cleanly await each retry

#### 2. `src/lib/stores.js`

**Added comments**:
```javascript
onError: (error) => {
  // Only show error on final failure (after all retries exhausted)
  rawFeatured.set({ 
    status: 'error', 
    message: error.message,
    featuredDate: date
  });
},
onRetry: (newDate) => {
  // Silently retry with new date - don't show error toast
  console.log('Retrying featured articles for:', newDate.toISOString().split('T')[0]);
}
```

#### 3. `src/routes/index.svelte`

**Better error handling**:
```javascript
if (result.status === 'error') {
  // Handle final error (after retries exhausted)
  addToast({
    message: result.message || $_('wiki_no_data'),
    type: 'error',
    dismissible: true,
    timeout: 2000
  });
  loading = false;
  return;
}
```

## Testing

**Scenario 1: Request today's articles**
```
GET /2025/10/25 → 404 (no data yet)
→ Silently retry: /2025/10/24
→ Silently retry: /2025/10/23
→ Success! Data found, articles displayed
→ No error toast shown
```

**Scenario 2: Request from 10 days ago**
```
GET /2025/10/15 → 200 (data available)
→ Parse and display articles
→ No toasts, success
```

**Scenario 3: All retries fail (e.g., language not available)**
```
GET /2025/10/25 → 404
GET /2025/10/24 → 404
... (10 attempts)
→ Max retries reached
→ Call onError
→ Show "No featured articles data available after maximum retries" toast
```

## Flow Diagram

```
index.svelte
  ↓
featuredStore.fetchForDate(date)
  ↓
featuredApi.fetchFeatured(date, {onSuccess, onError, onRetry})
  ↓
attemptFetch(date)
  ├─ fetch API
  ├─ 404? → retries++ → onRetry(yesterday) → attemptFetch(yesterday)
  ├─ success? → onSuccess(articles) → return articles
  ├─ empty result? → retries++ → onRetry(yesterday) → attemptFetch(yesterday)
  └─ max retries? → onError(error) → return []
```

## Backwards Compatibility

✅ This is a **pure bug fix**:
- Same API signatures
- No breaking changes
- Better behavior (silent retries instead of error toasts)
- More aligned with original WikiApiClient behavior

## Related Files

- `src/lib/api/featuredApi.js` - Main fix
- `src/lib/stores.js` - Store integration
- `src/routes/index.svelte` - UI integration
- `docs/MIGRATION_TO_STORES.md` - Full migration context

## Edge Cases Handled

1. **404 on today's date** → Retry yesterday ✓
2. **Empty articles array** → Retry yesterday ✓
3. **Network error** → Fail immediately (don't retry) ✓
4. **Max retries reached** → Show error toast ✓
5. **Successful data found** → Show articles, no toast ✓

---

**Fixed**: October 2025
**Status**: ✅ Ready for production
**Test**: Manual testing with 404 responses works correctly


