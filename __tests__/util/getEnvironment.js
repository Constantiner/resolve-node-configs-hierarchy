import { getEnvironment } from "../../src/util/getEnvironment";

describe("getEnvironment tests", () => {
	it("should throw error if no environment provided", () => {
		const oldEnvironment = process.env.NODE_ENV;
		delete process.env.NODE_ENV;
		try {
			getEnvironment();
			expect(false).toBe(true);
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toBe("The NODE_ENV environment variable is required but was not specified.");
		}
		process.env.NODE_ENV = oldEnvironment;
	});
	it("should return proper environment value for tests", () => {
		const environment = getEnvironment();
		expect(environment).toBe("test");
	});
	it("should return proper environment value for development", () => {
		const DEVELOPMENT_ENVIRONMENT = "development";
		const oldEnvironment = process.env.NODE_ENV;
		process.env.NODE_ENV = DEVELOPMENT_ENVIRONMENT;
		const environment = getEnvironment();
		expect(environment).toBe(DEVELOPMENT_ENVIRONMENT);
		process.env.NODE_ENV = oldEnvironment;
	});
});
