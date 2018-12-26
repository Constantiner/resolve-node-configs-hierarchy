import { realpathSync } from "fs";
import { resolve } from "path";

const allPossibleExistingFiles = [
	".env.test",
	".env.production",
	".env.local",
	".env",
	".env.test.local",
	".env.production.local",
	".env.development.local",
	".env.development",
	".env.test.json",
	".env.production.json",
	".env.local.json",
	".env.json",
	".env.test.local.json",
	".env.production.local.json",
	".env.development.local.json",
	".env.development.json",
	"src/.env.test",
	"src/.env.production",
	"src/.env.local",
	"src/.env",
	"src/.env.test.local",
	"src/.env.production.local",
	"src/.env.development.local",
	"src/.env.development",
	"src/.env.test.json",
	"src/.env.production.json",
	"src/.env.local.json",
	"src/.env.json",
	"src/.env.test.local.json",
	"src/.env.production.local.json",
	"src/.env.development.local.json",
	"src/.env.development.json",
	"coverage/.env.test",
	"coverage/.env.production",
	"coverage/.env.local",
	"coverage/.env",
	"coverage/.env.test.local",
	"coverage/.env.production.local",
	"coverage/.env.development.local",
	"coverage/.env.development",
	"coverage/.env.test.json",
	"coverage/.env.production.json",
	"coverage/.env.local.json",
	"coverage/.env.json",
	"coverage/.env.test.local.json",
	"coverage/.env.production.local.json",
	"coverage/.env.development.local.json",
	"coverage/.env.development.json"
];

const resolvePath = relativePath => resolve(realpathSync(process.cwd()), relativePath);

const getAbsoluteFromRelative = (relPathTransformer = path => path) => rel => resolvePath(relPathTransformer(rel));

const comparePathArrays = relativeToAbsoluteFn => (expectedRelPaths, actualAbsolutePaths) => {
	expect(expectedRelPaths.map(relativeToAbsoluteFn)).toEqual(actualAbsolutePaths);
};

export { allPossibleExistingFiles, getAbsoluteFromRelative, comparePathArrays, resolvePath };
