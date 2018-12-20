import { realpath, access, constants } from "fs";
import { resolve } from "path";
import { promisify } from "util";

const realpathAsync = promisify(realpath);
const accessAsync = promisify(access);
// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const resolvedCwd = realpathAsync(process.cwd());
const resolvePath = async relativePath => resolve(await resolvedCwd, relativePath);
const fileExists = async file => {
	try {
		await accessAsync(file, constants.R_OK);
		return true;
	} catch (e) {
		return false;
	}
};

export { fileExists, resolvePath };
