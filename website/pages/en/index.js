/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const Button = props => (
	<div className="pluginWrapper buttonWrapper">
		<a className="button" href={props.href} target={props.target}>
			{props.children}
		</a>
	</div>
);

const PromoSection = props => (
	<div className="section promoSection">
		<div className="promoRow">
			<div className="pluginRowBlock">{props.children}</div>
		</div>
	</div>
);

const PromoSectionWitButtons = props => (
	<PromoSection {...props}>
		<Button href="#try">Try It Out</Button>
		<Button href={props.docUrl("doc1.html")}>Example Link</Button>
		<Button href={props.docUrl("doc2.html")}>Example Link 2</Button>
	</PromoSection>
);

class HomeSplash extends React.Component {
	render() {
		const { siteConfig, language = "" } = this.props;
		const { baseUrl, docsUrl } = siteConfig;
		const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
		const langPart = `${language ? `${language}/` : ""}`;
		const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

		const SplashContainer = props => (
			<div className="homeContainer">
				<div className="homeSplashFade">
					<div className="wrapper homeWrapper">{props.children}</div>
				</div>
			</div>
		);

		const ProjectTitle = () => (
			<h2 className="projectTitle">
				{siteConfig.title}
				<small>{siteConfig.tagline}</small>
			</h2>
		);

		return (
			<SplashContainer>
				<div className="inner">
					<ProjectTitle siteConfig={siteConfig} />
					<PromoSectionWitButtons docUrl={docUrl} {...this.props} />
					<PromoSection>
						<MarkdownBlock>
							[![Build
							Status](https://travis-ci.org/Constantiner/resolve-node-configs-hierarchy.svg?branch=master)](https://travis-ci.org/Constantiner/resolve-node-configs-hierarchy)
							[![codecov](https://codecov.io/gh/Constantiner/resolve-node-configs-hierarchy/branch/master/graph/badge.svg)](https://codecov.io/gh/Constantiner/resolve-node-configs-hierarchy)
						</MarkdownBlock>
					</PromoSection>
				</div>
			</SplashContainer>
		);
	}
}

class Index extends React.Component {
	render() {
		const { config: siteConfig, language = "" } = this.props;
		const { baseUrl, docsUrl } = siteConfig;
		const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
		const langPart = `${language ? `${language}/` : ""}`;
		const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

		const Block = props => (
			<Container padding={["bottom", "top"]} id={props.id} background={props.background}>
				<GridBlock align="center" contents={props.children} layout={props.layout} />
			</Container>
		);

		const LocalEnvironmentsSection = () => (
			<Block>
				{[
					{
						content:
							"With `resolve-node-configs-hierarchy` library you can create local versions of configuration files " +
							"with some local-specific data (don't put them under version control!). " +
							"For example, you can create your personal AWS S3 bucket for testing in local development environment " +
							"and add corresponding keys to your local development configuration file " +
							"(don't forget to add it to `.gitignore`). Without any line of code!",
						image: `${baseUrl}img/undraw_local_environments.svg`,
						imageAlign: "left",
						title: "Set up local configurations"
					}
				]}
			</Block>
		);

		const SimplePowerfulSection = () => (
			<Block background="dark">
				{[
					{
						content:
							"`resolve-node-configs-hierarchy` library is very simple and yet powerful. It takes almost no time to learn it.",
						image: `${baseUrl}img/undraw_simple_powerful_api.svg`,
						imageAlign: "right",
						title: "Very simple synchronous and asynchronous API"
					}
				]}
			</Block>
		);

		const DeploymentEnvironmentsSection = () => (
			<Block background="light">
				{[
					{
						content:
							"`resolve-node-configs-hierarchy` library allows you to manage your configurations for different environments easily. " +
							"You can have separate files for `development`, `test`, `staging`, `production` etc. environments without writing special logic for that. " +
							"It works with any files and extensions (`.env` files, or `*.js` sources, or `*.json` configs etc.)",
						image: `${baseUrl}img/undraw_deployment_environments.svg`,
						imageAlign: "right",
						title: "Set up your JS/Node project for different environments"
					}
				]}
			</Block>
		);

		return (
			<div>
				<HomeSplash siteConfig={siteConfig} language={language} />
				<div className="mainContainer">
					<DeploymentEnvironmentsSection />
					<LocalEnvironmentsSection />
					<SimplePowerfulSection />
					<PromoSectionWitButtons docUrl={docUrl} {...this.props} />
				</div>
			</div>
		);
	}
}

module.exports = Index;
