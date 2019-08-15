---
id: introduction
title: Introduction
sidebar_label: Introduction
---

`resolve-node-configs-hierarchy` solves an usual for Node/JavaScript projects problem of setting up environments with some individual configuration options.

When we are talking about environments, we mean the following:

- Environment to run your script/project in. In Node scripts/projects we are talking about `process.env.NODE_ENV`. For example, it could be `development`, `production`, `test`, `staging` or some other custom environments.
- Environment with settings stored in version control system and shared between all developers, and local environment specific for this particular developer (usually this local environment can't be shared because of it will break someone elses environment or may contain some sensitive data or information like API keys etc.). In some cases it requires to set up `staging` or `production` environments with some local configuration to prevent sharing private data across development team.

## Resolving configurations

`resolve-node-configs-hierarchy` uses [the following principle of resolving configuration files](https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use):

It will list the following files, starting from the bottom (we use base `.env` file as example here). The first value set (or those already defined in the environment) take precedence:

- `.env` is The Original®
- `.env.development`, `.env.test`, `.env.production` are environment-specific settings.
- `.env.local` are local overrides. This file is loaded for all environments except `test` (in `resolve-node-configs-hierarchy` API you can include it with flag if needed).
- `.env.development.local`, `.env.test.local` (for `test` environment you can include it with flag as the second parameter; pretending tests should run the same for everybody), `.env.production.local` are local overrides of environment-specific settings.

As we mentioned above, for test environment it will not list `.env.local` and `.env.test.local` from this list by default since normally you expect tests to produce the same results for everyone. You can include them by passing the second parameter with `true` value (see [API reference](api.md)).

So if our environment is `production` and we have the following files `.env`, `.env.development`, `.env.production`, `.env.local`, `.env.development.local`, `.env.production.local`, the final precedence list will be the following:

- `.env.production.local` (highest priority)
- `.env.local`
- `.env.production`
- `.env` (lowest priority)

It allows us to override base configs (like `.env` in the example above) with local ones (like `.env.production.local`).

## File extensions

`resolve-node-configs-hierarchy` allows to use files with extensions. For example, if we want to use some configuration file in JSON format, it works the following way.

Let we have our base `settings.json` and we need to set up our `development` environment with some local settings. Imagine, we have the following files in our project structure:

```
project_root
 │
 ├ settings.json
 ├ settings.development.json
 ├ settings.production.json
 ├ settings.local.json
 ├ settings.development.local.json
 └ settings.production.local.json
```

The final precedence list for looking up of `settings.json` with `resolve-node-configs-hierarchy` methods will be the following:

- `settings.development.local.json` (highest priority)
- `settings.local.json`
- `settings.development.json`
- `settings.json` (lowest priority)

## .gitignore

Using this configuration scheme, make sure you add all the local files into your version control ignore list (to `.gitignore` for Git, for example).

For `settings.json` sample above, these files are:

```
settings.development.local.json
settings.production.local.json
settings.local.json
```