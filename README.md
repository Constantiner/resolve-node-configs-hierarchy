# resolve-node-configs-hierarchy<!-- omit in toc -->

Simple library to resolve configuration files hierarchy in Node projects for producing effective configuration from them.

It is very convenient if you need to have local configuration for local environment and not place it in version control system. Or to have separate configurations for `development` or `test` or `production` environments to apply them automatically.

So the library allows to manage configurations for any environment and the same code base.

**Note** Don't forget to place `local` files to `.gitignore`.

- [Documentation](#documentation)
	- [getConfigFiles](#getconfigfiles)
	- [getConfigFile](#getconfigfile)
- [Installation](#installation)
- [Usage](#usage)

## Documentation

The utility was inspired by [create-react-app](https://github.com/facebook/create-react-app) and may contain some chunks of code from it.

**Note** To use in Node environment, not in browser.

The base idea is [the following](https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use):

It will list the following files, starting from the bottom. The first value set (or those already defined in the environment) take precedence:

* `.env` - The Original®
* `.env.development`, `.env.test`, `.env.production` - Environment-specific settings.
* `.env.local` - Local overrides. This file is loaded for all environments except test (you can include it with flag as the second parameter).
* `.env.development.local`, `.env.test.local` (for `test` environment you can include it with flag as the second parameter), `.env.production.local` - Local overrides of environment-specific settings.

It uses `process.env.NODE_ENV` for setting environment.

For test environment it will not list `.env.local` and `.env.test.local` from this list by default since normally you expect tests to produce the same results for everyone. You can include them by passing the second parameter with `true` value.

It may use any relative path as the base path even with extension.

It contains the following methods:

### getConfigFiles

Returns a list of absolute file paths of existing files in the order to apply from first to last (in order of precedence).

for example if you pass `"configuration/log4js.json"` it will produce the following list for development environment (if all of these files are exist in file system):

* `<project_path>/configuration/log4js.development.local.json`
* `<project_path>/configuration/log4js.local.json`
* `<project_path>/configuration/log4js.development.json`
* `<project_path>/configuration/log4js.json`

This utility is asynchronous and returns a promise resolving to file list.

This utility was inspired by [create-react-app](https://github.com/facebook/create-react-app) and may contain some chunks of code from it.

**Note** The bundle contains only ES6 modules version. Use Babel, Rollup, Webpack etc. to produce commonjs version.

### getConfigFile

Returns the most relevant absolute file path of existing files in files hierarchy.

for example if you pass `"configuration/log4js.json"` it will return the following file path for development environment (if it exists in file system):

* `<project_path>/configuration/log4js.development.local.json`

This utility is asynchronous and returns a promise resolving to absolute file path as `String` (or resolving to `null`).

## Installation

```bash
npm install @constantiner/resolve-node-configs-hierarchy
```

## Usage

Import it first:

```JavaScript
import { getConfigFiles } from "@constantiner/resolve-node-configs-hierarchy";
```

Then you can use it:

```JavaScript
getConfigFiles("src/.env").then(files => {
	files.forEach(file => {
		dotenv.config({
			path: file
		})
	})
});
```

Or for getting the single most actual config file:

```JavaScript
import { getConfigFile } from "@constantiner/resolve-node-configs-hierarchy";

getConfigFile("src/.env").then(filePath => {
	if (filePath) {
		const config = require(filePath);
	}
});

```



To include `local` files in `test` environment you may pass corresponding flag (it is `false` by default):

```JavaScript
getConfigFiles("src/.env", true).then(files => {
	files.forEach(file => {
		dotenv.config({
			path: file
		})
	})
});
```

Or the same for `getConfigFile`:

```JavaScript
getConfigFile("src/.env", true).then(filePath => {
	if (filePath) {
		const config = require(filePath);
	}
});
```
