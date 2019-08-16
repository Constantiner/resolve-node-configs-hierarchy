import { join, parse } from "path";

const formExtension = extension => (extension ? extension.substring(1) : extension);

const separatePathAndExtension = path => {
	const pathObject = parse(path);
	return { path: join(pathObject.dir, pathObject.name), extension: formExtension(pathObject.ext) };
};

export { separatePathAndExtension };
