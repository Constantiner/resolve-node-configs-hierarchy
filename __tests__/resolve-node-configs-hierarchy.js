let getEnvFuncs;
let fsUtils;
let getConfigFiles;

const processCwd = process.cwd();

beforeEach(() => {
	jest.clearAllMocks().resetModules();
	getEnvFuncs = require("../src/util/getEnv");
	fsUtils = require("../src/util/fsUtils");
	fsUtils.resolvePath = jest.fn(async relativePath => `${processCwd}/${relativePath}`).mockName("resolvePath");
});

const importGetConfigFiles = () => {
	getConfigFiles = require("../src/resolve-node-configs-hierarchy").default;
};

const configureEnvMock = envValue => {
	getEnvFuncs.getEnv = jest.fn(() => envValue).mockName(`getEnv with ${envValue}`);
};

const getAbsoluteFromRelative = rel => `${processCwd}/${rel}`;

const configureExistingPaths = relPaths => {
	const filesDictionary = relPaths.map(getAbsoluteFromRelative).reduce((dic, path) => ((dic[path] = true), dic), {});
	fsUtils.statAsync = jest
		.fn(async file => {
			if (filesDictionary[file]) {
				return {};
			}
			throw { code: "ENOENT" };
		})
		.mockName("statAsync");
};

const comparePathArrays = (expectedRelPaths, actualAbsolutePaths) => {
	expect(expectedRelPaths.map(getAbsoluteFromRelative)).toEqual(actualAbsolutePaths);
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

describe("resolve-node-configs-hierarchy tests", () => {
	it("should pass without existing files", async () => {
		expect.assertions(1);
		configureEnvMock("production");
		configureExistingPaths([]);
		importGetConfigFiles();
		const actualPaths = await getConfigFiles(".env");
		expect(actualPaths.length).toBe(0);
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
		expect(actualPaths.length).toBe(3);
		comparePathArrays([".env.test.local", ".env.test", ".env"], actualPaths);
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
		expect(actualPaths.length).toBe(3);
		comparePathArrays([".env.test.local.json", ".env.test.json", ".env.json"], actualPaths);
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
		expect(actualPaths.length).toBe(3);
		comparePathArrays(["src/.env.test.local", "src/.env.test", "src/.env"], actualPaths);
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
		expect(actualPaths.length).toBe(3);
		comparePathArrays(
			["coverage/.env.test.local.json", "coverage/.env.test.json", "coverage/.env.json"],
			actualPaths
		);
	});
});
