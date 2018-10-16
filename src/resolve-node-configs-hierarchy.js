import acatch from "@constantiner/fun-ctional/acatch";
import acompose from "@constantiner/fun-ctional/acompose";
import afilter from "@constantiner/fun-ctional/afilter";
import { resolvePath, statAsync } from "./util/fsUtils";
import { getEnv } from "./util/getEnv";

const fileExists = acompose(acatch(() => false), () => true, statAsync);

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
	return { path: resultingPath, ext: extension };
};

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const getHierarchicConfigsArray = nodeEnvFunc => ({ path, ext }) => {
	const nodeEnv = nodeEnvFunc();
	return [
		`${path}.${nodeEnv}.local`,
		// Don't include `.env.local` for `test` environment
		// since normally you expect tests to produce the same
		// results for everyone
		nodeEnv !== "test" && `${path}.local`,
		`${path}.${nodeEnv}`,
		path
	]
		.filter(Boolean)
		.map(path => (ext ? `${path}.${ext}` : path));
};

/**
 * Returns a list of absolute file paths of existing files in the order to apply from first to last
 * (in order of precedence).
 *
 * The base idea is the following https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
 *
 * It will list the following files, starting from the bottom.
 * The first value set (or those already defined in the environment) take precedence:
 * .env - The Original®
 * .env.development, .env.test, .env.production - Environment-specific settings.
 * .env.local - Local overrides. This file is loaded for all environments except test.
 * .env.development.local, .env.test.local, .env.production.local - Local overrides of environment-specific settings.
 *
 * It uses process.env.NODE_ENV for setting environment.
 *
 * For test environment it will not list .env.local from this list
 * since normally you expect tests to produce the same results for everyone.
 *
 * It may use any relative path as the base path even with extension.
 *
 * for example if you pass "configuration/log4js.json" it will produce the following list for development environment
 * (if all of these files are exist in file system):
 * <project_path>/configuration/log4js.development.local.json
 * <project_path>/configuration/log4js.local.json
 * <project_path>/configuration/log4js.development.json
 * <project_path>/configuration/log4js.json
 *
 * This utility is asynchronous and returns a promise resolving to file list.
 *
 * This utility was inspired by https://github.com/facebook/create-react-app and may contain some chunks of code from it.
 *
 * @param {string} file Relative path (from project root) to base file location (for example "config/.env").
 * @returns {Promise<Array>} A promise resolving to array of absolute file names.
 *
 * @see https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
 */
const getConfigFiles = acompose(
	afilter(fileExists),
	getHierarchicConfigsArray(getEnv),
	separatePathAndExtension,
	resolvePath
);

export default getConfigFiles;
