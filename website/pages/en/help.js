/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

function Help(props) {
	const { config: siteConfig, language = "" } = props;
	const { baseUrl, docsUrl } = siteConfig;
	const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
	const langPart = `${language ? `${language}/` : ""}`;
	const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

	const supportLinks = [
		{
			content: `Learn more using the [documentation on this site.](${docUrl("introduction.html")})`,
			title: "Browse Docs"
		},
		{
			content:
				"If you find some problems with code and/or documentation and able to fix it feel free [to provide a pull request](https://github.com/Constantiner/resolve-node-configs-hierarchy/pulls).",
			title: "Contribute"
		},
		{
			content:
				"If you wish to request a feature or report a bug feel free [to create an issue](https://github.com/Constantiner/resolve-node-configs-hierarchy/issues).",
			title: "Report a problem"
		}
	];

	return (
		<div className="docMainWrapper wrapper">
			<Container className="mainContainer documentContainer postContainer">
				<div className="post">
					<header className="postHeader">
						<h1>Need help?</h1>
					</header>
					<p>
						This project is maintained by{" "}
						<a href="mailto:constantiner@gmail.com?subject=resolve-node-configs-hierarchy support">
							Konstantin Kovalev aka Constantiner
						</a>
						.
					</p>
					<GridBlock contents={supportLinks} layout="threeColumn" />
				</div>
			</Container>
		</div>
	);
}

module.exports = Help;
