import {
	allPossibleExistingFiles as allPossibleExisting,
	getAbsoluteFromRelative as getAbsoluteFromRelativeFactory,
	comparePathArrays as comparePathArraysFactory
} from "./util/test-utils";

let getEnvFuncs;
let fsUtils;
let getConfigFiles;
let getConfigFile;
let getConfigFilesSync;
let getConfigFileSync;

const getAbsoluteFromRelative = getAbsoluteFromRelativeFactory();

beforeEach(() => {
	jest.clearAllMocks().resetModules();
	getEnvFuncs = require("../src/util/getEnv");
	fsUtils = require("../src/util/fsUtils");
	fsUtils.resolvePath = jest.fn(async relativePath => getAbsoluteFromRelative(relativePath)).mockName("resolvePath");
	fsUtils.resolvePathSync = jest
		.fn(relativePath => getAbsoluteFromRelative(relativePath))
		.mockName("resolvePathSync");
});

const importGetConfigFiles = () => {
	const resolveNodeConfigsHierarchy = require("../src/resolve-node-configs-hierarchy");
	getConfigFiles = resolveNodeConfigsHierarchy.getConfigFiles;
	getConfigFile = resolveNodeConfigsHierarchy.getConfigFile;
	getConfigFilesSync = resolveNodeConfigsHierarchy.getConfigFilesSync;
	getConfigFileSync = resolveNodeConfigsHierarchy.getConfigFileSync;
};

const configureEnvMock = envValue => {
	getEnvFuncs.getEnv = jest.fn(() => envValue).mockName(`getEnv with ${envValue}`);
};

const configureExistingPaths = relPaths => {
	const filesDictionary = relPaths.map(getAbsoluteFromRelative).reduce((dic, path) => ((dic[path] = true), dic), {});
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

describe("resolve-node-configs-hierarchy getConfigFiles tests", () => {
	it("should pass without existing files", async () => {
		expect.assertions(1);
		configureEnvMock("production");
		configureExistingPaths([]);
		importGetConfigFiles();
		const actualPath = await getConfigFile(".env");
		expect(actualPath).toBeNull();
	});
	it("should pass without extension in project root in production", async () => {
		expect.assertions(2);
		const existingRelPaths = [".env"];
		configureEnvMock("production");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPaths = await getConfigFiles(".env");
		expect(actualPaths.length).toBe(1);
		comparePathArrays(existingRelPaths, actualPaths);
	});
	it("should pass without extension in project root in test", async () => {
		expect.assertions(2);
		const existingRelPaths = [".env"];
		configureEnvMock("test");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPaths = await getConfigFiles(".env");
		expect(actualPaths.length).toBe(1);
		comparePathArrays(existingRelPaths, actualPaths);
	});
	it("should pass for all existing without ext in project root in production", async () => {
		expect.assertions(2);
		configureEnvMock("production");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPaths = await getConfigFiles(".env");
		expect(actualPaths.length).toBe(4);
		comparePathArrays([".env.production.local", ".env.local", ".env.production", ".env"], actualPaths);
	});
	it("should pass for all existing without ext in project root in test", async () => {
		expect.assertions(2);
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPaths = await getConfigFiles(".env");
		expect(actualPaths.length).toBe(2);
		comparePathArrays([".env.test", ".env"], actualPaths);
	});
	it("should pass for all existing without ext in project root in test with flag", async () => {
		expect.assertions(2);
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPaths = await getConfigFiles(".env", true);
		expect(actualPaths.length).toBe(4);
		comparePathArrays([".env.test.local", ".env.local", ".env.test", ".env"], actualPaths);
	});
	it("should pass with extension in project root in production", async () => {
		expect.assertions(2);
		const existingRelPaths = [".env.json"];
		configureEnvMock("production");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPaths = await getConfigFiles(".env.json");
		expect(actualPaths.length).toBe(1);
		comparePathArrays(existingRelPaths, actualPaths);
	});
	it("should pass with extension in project root in test", async () => {
		expect.assertions(2);
		const existingRelPaths = [".env.json"];
		configureEnvMock("test");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPaths = await getConfigFiles(".env.json");
		expect(actualPaths.length).toBe(1);
		comparePathArrays(existingRelPaths, actualPaths);
	});
	it("should pass for all existing with ext in project root in production", async () => {
		expect.assertions(2);
		configureEnvMock("production");
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
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPaths = await getConfigFiles(".env.json");
		expect(actualPaths.length).toBe(2);
		comparePathArrays([".env.test.json", ".env.json"], actualPaths);
	});

	it("should pass for all existing with ext in project root in test with flag", async () => {
		expect.assertions(2);
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPaths = await getConfigFiles(".env.json", true);
		expect(actualPaths.length).toBe(4);
		comparePathArrays([".env.test.local.json", ".env.local.json", ".env.test.json", ".env.json"], actualPaths);
	});
	it("should pass without extension in subdirectory in production", async () => {
		expect.assertions(2);
		const existingRelPaths = ["src/.env"];
		configureEnvMock("production");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPaths = await getConfigFiles("src/.env");
		expect(actualPaths.length).toBe(1);
		comparePathArrays(existingRelPaths, actualPaths);
	});
	it("should pass without extension in subdirectory in test", async () => {
		expect.assertions(2);
		const existingRelPaths = ["src/.env"];
		configureEnvMock("test");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPaths = await getConfigFiles("src/.env");
		expect(actualPaths.length).toBe(1);
		comparePathArrays(existingRelPaths, actualPaths);
	});
	it("should pass for all existing without ext in subdirectory in production", async () => {
		expect.assertions(2);
		configureEnvMock("production");
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
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPaths = await getConfigFiles("src/.env");
		expect(actualPaths.length).toBe(2);
		comparePathArrays(["src/.env.test", "src/.env"], actualPaths);
	});
	it("should pass for all existing without ext in subdirectory in test with flag", async () => {
		expect.assertions(2);
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPaths = await getConfigFiles("src/.env", true);
		expect(actualPaths.length).toBe(4);
		comparePathArrays(["src/.env.test.local", "src/.env.local", "src/.env.test", "src/.env"], actualPaths);
	});
	it("should pass with extension in subdirectory in production", async () => {
		expect.assertions(2);
		const existingRelPaths = ["src/.env.json"];
		configureEnvMock("production");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPaths = await getConfigFiles("src/.env.json");
		expect(actualPaths.length).toBe(1);
		comparePathArrays(existingRelPaths, actualPaths);
	});
	it("should pass with extension in subdirectory in test", async () => {
		expect.assertions(2);
		const existingRelPaths = ["src/.env.json"];
		configureEnvMock("test");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPaths = await getConfigFiles("src/.env.json");
		expect(actualPaths.length).toBe(1);
		comparePathArrays(existingRelPaths, actualPaths);
	});
	it("should pass for all existing with ext in subdirectory in production", async () => {
		expect.assertions(2);
		configureEnvMock("production");
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
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPaths = await getConfigFiles("coverage/.env.json");
		expect(actualPaths.length).toBe(2);
		comparePathArrays(["coverage/.env.test.json", "coverage/.env.json"], actualPaths);
	});
	it("should pass for all existing with ext in subdirectory in test with flag", async () => {
		expect.assertions(2);
		configureEnvMock("test");
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
		configureEnvMock("production");
		configureExistingPaths([]);
		importGetConfigFiles();
		const actualPath = await getConfigFile(".env");
		expect(actualPath).toBeNull();
	});
	it("should pass without extension in project root in production", async () => {
		expect.assertions(1);
		const expectedPath = ".env";
		const existingRelPaths = [expectedPath];
		configureEnvMock("production");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPath = await getConfigFile(".env");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass without extension in project root in test", async () => {
		expect.assertions(1);
		const expectedPath = ".env";
		const existingRelPaths = [expectedPath];
		configureEnvMock("test");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPath = await getConfigFile(".env");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass for all existing without ext in project root in production", async () => {
		expect.assertions(1);
		const expectedPath = ".env.production.local";
		configureEnvMock("production");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPath = await getConfigFile(".env");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass for all existing without ext in project root in test", async () => {
		expect.assertions(1);
		const expectedPath = ".env.test";
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPath = await getConfigFile(".env");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass for all existing without ext in project root in test with flag", async () => {
		expect.assertions(1);
		const expectedPath = ".env.test.local";
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPath = await getConfigFile(".env", true);
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass with extension in project root in production", async () => {
		expect.assertions(1);
		const expectedPath = ".env.json";
		const existingRelPaths = [expectedPath];
		configureEnvMock("production");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPath = await getConfigFile(".env.json");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass with extension in project root in test", async () => {
		expect.assertions(1);
		const expectedPath = ".env.json";
		const existingRelPaths = [expectedPath];
		configureEnvMock("test");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPath = await getConfigFile(".env.json");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass for all existing with ext in project root in production", async () => {
		expect.assertions(1);
		const expectedPath = ".env.production.local.json";
		configureEnvMock("production");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPath = await getConfigFile(".env.json");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass for all existing with ext in project root in test", async () => {
		expect.assertions(1);
		const expectedPath = ".env.test.json";
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPath = await getConfigFile(".env.json");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});

	it("should pass for all existing with ext in project root in test with flag", async () => {
		expect.assertions(1);
		const expectedPath = ".env.test.local.json";
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPath = await getConfigFile(".env.json", true);
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass without extension in subdirectory in production", async () => {
		expect.assertions(1);
		const expectedPath = "src/.env";
		const existingRelPaths = [expectedPath];
		configureEnvMock("production");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPath = await getConfigFile("src/.env");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass without extension in subdirectory in test", async () => {
		expect.assertions(1);
		const expectedPath = "src/.env";
		const existingRelPaths = [expectedPath];
		configureEnvMock("test");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPath = await getConfigFile("src/.env");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass for all existing without ext in subdirectory in production", async () => {
		expect.assertions(1);
		const expectedPath = "src/.env.production.local";
		configureEnvMock("production");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPath = await getConfigFile("src/.env");

		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass for all existing without ext in subdirectory in test", async () => {
		expect.assertions(1);
		const expectedPath = "src/.env.test";
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPath = await getConfigFile("src/.env");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass for all existing without ext in subdirectory in test with flag", async () => {
		expect.assertions(1);
		const expectedPath = "src/.env.test.local";
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPath = await getConfigFile("src/.env", true);
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass with extension in subdirectory in production", async () => {
		expect.assertions(1);
		const expectedPath = "src/.env.json";
		const existingRelPaths = [expectedPath];
		configureEnvMock("production");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPath = await getConfigFile("src/.env.json");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass with extension in subdirectory in test", async () => {
		expect.assertions(1);
		const expectedPath = "src/.env.json";
		const existingRelPaths = [expectedPath];
		configureEnvMock("test");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPath = await getConfigFile("src/.env.json");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass for all existing with ext in subdirectory in production", async () => {
		expect.assertions(1);
		const expectedPath = "coverage/.env.production.local.json";
		configureEnvMock("production");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPath = await getConfigFile("coverage/.env.json");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass for all existing with ext in subdirectory in test", async () => {
		expect.assertions(1);
		const expectedPath = "coverage/.env.test.json";
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPath = await getConfigFile("coverage/.env.json");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass for all existing with ext in subdirectory in test with flag", async () => {
		expect.assertions(1);
		const expectedPath = "coverage/.env.test.local.json";
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPath = await getConfigFile("coverage/.env.json", true);
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
});
describe("resolve-node-configs-hierarchy getConfigFilesSync tests", () => {
	it("should pass without existing files", () => {
		configureEnvMock("production");
		configureExistingPaths([]);
		importGetConfigFiles();
		const actualPath = getConfigFileSync(".env");
		expect(actualPath).toBeNull();
	});
	it("should pass without extension in project root in production", () => {
		const existingRelPaths = [".env"];
		configureEnvMock("production");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPaths = getConfigFilesSync(".env");
		expect(actualPaths.length).toBe(1);
		comparePathArrays(existingRelPaths, actualPaths);
	});
	it("should pass without extension in project root in test", () => {
		const existingRelPaths = [".env"];
		configureEnvMock("test");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPaths = getConfigFilesSync(".env");
		expect(actualPaths.length).toBe(1);
		comparePathArrays(existingRelPaths, actualPaths);
	});
	it("should pass for all existing without ext in project root in production", () => {
		configureEnvMock("production");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPaths = getConfigFilesSync(".env");
		expect(actualPaths.length).toBe(4);
		comparePathArrays([".env.production.local", ".env.local", ".env.production", ".env"], actualPaths);
	});
	it("should pass for all existing without ext in project root in test", () => {
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPaths = getConfigFilesSync(".env");
		expect(actualPaths.length).toBe(2);
		comparePathArrays([".env.test", ".env"], actualPaths);
	});
	it("should pass for all existing without ext in project root in test with flag", () => {
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPaths = getConfigFilesSync(".env", true);
		expect(actualPaths.length).toBe(4);
		comparePathArrays([".env.test.local", ".env.local", ".env.test", ".env"], actualPaths);
	});
	it("should pass with extension in project root in production", () => {
		const existingRelPaths = [".env.json"];
		configureEnvMock("production");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPaths = getConfigFilesSync(".env.json");
		expect(actualPaths.length).toBe(1);
		comparePathArrays(existingRelPaths, actualPaths);
	});
	it("should pass with extension in project root in test", () => {
		const existingRelPaths = [".env.json"];
		configureEnvMock("test");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPaths = getConfigFilesSync(".env.json");
		expect(actualPaths.length).toBe(1);
		comparePathArrays(existingRelPaths, actualPaths);
	});
	it("should pass for all existing with ext in project root in production", () => {
		configureEnvMock("production");
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
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPaths = getConfigFilesSync(".env.json");
		expect(actualPaths.length).toBe(2);
		comparePathArrays([".env.test.json", ".env.json"], actualPaths);
	});

	it("should pass for all existing with ext in project root in test with flag", () => {
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPaths = getConfigFilesSync(".env.json", true);
		expect(actualPaths.length).toBe(4);
		comparePathArrays([".env.test.local.json", ".env.local.json", ".env.test.json", ".env.json"], actualPaths);
	});
	it("should pass without extension in subdirectory in production", () => {
		const existingRelPaths = ["src/.env"];
		configureEnvMock("production");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPaths = getConfigFilesSync("src/.env");
		expect(actualPaths.length).toBe(1);
		comparePathArrays(existingRelPaths, actualPaths);
	});
	it("should pass without extension in subdirectory in test", () => {
		const existingRelPaths = ["src/.env"];
		configureEnvMock("test");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPaths = getConfigFilesSync("src/.env");
		expect(actualPaths.length).toBe(1);
		comparePathArrays(existingRelPaths, actualPaths);
	});
	it("should pass for all existing without ext in subdirectory in production", () => {
		configureEnvMock("production");
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
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPaths = getConfigFilesSync("src/.env");
		expect(actualPaths.length).toBe(2);
		comparePathArrays(["src/.env.test", "src/.env"], actualPaths);
	});
	it("should pass for all existing without ext in subdirectory in test with flag", () => {
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPaths = getConfigFilesSync("src/.env", true);
		expect(actualPaths.length).toBe(4);
		comparePathArrays(["src/.env.test.local", "src/.env.local", "src/.env.test", "src/.env"], actualPaths);
	});
	it("should pass with extension in subdirectory in production", () => {
		const existingRelPaths = ["src/.env.json"];
		configureEnvMock("production");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPaths = getConfigFilesSync("src/.env.json");
		expect(actualPaths.length).toBe(1);
		comparePathArrays(existingRelPaths, actualPaths);
	});
	it("should pass with extension in subdirectory in test", () => {
		const existingRelPaths = ["src/.env.json"];
		configureEnvMock("test");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPaths = getConfigFilesSync("src/.env.json");
		expect(actualPaths.length).toBe(1);
		comparePathArrays(existingRelPaths, actualPaths);
	});
	it("should pass for all existing with ext in subdirectory in production", () => {
		configureEnvMock("production");
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
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPaths = getConfigFilesSync("coverage/.env.json");
		expect(actualPaths.length).toBe(2);
		comparePathArrays(["coverage/.env.test.json", "coverage/.env.json"], actualPaths);
	});
	it("should pass for all existing with ext in subdirectory in test with flag", () => {
		configureEnvMock("test");
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
		configureEnvMock("production");
		configureExistingPaths([]);
		importGetConfigFiles();
		const actualPath = getConfigFileSync(".env");
		expect(actualPath).toBeNull();
	});
	it("should pass without extension in project root in production", () => {
		const expectedPath = ".env";
		const existingRelPaths = [expectedPath];
		configureEnvMock("production");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPath = getConfigFileSync(".env");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass without extension in project root in test", () => {
		const expectedPath = ".env";
		const existingRelPaths = [expectedPath];
		configureEnvMock("test");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPath = getConfigFileSync(".env");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass for all existing without ext in project root in production", () => {
		const expectedPath = ".env.production.local";
		configureEnvMock("production");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPath = getConfigFileSync(".env");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass for all existing without ext in project root in test", () => {
		const expectedPath = ".env.test";
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPath = getConfigFileSync(".env");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass for all existing without ext in project root in test with flag", () => {
		const expectedPath = ".env.test.local";
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPath = getConfigFileSync(".env", true);
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass with extension in project root in production", () => {
		const expectedPath = ".env.json";
		const existingRelPaths = [expectedPath];
		configureEnvMock("production");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPath = getConfigFileSync(".env.json");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass with extension in project root in test", () => {
		const expectedPath = ".env.json";
		const existingRelPaths = [expectedPath];
		configureEnvMock("test");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPath = getConfigFileSync(".env.json");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass for all existing with ext in project root in production", () => {
		const expectedPath = ".env.production.local.json";
		configureEnvMock("production");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPath = getConfigFileSync(".env.json");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass for all existing with ext in project root in test", () => {
		const expectedPath = ".env.test.json";
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPath = getConfigFileSync(".env.json");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass for all existing with ext in project root in test with flag", () => {
		const expectedPath = ".env.test.local.json";
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPath = getConfigFileSync(".env.json", true);
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass without extension in subdirectory in production", () => {
		const expectedPath = "src/.env";
		const existingRelPaths = [expectedPath];
		configureEnvMock("production");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPath = getConfigFileSync("src/.env");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass without extension in subdirectory in test", () => {
		const expectedPath = "src/.env";
		const existingRelPaths = [expectedPath];
		configureEnvMock("test");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPath = getConfigFileSync("src/.env");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass for all existing without ext in subdirectory in production", () => {
		const expectedPath = "src/.env.production.local";
		configureEnvMock("production");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPath = getConfigFileSync("src/.env");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass for all existing without ext in subdirectory in test", () => {
		const expectedPath = "src/.env.test";
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPath = getConfigFileSync("src/.env");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass for all existing without ext in subdirectory in test with flag", () => {
		const expectedPath = "src/.env.test.local";
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPath = getConfigFileSync("src/.env", true);
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass with extension in subdirectory in production", () => {
		const expectedPath = "src/.env.json";
		const existingRelPaths = [expectedPath];
		configureEnvMock("production");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPath = getConfigFileSync("src/.env.json");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass with extension in subdirectory in test", () => {
		const expectedPath = "src/.env.json";
		const existingRelPaths = [expectedPath];
		configureEnvMock("test");
		configureExistingPaths(existingRelPaths);
		importGetConfigFiles();
		const actualPath = getConfigFileSync("src/.env.json");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass for all existing with ext in subdirectory in production", () => {
		const expectedPath = "coverage/.env.production.local.json";
		configureEnvMock("production");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPath = getConfigFileSync("coverage/.env.json");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass for all existing with ext in subdirectory in test", () => {
		const expectedPath = "coverage/.env.test.json";
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPath = getConfigFileSync("coverage/.env.json");
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
	it("should pass for all existing with ext in subdirectory in test with flag", () => {
		const expectedPath = "coverage/.env.test.local.json";
		configureEnvMock("test");
		configureExistingPaths(allPossibleExisting);
		importGetConfigFiles();
		const actualPath = getConfigFileSync("coverage/.env.json", true);
		expect(actualPath).toBe(getAbsoluteFromRelative(expectedPath));
	});
});
