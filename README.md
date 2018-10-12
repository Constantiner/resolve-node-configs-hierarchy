# resolve-node-configs-hierarchy<!-- omit in toc -->

Simple library to resolve configuration files hierarchy in Node projects for merging them into effective configuration

- [Documentation](#documentation)
	- [Installation](#installation)
	- [Usage](#usage)

## Documentation

Returns a list of absolute file paths of existing files in the order to apply from first to last (in order of precedence).

**Note** To use in Node environment, not in browser.

The base idea is [the following](https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use).

It will list the following files, starting from the bottom. The first value set (or those already defined in the environment) take precedence:

* `.env` - The Original®
* `.env.development`, `.env.test`, `.env.production` - Environment-specific settings.
* `.env.local` - Local overrides. This file is loaded for all environments except test.
* `.env.development.local`, `.env.test.local`, `.env.production.local` - Local overrides of environment-specific settings.

It uses `process.env.NODE_ENV` for setting environment.

For test environment it will not list `.env.local` from this list since normally you expect tests to produce the same results for everyone.

It may use any relative path as the base path even with extension.

for example if you pass `"configuration/log4js.json"` it will produce the following list for development environment (if all of these files are exist in file system):

* `<project_path>/configuration/log4js.development.local.json`
* `<project_path>/configuration/log4js.local.json`
* `<project_path>/configuration/log4js.development.json`
* `<project_path>/configuration/log4js.json`

This utility is asynchronous and returns a promise resolving to file list.

This utility was inspired by [create-react-app](https://github.com/facebook/create-react-app) and may contain some chunks of code from it.

**Note** The bundle contains only ES6 modules version. Use Babel, Rollup, Webpack etc. to produce commonjs version.

### Installation

```bash
npm install @constantiner/resolve-node-configs-hierarchy
```

### Usage

Import it first:

```JavaScript
import getConfigFiles from "@constantiner/resolve-node-configs-hierarchy";
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