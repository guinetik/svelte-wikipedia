# Testing Guide

## Overview

The refactored API modules are designed to be **testable** and **composable**. This guide explains how to test the API layer.

## Current State

Currently, there are **no automated tests** in the project. This document provides examples and setup instructions for adding tests.

## Recommended Test Framework

We recommend **Vitest** or **Jest** for testing. Both work well with Svelte/SvelteKit projects without adding heavy dependencies.

### Setup Instructions

```bash
# Install Vitest
npm install -D vitest

# Install mocking utilities
npm install -D @vitest/ui
```

Add to `package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

## Testing API Utilities

### `apiUtils.js` Tests

**Strengths**: Pure functions, no side effects - easy to test!

```javascript
// src/lib/api/__tests__/apiUtils.test.js
import { describe, it, expect } from 'vitest';
import {
  normalizeImageUrl,
  isErrorResponse,
  extractArticleText,
  extractArticleUrl,
  buildQueryString,
  formatViewCount
} from '../apiUtils';

describe('apiUtils', () => {
  describe('normalizeImageUrl', () => {
    it('should change image width prefix', () => {
      const input = 'https://example.com/320px-Image.png';
      const output = normalizeImageUrl(input, 400);
      expect(output).toBe('https://example.com/400px-Image.png');
    });

    it('should handle URLs without px- pattern', () => {
      const input = 'https://example.com/image.png';
      expect(normalizeImageUrl(input)).toBe(input);
    });

    it('should handle null/undefined gracefully', () => {
      expect(normalizeImageUrl(null)).toBe(null);
      expect(normalizeImageUrl(undefined)).toBe(undefined);
    });
  });

  describe('isErrorResponse', () => {
    it('should detect error responses', () => {
      expect(isErrorResponse(null)).toBe(true);
      expect(isErrorResponse({ error: true })).toBe(true);
      expect(isErrorResponse({ title: 'Not found' })).toBe(true);
    });

    it('should accept valid responses', () => {
      expect(isErrorResponse({ title: 'Valid Title', extract: 'text' })).toBe(false);
    });
  });

  describe('extractArticleText', () => {
    it('should prefer extract over description', () => {
      const response = {
        extract: 'Primary text',
        description: 'Fallback text'
      };
      expect(extractArticleText(response)).toBe('Primary text');
    });

    it('should fallback to description', () => {
      const response = {
        description: 'Fallback text'
      };
      expect(extractArticleText(response)).toBe('Fallback text');
    });

    it('should handle empty response', () => {
      expect(extractArticleText(null)).toBe('');
      expect(extractArticleText({})).toBe('');
    });
  });

  describe('formatViewCount', () => {
    it('should format large numbers', () => {
      expect(formatViewCount(1000)).toBe('1,000');
      expect(formatViewCount(1000000)).toBe('1,000,000');
    });

    it('should handle invalid input', () => {
      expect(formatViewCount(null)).toBe('0');
      expect(formatViewCount('not a number')).toBe('0');
    });
  });

  describe('buildQueryString', () => {
    it('should build query strings', () => {
      const params = { search: 'javascript', lang: 'en' };
      const result = buildQueryString(params);
      expect(result).toBe('search=javascript&lang=en');
    });

    it('should filter empty values', () => {
      const params = { search: 'test', empty: '', undef: undefined, null: null };
      const result = buildQueryString(params);
      expect(result).toBe('search=test');
    });

    it('should encode special characters', () => {
      const params = { search: 'hello world' };
      const result = buildQueryString(params);
      expect(result).toBe('search=hello%20world');
    });
  });
});
```

## Testing API Factories

### `searchApi.js` Tests

```javascript
// src/lib/api/__tests__/searchApi.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createSearchApi } from '../searchApi';

describe('createSearchApi', () => {
  let api;

  beforeEach(() => {
    api = createSearchApi('en');
  });

  describe('language management', () => {
    it('should initialize with provided language', () => {
      expect(api.getLanguage()).toBe('en');
    });

    it('should set language', () => {
      api.setLanguage('es');
      expect(api.getLanguage()).toBe('es');
    });
  });

  describe('buildSearchUrl', () => {
    it('should build valid search URLs', () => {
      const url = api.buildSearchUrl('javascript');
      expect(url).toContain('gsrsearch=javascript');
      expect(url).toContain('en.wikipedia.org');
    });

    it('should change language in URLs', () => {
      const enUrl = api.buildSearchUrl('test');
      api.setLanguage('es');
      const esUrl = api.buildSearchUrl('test');
      expect(enUrl).toContain('en.wikipedia.org');
      expect(esUrl).toContain('es.wikipedia.org');
    });
  });

  describe('search', () => {
    it('should reject empty search terms', async () => {
      await expect(api.search('')).rejects.toThrow('Search term cannot be empty');
      await expect(api.search('   ')).rejects.toThrow('Search term cannot be empty');
    });

    it('should fetch search results', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ query: { pages: {} } })
        })
      );

      const results = await api.search('test');
      expect(results).toEqual({ query: { pages: {} } });
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should handle HTTP errors', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
          statusText: 'Not Found'
        })
      );

      await expect(api.search('test')).rejects.toThrow('HTTP 404');
    });

    it('should handle network errors', async () => {
      global.fetch = vi.fn(() =>
        Promise.reject(new Error('Network error'))
      );

      await expect(api.search('test')).rejects.toThrow('Network error');
    });
  });

  describe('URL history', () => {
    it('should track last search URL', () => {
      vi.mock('fetch');
      api.buildSearchUrl('test');
      expect(api.getLastSearchUrl()).toContain('gsrsearch=test');
    });

    it('should update search URL language', () => {
      api.buildSearchUrl('test');
      api.setLanguage('fr');
      const updated = api.updateSearchUrlLanguage('en');
      expect(updated).toContain('fr.wikipedia.org');
    });
  });
});
```

## Testing Featured API

### `featuredApi.js` Tests

```javascript
// src/lib/api/__tests__/featuredApi.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createFeaturedApi } from '../featuredApi';

describe('createFeaturedApi', () => {
  let api;

  beforeEach(() => {
    api = createFeaturedApi('en');
  });

  describe('parseFeatured', () => {
    it('should parse featured articles', async () => {
      const mockData = {
        items: [
          {
            articles: [
              { article: 'JavaScript', views: 1000 },
              { article: 'Python', views: 900 }
            ]
          }
        ]
      };

      // Mock the fetch for page details
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            title: 'Test Article',
            extract: 'Test extract',
            content_urls: { desktop: { page: 'https://en.wikipedia.org/wiki/Test' } }
          })
        })
      );

      const articles = await api.parseFeatured(mockData);
      expect(articles.length).toBeGreaterThan(0);
      expect(articles[0]).toHaveProperty('title');
      expect(articles[0]).toHaveProperty('views');
      expect(articles[0]).toHaveProperty('rank');
    });

    it('should handle empty data', async () => {
      const articles = await api.parseFeatured({ items: [] });
      expect(articles).toEqual([]);
    });

    it('should skip invalid articles', async () => {
      const mockData = {
        items: [
          {
            articles: [
              { article: 'JavaScript', views: 1000 }
            ]
          }
        ]
      };

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404
        })
      );

      const articles = await api.parseFeatured(mockData);
      expect(articles.length).toBe(0);
    });
  });

  describe('fetchFeatured', () => {
    it('should call callbacks appropriately', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();

      global.fetch = vi.fn((url) => {
        if (url.includes('pageviews')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              items: [{ articles: [] }]
            })
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ title: 'Test' })
        });
      });

      await api.fetchFeatured(new Date(), { onSuccess });
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
```

## Integration Testing

### E2E Tests for Components

```javascript
// src/routes/__tests__/index.test.js
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Index from '../+page.svelte';

describe('Index Page', () => {
  it('should render search bar', () => {
    render(Index);
    // Test that page renders
    expect(document.body).toBeDefined();
  });
});
```

## Manual Testing Checklist

Before deploying, manually test these scenarios:

- [ ] Search with various terms (including special characters)
- [ ] Search with empty input
- [ ] Switch languages while searching
- [ ] Switch languages for featured articles
- [ ] Try to access featured articles from historical dates
- [ ] Test on slow network (DevTools Network throttling)
- [ ] Test with large result sets
- [ ] Check console for warnings/errors

## Debugging Tips

### 1. Enable Debug Logging
```javascript
// In any API module
console.log('DEBUG:', {
  url,
  response,
  timestamp: new Date().toISOString()
});
```

### 2. Use Browser DevTools
- Network tab: See actual API requests
- Console: Check for errors/warnings
- Storage: Inspect cache if implemented

### 3. Mock Data for Development
```javascript
const mockFeaturedData = {
  items: [{
    articles: [
      { article: 'JavaScript', views: 150000 },
      { article: 'Python', views: 140000 }
    ]
  }]
};

// Use in development
if (dev) {
  await api.parseFeatured(mockFeaturedData);
}
```

## Continuous Integration

### Add GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test
```

## Coverage Goals

Aim for:
- **apiUtils.js**: 100% coverage (all functions tested)
- **apiConfig.js**: 100% coverage (constants only)
- **searchApi.js**: 80%+ coverage
- **featuredApi.js**: 80%+ coverage
- **WikiApiClient.js (legacy)**: 50%+ (being phased out)

## Next Steps

1. Set up Vitest
2. Start with utility tests (easiest)
3. Add factory tests
4. Add integration tests
5. Set up CI/CD
6. Aim for 80%+ coverage

---

**Note**: This is a living document. Update it as the testing infrastructure evolves!


