---
id: api
title: API Reference
sidebar_label: API Reference
---

Depending on your needs you can choose [synchronous](#synchronous-api) or [asynchronous](#asynchronous-api) methods.

## Synchronous API

### getConfigFilesSync

Returns a list of absolute file paths of existing files in order of precedence. Doesn't work in browser environment.

For example, if we have the following file structure:

```
project_root
 │
 └ configuration
    │
    ├ settings.json
    ├ settings.development.json
    ├ settings.production.json
    ├ settings.local.json
    ├ settings.development.local.json
    └ settings.production.local.json
```

And call `getConfigFilesSync` like the following in `development` environment:

```JavaScript
getConfigFilesSync("configuration/settings.json");
```

It will return the following array:

```JavaScript
["<project_root_absolute_path>/configuration/settings.development.local.json", "<project_root_absolute_path>/configuration/settings.local.json", "<project_root_absolute_path>/configuration/settings.development.json", "<project_root_absolute_path>/configuration/settings.json"]
```

It will return an empty array if there is no relevant files.

**Note:** it checks files existence and doesn't include inexistent files!

Signature is the following:

```TypeScript
declare function getConfigFilesSync(file: string, includeTestLocals?: boolean): string[];
```

Parameters:

- `file`: `string` — is base file path (related to [`process.cwd()`](https://nodejs.org/api/process.html#process_process_cwd)).
- `includeTestLocals`: `boolean` (optional, default is `false`) — if `true` it will include `local` files for `test` environment (ignores them by default). So, if you pass `true` it will work absolutely the same way for ant environment. See explanation about `test` environment in [introduction section](introduction.md#resolving-configurations).

Returns:

`string[]` — an array of existing absolute file paths in order of precedence.

To import it with SystemJS:

```JavaScript
const getConfigFilesSync = require("@constantiner/resolve-node-configs-hierarchy").getConfigFilesSync;
```

or with ES6 modules:

```JavaScript
import { getConfigFilesSync } from "@constantiner/resolve-node-configs-hierarchy";
```

### getConfigFileSync

Returns absolute file path of the most precedent existing file in files hierarchy.

For example, if we have the following file structure:

```
project_root
 │
 └ configuration
    │
    ├ settings.json
    ├ settings.development.json
    ├ settings.production.json
    ├ settings.local.json
    └ settings.production.local.json
```

And call `getConfigFileSync` like the following in `development` environment:

```JavaScript
getConfigFileSync("configuration/settings.json");
```

It will return the following string:

```JavaScript
"<project_root_absolute_path>/configuration/settings.local.json"
```

It will return `null` if there is no relevant files.

**Note:** it checks files existence and doesn't include inexistent files!

Signature is the following:

```TypeScript
declare function getConfigFileSync(file: string, includeTestLocals?: boolean): string | null;
```

Parameters:

- `file`: `string` — is base file path (related to [`process.cwd()`](https://nodejs.org/api/process.html#process_process_cwd)).
- `includeTestLocals`: `boolean` (optional, default is `false`) — if `true` it will include `local` files for `test` environment (ignores them by default). So, if you pass `true` it will work absolutely the same way for ant environment. See explanation about `test` environment in [introduction section](introduction.md#resolving-configurations).

Returns either:

- `string` — the most precedent existing file in files hierarchy. It is the first element of array, returned from [`getConfigFilesSync` method](#getconfigfilessync) (if the array is not empty).
- `null` if there are no existing files.

To import it with SystemJS:

```JavaScript
const getConfigFileSync = require("@constantiner/resolve-node-configs-hierarchy").getConfigFileSync;
```

or with ES6 modules:

```JavaScript
import { getConfigFileSync } from "@constantiner/resolve-node-configs-hierarchy";
```

## Asynchronous API

### getConfigFiles

Returns a promise resolving to a list of absolute file paths of existing files in order of precedence. Doesn't work in browser environment.

For example, if we have the following file structure:

```
project_root
 │
 └ configuration
    │
    ├ settings.json
    ├ settings.development.json
    ├ settings.production.json
    ├ settings.local.json
    ├ settings.development.local.json
    └ settings.production.local.json
```

And call `getConfigFiles` like the following in `development` environment:

```JavaScript
getConfigFiles("configuration/settings.json").then(files => console.log(files));
```

It will print in console the following array:

```JavaScript
["<project_root_absolute_path>/configuration/settings.development.local.json", "<project_root_absolute_path>/configuration/settings.local.json", "<project_root_absolute_path>/configuration/settings.development.json", "<project_root_absolute_path>/configuration/settings.json"]
```

Returning promise will resolve to an empty array if there is no relevant files.

**Note:** it checks files existence and doesn't include inexistent files!

Signature is the following:

```TypeScript
declare function getConfigFiles(file: string, includeTestLocals?: boolean): Promise<string[]>;
```

Parameters:

- `file`: `string` — is base file path (related to [`process.cwd()`](https://nodejs.org/api/process.html#process_process_cwd)).
- `includeTestLocals`: `boolean` (optional, default is `false`) — if `true` it will include `local` files for `test` environment (ignores them by default). So, if you pass `true` it will work absolutely the same way for ant environment. See explanation about `test` environment in [introduction section](introduction.md#resolving-configurations).

Returns:

`Promise<string[]>` — a promise resolving to an array of existing absolute file paths in order of precedence.

To import it with SystemJS:

```JavaScript
const getConfigFiles = require("@constantiner/resolve-node-configs-hierarchy").getConfigFiles;
```

or with ES6 modules:

```JavaScript
import { getConfigFiles } from "@constantiner/resolve-node-configs-hierarchy";
```

### getConfigFile

Returns a promise resolving to absolute file path of the most precedent existing file in files hierarchy.

For example, if we have the following file structure:

```
project_root
 │
 └ configuration
    │
    ├ settings.json
    ├ settings.development.json
    ├ settings.production.json
    ├ settings.local.json
    └ settings.production.local.json
```

And call `getConfigFile` like the following in `development` environment:

```JavaScript
getConfigFile("configuration/settings.json").then(file => console.log(file));
```

It will print to console the following string:

```JavaScript
"<project_root_absolute_path>/configuration/settings.local.json"
```

Resulting promise will resolve to `null` if there is no relevant files.

**Note:** it checks files existence and doesn't include inexistent files!

Signature is the following:

```TypeScript
declare function getConfigFile(file: string, includeTestLocals?: boolean): Promise<string | null>;
```

Parameters:

- `file`: `string` — is base file path (related to [`process.cwd()`](https://nodejs.org/api/process.html#process_process_cwd)).
- `includeTestLocals`: `boolean` (optional, default is `false`) — if `true` it will include `local` files for `test` environment (ignores them by default). So, if you pass `true` it will work absolutely the same way for ant environment. See explanation about `test` environment in [introduction section](introduction.md#resolving-configurations).

Returns:

`Promise<string | null>` — a promise resolving to the most precedent existing file in files hierarchy. It is the first element of array, returned from [`getConfigFiles` method](#getconfigfiles) (if the array is not empty). In case of empty array (files don't exist) the resulting promise will resolve to `null`.

To import it with SystemJS:

```JavaScript
const getConfigFile = require("@constantiner/resolve-node-configs-hierarchy").getConfigFile;
```

or with ES6 modules:

```JavaScript
import { getConfigFile } from "@constantiner/resolve-node-configs-hierarchy";
```
