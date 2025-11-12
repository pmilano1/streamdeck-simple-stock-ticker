# Stock Ticker Plugin - Test Suite

## Overview

This test suite validates the core business logic of the Stock Ticker Stream Deck plugin using unit tests.

## Running Tests

```bash
npm test
```

## Test Coverage

### 1. Price Calculation Tests
- ✅ Positive price changes
- ✅ Negative price changes
- ✅ Zero change scenarios

### 2. Formatting Tests
- ✅ Price formatting ($XXX.XX)
- ✅ Change formatting (+/-X.XX)
- ✅ Percent formatting (+/-X.XX%)
- ✅ Title formatting (symbol + price + percent)

### 3. State Determination Tests
- ✅ Green state for positive changes
- ✅ Red state for negative changes
- ✅ Zero change handling

### 4. Yahoo Finance API Response Parsing
- ✅ Regular market hours data
- ✅ Post-market (after-hours) data
- ✅ Pre-market data
- ✅ Invalid response handling
- ✅ Fallback field handling

### 5. Integration Tests
- ✅ Complete flow for stock price increases
- ✅ Complete flow for stock price decreases
- ✅ After-hours indicator display

## Test Framework

- **Mocha** - Test runner
- **Node.js Assert** - Assertion library

## Test Structure

```
test/
├── app.test.js       # Main test suite
└── README.md         # This file
```

## Adding New Tests

To add new tests, edit `test/app.test.js` and add new `describe` or `it` blocks:

```javascript
describe('New Feature', function() {
    it('should do something', function() {
        assert.strictEqual(actual, expected);
    });
});
```

## Continuous Testing

For development, you can run tests in watch mode:

```bash
npx mocha test/**/*.test.js --watch
```

This will automatically re-run tests when files change.

