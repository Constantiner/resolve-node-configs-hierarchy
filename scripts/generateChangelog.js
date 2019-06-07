import { exec as childProcessExec } from "child_process";
import { promisify } from "util";

const exec = promisify(childProcessExec);
const { version } = require("../package.json");

const generateChangelog = async () => {
	const { stdout, stderr } = await exec(`github_changelog_generator --future-release v${version}`);
	// eslint-disable-next-line no-console
	console.log(stdout);
	// eslint-disable-next-line no-console
	console.error(stderr);
};

generateChangelog();
