import afilter from "@constantiner/fun-ctional/afilter";
import { getEnv } from "./util/getEnv";
import { getProcessCwd, realpathAsync, resolvePath, statAsync } from "./util/getFsUtils";

const existsAsync = async file => {
	try {
		await statAsync(file);
		return true;
	} catch (e) {
		return false;
	}
};

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const resolveApp = async relativePath => resolvePath(await realpathAsync(getProcessCwd()), relativePath);

const getPathAndExtension = path => {
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
const getConfigFilesListHierarchy = (configPath, nodeEnv) => {
	const { path, ext } = getPathAndExtension(configPath);
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

const getConfigFiles = async configPath => {
	const realConfigPath = await resolveApp(configPath);
	const configFiles = getConfigFilesListHierarchy(realConfigPath, getEnv());
	const existingFiles = await afilter(existsAsync)(configFiles);
	return existingFiles;
};

export default getConfigFiles;
