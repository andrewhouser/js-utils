# Publishing Checklist

This document outlines the steps to publish `@houser/js-utils` to NPM.

## Prerequisites

1. **NPM Account**: Create an account at [npmjs.com](https://www.npmjs.com/)
2. **NPM CLI**: Ensure you have npm installed (comes with Node.js)
3. **Authentication**: Login to NPM

```bash
# Login to NPM
npm login

# Verify you're logged in
npm whoami
```

## Pre-Publication Steps

### 1. Update Version (if needed)

```bash
# Bump patch version (1.0.0 -> 1.0.1)
npm version patch
# or
yarn version --patch

# Bump minor version (1.0.0 -> 1.1.0)
npm version minor
# or
yarn version --minor

# Bump major version (1.0.0 -> 2.0.0)
npm version major
# or
yarn version --major
```

### 2. Run Tests and Build

```bash
# Install dependencies
npm install
# or
yarn install

# Run the prepublish script (includes typecheck, test, and build)
npm run prepublishOnly
# or
yarn prepublishOnly
```

### 3. Test the Package Locally

```bash
# Create a tarball to inspect what will be published
npm pack

# This creates a .tgz file - extract and inspect it to ensure only necessary files are included
```

### 4. Verify Package Contents

The package should include:

- `dist/` - Built JavaScript and TypeScript declaration files
- `README.md` - Package documentation
- `LICENSE` - MIT license file
- `RandomUtils_README.md` - Detailed RandomUtils documentation
- `package.json` - Package metadata

It should NOT include:

- `src/` - Source TypeScript files
- `node_modules/` - Dependencies
- `.github/` - GitHub workflows
- `docs/` - Generated documentation
- Test files or configuration files

## Publication

### 1. Publish to NPM

```bash
# Publish the package
npm publish

# For scoped packages (like @houser/js-utils), ensure it's public
npm publish --access public
```

### 2. Verify Publication

```bash
# Check if the package is available
npm view @houser/js-utils

# Install the published package in a test project
npm install @houser/js-utils
# or
yarn add @houser/js-utils
```

## Post-Publication

### 1. Create Git Tag

```bash
# Tag the release (if not done automatically by npm version)
git tag v1.0.0
git push origin v1.0.0
```

### 2. Update Repository URLs

Don't forget to update the repository URLs in `package.json` from:

```json
"repository": {
  "type": "git",
  "url": "git+https://github.com/yourusername/js-utils.git"
}
```

To your actual repository URL.

### 3. Monitor Package

- Check the package page on [npmjs.com](https://www.npmjs.com/package/@houser/js-utils)
- Monitor downloads and usage
- Respond to issues and feedback

## Troubleshooting

### Common Issues

1. **403 Forbidden**: You don't have permission to publish to this package name

   - Choose a different package name
   - Request access to the package if you're the rightful owner

2. **Package Name Already Taken**: Choose a different name or scope

3. **Missing Build Files**: Ensure `npm run build` completed successfully

4. **Large Package Size**: Review `.npmignore` and `files` array in `package.json`

### Useful Commands

```bash
# Check what files will be included in the package
npm pack --dry-run

# View package information
npm view @houser/js-utils

# Unpublish a version (only within 24-72 hours)
npm unpublish @houser/js-utils@1.0.0

# Deprecate a version
npm deprecate @houser/js-utils@1.0.0 "This version has been deprecated"
```
