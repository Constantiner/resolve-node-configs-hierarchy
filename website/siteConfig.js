/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
	title: "resolve-node-configs-hierarchy", // Title for your website.
	tagline: "Fights configuration headaches for JavaScript/Node projects in different environments without pain",
	url: "http://constantiner.github.io", // Your website URL
	baseUrl: "/resolve-node-configs-hierarchy/", // Base URL for your project */
	// For github.io type URLs, you would set the url and baseUrl like:
	//   url: 'https://facebook.github.io',
	//   baseUrl: '/test-site/',

	// Used for publishing and more
	projectName: "resolve-node-configs-hierarchy",
	organizationName: "constantiner",
	// For top-level user or org sites, the organization is still the same.
	// e.g., for the https://JoelMarcey.github.io site, it would be set like...
	//   organizationName: 'JoelMarcey'

	// For no header links in the top nav bar -> headerLinks: [],
	headerLinks: [
		{ doc: "introduction", label: "Docs" },
		{ doc: "api", label: "API" },
		{ page: "help", label: "Help" },
		{ href: "https://github.com/Constantiner/resolve-node-configs-hierarchy", label: "GitHub" }
	],

	/* path to images for header/footer */
	headerIcon: "img/resolve-node-configs-hierarchy-32.png",
	footerIcon: "img/resolve-node-configs-hierarchy-64.png",
	favicon: "img/favicon.ico",

	/* Colors for website */
	colors: {
		primaryColor: "#6D7C60",
		secondaryColor: "#D0E3C4"
	},

	/* Custom fonts for website */
	/*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

	// This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
	copyright: `Copyright © ${new Date().getFullYear()} Konstantin Kovalev aka Constantiner`,

	highlight: {
		// Highlight.js theme to use for syntax highlighting in code blocks.
		theme: "default"
	},

	// Add custom scripts here that would be placed in <script> tags.
	scripts: ["https://buttons.github.io/buttons.js"],

	// On page navigation for the current documentation page.
	onPageNav: "separate",
	// No .html extensions for paths.
	cleanUrl: true,

	// Open Graph and Twitter card images.
	ogImage: "img/undraw_online.svg",
	twitterImage: "img/undraw_tweetstorm.svg"

	// Show documentation's last contributor's name.
	// enableUpdateBy: true,

	// Show documentation's last update time.
	// enableUpdateTime: true,

	// You may provide arbitrary config keys to be used as needed by your
	// template. For example, if you need your repo's URL...
	//   repoUrl: 'https://github.com/facebook/test-site',
};

module.exports = siteConfig;
