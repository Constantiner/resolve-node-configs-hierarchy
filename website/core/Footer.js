/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

class Footer extends React.Component {
	docUrl(doc, language) {
		const baseUrl = this.props.config.baseUrl;
		const docsUrl = this.props.config.docsUrl;
		const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
		const langPart = `${language ? `${language}/` : ""}`;
		return `${baseUrl}${docsPart}${langPart}${doc}`;
	}

	pageUrl(doc, language) {
		const baseUrl = this.props.config.baseUrl;
		return baseUrl + (language ? `${language}/` : "") + doc;
	}

	render() {
		return (
			<footer className="nav-footer" id="footer">
				<section className="sitemap">
					<a href={this.props.config.baseUrl} className="nav-home">
						{this.props.config.footerIcon && (
							<img
								src={this.props.config.baseUrl + this.props.config.footerIcon}
								alt={this.props.config.title}
								width="66"
								height="58"
							/>
						)}
					</a>
					<div>
						<h5>Docs</h5>
						<a href={this.docUrl("introduction.html")}>Getting Started</a>
						<a href={this.docUrl("api.html")}>API Reference</a>
						<a href={this.docUrl("code-samples.html")}>Code Samples</a>
					</div>
					<div>
						<h5>More</h5>
						<a href="https://github.com/Constantiner/resolve-node-configs-hierarchy">GitHub</a>
						<a
							className="github-button"
							href={this.props.config.repoUrl}
							data-icon="octicon-star"
							data-count-href="/Constantiner/resolve-node-configs-hierarchy/stargazers"
							data-show-count="true"
							data-count-aria-label="# stargazers on GitHub"
							aria-label="Star this project on GitHub"
						>
							Star
						</a>
					</div>
				</section>

				<a
					href="https://opensource.facebook.com/"
					target="_blank"
					rel="noreferrer noopener"
					className="fbOpenSource"
				>
					<img
						src={`${this.props.config.baseUrl}img/oss_logo.png`}
						alt="Facebook Open Source"
						width="170"
						height="45"
					/>
				</a>
				<section className="copyright">{this.props.config.copyright}</section>
				<section className="copyright">
					<div className="secondary">
						Illustrations made by{" "}
						<a href="https://undraw.co/" title="unDraw">
							unDraw
						</a>
					</div>
				</section>
				<section className="copyright">
					<div className="secondary">
						Library icons made by{" "}
						<a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">
							Pixel perfect
						</a>{" "}
						from{" "}
						<a href="https://www.flaticon.com/" title="Flaticon">
							www.flaticon.com
						</a>{" "}
						is licensed by{" "}
						<a
							href="http://creativecommons.org/licenses/by/3.0/"
							title="Creative Commons BY 3.0"
							target="_blank"
						>
							CC 3.0 BY
						</a>
					</div>
				</section>
			</footer>
		);
	}
}

module.exports = Footer;
