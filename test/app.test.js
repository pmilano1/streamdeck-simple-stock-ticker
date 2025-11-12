const assert = require('assert');

// Helper functions extracted for testing
function calculateStockChange(currentPrice, previousClose) {
    const change = currentPrice - previousClose;
    const changePercent = (change / previousClose) * 100;
    return { change, changePercent };
}

function formatPrice(price) {
    return '$' + price.toFixed(2);
}

function formatChange(change) {
    return (change >= 0 ? '+' : '') + change.toFixed(2);
}

function formatPercent(changePercent) {
    return (changePercent >= 0 ? '+' : '') + changePercent.toFixed(2) + '%';
}

function formatTitle(symbol, price, changePercent, isAfterHours) {
    if (price === null) {
        return 'ERROR';
    }
    
    const priceStr = formatPrice(price);
    const percentStr = formatPercent(changePercent);
    
    if (isAfterHours) {
        return symbol + '\n' + priceStr + '\n' + percentStr + ' AH';
    } else {
        return symbol + '\n' + priceStr + '\n' + percentStr;
    }
}

function determineState(change) {
    return change >= 0 ? 0 : 1; // 0 = green (up), 1 = red (down)
}

function parseYahooFinanceResponse(json) {
    if (!json.chart || !json.chart.result || !json.chart.result[0]) {
        throw new Error('Invalid response format');
    }
    
    const result = json.chart.result[0];
    const meta = result.meta;
    
    let currentPrice = meta.regularMarketPrice;
    let isAfterHours = false;
    
    // Check for post-market price
    if (meta.postMarketPrice && meta.postMarketPrice !== currentPrice) {
        currentPrice = meta.postMarketPrice;
        isAfterHours = true;
    } else if (meta.preMarketPrice && meta.preMarketPrice !== currentPrice) {
        currentPrice = meta.preMarketPrice;
        isAfterHours = true;
    }
    
    const previousClose = meta.chartPreviousClose || meta.previousClose;
    
    return {
        currentPrice,
        previousClose,
        isAfterHours
    };
}

// Test Suite
describe('Stock Ticker Plugin - Unit Tests', function() {
    
    describe('calculateStockChange', function() {
        it('should calculate positive change correctly', function() {
            const result = calculateStockChange(150.50, 145.00);
            assert.strictEqual(result.change.toFixed(2), '5.50');
            assert.strictEqual(result.changePercent.toFixed(2), '3.79');
        });
        
        it('should calculate negative change correctly', function() {
            const result = calculateStockChange(140.00, 145.00);
            assert.strictEqual(result.change.toFixed(2), '-5.00');
            assert.strictEqual(result.changePercent.toFixed(2), '-3.45');
        });
        
        it('should handle zero change', function() {
            const result = calculateStockChange(100.00, 100.00);
            assert.strictEqual(result.change, 0);
            assert.strictEqual(result.changePercent, 0);
        });
    });
    
    describe('formatPrice', function() {
        it('should format price with dollar sign and 2 decimals', function() {
            assert.strictEqual(formatPrice(150.5), '$150.50');
            assert.strictEqual(formatPrice(99.99), '$99.99');
            assert.strictEqual(formatPrice(1000), '$1000.00');
        });
    });
    
    describe('formatChange', function() {
        it('should format positive change with + sign', function() {
            assert.strictEqual(formatChange(5.50), '+5.50');
        });
        
        it('should format negative change with - sign', function() {
            assert.strictEqual(formatChange(-3.25), '-3.25');
        });
        
        it('should format zero change with + sign', function() {
            assert.strictEqual(formatChange(0), '+0.00');
        });
    });
    
    describe('formatPercent', function() {
        it('should format positive percent with + sign and %', function() {
            assert.strictEqual(formatPercent(3.79), '+3.79%');
        });
        
        it('should format negative percent with - sign and %', function() {
            assert.strictEqual(formatPercent(-2.50), '-2.50%');
        });
    });
    
    describe('formatTitle', function() {
        it('should format regular market hours title', function() {
            const title = formatTitle('AAPL', 150.50, 3.79, false);
            assert.strictEqual(title, 'AAPL\n$150.50\n+3.79%');
        });
        
        it('should format after-hours title with AH indicator', function() {
            const title = formatTitle('TSLA', 245.75, -1.25, true);
            assert.strictEqual(title, 'TSLA\n$245.75\n-1.25% AH');
        });
        
        it('should return ERROR for null price', function() {
            const title = formatTitle('AAPL', null, 0, false);
            assert.strictEqual(title, 'ERROR');
        });
    });
    
    describe('determineState', function() {
        it('should return 0 (green) for positive change', function() {
            assert.strictEqual(determineState(5.50), 0);
        });
        
        it('should return 1 (red) for negative change', function() {
            assert.strictEqual(determineState(-3.25), 1);
        });
        
        it('should return 0 (green) for zero change', function() {
            assert.strictEqual(determineState(0), 0);
        });
    });
    
    describe('parseYahooFinanceResponse', function() {
        it('should parse regular market data', function() {
            const mockResponse = {
                chart: {
                    result: [{
                        meta: {
                            regularMarketPrice: 150.50,
                            chartPreviousClose: 145.00
                        }
                    }]
                }
            };
            
            const result = parseYahooFinanceResponse(mockResponse);
            assert.strictEqual(result.currentPrice, 150.50);
            assert.strictEqual(result.previousClose, 145.00);
            assert.strictEqual(result.isAfterHours, false);
        });
        
        it('should detect post-market price', function() {
            const mockResponse = {
                chart: {
                    result: [{
                        meta: {
                            regularMarketPrice: 150.50,
                            postMarketPrice: 152.00,
                            chartPreviousClose: 145.00
                        }
                    }]
                }
            };
            
            const result = parseYahooFinanceResponse(mockResponse);
            assert.strictEqual(result.currentPrice, 152.00);
            assert.strictEqual(result.isAfterHours, true);
        });
        
        it('should detect pre-market price', function() {
            const mockResponse = {
                chart: {
                    result: [{
                        meta: {
                            regularMarketPrice: 150.50,
                            preMarketPrice: 148.00,
                            chartPreviousClose: 145.00
                        }
                    }]
                }
            };
            
            const result = parseYahooFinanceResponse(mockResponse);
            assert.strictEqual(result.currentPrice, 148.00);
            assert.strictEqual(result.isAfterHours, true);
        });
        
        it('should throw error for invalid response format', function() {
            const invalidResponse = { invalid: 'data' };
            assert.throws(() => {
                parseYahooFinanceResponse(invalidResponse);
            }, /Invalid response format/);
        });
        
        it('should use previousClose as fallback', function() {
            const mockResponse = {
                chart: {
                    result: [{
                        meta: {
                            regularMarketPrice: 150.50,
                            previousClose: 145.00
                        }
                    }]
                }
            };
            
            const result = parseYahooFinanceResponse(mockResponse);
            assert.strictEqual(result.previousClose, 145.00);
        });
    });
    
    describe('Integration - Full Price Display Flow', function() {
        it('should format complete display for stock up during market hours', function() {
            const mockResponse = {
                chart: {
                    result: [{
                        meta: {
                            regularMarketPrice: 175.43,
                            chartPreviousClose: 173.50
                        }
                    }]
                }
            };
            
            const parsed = parseYahooFinanceResponse(mockResponse);
            const { change, changePercent } = calculateStockChange(parsed.currentPrice, parsed.previousClose);
            const title = formatTitle('AAPL', parsed.currentPrice, changePercent, parsed.isAfterHours);
            const state = determineState(change);
            
            assert.strictEqual(title, 'AAPL\n$175.43\n+1.11%');
            assert.strictEqual(state, 0); // green
        });
        
        it('should format complete display for stock down after hours', function() {
            const mockResponse = {
                chart: {
                    result: [{
                        meta: {
                            regularMarketPrice: 245.00,
                            postMarketPrice: 242.50,
                            chartPreviousClose: 248.00
                        }
                    }]
                }
            };
            
            const parsed = parseYahooFinanceResponse(mockResponse);
            const { change, changePercent } = calculateStockChange(parsed.currentPrice, parsed.previousClose);
            const title = formatTitle('TSLA', parsed.currentPrice, changePercent, parsed.isAfterHours);
            const state = determineState(change);
            
            assert.strictEqual(title, 'TSLA\n$242.50\n-2.22% AH');
            assert.strictEqual(state, 1); // red
        });
    });
});

// Export functions for use in main app if needed
module.exports = {
    calculateStockChange,
    formatPrice,
    formatChange,
    formatPercent,
    formatTitle,
    determineState,
    parseYahooFinanceResponse
};

