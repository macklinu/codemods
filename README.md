# @macklinu/codemods

> A collection of JavaScript codemod scripts for easier code migration

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Build Status](https://travis-ci.org/macklinu/codemods.svg?branch=master)](https://travis-ci.org/macklinu/codemods)

## Scripts

All scripts should be executed with Node >=8.

### `requirejs-to-commonjs`

Converts AMD modules (`define()`) to CommonJS modules (`module.exports`). This
codemod currently only handles converting AMD `define()` statements - global AMD
`require()` modification is not supported.

To run:

```sh
npx jscodeshift <files-or-glob> -t https://raw.githubusercontent.com/macklinu/codemods/master/src/requirejs-to-commonjs.js
```

## Development

### `yarn test`

Runs the [Jest](https://facebook.github.io/jest/) test suite. Tip: run
`yarn test --watch` for interactive watch mode during development.

Jest also includes an [ESLint](https://eslint.org/) runner, so running
`yarn test` will lint and test all source files.

## Contributing

If you use any of these codemods and have bug reports / feature requests, please
[open an issue](https://github.com/macklinu/codemods/issues/new)!
