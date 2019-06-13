import { acompose, afilter } from "@constantiner/fun-ctional";
import compose from "./util/compose";
import { fileExists, fileExistsSync, resolvePath, resolvePathSync } from "./util/fsUtils";
import { getEnvironment } from "./util/getEnvironment";

const separatePathAndExtension = path => {
	const pathParts = path.split("/");
	let fileName = pathParts.pop();
	let extension = "";
	const fileNameParts = fileName.split(".");
	if (fileNameParts.length > 2 || (fileNameParts.length === 2 && fileNameParts[0].length > 0)) {
		extension = fileNameParts.pop();
		fileName = fileNameParts.join(".");
	}
	const resultingPath = `${pathParts.join("/")}/${fileName}`;
	return { path: resultingPath, extension };
};

const canIncludeLocal = (nodeEnvironment, includeTestLocals) => nodeEnvironment !== "test" || includeTestLocals;

const produceHierarchicConfigsArray = (nodeEnvironment, includeTestLocals, path, extension) =>
	[
		// Don't include `*.local.*` files for `test` environment
		// since normally you expect tests to produce the same
		// results for everyone
		canIncludeLocal(nodeEnvironment, includeTestLocals) && `${path}.${nodeEnvironment}.local`,
		// Don't include `*.local.*` files for `test` environment
		// since normally you expect tests to produce the same
		// results for everyone
		canIncludeLocal(nodeEnvironment, includeTestLocals) && `${path}.local`,
		`${path}.${nodeEnvironment}`,
		path
	]
		.filter(Boolean)
		.map(path => (extension ? `${path}.${extension}` : path));

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const getHierarchicConfigsArray = (nodeEnvironmentFunc, includeTestLocals) => ({ path, extension }) =>
	produceHierarchicConfigsArray(nodeEnvironmentFunc(), includeTestLocals, path, extension);

const filterFiles = filterFunc => files => files.filter(filterFunc);

/**
 * Returns a list of absolute file paths of existing files in the order to apply from first to last (in order of precedence).
 *
 * **Note** To use in Node environment, not in browser.
 *
 * The base idea is [the following](https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use).
 *
 * It will list the following files, starting from the bottom. The first value set (or those already defined in the environment)
 * take precedence:
 *
 * * `.env` - The Original®
 * * `.env.development`, `.env.test`, `.env.production` - Environment-specific settings.
 * * `.env.local` - Local overrides. This file is loaded for all environments except test
 * (you can include it with flag as the second parameter).
 * * `.env.development.local`, `.env.test.local` (for `test` environment
 * you can include it with flag as the second parameter), `.env.production.local` -
 * Local overrides of environment-specific settings.
 *
 * It uses `process.env.NODE_ENV` for setting environment.
 *
 * For test environment it will not list `.env.local` and `.env.test.local` from this list by default
 * since normally you expect tests to produce the same results for everyone.
 * You can include them by passing the second parameter with `true` value.
 *
 * It may use any relative path as the base path even with extension.
 *
 * for example if you pass `"configuration/log4js.json"` it will produce the following list for development environment
 * (if all of these files are exist in file system):
 *
 * * `<project_path>/configuration/log4js.development.local.json`
 * * `<project_path>/configuration/log4js.local.json`
 * * `<project_path>/configuration/log4js.development.json`
 * * `<project_path>/configuration/log4js.json`
 *
 * This utility is asynchronous and returns a promise resolving to file list.
 * Use `getConfigFilesSync` for synchronous version.
 *
 * This utility was inspired by [create-react-app](https://github.com/facebook/create-react-app)
 * and may contain some chunks of code from it.
 *
 * @param {string} file Relative path (from project root) to base file location (for example "config/.env").
 * @param {boolean} [includeTestLocals=false] Default to false. If true it includes files with "local" in name for test environment.
 * @returns {Promise<Array<string>>} A promise resolving to array of absolute file names.
 *
 * @see https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
 */
const getConfigFiles = (file, includeTestLocals = false) =>
	acompose(
		afilter(fileExists),
		getHierarchicConfigsArray(getEnvironment, includeTestLocals),
		separatePathAndExtension,
		resolvePath
	)(file);

/**
 * Returns a list of absolute file paths of existing files in the order to apply from first to last (in order of precedence).
 *
 * **Note** To use in Node environment, not in browser.
 *
 * The base idea is [the following](https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use).
 *
 * It will list the following files, starting from the bottom. The first value set (or those already defined in the environment)
 * take precedence:
 *
 * * `.env` - The Original®
 * * `.env.development`, `.env.test`, `.env.production` - Environment-specific settings.
 * * `.env.local` - Local overrides. This file is loaded for all environments except test
 * (you can include it with flag as the second parameter).
 * * `.env.development.local`, `.env.test.local` (for `test` environment
 * you can include it with flag as the second parameter), `.env.production.local` -
 * Local overrides of environment-specific settings.
 *
 * It uses `process.env.NODE_ENV` for setting environment.
 *
 * For test environment it will not list `.env.local` and `.env.test.local` from this list by default
 * since normally you expect tests to produce the same results for everyone.
 * You can include them by passing the second parameter with `true` value.
 *
 * It may use any relative path as the base path even with extension.
 *
 * for example if you pass `"configuration/log4js.json"` it will produce the following list for development environment
 * (if all of these files are exist in file system):
 *
 * * `<project_path>/configuration/log4js.development.local.json`
 * * `<project_path>/configuration/log4js.local.json`
 * * `<project_path>/configuration/log4js.development.json`
 * * `<project_path>/configuration/log4js.json`
 *
 * This utility is synchronous one. Use `getConfigFiles` for asynchronous version.
 *
 * This utility was inspired by [create-react-app](https://github.com/facebook/create-react-app)
 * and may contain some chunks of code from it.
 *
 * @param {string} file Relative path (from project root) to base file location (for example "config/.env").
 * @param {boolean} [includeTestLocals=false] Default to false. If true it includes files with "local" in name for test environment.
 * @returns {Array<string>} An array of absolute file paths.
 *
 * @see https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
 */
const getConfigFilesSync = (file, includeTestLocals = false) =>
	compose(
		filterFiles(fileExistsSync),
		getHierarchicConfigsArray(getEnvironment, includeTestLocals),
		separatePathAndExtension,
		resolvePathSync
	)(file);

/**
 * Returns the most relevant absolute file path of existing files in files hierarchy.
 *
 * **Note** To use in Node environment, not in browser.
 *
 * The base idea is [the following](https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use).
 *
 * It will list the following files, starting from the bottom. The first value set (or those already defined in the environment)
 * take precedence:
 *
 * * `.env` - The Original®
 * * `.env.development`, `.env.test`, `.env.production` - Environment-specific settings.
 * * `.env.local` - Local overrides. This file is loaded for all environments except test
 * (you can include it with flag as the second parameter).
 * * `.env.development.local`, `.env.test.local` (for `test` environment
 * you can include it with flag as the second parameter), `.env.production.local` -
 * Local overrides of environment-specific settings.
 *
 * Then it returns the absolute path to file which overrides all others (most bottom in the list).
 *
 * It uses `process.env.NODE_ENV` for setting environment.
 *
 * For test environment it will not list `.env.local` and `.env.test.local` from this list by default
 * since normally you expect tests to produce the same results for everyone.
 * You can include them by passing the second parameter with `true` value.
 *
 * It may use any relative path as the base path even with extension.
 *
 * for example if you pass `"configuration/log4js.json"` it will return the following file path for development environment
 * (if it exists in file system):
 *
 * * `<project_path>/configuration/log4js.development.local.json`
 *
 * This utility is asynchronous and returns a promise resolving to file path (or resolving to `null`).
 *  Use `getConfigFileSync` for synchronous version.
 *
 * This utility was inspired by [create-react-app](https://github.com/facebook/create-react-app)
 * and may contain some chunks of code from it.
 *
 * @param {string} file Relative path (from project root) to base file location (for example "config/.env").
 * @param {boolean} [includeTestLocals=false] Default to false. If true it includes files with "local" in name for test environment.
 * @returns {Promise<string|null>} A promise resolving to absolute file name or to `null`.
 *
 * @see https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
 */
const getConfigFile = async (file, includeTestLocals = false) => {
	const files = await getConfigFiles(file, includeTestLocals);
	return files.length > 0 ? files[0] : null;
};

/**
 * Returns the most relevant absolute file path of existing files in files hierarchy.
 *
 * **Note** To use in Node environment, not in browser.
 *
 * The base idea is [the following](https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use).
 *
 * It will list the following files, starting from the bottom. The first value set (or those already defined in the environment)
 * take precedence:
 *
 * * `.env` - The Original®
 * * `.env.development`, `.env.test`, `.env.production` - Environment-specific settings.
 * * `.env.local` - Local overrides. This file is loaded for all environments except test
 * (you can include it with flag as the second parameter).
 * * `.env.development.local`, `.env.test.local` (for `test` environment
 * you can include it with flag as the second parameter), `.env.production.local` -
 * Local overrides of environment-specific settings.
 *
 * Then it returns the absolute path to file which overrides all others (most bottom in the list).
 *
 * It uses `process.env.NODE_ENV` for setting environment.
 *
 * For test environment it will not list `.env.local` and `.env.test.local` from this list by default
 * since normally you expect tests to produce the same results for everyone.
 * You can include them by passing the second parameter with `true` value.
 *
 * It may use any relative path as the base path even with extension.
 *
 * for example if you pass `"configuration/log4js.json"` it will return the following file path for development environment
 * (if it exists in file system):
 *
 * * `<project_path>/configuration/log4js.development.local.json`
 *
 * This utility is synchronous and an absolute file path (or `null`). Use `getConfigFile` for asynchronous version.
 *
 * This utility was inspired by [create-react-app](https://github.com/facebook/create-react-app)
 * and may contain some chunks of code from it.
 *
 * @param {string} file Relative path (from project root) to base file location (for example "config/.env").
 * @param {boolean} [includeTestLocals=false] Default to false. If true it includes files with "local" in name for test environment.
 * @returns {string|null} An absolute file path or `null`.
 *
 * @see https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
 */
const getConfigFileSync = (file, includeTestLocals = false) => {
	const files = getConfigFilesSync(file, includeTestLocals);
	return files.length > 0 ? files[0] : null;
};

export { getConfigFiles, getConfigFile, getConfigFilesSync, getConfigFileSync };
