import childProcess from "child_process";
import { run } from "jest";
import { getConfigFileSync } from "../../src";

const getJestConfigFile = jestConfigFile => {
	const configPath = jestConfigFile;
	return getConfigFileSync(configPath, true);
};
function isInGitRepository(execSync) {
	try {
		execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
		return true;
	} catch (e) {
		return false;
	}
}

function isInMercurialRepository(execSync) {
	try {
		execSync("hg --cwd . root", { stdio: "ignore" });
		return true;
	} catch (e) {
		return false;
	}
}

const getArgv = (jestConfigFile, runInBand, watch) => {
	const execSync = childProcess.execSync;
	let argv = process.argv.slice(2);

	// Watch unless on CI, in coverage mode, or explicitly running all tests
	if (watch && !process.env.CI && !argv.includes("--coverage") && !argv.includes("--watchAll")) {
		// https://github.com/facebook/create-react-app/issues/5210
		const hasSourceControl = isInGitRepository(execSync) || isInMercurialRepository(execSync);
		argv.push(hasSourceControl ? "--watch" : "--watchAll");
	}

	if (!argv.includes("--config")) {
		const configPath = getJestConfigFile(jestConfigFile);
		if (configPath) {
			argv.push("--config");
			argv.push(configPath);
		}
	}

	if (runInBand) {
		argv.push("--runInBand");
	}

	return argv;
};

const runJest = (jestConfigFile, runInBand = false, watch = true) => {
	const argv = getArgv(jestConfigFile, runInBand, watch);
	run(argv);
};

export default runJest;
