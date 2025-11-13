#!/usr/bin/env node

// Simple Stock Ticker Stream Deck Plugin
// Shows real-time stock price with frequent updates

const WebSocket = require('ws');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Set up logging to file
const logFile = path.join(__dirname, 'debug.log');
const originalLog = console.log;
const originalError = console.error;

console.log = function(...args) {
    const message = args.join(' ') + '\n';
    fs.appendFileSync(logFile, new Date().toISOString() + ' ' + message);
    originalLog.apply(console, args);
};

console.error = function(...args) {
    const message = 'ERROR: ' + args.join(' ') + '\n';
    fs.appendFileSync(logFile, new Date().toISOString() + ' ' + message);
    originalError.apply(console, args);
};

// Configuration
const DEFAULT_SYMBOL = 'AAPL';
const DEFAULT_DATA_SOURCE = 'yahoo';
const UPDATE_INTERVAL = 15000; // 15 seconds

// Plugin state
let websocket = null;
let pluginUUID = null;
let contexts = {}; // Store context data: { symbol, dataSource, apiKey, lastPrice, lastChange }
let updateIntervals = {};

// Connect to Stream Deck
function connectElgatoStreamDeckSocket(inPort, inPluginUUID, inRegisterEvent, inInfo) {
    pluginUUID = inPluginUUID;
    
    websocket = new WebSocket('ws://127.0.0.1:' + inPort);
    
    websocket.on('open', function() {
        const json = {
            event: inRegisterEvent,
            uuid: inPluginUUID
        };
        websocket.send(JSON.stringify(json));
        
        console.log('[Stock Ticker] Plugin connected to Stream Deck');
    });
    
    websocket.on('message', function(data) {
        const jsonObj = JSON.parse(data);
        const event = jsonObj.event;
        const context = jsonObj.context;
        
        console.log('[Stock Ticker] Event:', event);
        
        if (event === 'keyDown') {
            onKeyDown(context);
        } else if (event === 'willAppear') {
            onWillAppear(context, jsonObj.payload);
        } else if (event === 'willDisappear') {
            onWillDisappear(context);
        } else if (event === 'didReceiveSettings') {
            onDidReceiveSettings(context, jsonObj.payload);
        }
    });
    
    websocket.on('error', function(error) {
        console.error('[Stock Ticker] WebSocket error:', error);
    });
    
    websocket.on('close', function() {
        console.log('[Stock Ticker] WebSocket closed');
    });
}

// Button appears on Stream Deck
function onWillAppear(context, payload) {
    console.log('[Stock Ticker] Button appeared:', context);

    // Get settings or use defaults
    const settings = payload.settings || {};
    const symbol = settings.symbol || DEFAULT_SYMBOL;
    const dataSource = settings.dataSource || DEFAULT_DATA_SOURCE;
    const apiKey = settings.apiKey || '';

    // Store context with settings
    contexts[context] = {
        symbol: symbol,
        dataSource: dataSource,
        apiKey: apiKey,
        lastPrice: null,
        lastChange: null
    };

    console.log('[Stock Ticker] Using symbol:', symbol, 'source:', dataSource);

    // Fetch stock price immediately
    fetchStockPrice(context);

    // Set up interval to update
    if (!updateIntervals[context]) {
        updateIntervals[context] = setInterval(function() {
            fetchStockPrice(context);
        }, UPDATE_INTERVAL);
    }
}

// Settings changed
function onDidReceiveSettings(context, payload) {
    console.log('[Stock Ticker] Settings changed:', context);

    const settings = payload.settings || {};
    const symbol = settings.symbol || DEFAULT_SYMBOL;
    const dataSource = settings.dataSource || DEFAULT_DATA_SOURCE;
    const apiKey = settings.apiKey || '';

    // Update context with new settings
    if (contexts[context]) {
        contexts[context].symbol = symbol;
        contexts[context].dataSource = dataSource;
        contexts[context].apiKey = apiKey;
        contexts[context].lastPrice = null;
        contexts[context].lastChange = null;

        console.log('[Stock Ticker] Settings changed - symbol:', symbol, 'source:', dataSource);

        // Fetch new stock price immediately
        fetchStockPrice(context);
    }
}

// Button disappears from Stream Deck
function onWillDisappear(context) {
    console.log('[Stock Ticker] Button disappeared:', context);
    delete contexts[context];
    
    if (updateIntervals[context]) {
        clearInterval(updateIntervals[context]);
        delete updateIntervals[context];
    }
}

// Button pressed - disabled
function onKeyDown(context) {
    console.log('[Stock Ticker] Button pressed');
    // Disabled: No action on button press
}

// Fetch stock price from API
function fetchStockPrice(context) {
    const contextData = contexts[context];
    if (!contextData) {
        console.error('[Stock Ticker] No context data for:', context);
        return;
    }

    const symbol = contextData.symbol;
    const dataSource = contextData.dataSource || DEFAULT_DATA_SOURCE;
    const apiKey = contextData.apiKey || '';

    console.log('[Stock Ticker] Fetching stock price for', symbol, 'from', dataSource);

    // Route to appropriate data source
    switch (dataSource) {
        case 'yahoo':
            fetchFromYahoo(context, symbol);
            break;
        case 'alphavantage':
            fetchFromAlphaVantage(context, symbol, apiKey);
            break;
        case 'finnhub':
            fetchFromFinnhub(context, symbol, apiKey);
            break;
        default:
            console.error('[Stock Ticker] Unknown data source:', dataSource);
            fetchFromYahoo(context, symbol); // Fallback to Yahoo
    }
}

// Fetch from Yahoo Finance
function fetchFromYahoo(context, symbol) {
    // Using Yahoo Finance chart endpoint (most reliable)
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;

    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    };

    https.get(url, options, function(res) {
        console.log('[Stock Ticker] Response status:', res.statusCode);

        let data = '';

        res.on('data', function(chunk) {
            data += chunk;
        });

        res.on('end', function() {
            console.log('[Stock Ticker] Response received, length:', data.length);

            // Handle rate limiting
            if (res.statusCode === 429) {
                console.error('[Stock Ticker] Rate limited by Yahoo Finance. Waiting before retry...');
                updateButton(context, null, null, null, false);
                return;
            }

            if (res.statusCode !== 200) {
                console.error('[Stock Ticker] HTTP error:', res.statusCode, data);
                updateButton(context, null, null, null, false);
                return;
            }

            try {
                const json = JSON.parse(data);
                console.log('[Stock Ticker] JSON parsed successfully');

                // Yahoo Finance chart format
                if (json.chart && json.chart.result && json.chart.result[0]) {
                    const result = json.chart.result[0];
                    const meta = result.meta;

                    let currentPrice = meta.regularMarketPrice;
                    let isAfterHours = false;

                    // Check for post-market price
                    if (meta.postMarketPrice && meta.postMarketPrice !== currentPrice) {
                        currentPrice = meta.postMarketPrice;
                        isAfterHours = true;
                        console.log('[Stock Ticker] Using post-market price:', currentPrice);
                    } else if (meta.preMarketPrice && meta.preMarketPrice !== currentPrice) {
                        currentPrice = meta.preMarketPrice;
                        isAfterHours = true;
                        console.log('[Stock Ticker] Using pre-market price:', currentPrice);
                    }

                    const previousClose = meta.chartPreviousClose || meta.previousClose;
                    const change = currentPrice - previousClose;
                    const changePercent = (change / previousClose) * 100;

                    // Store in context
                    const contextData = contexts[context];
                    if (contextData) {
                        contextData.lastPrice = currentPrice;
                        contextData.lastChange = change;
                    }

                    console.log('[Stock Ticker] Price:', currentPrice, 'Change:', change.toFixed(2), '(' + changePercent.toFixed(2) + '%)', isAfterHours ? '(After Hours)' : '');

                    updateButton(context, currentPrice, change, changePercent, isAfterHours);
                } else {
                    console.error('[Stock Ticker] Invalid response format');
                    updateButton(context, null, null, null, false);
                }
            } catch (error) {
                console.error('[Stock Ticker] Error parsing response:', error);
                updateButton(context, null, null, null, false);
            }
        });
    }).on('error', function(error) {
        console.error('[Stock Ticker] Error fetching from Yahoo:', error);
        updateButton(context, null, null, null, false);
    });
}

// Fetch from Alpha Vantage
function fetchFromAlphaVantage(context, symbol, apiKey) {
    if (!apiKey) {
        console.error('[Stock Ticker] Alpha Vantage requires an API key');
        updateButton(context, null, null, null, false);
        return;
    }

    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    };

    https.get(url, options, function(res) {
        let data = '';

        res.on('data', function(chunk) {
            data += chunk;
        });

        res.on('end', function() {
            if (res.statusCode !== 200) {
                console.error('[Stock Ticker] Alpha Vantage HTTP error:', res.statusCode);
                updateButton(context, null, null, null, false);
                return;
            }

            try {
                const json = JSON.parse(data);
                const quote = json['Global Quote'];

                if (!quote || !quote['05. price']) {
                    console.error('[Stock Ticker] Invalid Alpha Vantage response');
                    updateButton(context, null, null, null, false);
                    return;
                }

                const currentPrice = parseFloat(quote['05. price']);
                const previousClose = parseFloat(quote['08. previous close']);
                const change = currentPrice - previousClose;
                const changePercent = (change / previousClose) * 100;

                // Store in context
                const contextData = contexts[context];
                if (contextData) {
                    contextData.lastPrice = currentPrice;
                    contextData.lastChange = change;
                }

                console.log('[Stock Ticker] Alpha Vantage - Price:', currentPrice, 'Change:', change.toFixed(2));

                updateButton(context, currentPrice, change, changePercent, false);
            } catch (error) {
                console.error('[Stock Ticker] Error parsing Alpha Vantage response:', error);
                updateButton(context, null, null, null, false);
            }
        });
    }).on('error', function(error) {
        console.error('[Stock Ticker] Error fetching from Alpha Vantage:', error);
        updateButton(context, null, null, null, false);
    });
}

// Fetch from Finnhub
function fetchFromFinnhub(context, symbol, apiKey) {
    if (!apiKey) {
        console.error('[Stock Ticker] Finnhub requires an API key');
        updateButton(context, null, null, null, false);
        return;
    }

    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;

    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    };

    https.get(url, options, function(res) {
        let data = '';

        res.on('data', function(chunk) {
            data += chunk;
        });

        res.on('end', function() {
            if (res.statusCode !== 200) {
                console.error('[Stock Ticker] Finnhub HTTP error:', res.statusCode);
                updateButton(context, null, null, null, false);
                return;
            }

            try {
                const json = JSON.parse(data);

                if (!json.c || json.c === 0) {
                    console.error('[Stock Ticker] Invalid Finnhub response');
                    updateButton(context, null, null, null, false);
                    return;
                }

                const currentPrice = json.c; // Current price
                const previousClose = json.pc; // Previous close
                const change = currentPrice - previousClose;
                const changePercent = (change / previousClose) * 100;

                // Store in context
                const contextData = contexts[context];
                if (contextData) {
                    contextData.lastPrice = currentPrice;
                    contextData.lastChange = change;
                }

                console.log('[Stock Ticker] Finnhub - Price:', currentPrice, 'Change:', change.toFixed(2));

                updateButton(context, currentPrice, change, changePercent, false);
            } catch (error) {
                console.error('[Stock Ticker] Error parsing Finnhub response:', error);
                updateButton(context, null, null, null, false);
            }
        });
    }).on('error', function(error) {
        console.error('[Stock Ticker] Error fetching from Finnhub:', error);
        updateButton(context, null, null, null, false);
    });
}

// Update button display
function updateButton(context, price, change, changePercent, isAfterHours) {
    if (!websocket || websocket.readyState !== WebSocket.OPEN) {
        console.error('[Stock Ticker] WebSocket not connected');
        return;
    }

    const contextData = contexts[context];
    if (!contextData) {
        console.error('[Stock Ticker] No context data for:', context);
        return;
    }

    const symbol = contextData.symbol;
    let title = '';
    let state = 0; // 0 = green (up), 1 = red (down)

    if (price !== null) {
        // Format price
        const priceStr = '$' + price.toFixed(2);
        const changeStr = (change >= 0 ? '+' : '') + change.toFixed(2);
        const percentStr = (changePercent >= 0 ? '+' : '') + changePercent.toFixed(2) + '%';

        // Add indicator for after-hours trading
        if (isAfterHours) {
            title = symbol + '\n' + priceStr + '\n' + percentStr + ' AH';
        } else {
            title = symbol + '\n' + priceStr + '\n' + percentStr;
        }

        state = change >= 0 ? 0 : 1;
    } else {
        title = 'ERROR';
        state = 1;
    }
    
    // Set title
    const titleJson = {
        event: 'setTitle',
        context: context,
        payload: {
            title: title,
            target: 0
        }
    };
    websocket.send(JSON.stringify(titleJson));
    
    // Set state (green for up, red for down)
    const stateJson = {
        event: 'setState',
        context: context,
        payload: {
            state: state
        }
    };
    websocket.send(JSON.stringify(stateJson));
    
    console.log('[Stock Ticker] Button updated:', title, 'State:', state);
}

// Parse command line arguments
const args = process.argv.slice(2);
let port = null;
let uuid = null;
let registerEvent = null;
let info = null;

for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    const value = args[i + 1];
    
    if (key === '-port') {
        port = value;
    } else if (key === '-pluginUUID') {
        uuid = value;
    } else if (key === '-registerEvent') {
        registerEvent = value;
    } else if (key === '-info') {
        info = value;
    }
}

// Connect to Stream Deck
if (port && uuid && registerEvent) {
    console.log('[Stock Ticker] Starting plugin...');
    console.log('[Stock Ticker] Port:', port);
    console.log('[Stock Ticker] UUID:', uuid);
    console.log('[Stock Ticker] Register Event:', registerEvent);
    connectElgatoStreamDeckSocket(port, uuid, registerEvent, info);
} else {
    console.error('[Stock Ticker] Missing required arguments');
    process.exit(1);
}

// Handle process termination
process.on('SIGTERM', function() {
    console.log('[Stock Ticker] Shutting down...');
    
    for (const context in updateIntervals) {
        clearInterval(updateIntervals[context]);
    }
    
    if (websocket) {
        websocket.close();
    }
    
    process.exit(0);
});

