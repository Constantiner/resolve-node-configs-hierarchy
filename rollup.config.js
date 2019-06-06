import { format } from "date-fns";
import { readFileSync } from "fs";
import { sync as globby } from "globby";
import resolve from "rollup-plugin-node-resolve";
import sourcemaps from "rollup-plugin-sourcemaps";

const getBuildDate = () => format(new Date(), "DD MMMM YYYY");
const pkg = require("./package.json");

const getActualBanner = () => {
	const licenseText = readFileSync("./LICENSE", "utf-8");
	const banner = `/**
 * ${pkg.name}
 * ${pkg.description}
 * 
 * @author ${pkg.author.name} <${pkg.author.email}>
 * @version v${pkg.version}
 * @link ${pkg.homepage}
 * @date ${getBuildDate()}
 * 
${licenseText.replace(/^/gm, " * ")}
 */

`;
	return banner;
};

const getSourceFilesList = () => globby(["src/*.js"]);
const getFileName = file =>
	file
		.split("/")
		.pop()
		.split(".")
		.slice(0, -1)
		.join(".");
const getOutput = (input, extension) => `${getFileName(input)}.${extension}`;
const getFolderPart = folder => (folder ? folder + "/" : "");

const config = (format, folder) => input => ({
	input,
	output: {
		file: `${getFolderPart(folder)}${getOutput(input, "js")}`,
		format,
		sourcemap: true,
		sourcemapFile: `${getFolderPart(folder)}${getOutput(input, "js")}.map`,
		strict: true,
		banner: getActualBanner()
	},
	external: ["path", "fs", "util"],
	plugins: [resolve(), sourcemaps()]
});

const sourceFiles = getSourceFilesList();

export default [...sourceFiles.map(config("cjs", "dist")), ...sourceFiles.map(config("es", "esm"))];
