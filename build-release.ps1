# Build Script for Stream Deck Plugin Release
# This script helps prepare the plugin for distribution

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Simple Stock Ticker - Build Release" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if DistributionTool exists
$distToolPath = ".\DistributionTool.exe"
if (-not (Test-Path $distToolPath)) {
    Write-Host "ERROR: DistributionTool.exe not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please download the Stream Deck Distribution Tool from:" -ForegroundColor Yellow
    Write-Host "https://developer.elgato.com/documentation/stream-deck/sdk/packaging/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Place DistributionTool.exe in the same directory as this script." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Run tests first
Write-Host "Running tests..." -ForegroundColor Yellow
npm test
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Tests failed! Fix tests before building release." -ForegroundColor Red
    exit 1
}
Write-Host "Tests passed!" -ForegroundColor Green
Write-Host ""

# Clean up any existing release files
Write-Host "Cleaning up old release files..." -ForegroundColor Yellow
Remove-Item "*.streamDeckPlugin" -ErrorAction SilentlyContinue
Write-Host "Done!" -ForegroundColor Green
Write-Host ""

# Build the plugin
Write-Host "Building plugin package..." -ForegroundColor Yellow
& $distToolPath -b -i . -o ..
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Done!" -ForegroundColor Green
Write-Host ""

# Show results
$pluginFile = "..\com.pmilano1.simplestockticker.streamDeckPlugin"
if (Test-Path $pluginFile) {
    $fileSize = (Get-Item $pluginFile).Length / 1MB
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "SUCCESS! Plugin built successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "File: com.pmilano1.simplestockticker.streamDeckPlugin" -ForegroundColor Cyan
    Write-Host "Size: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Cyan
    Write-Host "Location: $((Resolve-Path $pluginFile).Path)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Test the plugin by double-clicking the .streamDeckPlugin file" -ForegroundColor White
    Write-Host "2. Review MARKETPLACE_SUBMISSION.md for submission checklist" -ForegroundColor White
    Write-Host "3. Submit to Elgato Marketplace at https://marketplace.elgato.com/" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "ERROR: Plugin file not created!" -ForegroundColor Red
    exit 1
}

