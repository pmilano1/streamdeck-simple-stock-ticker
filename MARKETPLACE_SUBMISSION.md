# Stream Deck Marketplace Submission Checklist

## Pre-Submission Checklist

### ✅ Plugin Requirements

- [x] Plugin is fully functional
- [x] Tested on Windows 10+
- [ ] Tested on macOS 10.15+
- [x] No hardcoded values (all configurable)
- [x] Error handling implemented
- [x] Unit tests passing
- [x] No PII or sensitive data in code
- [x] MIT License included

### ✅ Metadata & Documentation

- [x] manifest.json complete with all required fields
- [x] README.md with installation and usage instructions
- [x] Author field set to "pmilano1"
- [x] Version number set (1.0.0)
- [x] Description clear and concise
- [x] GitHub repository URL included

### ✅ Icons & Images

Required icon sizes (all present):
- [x] icon.png (72x72)
- [x] icon@2x.png (144x144)
- [x] category.png (28x28)
- [x] category@2x.png (56x56)
- [x] key-green.png (144x144) - Button state 0
- [x] key-green@2x.png (288x288)
- [x] key-red.png (144x144) - Button state 1
- [x] key-red@2x.png (288x288)

### ✅ Code Quality

- [x] No console.log() in production code (using proper logging)
- [x] Proper error handling for API failures
- [x] Rate limiting considerations (15 second updates)
- [x] Clean code structure
- [x] Comments where necessary

### ✅ Dependencies

- [x] package.json lists all dependencies
- [x] package-lock.json included
- [x] Node.js requirement documented (v20+)
- [x] All dependencies are from npm (no custom/private packages)

## Submission Steps

### 1. Create Distribution Package

```bash
# Download Distribution Tool from:
# https://developer.elgato.com/documentation/stream-deck/sdk/packaging/

# Windows
DistributionTool.exe -b -i com.pmilano1.simplestockticker.sdPlugin -o .

# macOS
./DistributionTool -b -i com.pmilano1.simplestockticker.sdPlugin -o .
```

This creates: `com.pmilano1.simplestockticker.streamDeckPlugin`

### 2. Test the Package

1. Uninstall any existing version from Stream Deck
2. Double-click the `.streamDeckPlugin` file
3. Verify it installs correctly
4. Test all functionality:
   - [ ] Plugin appears in Finance category
   - [ ] Can drag to Stream Deck button
   - [ ] Property inspector opens and accepts stock symbols
   - [ ] Stock prices display correctly
   - [ ] Updates every 15 seconds
   - [ ] Green/red states work correctly
   - [ ] After-hours indicator shows when applicable
   - [ ] Error handling works (invalid symbols, network issues)

### 3. Create Elgato Developer Account

1. Go to [developer.elgato.com](https://developer.elgato.com/)
2. Click "Sign Up" or "Register"
3. Complete registration
4. Verify email address

### 4. Submit to Marketplace

1. Log in to [marketplace.elgato.com](https://marketplace.elgato.com/)
2. Navigate to "Submit Plugin" or "Developer Portal"
3. Fill out submission form:

**Plugin Information:**
- **Name:** Simple Stock Ticker
- **Category:** Finance
- **Version:** 1.0.0
- **Author:** pmilano1
- **Short Description:** Real-time stock price ticker with automatic updates every 15 seconds
- **Long Description:**
  ```
  Simple Stock Ticker displays real-time stock prices on your Stream Deck with automatic updates every 15 seconds.
  
  Features:
  - Real-time stock prices from Yahoo Finance
  - Visual indicators (green for gains, red for losses)
  - After-hours pricing support (pre-market and post-market)
  - Configurable for any stock symbol (AAPL, TSLA, MSFT, etc.)
  - Multiple buttons to track different stocks
  - Updates every 15 seconds
  
  Requirements:
  - Node.js version 20 or higher must be installed
  - Internet connection for stock data
  ```

- **Support Email:** [Your email]
- **Website/GitHub:** https://github.com/pmilano1/streamdeck-simple-stock-ticker
- **License:** MIT

**Technical Details:**
- **Supported Platforms:** Windows 10+, macOS 10.15+
- **Stream Deck Software Version:** 6.4+
- **External Dependencies:** Node.js 20+, Yahoo Finance API (free, no API key required)

**Upload:**
- Upload `com.pmilano1.simplestockticker.streamDeckPlugin`

**Screenshots (if required):**
- Screenshot of plugin in action on Stream Deck
- Screenshot of property inspector
- Screenshot showing multiple stocks

### 5. Wait for Review

- Elgato typically reviews within 1-4 weeks
- Check email for approval or feedback
- Respond to any requested changes promptly

### 6. After Approval

- Plugin appears in Stream Deck Store
- Monitor for user feedback/issues
- Plan updates as needed

## Important Notes

### Requirements for Users

Make sure to clearly communicate in your submission that users need:
1. **Node.js 20+** installed on their system
2. **Internet connection** for stock data
3. **Valid stock symbols** (Yahoo Finance format)

### Support & Maintenance

Be prepared to:
- Respond to user issues
- Update if Yahoo Finance API changes
- Fix bugs reported by users
- Maintain compatibility with new Stream Deck versions

### Version Updates

When submitting updates:
1. Increment version number in manifest.json
2. Update package.json version
3. Create new distribution package
4. Submit update through marketplace
5. Include changelog

## Troubleshooting Submission Issues

### Common Rejection Reasons

1. **Missing icons** - Ensure all required sizes are present
2. **Broken functionality** - Test thoroughly before submitting
3. **Poor documentation** - Clear README and user instructions
4. **Missing dependencies** - Document all requirements
5. **Trademark issues** - Ensure plugin name doesn't infringe

### If Rejected

1. Read feedback carefully
2. Make requested changes
3. Test again thoroughly
4. Resubmit with explanation of changes

## Contact

- **GitHub Issues:** https://github.com/pmilano1/streamdeck-simple-stock-ticker/issues
- **Elgato Developer Support:** https://developer.elgato.com/support

---

**Good luck with your submission!** 🚀

