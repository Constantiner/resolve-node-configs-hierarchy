import acompose from "@constantiner/fun-ctional/acompose";
import afilter from "@constantiner/fun-ctional/afilter";
import applySafe from "@constantiner/fun-ctional/applySafe";
import { resolvePath, statAsync } from "./util/fsUtils";
import { getEnv } from "./util/getEnv";

const fileExists = applySafe(acompose(() => true, statAsync), () => false);

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
const getHierarchicConfigsArray = nodeEnv => ({ path, ext }) =>
	[
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

const getConfigFiles = acompose(
	afilter(fileExists),
	getHierarchicConfigsArray(getEnv()),
	separatePathAndExtension,
	resolvePath
);

export default getConfigFiles;
