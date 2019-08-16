import { sync as del } from "del";
import { accessSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import {
	allPossibleExistingFiles as allPossibleExisting,
	comparePathArrays as comparePathArraysFactory,
	getAbsoluteFromRelative as getAbsoluteFromRelativeFactory,
	resolvePath
} from "./testUtil/testUtils";

let getEnvironmentFuncs;
let getConfigFiles;
let getConfigFilesSync;
let getConfigFile;
let getConfigFileSync;

const filesFolderName = "test-files";
const getRelativePathForTests = relativePath => join(filesFolderName, relativePath);
const getAbsoluteFromRelative = getAbsoluteFromRelativeFactory(getRelativePathForTests);

const importGetConfigFiles = () => {
	const resolveNodeConfigsHierarchy = require("../src");
	getConfigFiles = resolveNodeConfigsHierarchy.getConfigFiles;
	getConfigFile = resolveNodeConfigsHierarchy.getConfigFile;
	getConfigFilesSync = resolveNodeConfigsHierarchy.getConfigFilesSync;
	getConfigFileSync = resolveNodeConfigsHierarchy.getConfigFileSync;
};

beforeEach(() => {
	jest.clearAllMocks().resetModules();
	getEnvironmentFuncs = require("../src/util/getEnvironment");
	const filesDirectoryName = resolvePath(filesFolderName);
	try {
		del([filesDirectoryName]);
		mkdirSync(filesDirectoryName);
	} catch (e) {
		// Nothing
	}
});

const configureEnvironmentMock = environmentValue => {
	getEnvironmentFuncs.getEnvironment = jest
		.fn(() => environmentValue)
		.mockName(`getEnvironment with ${environmentValue}`);
	importGetConfigFiles();
};

const ensureDirectoryExistence = filePath => {
	const directoryName = dirname(filePath);
	try {
		accessSync(directoryName);
	} catch (e) {
		ensureDirectoryExistence(directoryName);
		mkdirSync(directoryName);
	}
	return filePath;
};

const configureExistingPaths = relativePaths =>
	relativePaths
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

describe("resolve-node-configs-hierarchy integration tests", () => {
	describe("resolve-node-configs-hierarchy getConfigFiles integration tests", () => {
		it("should pass without existing files", async () => {
			expect.assertions(1);
			configureEnvironmentMock("production");
			const actualPaths = await getConfigFiles(".env");
			expect(actualPaths.length).toBe(0);
		});
		it("should pass without extension in tests root in production", async () => {
			expect.assertions(2);
			const existingRelativePaths = [".env"];
			configureEnvironmentMock("production");
			configureExistingPaths(existingRelativePaths);
			const actualPaths = await getConfigFiles(getRelativePathForTests(".env"));
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass without extension in tests root in test", async () => {
			expect.assertions(2);
			const existingRelativePaths = [".env"];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			const actualPaths = await getConfigFiles(getRelativePathForTests(".env"));
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass without extension in tests root in test with flag", async () => {
			expect.assertions(2);
			const existingRelativePaths = [".env"];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			const actualPaths = await getConfigFiles(getRelativePathForTests(".env"), true);
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass for all existing without ext in tests root in production", async () => {
			expect.assertions(2);
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			const actualPaths = await getConfigFiles(getRelativePathForTests(".env"));
			expect(actualPaths.length).toBe(4);
			comparePathArrays([".env.production.local", ".env.local", ".env.production", ".env"], actualPaths);
		});
		it("should pass for all existing without ext in tests root in test", async () => {
			expect.assertions(2);
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			const actualPaths = await getConfigFiles(getRelativePathForTests(".env"));
			expect(actualPaths.length).toBe(2);
			comparePathArrays([".env.test", ".env"], actualPaths);
		});
		it("should pass for all existing without ext in tests root in test with flag", async () => {
			expect.assertions(2);
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			const actualPaths = await getConfigFiles(getRelativePathForTests(".env"), true);
			expect(actualPaths.length).toBe(4);
			comparePathArrays([".env.test.local", ".env.local", ".env.test", ".env"], actualPaths);
		});
		it("should pass with extension in tests root in production", async () => {
			expect.assertions(2);
			const existingRelativePaths = [".env.json"];
			configureEnvironmentMock("production");
			configureExistingPaths(existingRelativePaths);
			const actualPaths = await getConfigFiles(getRelativePathForTests(".env.json"));
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass with extension in tests root in test", async () => {
			expect.assertions(2);
			const existingRelativePaths = [".env.json"];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			const actualPaths = await getConfigFiles(getRelativePathForTests(".env.json"));
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass with extension in tests root in test with flag", async () => {
			expect.assertions(2);
			const existingRelativePaths = [".env.json"];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			const actualPaths = await getConfigFiles(getRelativePathForTests(".env.json"), true);
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass for all existing with ext in tests root in production", async () => {
			expect.assertions(2);
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			const actualPaths = await getConfigFiles(getRelativePathForTests(".env.json"));
			expect(actualPaths.length).toBe(4);
			comparePathArrays(
				[".env.production.local.json", ".env.local.json", ".env.production.json", ".env.json"],
				actualPaths
			);
		});
		it("should pass for all existing with dot as ext in tests root in production", async () => {
			expect.assertions(2);
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			const actualPaths = await getConfigFiles(getRelativePathForTests("index."));
			expect(actualPaths.length).toBe(4);
			comparePathArrays(["index.production.local.", "index.local.", "index.production.", "index."], actualPaths);
		});
		it("should pass for all existing with ext in tests root in test", async () => {
			expect.assertions(2);
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			const actualPaths = await getConfigFiles(getRelativePathForTests(".env.json"));
			expect(actualPaths.length).toBe(2);
			comparePathArrays([".env.test.json", ".env.json"], actualPaths);
		});
		it("should pass for all existing with dot as ext in tests root in test", async () => {
			expect.assertions(2);
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			const actualPaths = await getConfigFiles(getRelativePathForTests("index."));
			expect(actualPaths.length).toBe(2);
			comparePathArrays(["index.test.", "index."], actualPaths);
		});
		it("should pass for all existing with ext in tests root in test with flag", async () => {
			expect.assertions(2);
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			const actualPaths = await getConfigFiles(getRelativePathForTests(".env.json"), true);
			expect(actualPaths.length).toBe(4);
			comparePathArrays([".env.test.local.json", ".env.local.json", ".env.test.json", ".env.json"], actualPaths);
		});
		it("should pass for all existing with dot as ext in tests root in test with flag", async () => {
			expect.assertions(2);
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			const actualPaths = await getConfigFiles(getRelativePathForTests("index."), true);
			expect(actualPaths.length).toBe(4);
			comparePathArrays(["index.test.local.", "index.local.", "index.test.", "index."], actualPaths);
		});
	});
	describe("resolve-node-configs-hierarchy getConfigFile integration tests", () => {
		it("should pass without existing files", async () => {
			expect.assertions(1);
			configureEnvironmentMock("production");
			const actualPath = await getConfigFile(".env");
			expect(actualPath).toBeNull();
		});
		it("should pass without extension in tests root in production", async () => {
			expect.assertions(1);
			const existingRelativePaths = [".env"];
			configureEnvironmentMock("production");
			configureExistingPaths(existingRelativePaths);
			const actualPath = await getConfigFile(getRelativePathForTests(".env"));
			expect(actualPath).toBe(getAbsoluteFromRelative(".env"));
		});
		it("should pass without extension in tests root in test", async () => {
			expect.assertions(1);
			const existingRelativePaths = [".env"];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			const actualPath = await getConfigFile(getRelativePathForTests(".env"));
			expect(actualPath).toBe(getAbsoluteFromRelative(".env"));
		});
		it("should pass without extension in tests root in test with flag", async () => {
			expect.assertions(1);
			const existingRelativePaths = [".env"];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			const actualPath = await getConfigFile(getRelativePathForTests(".env"), true);
			expect(actualPath).toBe(getAbsoluteFromRelative(".env"));
		});
		it("should pass for all existing without ext in tests root in production", async () => {
			expect.assertions(1);
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			const actualPath = await getConfigFile(getRelativePathForTests(".env"));
			expect(actualPath).toBe(getAbsoluteFromRelative(".env.production.local"));
		});
		it("should pass for all existing without ext in tests root in test", async () => {
			expect.assertions(1);
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			const actualPath = await getConfigFile(getRelativePathForTests(".env"));
			expect(actualPath).toBe(getAbsoluteFromRelative(".env.test"));
		});
		it("should pass for all existing without ext in tests root in test with flag", async () => {
			expect.assertions(1);
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			const actualPath = await getConfigFile(getRelativePathForTests(".env"), true);
			expect(actualPath).toBe(getAbsoluteFromRelative(".env.test.local"));
		});
		it("should pass with extension in tests root in production", async () => {
			expect.assertions(1);
			const existingRelativePaths = [".env.json"];
			configureEnvironmentMock("production");
			configureExistingPaths(existingRelativePaths);
			const actualPath = await getConfigFile(getRelativePathForTests(".env.json"));
			expect(actualPath).toBe(getAbsoluteFromRelative(".env.json"));
		});
		it("should pass with extension in tests root in test", async () => {
			expect.assertions(1);
			const existingRelativePaths = [".env.json"];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			const actualPath = await getConfigFile(getRelativePathForTests(".env.json"));
			expect(actualPath).toBe(getAbsoluteFromRelative(".env.json"));
		});
		it("should pass with extension in tests root in test with flag", async () => {
			expect.assertions(1);
			const existingRelativePaths = [".env.json"];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			const actualPath = await getConfigFile(getRelativePathForTests(".env.json"), true);
			expect(actualPath).toBe(getAbsoluteFromRelative(".env.json"));
		});
		it("should pass for all existing with ext in tests root in production", async () => {
			expect.assertions(1);
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			const actualPath = await getConfigFile(getRelativePathForTests(".env.json"));
			expect(actualPath).toBe(getAbsoluteFromRelative(".env.production.local.json"));
		});
		it("should pass for all existing with dot as ext in tests root in production", async () => {
			expect.assertions(1);
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			const actualPath = await getConfigFile(getRelativePathForTests("index."));
			expect(actualPath).toBe(getAbsoluteFromRelative("index.production.local."));
		});
		it("should pass for all existing with ext in tests root in test", async () => {
			expect.assertions(1);
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			const actualPath = await getConfigFile(getRelativePathForTests(".env.json"));
			expect(actualPath).toBe(getAbsoluteFromRelative(".env.test.json"));
		});
		it("should pass for all existing with dot as ext in tests root in test", async () => {
			expect.assertions(1);
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			const actualPath = await getConfigFile(getRelativePathForTests("index."));
			expect(actualPath).toBe(getAbsoluteFromRelative("index.test."));
		});
		it("should pass for all existing with ext in tests root in test with flag", async () => {
			expect.assertions(1);
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			const actualPath = await getConfigFile(getRelativePathForTests(".env.json"), true);
			expect(actualPath).toBe(getAbsoluteFromRelative(".env.test.local.json"));
		});
		it("should pass for all existing with dot as ext in tests root in test with flag", async () => {
			expect.assertions(1);
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			const actualPath = await getConfigFile(getRelativePathForTests("index."), true);
			expect(actualPath).toBe(getAbsoluteFromRelative("index.test.local."));
		});
	});
	describe("resolve-node-configs-hierarchy getConfigFilesSync integration tests", () => {
		it("should pass without existing files", () => {
			configureEnvironmentMock("production");
			const actualPaths = getConfigFilesSync(".env");
			expect(actualPaths.length).toBe(0);
		});
		it("should pass without extension in tests root in production", () => {
			const existingRelativePaths = [".env"];
			configureEnvironmentMock("production");
			configureExistingPaths(existingRelativePaths);
			const actualPaths = getConfigFilesSync(getRelativePathForTests(".env"));
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass without extension in tests root in test", () => {
			const existingRelativePaths = [".env"];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			const actualPaths = getConfigFilesSync(getRelativePathForTests(".env"));
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass without extension in tests root in test with flag", () => {
			const existingRelativePaths = [".env"];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			const actualPaths = getConfigFilesSync(getRelativePathForTests(".env"), true);
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass for all existing without ext in tests root in production", () => {
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			const actualPaths = getConfigFilesSync(getRelativePathForTests(".env"));
			expect(actualPaths.length).toBe(4);
			comparePathArrays([".env.production.local", ".env.local", ".env.production", ".env"], actualPaths);
		});
		it("should pass for all existing without ext in tests root in test", () => {
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			const actualPaths = getConfigFilesSync(getRelativePathForTests(".env"));
			expect(actualPaths.length).toBe(2);
			comparePathArrays([".env.test", ".env"], actualPaths);
		});
		it("should pass for all existing without ext in tests root in test with flag", () => {
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			const actualPaths = getConfigFilesSync(getRelativePathForTests(".env"), true);
			expect(actualPaths.length).toBe(4);
			comparePathArrays([".env.test.local", ".env.local", ".env.test", ".env"], actualPaths);
		});
		it("should pass with extension in tests root in production", () => {
			const existingRelativePaths = [".env.json"];
			configureEnvironmentMock("production");
			configureExistingPaths(existingRelativePaths);
			const actualPaths = getConfigFilesSync(getRelativePathForTests(".env.json"));
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass with extension in tests root in test", () => {
			const existingRelativePaths = [".env.json"];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			const actualPaths = getConfigFilesSync(getRelativePathForTests(".env.json"));
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass with extension in tests root in test with flag", () => {
			const existingRelativePaths = [".env.json"];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			const actualPaths = getConfigFilesSync(getRelativePathForTests(".env.json"), true);
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass for all existing with ext in tests root in production", () => {
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			const actualPaths = getConfigFilesSync(getRelativePathForTests(".env.json"));
			expect(actualPaths.length).toBe(4);
			comparePathArrays(
				[".env.production.local.json", ".env.local.json", ".env.production.json", ".env.json"],
				actualPaths
			);
		});
		it("should pass for all existing with dot as ext in tests root in production", () => {
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			const actualPaths = getConfigFilesSync(getRelativePathForTests("index."));
			expect(actualPaths.length).toBe(4);
			comparePathArrays(["index.production.local.", "index.local.", "index.production.", "index."], actualPaths);
		});
		it("should pass for all existing with ext in tests root in test", () => {
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			const actualPaths = getConfigFilesSync(getRelativePathForTests(".env.json"));
			expect(actualPaths.length).toBe(2);
			comparePathArrays([".env.test.json", ".env.json"], actualPaths);
		});
		it("should pass for all existing with dot as ext in tests root in test", () => {
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			const actualPaths = getConfigFilesSync(getRelativePathForTests("index."));
			expect(actualPaths.length).toBe(2);
			comparePathArrays(["index.test.", "index."], actualPaths);
		});
		it("should pass for all existing with ext in tests root in test with flag", () => {
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			const actualPaths = getConfigFilesSync(getRelativePathForTests(".env.json"), true);
			expect(actualPaths.length).toBe(4);
			comparePathArrays([".env.test.local.json", ".env.local.json", ".env.test.json", ".env.json"], actualPaths);
		});
		it("should pass for all existing with dot as ext in tests root in test with flag", () => {
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			const actualPaths = getConfigFilesSync(getRelativePathForTests("index."), true);
			expect(actualPaths.length).toBe(4);
			comparePathArrays(["index.test.local.", "index.local.", "index.test.", "index."], actualPaths);
		});
	});
	describe("resolve-node-configs-hierarchy getConfigFileSync integration tests", () => {
		it("should pass without existing files", () => {
			configureEnvironmentMock("production");
			const actualPath = getConfigFileSync(".env");
			expect(actualPath).toBeNull();
		});
		it("should pass without extension in tests root in production", () => {
			const existingRelativePaths = [".env"];
			configureEnvironmentMock("production");
			configureExistingPaths(existingRelativePaths);
			const actualPath = getConfigFileSync(getRelativePathForTests(".env"));
			expect(actualPath).toBe(getAbsoluteFromRelative(".env"));
		});
		it("should pass without extension in tests root in test", () => {
			const existingRelativePaths = [".env"];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			const actualPath = getConfigFileSync(getRelativePathForTests(".env"));
			expect(actualPath).toBe(getAbsoluteFromRelative(".env"));
		});
		it("should pass without extension in tests root in test with flag", () => {
			const existingRelativePaths = [".env"];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			const actualPath = getConfigFileSync(getRelativePathForTests(".env"), true);
			expect(actualPath).toBe(getAbsoluteFromRelative(".env"));
		});
		it("should pass for all existing without ext in tests root in production", () => {
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			const actualPath = getConfigFileSync(getRelativePathForTests(".env"));
			expect(actualPath).toBe(getAbsoluteFromRelative(".env.production.local"));
		});
		it("should pass for all existing without ext in tests root in test", () => {
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			const actualPath = getConfigFileSync(getRelativePathForTests(".env"));
			expect(actualPath).toBe(getAbsoluteFromRelative(".env.test"));
		});
		it("should pass for all existing without ext in tests root in test with flag", () => {
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			const actualPath = getConfigFileSync(getRelativePathForTests(".env"), true);
			expect(actualPath).toBe(getAbsoluteFromRelative(".env.test.local"));
		});
		it("should pass with extension in tests root in production", () => {
			const existingRelativePaths = [".env.json"];
			configureEnvironmentMock("production");
			configureExistingPaths(existingRelativePaths);
			const actualPath = getConfigFileSync(getRelativePathForTests(".env.json"));
			expect(actualPath).toBe(getAbsoluteFromRelative(".env.json"));
		});
		it("should pass with extension in tests root in test", () => {
			const existingRelativePaths = [".env.json"];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			const actualPath = getConfigFileSync(getRelativePathForTests(".env.json"));
			expect(actualPath).toBe(getAbsoluteFromRelative(".env.json"));
		});
		it("should pass with extension in tests root in test with flag", () => {
			const existingRelativePaths = [".env.json"];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			const actualPath = getConfigFileSync(getRelativePathForTests(".env.json"), true);
			expect(actualPath).toBe(getAbsoluteFromRelative(".env.json"));
		});
		it("should pass for all existing with ext in tests root in production", () => {
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			const actualPath = getConfigFileSync(getRelativePathForTests(".env.json"));
			expect(actualPath).toBe(getAbsoluteFromRelative(".env.production.local.json"));
		});
		it("should pass for all existing with dot as ext in tests root in production", () => {
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			const actualPath = getConfigFileSync(getRelativePathForTests("index."));
			expect(actualPath).toBe(getAbsoluteFromRelative("index.production.local."));
		});
		it("should pass for all existing with ext in tests root in test", () => {
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			const actualPath = getConfigFileSync(getRelativePathForTests(".env.json"));
			expect(actualPath).toBe(getAbsoluteFromRelative(".env.test.json"));
		});
		it("should pass for all existing with dot as ext in tests root in test", () => {
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			const actualPath = getConfigFileSync(getRelativePathForTests("index."));
			expect(actualPath).toBe(getAbsoluteFromRelative("index.test."));
		});
		it("should pass for all existing with ext in tests root in test with flag", () => {
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			const actualPath = getConfigFileSync(getRelativePathForTests(".env.json"), true);
			expect(actualPath).toBe(getAbsoluteFromRelative(".env.test.local.json"));
		});
		it("should pass for all existing with dot as ext in tests root in test with flag", () => {
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			const actualPath = getConfigFileSync(getRelativePathForTests("index."), true);
			expect(actualPath).toBe(getAbsoluteFromRelative("index.test.local."));
		});
	});
});
