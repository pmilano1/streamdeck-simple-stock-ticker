# Simple Stock Ticker - Stream Deck Plugin

Display real-time stock prices on your Stream Deck. Track multiple stocks with live price updates, percentage changes, and visual indicators for gains (green) and losses (red). Supports Yahoo Finance (free), Alpha Vantage, and Finnhub APIs with after-hours trading data.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-orange)

## Features

- 📈 **Real-time stock prices** - Updates every 15 seconds
- 🎨 **Visual indicators** - Green for gains, red for losses
- 🌙 **After-hours pricing** - Shows pre-market and post-market prices with "AH" indicator
- 🔌 **Multiple APIs** - Yahoo Finance (free), Alpha Vantage, Finnhub
- 🎯 **Multiple stocks** - Track different stocks on different buttons

## Installation

### From Stream Deck Marketplace (Recommended)

1. Open Stream Deck software
2. Click the Store icon
3. Search for "Simple Stock Ticker"
4. Click Install

### From GitHub Releases

1. Download the latest release from [Releases](https://github.com/pmilano1/streamdeck-simple-stock-ticker/releases)
2. Double-click `com.pmilano1.simplestockticker.streamDeckPlugin`
3. Stream Deck will automatically install the plugin

### Prerequisites

- Stream Deck software 6.4+
- Node.js 20+ (must be installed on your system)
- Windows 10+ or macOS 10.15+

## Usage

1. Open Stream Deck software
2. Find "Ticker" in the "Simple Stock Ticker" category
3. Drag it to any button
4. Enter a stock symbol (e.g., AAPL, TSLA, MSFT)
5. The button displays:
   - Stock symbol
   - Current price
   - Percent change
   - "AH" indicator for after-hours

**Display Example:**
```
AAPL
$175.43
+1.25%
```

## Configuration

### API Selection

Choose your preferred data source:
- **Yahoo Finance** (default, free, no API key required)
- **Alpha Vantage** (requires free API key)
- **Finnhub** (requires free API key)

### Stock Symbols

Enter any valid ticker symbol:
- `AAPL` - Apple Inc.
- `TSLA` - Tesla Inc.
- `MSFT` - Microsoft Corporation
- `GOOGL` - Alphabet Inc.

## Troubleshooting

**Plugin not showing:** Restart Stream Deck, verify Node.js is installed (`node -v`)

**Button shows "ERROR":** Check internet connection, verify stock symbol is valid

**Price not updating:** Ensure Stream Deck is running and button is visible

## Development

```bash
npm install
npm test
```

## License

MIT License - see [LICENSE](LICENSE) file

## Support

Open an [issue](https://github.com/pmilano1/streamdeck-simple-stock-ticker/issues) for questions or problems

