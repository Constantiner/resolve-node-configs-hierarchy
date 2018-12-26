import { sync as del } from "del";
import { accessSync, mkdirSync, realpathSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";

let getEnvFuncs;
let getConfigFiles;
let getConfigFile;

const filesFolderName = "test-files";
const resolvePath = relativePath => resolve(realpathSync(process.cwd()), relativePath);
const getRelativePathForTests = relativePath => join(filesFolderName, relativePath);
const getAbsoluteFromRelative = rel => `${process.cwd()}/${getRelativePathForTests(rel)}`;

const importGetConfigFiles = () => {
	const resolveNodeConfigsHierarchy = require("../src/resolve-node-configs-hierarchy");
	getConfigFiles = resolveNodeConfigsHierarchy.getConfigFiles;
	getConfigFile = resolveNodeConfigsHierarchy.getConfigFile;
};

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
	importGetConfigFiles();
};

const getAbsolutePaths = relPaths =>
	relPaths.map(relPath => getRelativePathForTests(relPath)).map(relPath => resolvePath(relPath));

const ensureDirectoryExistence = filePath => {
	const dirName = dirname(filePath);
	try {
		accessSync(dirName);
	} catch (e) {
		ensureDirectoryExistence(dirName);
		mkdirSync(dirName);
	}
	return filePath;
};

const configureExistingPaths = relPaths =>
	getAbsolutePaths(relPaths)
		.map(ensureDirectoryExistence)
		.forEach(path => writeFileSync(path, "1"));

const comparePathArrays = (expectedRelPaths, actualAbsolutePaths) => {
	expect(getAbsolutePaths(expectedRelPaths)).toEqual(actualAbsolutePaths);
};

const allPossibleExisting = [
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
	it("should pass without extension in tests root in test", async () => {
		expect.assertions(2);
		const existingRelPaths = [".env"];
		configureEnvMock("test");
		configureExistingPaths(existingRelPaths);
		const actualPaths = await getConfigFiles(getRelativePathForTests(".env"));
		expect(actualPaths.length).toBe(1);
		comparePathArrays(existingRelPaths, actualPaths);
	});
	it("should pass without extension in tests root in test with flag", async () => {
		expect.assertions(2);
		const existingRelPaths = [".env"];
		configureEnvMock("test");
		configureExistingPaths(existingRelPaths);
		const actualPaths = await getConfigFiles(getRelativePathForTests(".env"), true);
		expect(actualPaths.length).toBe(1);
		comparePathArrays(existingRelPaths, actualPaths);
	});
	it("should pass for all existing without ext in tests root in production", async () => {
		expect.assertions(2);
		configureEnvMock("production");
		configureExistingPaths(allPossibleExisting);
		const actualPaths = await getConfigFiles(getRelativePathForTests(".env"));
		expect(actualPaths.length).toBe(4);
		comparePathArrays([".env.production.local", ".env.local", ".env.production", ".env"], actualPaths);
	});
	it("should pass for all existing without ext in tests root in test", async () => {
		expect.assertions(2);
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		const actualPaths = await getConfigFiles(getRelativePathForTests(".env"));
		expect(actualPaths.length).toBe(2);
		comparePathArrays([".env.test", ".env"], actualPaths);
	});
	it("should pass for all existing without ext in tests root in test with flag", async () => {
		expect.assertions(2);
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		const actualPaths = await getConfigFiles(getRelativePathForTests(".env"), true);
		expect(actualPaths.length).toBe(4);
		comparePathArrays([".env.test.local", ".env.local", ".env.test", ".env"], actualPaths);
	});
	it("should pass with extension in tests root in production", async () => {
		expect.assertions(2);
		const existingRelPaths = [".env.json"];
		configureEnvMock("production");
		configureExistingPaths(existingRelPaths);
		const actualPaths = await getConfigFiles(getRelativePathForTests(".env.json"));
		expect(actualPaths.length).toBe(1);
		comparePathArrays(existingRelPaths, actualPaths);
	});
	it("should pass with extension in tests root in test", async () => {
		expect.assertions(2);
		const existingRelPaths = [".env.json"];
		configureEnvMock("test");
		configureExistingPaths(existingRelPaths);
		const actualPaths = await getConfigFiles(getRelativePathForTests(".env.json"));
		expect(actualPaths.length).toBe(1);
		comparePathArrays(existingRelPaths, actualPaths);
	});
	it("should pass with extension in tests root in test with flag", async () => {
		expect.assertions(2);
		const existingRelPaths = [".env.json"];
		configureEnvMock("test");
		configureExistingPaths(existingRelPaths);
		const actualPaths = await getConfigFiles(getRelativePathForTests(".env.json"), true);
		expect(actualPaths.length).toBe(1);
		comparePathArrays(existingRelPaths, actualPaths);
	});
	it("should pass for all existing with ext in tests root in production", async () => {
		expect.assertions(2);
		configureEnvMock("production");
		configureExistingPaths(allPossibleExisting);
		const actualPaths = await getConfigFiles(getRelativePathForTests(".env.json"));
		expect(actualPaths.length).toBe(4);
		comparePathArrays(
			[".env.production.local.json", ".env.local.json", ".env.production.json", ".env.json"],
			actualPaths
		);
	});
	it("should pass for all existing with ext in tests root in test", async () => {
		expect.assertions(2);
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		const actualPaths = await getConfigFiles(getRelativePathForTests(".env.json"));
		expect(actualPaths.length).toBe(2);
		comparePathArrays([".env.test.json", ".env.json"], actualPaths);
	});
	it("should pass for all existing with ext in tests root in test with flag", async () => {
		expect.assertions(2);
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		const actualPaths = await getConfigFiles(getRelativePathForTests(".env.json"), true);
		expect(actualPaths.length).toBe(4);
		comparePathArrays([".env.test.local.json", ".env.local.json", ".env.test.json", ".env.json"], actualPaths);
	});
});
describe("resolve-node-configs-hierarchy getConfigFile integration tests", () => {
	it("should pass without existing files", async () => {
		expect.assertions(1);
		configureEnvMock("production");
		const actualPath = await getConfigFile(".env");
		expect(actualPath).toBeNull();
	});
	it("should pass without extension in tests root in production", async () => {
		expect.assertions(1);
		const existingRelPaths = [".env"];
		configureEnvMock("production");
		configureExistingPaths(existingRelPaths);
		const actualPath = await getConfigFile(getRelativePathForTests(".env"));
		expect(actualPath).toBe(getAbsoluteFromRelative(".env"));
	});
	it("should pass without extension in tests root in test", async () => {
		expect.assertions(1);
		const existingRelPaths = [".env"];
		configureEnvMock("test");
		configureExistingPaths(existingRelPaths);
		const actualPath = await getConfigFile(getRelativePathForTests(".env"));
		expect(actualPath).toBe(getAbsoluteFromRelative(".env"));
	});
	it("should pass without extension in tests root in test with flag", async () => {
		expect.assertions(1);
		const existingRelPaths = [".env"];
		configureEnvMock("test");
		configureExistingPaths(existingRelPaths);
		const actualPath = await getConfigFile(getRelativePathForTests(".env"), true);
		expect(actualPath).toBe(getAbsoluteFromRelative(".env"));
	});
	it("should pass for all existing without ext in tests root in production", async () => {
		expect.assertions(1);
		configureEnvMock("production");
		configureExistingPaths(allPossibleExisting);
		const actualPath = await getConfigFile(getRelativePathForTests(".env"));
		expect(actualPath).toBe(getAbsoluteFromRelative(".env.production.local"));
	});
	it("should pass for all existing without ext in tests root in test", async () => {
		expect.assertions(1);
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		const actualPath = await getConfigFile(getRelativePathForTests(".env"));
		expect(actualPath).toBe(getAbsoluteFromRelative(".env.test"));
	});
	it("should pass for all existing without ext in tests root in test with flag", async () => {
		expect.assertions(1);
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		const actualPath = await getConfigFile(getRelativePathForTests(".env"), true);
		expect(actualPath).toBe(getAbsoluteFromRelative(".env.test.local"));
	});
	it("should pass with extension in tests root in production", async () => {
		expect.assertions(1);
		const existingRelPaths = [".env.json"];
		configureEnvMock("production");
		configureExistingPaths(existingRelPaths);
		const actualPath = await getConfigFile(getRelativePathForTests(".env.json"));
		expect(actualPath).toBe(getAbsoluteFromRelative(".env.json"));
	});
	it("should pass with extension in tests root in test", async () => {
		expect.assertions(1);
		const existingRelPaths = [".env.json"];
		configureEnvMock("test");
		configureExistingPaths(existingRelPaths);
		const actualPath = await getConfigFile(getRelativePathForTests(".env.json"));
		expect(actualPath).toBe(getAbsoluteFromRelative(".env.json"));
	});
	it("should pass with extension in tests root in test with flag", async () => {
		expect.assertions(1);
		const existingRelPaths = [".env.json"];
		configureEnvMock("test");
		configureExistingPaths(existingRelPaths);
		const actualPath = await getConfigFile(getRelativePathForTests(".env.json"), true);
		expect(actualPath).toBe(getAbsoluteFromRelative(".env.json"));
	});
	it("should pass for all existing with ext in tests root in production", async () => {
		expect.assertions(1);
		configureEnvMock("production");
		configureExistingPaths(allPossibleExisting);
		const actualPath = await getConfigFile(getRelativePathForTests(".env.json"));
		expect(actualPath).toBe(getAbsoluteFromRelative(".env.production.local.json"));
	});
	it("should pass for all existing with ext in tests root in test", async () => {
		expect.assertions(1);
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		const actualPath = await getConfigFile(getRelativePathForTests(".env.json"));
		expect(actualPath).toBe(getAbsoluteFromRelative(".env.test.json"));
	});
	it("should pass for all existing with ext in tests root in test with flag", async () => {
		expect.assertions(1);
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		const actualPath = await getConfigFile(getRelativePathForTests(".env.json"), true);
		expect(actualPath).toBe(getAbsoluteFromRelative(".env.test.local.json"));
	});
});
