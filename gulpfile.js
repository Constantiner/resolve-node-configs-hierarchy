const gulp = require("gulp");
const rename = require("gulp-rename");
const pkg = require("./package.json");
const rollup = require("gulp-better-rollup");
const SOURCES = "src/*.js";
const fs = require("fs");
const { format } = require("date-fns");
const getBuildDate = () => format(new Date(), "DD MMMM YYYY");
let banner = `/**
 * ${pkg.name}
 * ${pkg.description}
 * 
 * @author ${pkg.author.name} <${pkg.author.email}>
 * @version v${pkg.version}
 * @link ${pkg.homepage}
 * @date ${getBuildDate()}
 * @license ${pkg.license}
 */

`;

const getSourceFile = () => gulp.src(SOURCES),
	getDestination = () => gulp.dest("."),
	proceedEs6Modules = () => {
		const licenseText = fs.readFileSync("./LICENSE", "utf-8");
		banner = `/**
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
			.pipe(getDestination())
			.pipe(rename({ extname: `.mjs` }))
			.pipe(getDestination());
	};

gulp.task("es6modules", () => proceedEs6Modules());

gulp.task("scripts", gulp.series("es6modules"));

gulp.task("default", gulp.series("scripts"));
