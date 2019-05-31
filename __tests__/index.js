import {
	allPossibleExistingFiles as allPossibleExisting,
	comparePathArrays as comparePathArraysFactory,
	getAbsoluteFromRelative as getAbsoluteFromRelativeFactory
} from "./testUtil/testUtils";

let getEnvironmentFuncs;
let fsUtils;
let getConfigFiles;
let getConfigFile;
let getConfigFilesSync;
let getConfigFileSync;

const getAbsoluteFromRelative = getAbsoluteFromRelativeFactory();

beforeEach(() => {
	jest.clearAllMocks().resetModules();
	getEnvironmentFuncs = require("../src/util/getEnvironment");
	fsUtils = require("../src/util/fsUtils");
	fsUtils.resolvePath = jest.fn(async relativePath => getAbsoluteFromRelative(relativePath)).mockName("resolvePath");
	fsUtils.resolvePathSync = jest
		.fn(relativePath => getAbsoluteFromRelative(relativePath))
		.mockName("resolvePathSync");
});

const importGetConfigFiles = () => {
	const resolveNodeConfigsHierarchy = require("../src");
	getConfigFiles = resolveNodeConfigsHierarchy.getConfigFiles;
	getConfigFile = resolveNodeConfigsHierarchy.getConfigFile;
	getConfigFilesSync = resolveNodeConfigsHierarchy.getConfigFilesSync;
	getConfigFileSync = resolveNodeConfigsHierarchy.getConfigFileSync;
};

const configureEnvironmentMock = environmentValue => {
	getEnvironmentFuncs.getEnvironment = jest
		.fn(() => environmentValue)
		.mockName(`getEnvironment with ${environmentValue}`);
};

const configureExistingPaths = relativePaths => {
	const filesDictionary = relativePaths
		.map(getAbsoluteFromRelative)
		.reduce((dic, path) => ((dic[path] = true), dic), {});
	fsUtils.fileExists = jest
		.fn(async file => {
			if (filesDictionary[file]) {
				return true;
			}
			return false;
		})
		.mockName("fileExists");
	fsUtils.fileExistsSync = jest
		.fn(file => {
			if (filesDictionary[file]) {
				return true;
			}
			return false;
		})
		.mockName("fileExistsSync");
};

const comparePathArrays = comparePathArraysFactory(getAbsoluteFromRelative);

describe("resolve-node-configs-hierarchy unit tests", () => {
	describe("resolve-node-configs-hierarchy getConfigFiles tests", () => {
		it("should pass without existing files", async () => {
			expect.assertions(1);
			configureEnvironmentMock("production");
			configureExistingPaths([]);
			importGetConfigFiles();
			const actualPath = await getConfigFile(".env");
			expect(actualPath).toBeNull();
		});
		it("should pass without extension in project root in production", async () => {
			expect.assertions(2);
			const existingRelativePaths = [".env"];
			configureEnvironmentMock("production");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPaths = await getConfigFiles(".env");
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass without extension in project root in test", async () => {
			expect.assertions(2);
			const existingRelativePaths = [".env"];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPaths = await getConfigFiles(".env");
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass for all existing without ext in project root in production", async () => {
			expect.assertions(2);
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPaths = await getConfigFiles(".env");
			expect(actualPaths.length).toBe(4);
			comparePathArrays([".env.production.local", ".env.local", ".env.production", ".env"], actualPaths);
		});
		it("should pass for all existing without ext in project root in test", async () => {
			expect.assertions(2);
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPaths = await getConfigFiles(".env");
			expect(actualPaths.length).toBe(2);
			comparePathArrays([".env.test", ".env"], actualPaths);
		});
		it("should pass for all existing without ext in project root in test with flag", async () => {
			expect.assertions(2);
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPaths = await getConfigFiles(".env", true);
			expect(actualPaths.length).toBe(4);
			comparePathArrays([".env.test.local", ".env.local", ".env.test", ".env"], actualPaths);
		});
		it("should pass with extension in project root in production", async () => {
			expect.assertions(2);
			const existingRelativePaths = [".env.json"];
			configureEnvironmentMock("production");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPaths = await getConfigFiles(".env.json");
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass with extension in project root in test", async () => {
			expect.assertions(2);
			const existingRelativePaths = [".env.json"];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPaths = await getConfigFiles(".env.json");
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass for all existing with ext in project root in production", async () => {
			expect.assertions(2);
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPaths = await getConfigFiles(".env.json");
			expect(actualPaths.length).toBe(4);
			comparePathArrays(
				[".env.production.local.json", ".env.local.json", ".env.production.json", ".env.json"],
				actualPaths
			);
		});
		it("should pass for all existing with ext in project root in test", async () => {
			expect.assertions(2);
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPaths = await getConfigFiles(".env.json");
			expect(actualPaths.length).toBe(2);
			comparePathArrays([".env.test.json", ".env.json"], actualPaths);
		});

		it("should pass for all existing with ext in project root in test with flag", async () => {
			expect.assertions(2);
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPaths = await getConfigFiles(".env.json", true);
			expect(actualPaths.length).toBe(4);
			comparePathArrays([".env.test.local.json", ".env.local.json", ".env.test.json", ".env.json"], actualPaths);
		});
		it("should pass without extension in subdirectory in production", async () => {
			expect.assertions(2);
			const existingRelativePaths = ["src/.env"];
			configureEnvironmentMock("production");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPaths = await getConfigFiles("src/.env");
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass without extension in subdirectory in test", async () => {
			expect.assertions(2);
			const existingRelativePaths = ["src/.env"];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPaths = await getConfigFiles("src/.env");
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass for all existing without ext in subdirectory in production", async () => {
			expect.assertions(2);
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPaths = await getConfigFiles("src/.env");
			expect(actualPaths.length).toBe(4);
			comparePathArrays(
				["src/.env.production.local", "src/.env.local", "src/.env.production", "src/.env"],
				actualPaths
			);
		});
		it("should pass for all existing without ext in subdirectory in test", async () => {
			expect.assertions(2);
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPaths = await getConfigFiles("src/.env");
			expect(actualPaths.length).toBe(2);
			comparePathArrays(["src/.env.test", "src/.env"], actualPaths);
		});
		it("should pass for all existing without ext in subdirectory in test with flag", async () => {
			expect.assertions(2);
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPaths = await getConfigFiles("src/.env", true);
			expect(actualPaths.length).toBe(4);
			comparePathArrays(["src/.env.test.local", "src/.env.local", "src/.env.test", "src/.env"], actualPaths);
		});
		it("should pass with extension in subdirectory in production", async () => {
			expect.assertions(2);
			const existingRelativePaths = ["src/.env.json"];
			configureEnvironmentMock("production");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPaths = await getConfigFiles("src/.env.json");
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass with extension in subdirectory in test", async () => {
			expect.assertions(2);
			const existingRelativePaths = ["src/.env.json"];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPaths = await getConfigFiles("src/.env.json");
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass for all existing with ext in subdirectory in production", async () => {
			expect.assertions(2);
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPaths = await getConfigFiles("coverage/.env.json");
			expect(actualPaths.length).toBe(4);
			comparePathArrays(
				[
					"coverage/.env.production.local.json",
					"coverage/.env.local.json",
					"coverage/.env.production.json",
					"coverage/.env.json"
				],
				actualPaths
			);
		});
		it("should pass for all existing with ext in subdirectory in test", async () => {
			expect.assertions(2);
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPaths = await getConfigFiles("coverage/.env.json");
			expect(actualPaths.length).toBe(2);
			comparePathArrays(["coverage/.env.test.json", "coverage/.env.json"], actualPaths);
		});
		it("should pass for all existing with ext in subdirectory in test with flag", async () => {
			expect.assertions(2);
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPaths = await getConfigFiles("coverage/.env.json", true);
			expect(actualPaths.length).toBe(4);
			comparePathArrays(
				[
					"coverage/.env.test.local.json",
					"coverage/.env.local.json",
					"coverage/.env.test.json",
					"coverage/.env.json"
				],
				actualPaths
			);
		});
	});
	describe("resolve-node-configs-hierarchy getConfigFile tests", () => {
		it("should pass without existing files", async () => {
			expect.assertions(1);
			configureEnvironmentMock("production");
			configureExistingPaths([]);
			importGetConfigFiles();
			const actualPath = await getConfigFile(".env");
			expect(actualPath).toBeNull();
		});
		it("should pass without extension in project root in production", async () => {
			expect.assertions(1);
			const expectedPath = ".env";
			const existingRelativePaths = [expectedPath];
			configureEnvironmentMock("production");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPath = await getConfigFile(".env");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass without extension in project root in test", async () => {
			expect.assertions(1);
			const expectedPath = ".env";
			const existingRelativePaths = [expectedPath];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPath = await getConfigFile(".env");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass for all existing without ext in project root in production", async () => {
			expect.assertions(1);
			const expectedPath = ".env.production.local";
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPath = await getConfigFile(".env");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass for all existing without ext in project root in test", async () => {
			expect.assertions(1);
			const expectedPath = ".env.test";
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPath = await getConfigFile(".env");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass for all existing without ext in project root in test with flag", async () => {
			expect.assertions(1);
			const expectedPath = ".env.test.local";
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPath = await getConfigFile(".env", true);
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass with extension in project root in production", async () => {
			expect.assertions(1);
			const expectedPath = ".env.json";
			const existingRelativePaths = [expectedPath];
			configureEnvironmentMock("production");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPath = await getConfigFile(".env.json");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass with extension in project root in test", async () => {
			expect.assertions(1);
			const expectedPath = ".env.json";
			const existingRelativePaths = [expectedPath];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPath = await getConfigFile(".env.json");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass for all existing with ext in project root in production", async () => {
			expect.assertions(1);
			const expectedPath = ".env.production.local.json";
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPath = await getConfigFile(".env.json");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass for all existing with ext in project root in test", async () => {
			expect.assertions(1);
			const expectedPath = ".env.test.json";
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPath = await getConfigFile(".env.json");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});

		it("should pass for all existing with ext in project root in test with flag", async () => {
			expect.assertions(1);
			const expectedPath = ".env.test.local.json";
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPath = await getConfigFile(".env.json", true);
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass without extension in subdirectory in production", async () => {
			expect.assertions(1);
			const expectedPath = "src/.env";
			const existingRelativePaths = [expectedPath];
			configureEnvironmentMock("production");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPath = await getConfigFile("src/.env");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass without extension in subdirectory in test", async () => {
			expect.assertions(1);
			const expectedPath = "src/.env";
			const existingRelativePaths = [expectedPath];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPath = await getConfigFile("src/.env");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass for all existing without ext in subdirectory in production", async () => {
			expect.assertions(1);
			const expectedPath = "src/.env.production.local";
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPath = await getConfigFile("src/.env");

			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass for all existing without ext in subdirectory in test", async () => {
			expect.assertions(1);
			const expectedPath = "src/.env.test";
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPath = await getConfigFile("src/.env");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass for all existing without ext in subdirectory in test with flag", async () => {
			expect.assertions(1);
			const expectedPath = "src/.env.test.local";
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPath = await getConfigFile("src/.env", true);
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass with extension in subdirectory in production", async () => {
			expect.assertions(1);
			const expectedPath = "src/.env.json";
			const existingRelativePaths = [expectedPath];
			configureEnvironmentMock("production");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPath = await getConfigFile("src/.env.json");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass with extension in subdirectory in test", async () => {
			expect.assertions(1);
			const expectedPath = "src/.env.json";
			const existingRelativePaths = [expectedPath];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPath = await getConfigFile("src/.env.json");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass for all existing with ext in subdirectory in production", async () => {
			expect.assertions(1);
			const expectedPath = "coverage/.env.production.local.json";
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPath = await getConfigFile("coverage/.env.json");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass for all existing with ext in subdirectory in test", async () => {
			expect.assertions(1);
			const expectedPath = "coverage/.env.test.json";
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPath = await getConfigFile("coverage/.env.json");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass for all existing with ext in subdirectory in test with flag", async () => {
			expect.assertions(1);
			const expectedPath = "coverage/.env.test.local.json";
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPath = await getConfigFile("coverage/.env.json", true);
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
	});
	describe("resolve-node-configs-hierarchy getConfigFilesSync tests", () => {
		it("should pass without existing files", () => {
			configureEnvironmentMock("production");
			configureExistingPaths([]);
			importGetConfigFiles();
			const actualPath = getConfigFileSync(".env");
			expect(actualPath).toBeNull();
		});
		it("should pass without extension in project root in production", () => {
			const existingRelativePaths = [".env"];
			configureEnvironmentMock("production");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPaths = getConfigFilesSync(".env");
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass without extension in project root in test", () => {
			const existingRelativePaths = [".env"];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPaths = getConfigFilesSync(".env");
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass for all existing without ext in project root in production", () => {
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPaths = getConfigFilesSync(".env");
			expect(actualPaths.length).toBe(4);
			comparePathArrays([".env.production.local", ".env.local", ".env.production", ".env"], actualPaths);
		});
		it("should pass for all existing without ext in project root in test", () => {
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPaths = getConfigFilesSync(".env");
			expect(actualPaths.length).toBe(2);
			comparePathArrays([".env.test", ".env"], actualPaths);
		});
		it("should pass for all existing without ext in project root in test with flag", () => {
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPaths = getConfigFilesSync(".env", true);
			expect(actualPaths.length).toBe(4);
			comparePathArrays([".env.test.local", ".env.local", ".env.test", ".env"], actualPaths);
		});
		it("should pass with extension in project root in production", () => {
			const existingRelativePaths = [".env.json"];
			configureEnvironmentMock("production");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPaths = getConfigFilesSync(".env.json");
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass with extension in project root in test", () => {
			const existingRelativePaths = [".env.json"];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPaths = getConfigFilesSync(".env.json");
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass for all existing with ext in project root in production", () => {
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPaths = getConfigFilesSync(".env.json");
			expect(actualPaths.length).toBe(4);
			comparePathArrays(
				[".env.production.local.json", ".env.local.json", ".env.production.json", ".env.json"],
				actualPaths
			);
		});
		it("should pass for all existing with ext in project root in test", () => {
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPaths = getConfigFilesSync(".env.json");
			expect(actualPaths.length).toBe(2);
			comparePathArrays([".env.test.json", ".env.json"], actualPaths);
		});

		it("should pass for all existing with ext in project root in test with flag", () => {
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPaths = getConfigFilesSync(".env.json", true);
			expect(actualPaths.length).toBe(4);
			comparePathArrays([".env.test.local.json", ".env.local.json", ".env.test.json", ".env.json"], actualPaths);
		});
		it("should pass without extension in subdirectory in production", () => {
			const existingRelativePaths = ["src/.env"];
			configureEnvironmentMock("production");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPaths = getConfigFilesSync("src/.env");
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass without extension in subdirectory in test", () => {
			const existingRelativePaths = ["src/.env"];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPaths = getConfigFilesSync("src/.env");
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass for all existing without ext in subdirectory in production", () => {
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPaths = getConfigFilesSync("src/.env");
			expect(actualPaths.length).toBe(4);
			comparePathArrays(
				["src/.env.production.local", "src/.env.local", "src/.env.production", "src/.env"],
				actualPaths
			);
		});
		it("should pass for all existing without ext in subdirectory in test", () => {
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPaths = getConfigFilesSync("src/.env");
			expect(actualPaths.length).toBe(2);
			comparePathArrays(["src/.env.test", "src/.env"], actualPaths);
		});
		it("should pass for all existing without ext in subdirectory in test with flag", () => {
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPaths = getConfigFilesSync("src/.env", true);
			expect(actualPaths.length).toBe(4);
			comparePathArrays(["src/.env.test.local", "src/.env.local", "src/.env.test", "src/.env"], actualPaths);
		});
		it("should pass with extension in subdirectory in production", () => {
			const existingRelativePaths = ["src/.env.json"];
			configureEnvironmentMock("production");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPaths = getConfigFilesSync("src/.env.json");
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass with extension in subdirectory in test", () => {
			const existingRelativePaths = ["src/.env.json"];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPaths = getConfigFilesSync("src/.env.json");
			expect(actualPaths.length).toBe(1);
			comparePathArrays(existingRelativePaths, actualPaths);
		});
		it("should pass for all existing with ext in subdirectory in production", () => {
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPaths = getConfigFilesSync("coverage/.env.json");
			expect(actualPaths.length).toBe(4);
			comparePathArrays(
				[
					"coverage/.env.production.local.json",
					"coverage/.env.local.json",
					"coverage/.env.production.json",
					"coverage/.env.json"
				],
				actualPaths
			);
		});
		it("should pass for all existing with ext in subdirectory in test", () => {
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPaths = getConfigFilesSync("coverage/.env.json");
			expect(actualPaths.length).toBe(2);
			comparePathArrays(["coverage/.env.test.json", "coverage/.env.json"], actualPaths);
		});
		it("should pass for all existing with ext in subdirectory in test with flag", () => {
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPaths = getConfigFilesSync("coverage/.env.json", true);
			expect(actualPaths.length).toBe(4);
			comparePathArrays(
				[
					"coverage/.env.test.local.json",
					"coverage/.env.local.json",
					"coverage/.env.test.json",
					"coverage/.env.json"
				],
				actualPaths
			);
		});
	});
	describe("resolve-node-configs-hierarchy getConfigFileSync tests", () => {
		it("should pass without existing files", () => {
			configureEnvironmentMock("production");
			configureExistingPaths([]);
			importGetConfigFiles();
			const actualPath = getConfigFileSync(".env");
			expect(actualPath).toBeNull();
		});
		it("should pass without extension in project root in production", () => {
			const expectedPath = ".env";
			const existingRelativePaths = [expectedPath];
			configureEnvironmentMock("production");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPath = getConfigFileSync(".env");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass without extension in project root in test", () => {
			const expectedPath = ".env";
			const existingRelativePaths = [expectedPath];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPath = getConfigFileSync(".env");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass for all existing without ext in project root in production", () => {
			const expectedPath = ".env.production.local";
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPath = getConfigFileSync(".env");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass for all existing without ext in project root in test", () => {
			const expectedPath = ".env.test";
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPath = getConfigFileSync(".env");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass for all existing without ext in project root in test with flag", () => {
			const expectedPath = ".env.test.local";
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPath = getConfigFileSync(".env", true);
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass with extension in project root in production", () => {
			const expectedPath = ".env.json";
			const existingRelativePaths = [expectedPath];
			configureEnvironmentMock("production");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPath = getConfigFileSync(".env.json");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass with extension in project root in test", () => {
			const expectedPath = ".env.json";
			const existingRelativePaths = [expectedPath];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPath = getConfigFileSync(".env.json");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass for all existing with ext in project root in production", () => {
			const expectedPath = ".env.production.local.json";
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPath = getConfigFileSync(".env.json");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass for all existing with ext in project root in test", () => {
			const expectedPath = ".env.test.json";
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPath = getConfigFileSync(".env.json");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass for all existing with ext in project root in test with flag", () => {
			const expectedPath = ".env.test.local.json";
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPath = getConfigFileSync(".env.json", true);
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass without extension in subdirectory in production", () => {
			const expectedPath = "src/.env";
			const existingRelativePaths = [expectedPath];
			configureEnvironmentMock("production");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPath = getConfigFileSync("src/.env");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass without extension in subdirectory in test", () => {
			const expectedPath = "src/.env";
			const existingRelativePaths = [expectedPath];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPath = getConfigFileSync("src/.env");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass for all existing without ext in subdirectory in production", () => {
			const expectedPath = "src/.env.production.local";
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPath = getConfigFileSync("src/.env");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass for all existing without ext in subdirectory in test", () => {
			const expectedPath = "src/.env.test";
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPath = getConfigFileSync("src/.env");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass for all existing without ext in subdirectory in test with flag", () => {
			const expectedPath = "src/.env.test.local";
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPath = getConfigFileSync("src/.env", true);
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass with extension in subdirectory in production", () => {
			const expectedPath = "src/.env.json";
			const existingRelativePaths = [expectedPath];
			configureEnvironmentMock("production");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPath = getConfigFileSync("src/.env.json");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass with extension in subdirectory in test", () => {
			const expectedPath = "src/.env.json";
			const existingRelativePaths = [expectedPath];
			configureEnvironmentMock("test");
			configureExistingPaths(existingRelativePaths);
			importGetConfigFiles();
			const actualPath = getConfigFileSync("src/.env.json");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass for all existing with ext in subdirectory in production", () => {
			const expectedPath = "coverage/.env.production.local.json";
			configureEnvironmentMock("production");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPath = getConfigFileSync("coverage/.env.json");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass for all existing with ext in subdirectory in test", () => {
			const expectedPath = "coverage/.env.test.json";
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPath = getConfigFileSync("coverage/.env.json");
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
		it("should pass for all existing with ext in subdirectory in test with flag", () => {
			const expectedPath = "coverage/.env.test.local.json";
			configureEnvironmentMock("test");
			configureExistingPaths(allPossibleExisting);
			importGetConfigFiles();
			const actualPath = getConfigFileSync("coverage/.env.json", true);
			expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
		});
	});
});
