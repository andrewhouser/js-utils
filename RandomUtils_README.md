# RandomUtils Documentation

## Overview

The `RandomUtils` module provides a comprehensive collection of random number generation utilities based on the TC39 Random API proposals. It includes both standard random functions and seeded pseudo-random number generation for reproducible sequences.

## Features

### Standard Random Functions

- **Basic random functions**: `random()`, `boolean()`, `seed()`
- **Range-based generation**: `number()`, `int()`, `bigint()` with optional step parameters
- **Binary data**: `bytes()`, `fillBytes()` for generating random bytes
- **Array utilities**: `choice()`, `sample()`, `shuffle()` for working with arrays
- **String generation**: `string()`, `uuid()` for text-based randomness
- **Advanced functions**: `weightedChoice()`, `normal()`, `exponential()` for specialized use cases

### Seeded Random Generation

- **SeededRandom class**: Reproducible pseudo-random number generation
- **Multiple constructors**: Support for numeric seeds and Uint8Array seeds
- **Factory methods**: `fromSeed()`, `fromState()`, `fromFixed()` for different initialization patterns
- **State management**: `getState()`, `setState()` for saving/restoring generator state
- **All standard methods**: Seeded versions of all random functions

## Basic Usage

```typescript
import { RandomUtils } from "houser-js-utils";

// Generate random numbers
const dice = RandomUtils.int(1, 6); // Random integer 1-6
const percentage = RandomUtils.number(0, 100); // Random float 0-100
const coin = RandomUtils.boolean(); // Random true/false

// Generate random data
const bytes = RandomUtils.bytes(16); // 16 random bytes
const id = RandomUtils.uuid(); // Random UUID v4
const password = RandomUtils.string(12); // 12-character random string

// Work with arrays
const items = ["apple", "banana", "cherry"];
const chosen = RandomUtils.choice(items); // Random item
const sample = RandomUtils.sample(items, 2); // 2 random items without replacement
const shuffled = RandomUtils.shuffle(items); // Shuffled copy of array
```

## Seeded Random Generation

```typescript
import { RandomUtils } from "houser-js-utils";

// Create seeded generator for reproducible sequences
const seeded = RandomUtils.Seeded.fromFixed(42);

// These will always produce the same sequence
const value1 = seeded.random(); // Always the same value for seed 42
const dice1 = seeded.int(1, 6); // Always the same dice roll for seed 42

// Create another generator with the same seed
const seeded2 = RandomUtils.Seeded.fromFixed(42);
const value2 = seeded2.random(); // Will equal value1
const dice2 = seeded2.int(1, 6); // Will equal dice1

// Use state management
const state = seeded.getState();
const nextValue = seeded.random();
seeded.setState(state); // Reset to saved state
const sameValue = seeded.random(); // Will equal nextValue
```

## Advanced Features

### Weighted Random Choice

```typescript
const items = ["common", "uncommon", "rare"];
const weights = [70, 25, 5]; // 70% common, 25% uncommon, 5% rare
const result = RandomUtils.weightedChoice(items, weights);
```

### Normal Distribution

```typescript
// Generate normally distributed values (mean=0, stdDev=1)
const normal = RandomUtils.normal();

// Custom parameters
const customNormal = RandomUtils.normal(100, 15); // mean=100, stdDev=15
```

### Range with Steps

```typescript
// Generate even numbers between 0-20
const evenNumber = RandomUtils.int(0, 20, 2);

// Generate multiples of 5 between 0-100
const multiple = RandomUtils.number(0, 100, 5);
```

## API Compliance

This implementation follows the specifications from:

- [TC39 Random Functions Proposal](https://github.com/tc39/proposal-random-functions)
- [TC39 Seeded Random Proposal](https://github.com/tc39/proposal-seeded-random)

### Differences from Proposals

- Uses a simple Linear Congruential Generator (LCG) instead of ChaCha12 for simplicity
- State management uses numbers instead of full 112-byte states
- Some advanced distribution functions are included as bonuses

## Error Handling

All functions include comprehensive error checking:

- Type validation for all parameters
- Range validation for numeric bounds
- Array validation for collection functions
- Proper error messages with specific error types

## Testing

The module includes comprehensive tests covering:

- All function signatures and return types
- Boundary conditions and edge cases
- Error conditions and exception handling
- Reproducibility of seeded generators
- Statistical properties of distributions

Run tests with: `npm test -- src/__tests__/RandomUtils.test.ts`
