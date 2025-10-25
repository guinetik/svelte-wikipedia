# svelte-wikipedia-app

Search pages on Wikipedia and discover trending articles from any date.

[Visit Site](https://wikipedia.guinetik.com/)
![site preview](https://wikipedia.guinetik.com/social-preview.jpg)

## Quick Start

```bash
npm install
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Features

- 🔍 **Full-text Wikipedia Search** - Search across Wikipedia in your language
- 🌍 **Multi-language Support** - English, Spanish, Portuguese, French, Italian, German
- 🔥 **Trending Articles** - Browse Wikipedia's most-viewed articles by date
- 📅 **Historical Data** - Check trending articles from any date in the past
- 🎨 **Dark Mode** - Beautiful dark/light theme support
- ⚡ **Lightning Fast** - Optimized API interactions and caching

## Architecture

### 🆕 Modular Stores + API Factories

The project uses a clean, layered architecture:

- **`stores.js`** - Unified Svelte stores (searchStore, featuredStore)
- **`apiConfig.js`** - Centralized configuration and constants
- **`apiUtils.js`** - Reusable utility functions for data processing
- **`searchApi.js`** - Wikipedia search functionality
- **`featuredApi.js`** - Trending/featured articles functionality

**Benefits:**
- ✅ Pure, testable API factories
- ✅ Automatic language switching
- ✅ Intelligent retry logic for API delays
- ✅ Separated concerns
- ✅ Better error handling

See [`docs/MIGRATION_TO_STORES.md`](./docs/MIGRATION_TO_STORES.md) for architecture details.

## Documentation

- **[API Architecture](./docs/API_ARCHITECTURE.md)** - Complete guide to the modular API design
- **[Migration Guide](./docs/MIGRATION_TO_STORES.md)** - ✨ NEW: Stores architecture migration
- **[Bug Fixes](./docs/BUG_FIXES.md)** - Information about bugs fixed and prevention strategies
- **[Testing Guide](./docs/TESTING_GUIDE.md)** - How to test the API modules and add new tests

## Recent Improvements

### ✅ Bug Fixes
- Fixed: "can't access property 'toLowerCase', pageDetails.title is undefined" error
- Added defensive checks for all API responses
- Improved error handling with proper HTTP status validation

### 🏗️ Code Quality
- Comprehensive JSDoc documentation on all functions
- Modular API design with separated concerns
- Pure utility functions for better testability
- Better error messages and logging

### 📚 Documentation
- Complete API architecture guide
- Bug fix documentation with prevention strategies
- Testing guide with examples
- Inline code comments and JSDoc

## Development

### Running Tests

```bash
# When test infrastructure is added
npm run test
npm run test:ui
npm run test:coverage
```

See [`docs/TESTING_GUIDE.md`](./docs/TESTING_GUIDE.md) for setup instructions and examples.

### Code Standards

- **Documentation**: All functions have JSDoc comments
- **Modularity**: Separated concerns - config, utils, search, featured
- **Error Handling**: Defensive programming with validation
- **Pure Functions**: Utilities are side-effect free and testable

### Making Changes

When working with the API:

1. Add configuration to `apiConfig.js`
2. Create utilities in `apiUtils.js`
3. Implement logic in feature-specific modules (`searchApi.js`, `featuredApi.js`)
4. Document with JSDoc
5. Create tests in `__tests__` directory

## Project Structure

```
src/
├── lib/
│   ├── api/                    # 🆕 Modular API modules
│   │   ├── apiConfig.js       # Configuration & constants
│   │   ├── apiUtils.js        # Reusable utilities
│   │   ├── searchApi.js       # Wikipedia search
│   │   └── featuredApi.js     # Trending articles
│   ├── stores.js              # 🆕 Unified Svelte stores
│   ├── theme.js
│   └── utils.js
├── components/
│   ├── Header.svelte
│   ├── Searchbar.svelte
│   ├── WikiArticle.svelte
│   └── toast/
├── routes/
│   ├── __layout.svelte
│   ├── index.svelte
│   └── about.svelte
└── i18n/                      # Internationalization
    ├── en.json
    ├── es.json
    └── ...

docs/
├── API_ARCHITECTURE.md        # API design guide
├── MIGRATION_TO_STORES.md     # 🆕 Stores migration guide
├── HOTFIX_RETRY_LOGIC.md      # 🆕 Retry logic details
├── PHASE1_FINAL_SUMMARY.md    # 🆕 Phase 1 completion
├── BUG_FIXES.md              # Bug fixes & prevention
└── TESTING_GUIDE.md          # Testing setup & examples
```

## API Usage Examples

### Search Wikipedia

```javascript
import { createSearchApi } from 'src/lib/api/searchApi';

const search = createSearchApi('en');
const results = await search.search('javascript');
search.setLanguage('es');  // Switch language
```

### Get Trending Articles

```javascript
import { createFeaturedApi } from 'src/lib/api/featuredApi';

const featured = createFeaturedApi('en');
const articles = await featured.fetchFeatured(new Date('2024-10-24'));
```

### API Utilities

```javascript
import { normalizeImageUrl, formatViewCount } from 'src/lib/api/apiUtils';

const image = normalizeImageUrl(imageUrl, 400);
const viewsText = formatViewCount(1000000);  // "1,000,000"
```

See [`docs/API_ARCHITECTURE.md`](./docs/API_ARCHITECTURE.md) for complete examples.

## Performance

- Uses Wikimedia APIs for fast responses
- Image optimization and URL normalization
- Efficient error handling and retries
- Support for historical date queries

## Browser Support

- Modern browsers (ES6+)
- Chrome, Firefox, Safari, Edge

## License

MIT

## Contributing

Contributions are welcome! Please:

1. Follow the code standards (JSDoc documentation, modular design)
2. Update documentation when making changes
3. Test your changes thoroughly
4. Create descriptive commit messages

## Status

- ✅ Search functionality - Stable
- ✅ Featured articles - Stable
- ✅ Multi-language support - Stable
- ✅ Bug fixes - Complete
- ✅ Documentation - Complete
- ✅ Stores migration - Complete (Phase 1)
- 🚧 Unit tests - In progress (Phase 2)
- 📅 Caching layer - Planned (Phase 3)
- 📅 Performance optimizations - Planned
