const gulp = require("gulp");
const rename = require("gulp-rename");
const pkg = require("./package.json");
const del = require("del");
const rollup = require("gulp-better-rollup");
const SOURCES = "src/*.js";
const fs = require("fs");
let banner = `/**
 * ${pkg.name}
 * ${pkg.description}
 * 
 * @author ${pkg.author.name} <${pkg.author.email}>
 * @version v${pkg.version}
 * @link ${pkg.homepage}
 * @license ${pkg.license}
 */

`;

gulp.task("clean", () => del(["dist", "*.js", "*.mjs", "*.map", "!gulpfile.js", "!babel.config.js"]));

const getSourceFile = () => gulp.src(SOURCES),
	getDest = () => gulp.dest("."),
	proceedEs6Modules = () => {
		const licenseText = fs.readFileSync("./LICENSE", "utf-8");
		banner = `/**
 * ${pkg.name}
 * ${pkg.description}
 * 
 * @author ${pkg.author.name} <${pkg.author.email}>
 * @version v${pkg.version}
 * @link ${pkg.homepage}
 * 
${licenseText.replace(/^/gm, " * ")}
 */

`;
		return getSourceFile()
			.pipe(
				rollup(
					{},
					{
						format: "es",
						banner
					}
				)
			)
			.pipe(getDest())
			.pipe(rename({ extname: `.mjs` }))
			.pipe(getDest());
	};

gulp.task("es6modules", () => proceedEs6Modules());

gulp.task("scripts", gulp.series("es6modules"));

gulp.task("default", gulp.series("clean", "scripts"));
