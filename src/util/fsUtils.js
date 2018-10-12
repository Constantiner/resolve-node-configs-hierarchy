import { realpath, stat } from "fs";
import { resolve } from "path";
import { promisify } from "util";

const realpathAsync = promisify(realpath);
const statAsync = promisify(stat);
// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const resolvedCwd = realpathAsync(process.cwd());
const resolvePath = async relativePath => resolve(await resolvedCwd, relativePath);

export { statAsync, resolvePath };
