# Simple Stock Ticker - Stream Deck Plugin

A Stream Deck plugin that displays real-time stock prices with automatic updates every 15 seconds.

![Finance](https://img.shields.io/badge/category-Finance-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-orange)

## Features

- 📈 **Real-time stock prices** - Updates every 15 seconds
- 🎨 **Visual indicators** - Green for gains, red for losses
- 🌙 **After-hours pricing** - Shows pre-market and post-market prices with "AH" indicator
- ⚙️ **Configurable** - Track any stock symbol (AAPL, TSLA, MSFT, etc.)
- 🎯 **Multiple stocks** - Add multiple buttons to track different stocks

## Installation

### Prerequisites

- Stream Deck software version 6.4 or higher
- Node.js version 20 or higher (must be installed on your system)
- Windows 10 or higher, or macOS 10.15 (Catalina) or higher

### Easy Install (Recommended)

1. Download the latest release:
   - Go to [Releases](https://github.com/pmilano1/streamdeck-simple-stock-ticker/releases)
   - Download `com.pmilano1.simplestockticker.streamDeckPlugin`
2. Double-click the downloaded file
3. Stream Deck will automatically install the plugin
4. The plugin will appear in the Stream Deck actions list under "Finance"

### Install from Source

1. Clone this repository:
   ```bash
   git clone https://github.com/pmilano1/streamdeck-simple-stock-ticker.git
   cd streamdeck-simple-stock-ticker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy to Stream Deck plugins folder:
   ```bash
   # Windows
   xcopy /E /I /Y . "%APPDATA%\Elgato\StreamDeck\Plugins\com.pmilano1.simplestockticker.sdPlugin"

   # macOS
   cp -r . ~/Library/Application\ Support/com.elgato.StreamDeck/Plugins/com.pmilano1.simplestockticker.sdPlugin
   chmod +x ~/Library/Application\ Support/com.elgato.StreamDeck/Plugins/com.pmilano1.simplestockticker.sdPlugin/launch.sh
   ```

4. Restart Stream Deck

## Usage

1. Open Stream Deck software
2. Find "Simple Stock Ticker" in the actions list under Finance category
3. Drag it to any button on your Stream Deck
4. In the Stream Deck software, select the button and configure it in the property inspector:
   - Enter the stock symbol (e.g., AAPL, TSLA, MSFT)
5. The button will display:
   - Stock symbol (top line)
   - Current price (middle line)
   - Percent change (bottom line)
   - "AH" indicator for after-hours pricing

## Configuration

### Stock Symbol

Enter any valid stock ticker symbol in the configuration panel. Examples:
- `AAPL` - Apple Inc.
- `TSLA` - Tesla Inc.
- `MSFT` - Microsoft Corporation
- `GOOGL` - Alphabet Inc.
- `AMZN` - Amazon.com Inc.

### Display Format

**During Market Hours:**
```
AAPL
$175.43
+1.25%
```

**After Hours:**
```
AAPL
$176.20
+1.69% AH
```

## Building a Release

To create a distributable `.streamDeckPlugin` file:

### Option 1: Using Elgato's Distribution Tool (Recommended)

1. Download the [Stream Deck Distribution Tool](https://developer.elgato.com/documentation/stream-deck/sdk/packaging/)
2. Run the tool:
   ```bash
   # Windows
   DistributionTool.exe -b -i com.pmilano1.simplestockticker.sdPlugin -o release

   # macOS
   ./DistributionTool -b -i com.pmilano1.simplestockticker.sdPlugin -o release
   ```
3. This creates `release/com.pmilano1.simplestockticker.streamDeckPlugin`

### Option 2: Manual Packaging

The `.sdPlugin` folder itself is the plugin. Users can:
1. Download/clone the repository
2. Double-click the `com.pmilano1.simplestockticker.sdPlugin` folder
3. Stream Deck will install it

### GitHub Releases

This repository uses GitHub Actions to automatically create releases:
1. Create a new tag: `git tag v1.0.0`
2. Push the tag: `git push origin v1.0.0`
3. GitHub Actions will automatically build and attach the `.streamDeckPlugin` file to the release

## Building for Distribution

### Creating a Release Package

To submit to the Stream Deck Marketplace or distribute your plugin, you need to create a `.streamDeckPlugin` file.

#### Using Elgato's Distribution Tool (Required for Marketplace)

1. Download the [Stream Deck Distribution Tool](https://developer.elgato.com/documentation/stream-deck/sdk/packaging/)
2. Package the plugin:
   ```bash
   # Windows
   DistributionTool.exe -b -i com.pmilano1.simplestockticker.sdPlugin -o .

   # macOS
   ./DistributionTool -b -i com.pmilano1.simplestockticker.sdPlugin -o .
   ```
3. This creates `com.pmilano1.simplestockticker.streamDeckPlugin`

#### Manual Installation (Development)

Users can also install directly by double-clicking the `.sdPlugin` folder.

### Submitting to Stream Deck Marketplace

1. **Create an Elgato Developer Account**
   - Visit [developer.elgato.com](https://developer.elgato.com/)
   - Sign up for a developer account

2. **Prepare Your Submission**
   - Package your plugin using the Distribution Tool (see above)
   - Ensure all icons are present and correct sizes
   - Test thoroughly on all supported platforms (Windows, macOS)
   - Verify Node.js is listed as a requirement

3. **Submit Your Plugin**
   - Log in to the [Elgato Marketplace](https://marketplace.elgato.com/)
   - Click "Submit Plugin"
   - Upload your `.streamDeckPlugin` file
   - Fill out the submission form:
     - Plugin name: Simple Stock Ticker
     - Category: Finance
     - Description: Real-time stock price ticker with automatic updates
     - Screenshots (if required)
     - Support contact information

4. **Review Process**
   - Elgato reviews submissions (typically 1-4 weeks)
   - They test functionality and check guidelines compliance
   - You'll receive approval or feedback for changes

5. **After Approval**
   - Plugin appears in the Stream Deck Store
   - Users can install directly from Stream Deck software

### Alternative: GitHub Releases

While waiting for marketplace approval, distribute via GitHub:

1. Create a release on GitHub
2. Attach the `.streamDeckPlugin` file
3. Users download and double-click to install

## Development

### Running Tests

```bash
npm test
```

The test suite includes:
- Price calculation tests
- Formatting tests
- Yahoo Finance API response parsing
- Integration tests

### Project Structure

```
streamdeck-simple-stock-ticker/
├── .gitignore                # Git ignore file
├── LICENSE                   # MIT License
├── README.md                 # This file
├── app.js                    # Main plugin logic
├── launch.bat                # Windows launcher
├── manifest.json             # Plugin metadata
├── package.json              # Node.js dependencies
├── package-lock.json         # Dependency lock file
├── propertyinspector.html    # Configuration UI
├── images/                   # Plugin icons
│   ├── icon.png
│   ├── icon@2x.png
│   ├── category.png
│   ├── category@2x.png
│   ├── key-green.png         # Button background (stock up)
│   ├── key-green@2x.png
│   ├── key-red.png           # Button background (stock down)
│   └── key-red@2x.png
└── test/                     # Unit tests
    ├── README.md
    └── app.test.js
```

### API

This plugin uses the Yahoo Finance API to fetch stock data:
- Endpoint: `https://query1.finance.yahoo.com/v8/finance/chart/{SYMBOL}`
- Update interval: 15 seconds
- Includes regular market, pre-market, and post-market pricing

## Troubleshooting

### Plugin not showing in Stream Deck

1. Restart Stream Deck software
2. Check that the plugin is installed in `%APPDATA%\Elgato\StreamDeck\Plugins\`
3. Verify Node.js is installed: `node -v`

### Button shows "ERROR"

1. Check your internet connection
2. Verify the stock symbol is valid
3. Yahoo Finance may be rate limiting - wait a few minutes
4. Check `debug.log` for error details

### Stock price not updating

1. Verify Stream Deck is running
2. Check that the button is visible on your Stream Deck
3. Review `debug.log` for API errors

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Stock data provided by Yahoo Finance
- Built with the [Stream Deck SDK](https://docs.elgato.com/streamdeck/sdk/)

## Author

**pmilano1**

- GitHub: [@pmilano1](https://github.com/pmilano1)

## Support

If you encounter any issues or have questions:
- Open an [issue](https://github.com/pmilano1/streamdeck-simple-stock-ticker/issues)
- Check existing issues for solutions

---

**Disclaimer:** This plugin is not affiliated with or endorsed by Yahoo Finance or Elgato. Stock data is provided for informational purposes only and should not be used as the sole basis for investment decisions.

