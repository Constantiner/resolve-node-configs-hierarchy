const getEnvironment = () => {
	const NODE_ENV = process.env.NODE_ENV;
	if (!NODE_ENV) {
		throw new Error("The NODE_ENV environment variable is required but was not specified.");
	}
	return NODE_ENV;
};

export { getEnvironment };
