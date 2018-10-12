import { realpath, stat } from "fs";
import { resolve } from "path";
import { promisify } from "util";

const realpathAsync = promisify(realpath);
const statAsync = promisify(stat);
const resolvePath = resolve;
const getProcessCwd = process.cwd;

export { realpathAsync, statAsync, resolvePath, getProcessCwd };
