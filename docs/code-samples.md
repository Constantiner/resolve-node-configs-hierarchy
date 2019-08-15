---
id: code-samples
title: Code Samples
sidebar_label: Code Samples
---

## Environment variables

To set up environment variables from `.env` files in project root.

### Synchronous way

```JavaScript
import { getConfigFilesSync } from "@constantiner/resolve-node-configs-hierarchy";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

const dotenvFiles = getConfigFilesSync(".env");
dotenvFiles.forEach(file => {
	dotenvExpand(
		dotenv.config({
			path: file
		})
	);
});
```

### Asynchronous way

```JavaScript
import { getConfigFiles } from "@constantiner/resolve-node-configs-hierarchy";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

getConfigFiles(".env").then(dotenvFiles => {
	dotenvFiles.forEach(file => {
		dotenvExpand(
			dotenv.config({
				path: file
			})
		);
	});
});
```

## Reading configuration from JSON file

```JavaScript
import { getConfigFileSync } from "@constantiner/resolve-node-configs-hierarchy";

const settingsFileName = getConfigFileSync("./settings.json");

const settings = require(settingsFileName);

console.log(settings.apiKey);
```

## Environment related JavaScript

For example, we need some empty implementation of Email sender in `development` environment, some stub implementation for `test` environment and some real Email sending functionality for production.

So we have production implementation in `<project_root>/email/emailSender.js`:

```JavaScript
const sendEmail = (to, subject, body) => {
	// Some real implementation here
	return sentStatus;
}

export { sendEmail };
```

Then some empty implementation in `<project_root>/email/emailSender.development.js`:

```JavaScript
const sendEmail = (to, subject, body) => {
	// Do nothing
	return true;
}

export { sendEmail };
```

And something similar in `<project_root>/email/emailSender.test.js`.

Then in our real code we can use it the following way:

```JavaScript
import { getConfigFileSync } from "@constantiner/resolve-node-configs-hierarchy";

const emailSenderFileName = getConfigFileSync("./email/emailSender.js");

const sendEmail = require(emailSenderFileName).sendEmail;

const emailSent = sendEmail("hello@example.com", "Test message", "Hello there!");
console.log(`Email sent status is ${emailSent}`);
```

You may implement the same with [dynamic imports](https://github.com/tc39/proposal-dynamic-import).
