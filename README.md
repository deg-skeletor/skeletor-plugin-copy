# Skeletor Copy Plugin
[![Build Status](https://travis-ci.org/deg-skeletor/skeletor-plugin-copy.svg?branch=master)](https://travis-ci.org/deg-skeletor/skeletor-plugin-copy)

The purpose of this plugin is to copy static assets from one directory to another.

This is a functioning plugin that can be installed as-is to a Skeletor-equipped project. 

To learn more about Skeletor, [go here](https://github.com/deg-skeletor/skeletor-core).

## Getting Started
After you have cloned this repository, run `npm install` in a terminal to install some necessary tools, including a testing framework (Jest) and a linter (ESLint). 

## Source Code
The primary source code for this sample plugin is located in the `index.js` file.

## Running Tests
This sample plugin is pre-configured with the [Jest testing framework](https://facebook.github.io/jest/) and an example test. 

From a terminal, run `npm test`. You should see one test pass and feel pleased.

Test code can be found in the `index.test.js` file.

## Skeletor Plugin API

For a Skeletor plugin to function within the Skeletor ecosystem, it must expose a simple API that the Skeletor task runner will interact with.
The method signatures of the API are as follows:

### run(config)

The `run()` method executes a plugin's primary task,. It is the primary way (and, currently, the *only* way) that the Skeletor task runner interacts with a plugin.

#### Config Options

**directories**

Type: `Object[]`

The `directories` parameter is a list of objects detailing the directories to be copied.

##### Directories Parameter

**src**
Type: `String`

The path to the source directory to be copied. This path can contain globbing [syntax](https://github.com/sindresorhus/globby#globbing-patterns).

**dest**

The path to the destination directory to be copied into.

#### Return Value
A Promise that resolves to a [Status object](#the-status-object).

### The Status Object
The Status object is a simple Javascript `Object` for storing the current status of your plugin. The structure of this object is as follows:

#### Properties

**status**

Type: `String`

Possible Values: `'complete'`, `'error'`

Contains the status of the plugin. If the plugin has completed successfully, the `'complete'` value should be used. If an error was encountered during plugin execution, the `'error'` value should be used.

**message**

Type: `String`

Contains any additional information regarding the status of the plugin. If the plugin executed successfully, this property could include information about what the plugin accomplished. If the plugin encountered an error, this property could include error details. 

## Required Add-Ins
[fs-extra](https://github.com/jprichardson/node-fs-extra)
adds file system methods including ones that are not in the native `fs` module

[path](https://nodejs.org/docs/latest/api/path.html)
a module that provides utilities for working with file and directory paths

[globby](https://github.com/sindresorhus/globby)
a promised-based module that matches files using patterns
