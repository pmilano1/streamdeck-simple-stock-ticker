# Contributing to Simple Stock Ticker

## Development Workflow

This project uses a PR-based workflow with branch protection rules to ensure code quality.

### Branch Protection Rules

The `main` branch is protected with the following rules:
- ✅ Require pull request reviews (1 approval)
- ✅ Require status checks to pass (tests + manifest validation)
- ✅ Require branches to be up to date before merging
- ✅ Dismiss stale reviews when new commits are pushed
- ✅ Require linear history (no merge commits)
- ✅ Block force pushes
- ✅ Block deletions

### Making Changes

#### 1. Create a Feature Branch

```bash
# Make sure you're on main and up to date
git checkout main
git pull origin main

# Create a new branch for your feature/fix
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

#### 2. Make Your Changes

```bash
# Make your code changes
# ...

# Run tests locally
npm test

# Validate the plugin
streamdeck validate .

# Commit your changes
git add .
git commit -m "Description of your changes"
```

#### 3. Push Your Branch

```bash
git push origin feature/your-feature-name
```

#### 4. Create a Pull Request

```bash
# Using GitHub CLI
gh pr create --title "Your PR title" --body "Description of changes"

# Or go to GitHub and create PR manually
```

#### 5. Wait for CI Checks

The CI workflow will automatically:
- ✅ Run all tests
- ✅ Validate the plugin manifest
- ✅ Report results on your PR

#### 6. Review and Merge

For solo development:
1. Review your own changes
2. Approve the PR (required by branch protection)
3. Merge using **Squash and merge** or **Rebase and merge** (to maintain linear history)

### Creating Releases

After merging to `main`, create a release:

```bash
# Make sure you're on main and up to date
git checkout main
git pull origin main

# Create and push a version tag
git tag v1.0.1
git push origin v1.0.1
```

This will trigger the automated release workflow that:
- Runs tests
- Builds the plugin
- Creates a GitHub release
- Uploads the `.streamDeckPlugin` file

### Branch Naming Conventions

- `feature/` - New features (e.g., `feature/add-crypto-support`)
- `fix/` - Bug fixes (e.g., `fix/price-formatting`)
- `docs/` - Documentation updates (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/api-client`)
- `test/` - Test additions/updates (e.g., `test/add-integration-tests`)

### Commit Message Guidelines

Use clear, descriptive commit messages:

```bash
# Good
git commit -m "Add support for cryptocurrency tickers"
git commit -m "Fix price formatting for values over $1000"
git commit -m "Update README with installation instructions"

# Bad
git commit -m "updates"
git commit -m "fix"
git commit -m "wip"
```

### Testing

Always run tests before creating a PR:

```bash
# Run all tests
npm test

# Validate plugin
streamdeck validate .
```

### Code Quality

- Write tests for new features
- Update documentation when needed
- Keep commits focused and atomic
- Ensure all CI checks pass before merging

## Questions?

If you have questions about the workflow, open an issue or discussion on GitHub.

