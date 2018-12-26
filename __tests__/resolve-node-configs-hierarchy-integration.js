import { sync as del } from "del";
import { accessSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import {
	allPossibleExistingFiles as allPossibleExisting,
	comparePathArrays as comparePathArraysFactory,
	getAbsoluteFromRelative as getAbsoluteFromRelativeFactory,
	resolvePath
} from "./util/test-utils";

let getEnvFuncs;
let getConfigFiles;
let getConfigFile;

const filesFolderName = "test-files";
const getRelativePathForTests = relativePath => join(filesFolderName, relativePath);
const getAbsoluteFromRelative = getAbsoluteFromRelativeFactory(getRelativePathForTests);

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
	relPaths
		.map(getAbsoluteFromRelative)
		.map(ensureDirectoryExistence)
		.forEach(path => writeFileSync(path, "1"));

const comparePathArrays = comparePathArraysFactory(getAbsoluteFromRelative);

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
