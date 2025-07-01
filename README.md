# @houser/js-utils

A comprehensive collection of TypeScript utility functions for common development tasks.

[![npm version](https://badge.fury.io/js/%40houser%2Fjs-utils.svg)](https://badge.fury.io/js/%40houser%2Fjs-utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

## Installation

```bash
npm install @houser/js-utils
# or
yarn add @houser/js-utils
```

## Features

- Tree-shakeable - Only import what you need
- ESM and CommonJS support
- Full TypeScript support
- Comprehensive test coverage
- Well-documented API

## Available Utilities

- `ArrayUtils` - Array manipulation and helper functions
- `DateUtils` - Date and time manipulation utilities
- `DOMUtils` - DOM manipulation helpers
- `FileUtils` - File handling utilities
- `FormatUtils` - Data formatting utilities
- `MathUtils` - Mathematical operations and calculations
- `RandomUtils` - Random number generation and seeded PRNGs ([detailed docs](RandomUtils_README.md))
- `StringUtils` - String manipulation utilities
- `ValidationUtils` - Data validation helpers
- And many more...

## Usage

```typescript
import { ArrayUtils, DateUtils, RandomUtils } from "@houser/js-utils";

// Use the utilities
const uniqueArray = ArrayUtils.deduplicate([1, 2, 2, 3]);
const formattedDate = DateUtils.format(new Date(), "YYYY-MM-DD");
const randomNumber = RandomUtils.int(1, 100);

// Use seeded random for reproducible results
const seeded = RandomUtils.Seeded.fromFixed(42);
const reproducibleValue = seeded.random();
```

## Development

```bash
# Install dependencies
npm install
# or
yarn install

# Run tests
npm test
# or
yarn test

# Build the library
npm run build
# or
yarn build

# Type checking
npm run typecheck
# or
yarn typecheck

# Run tests with coverage
npm run test:coverage
# or
yarn test:coverage

# Watch mode for tests
npm run test:watch
# or
yarn test:watch
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## API Documentation

Full API documentation is available at [docs/index.html](docs/index.html) or [your hosted docs URL].
