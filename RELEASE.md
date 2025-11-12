# Release Process

This document explains how to create a new release of the Simple Stock Ticker plugin.

## Automated Build & Release

The plugin uses GitHub Actions to automatically build and release new versions when you create a version tag.

### How to Release a New Version

1. **Make your changes** and commit them to the `main` branch:
   ```bash
   git add .
   git commit -m "Add new feature or fix bug"
   git push
   ```

2. **Create and push a version tag**:
   ```bash
   # For a patch release (bug fixes): 1.0.0 -> 1.0.1
   git tag v1.0.1
   
   # For a minor release (new features): 1.0.1 -> 1.1.0
   git tag v1.1.0
   
   # For a major release (breaking changes): 1.1.0 -> 2.0.0
   git tag v2.0.0
   
   # Push the tag to GitHub
   git push origin v1.0.1  # Replace with your version
   ```

3. **GitHub Actions will automatically**:
   - ✅ Run all tests
   - ✅ Update the version in `manifest.json`
   - ✅ Build the `.streamDeckPlugin` file
   - ✅ Create a GitHub Release
   - ✅ Attach the plugin file to the release

4. **Download and submit to Marketplace**:
   - Go to: https://github.com/pmilano1/streamdeck-simple-stock-ticker/releases
   - Download the `.streamDeckPlugin` file from the latest release
   - Log in to Maker Console: https://maker.elgato.com/
   - Submit the new version with release notes

## Version Numbering (SemVer)

Follow Semantic Versioning: `MAJOR.MINOR.PATCH`

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features, no breaking changes
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, no breaking changes

## Example Workflow

```bash
# Fix a bug
git add .
git commit -m "Fix: Stock price not updating after market close"
git push

# Create patch release
git tag v1.0.1
git push origin v1.0.1

# Wait for GitHub Actions to complete (check Actions tab)
# Download from Releases page
# Submit to Maker Console
```

## Checking Build Status

1. Go to: https://github.com/pmilano1/streamdeck-simple-stock-ticker/actions
2. Click on the latest workflow run
3. Check if all steps completed successfully
4. If successful, the release will appear at: https://github.com/pmilano1/streamdeck-simple-stock-ticker/releases

## Manual Build (if needed)

If you need to build manually without creating a release:

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build plugin
streamdeck pack . -o ../

# The .streamDeckPlugin file will be in the parent directory
```

## Troubleshooting

**Tests fail during build:**
- Fix the failing tests locally first
- Run `npm test` to verify
- Commit and push the fix

**Build fails:**
- Check the Actions tab for error details
- Common issues: missing dependencies, syntax errors
- Fix locally, commit, and push again

**Need to delete a tag:**
```bash
# Delete local tag
git tag -d v1.0.1

# Delete remote tag
git push origin :refs/tags/v1.0.1
```

