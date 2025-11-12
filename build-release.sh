#!/bin/bash
# Build Script for Stream Deck Plugin Release (macOS/Linux)
# This script helps prepare the plugin for distribution

echo "========================================"
echo "Simple Stock Ticker - Build Release"
echo "========================================"
echo ""

# Check if DistributionTool exists
DIST_TOOL="./DistributionTool"
if [ ! -f "$DIST_TOOL" ]; then
    echo "ERROR: DistributionTool not found!"
    echo ""
    echo "Please download the Stream Deck Distribution Tool from:"
    echo "https://developer.elgato.com/documentation/stream-deck/sdk/packaging/"
    echo ""
    echo "Place DistributionTool in the same directory as this script."
    echo "Make it executable: chmod +x DistributionTool"
    echo ""
    exit 1
fi

# Make sure it's executable
chmod +x "$DIST_TOOL"

# Run tests first
echo "Running tests..."
npm test
if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Tests failed! Fix tests before building release."
    exit 1
fi
echo "Tests passed!"
echo ""

# Clean up any existing release files
echo "Cleaning up old release files..."
rm -f ../*.streamDeckPlugin
echo "Done!"
echo ""

# Build the plugin
echo "Building plugin package..."
"$DIST_TOOL" -b -i . -o ..
if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Build failed!"
    exit 1
fi
echo "Done!"
echo ""

# Show results
PLUGIN_FILE="../com.pmilano1.simplestockticker.streamDeckPlugin"
if [ -f "$PLUGIN_FILE" ]; then
    FILE_SIZE=$(du -h "$PLUGIN_FILE" | cut -f1)
    echo "========================================"
    echo "SUCCESS! Plugin built successfully!"
    echo "========================================"
    echo ""
    echo "File: com.pmilano1.simplestockticker.streamDeckPlugin"
    echo "Size: $FILE_SIZE"
    echo "Location: $(cd .. && pwd)/com.pmilano1.simplestockticker.streamDeckPlugin"
    echo ""
    echo "Next steps:"
    echo "1. Test the plugin by double-clicking the .streamDeckPlugin file"
    echo "2. Review MARKETPLACE_SUBMISSION.md for submission checklist"
    echo "3. Submit to Elgato Marketplace at https://marketplace.elgato.com/"
    echo ""
else
    echo "ERROR: Plugin file not created!"
    exit 1
fi

