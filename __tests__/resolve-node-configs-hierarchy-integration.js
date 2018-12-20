import { sync as del } from "del";
import { mkdirSync, realpathSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import { getConfigFiles } from "../src/resolve-node-configs-hierarchy";

let getEnvFuncs;

const filesFolderName = "test-files";
const resolvePath = relativePath => resolve(realpathSync(process.cwd()), relativePath);
const getRelativePathForTests = relativePath => join(filesFolderName, relativePath);

beforeEach(() => {
	jest.clearAllMocks().resetModules();
	getEnvFuncs = require("../src/util/getEnv");
	const filesDirName = resolvePath(filesFolderName);
	try {
		del([filesDirName]);
		mkdirSync(filesDirName);
	} catch (e) {
		// Nothing
	}
});

const configureEnvMock = envValue => {
	getEnvFuncs.getEnv = jest.fn(() => envValue).mockName(`getEnv with ${envValue}`);
};

const getAbsolutePaths = relPaths =>
	relPaths.map(relPath => getRelativePathForTests(relPath)).map(relPath => resolvePath(relPath));

const configureExistingPaths = relPaths => getAbsolutePaths(relPaths).forEach(path => writeFileSync(path, "1"));

const comparePathArrays = (expectedRelPaths, actualAbsolutePaths) => {
	expect(getAbsolutePaths(expectedRelPaths)).toEqual(actualAbsolutePaths);
};

afterEach(() => {
	try {
		del([resolvePath(filesFolderName)]);
	} catch (e) {
		// Nothing
	}
});

describe("resolve-node-configs-hierarchy getConfigFiles integration tests", () => {
	it("should pass without existing files", async () => {
		expect.assertions(1);
		configureEnvMock("production");
		const actualPaths = await getConfigFiles(".env");
		expect(actualPaths.length).toBe(0);
	});
	it("should pass without extension in tests root in production", async () => {
		expect.assertions(2);
		const existingRelPaths = [".env"];
		configureEnvMock("production");
		configureExistingPaths(existingRelPaths);
		const actualPaths = await getConfigFiles(getRelativePathForTests(".env"));
		expect(actualPaths.length).toBe(1);
		comparePathArrays(existingRelPaths, actualPaths);
	});
});
