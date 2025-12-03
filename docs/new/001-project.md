# 001 - Project Overview

## What Is This

A Svelte app that:
- Shows **trending/featured Wikipedia articles** by date (via pageviews)
- Lets you **search Wikipedia** across 6 languages
- Displays articles in a responsive masonry grid

## Stack

- **SvelteKit** - Framework
- **Tailwind CSS** - Styling
- **Flowbite** - UI components (date picker, etc.)
- **svelte-i18n** - Internationalization

## APIs Used

| API | Purpose | Endpoint Pattern |
|-----|---------|------------------|
| MediaWiki Search | Wikipedia search | `{lang}.wikipedia.org/w/api.php` |
| Wikipedia REST | Page summaries/details | `{lang}.wikipedia.org/api/rest_v1/page/summary/{title}` |
| Wikimedia Pageviews | Trending articles | `wikimedia.org/api/rest_v1/metrics/pageviews/top/{lang}.wikipedia/...` |

## Languages Supported

`en`, `pt`, `es`, `fr`, `it`, `de`

---

See: [[010-architecture]], [[020-the-refactor]]
