# @macklinu/codemods

> A collection of JavaScript and TypeScript codemod scripts for easier code migration

## Scripts

All scripts should be executed with Node >=22.

### `requirejs-to-commonjs`

Converts AMD modules (`define()`) to CommonJS modules (`module.exports`). This
codemod currently only handles converting AMD `define()` statements - global AMD
`require()` modification is not supported.

To run:

```sh
npx jscodeshift <files-or-glob> -t https://raw.githubusercontent.com/macklinu/codemods/master/src/requirejs-to-commonjs.js
```

## Development

### `bun run test`

Runs the [Vitest](https://vitest.dev/) test suite.

### `bun run lint`

Runs [ESLint](https://eslint.org/).

## Contributing

If you use any of these codemods and have bug reports / feature requests, please
[open an issue](https://github.com/macklinu/codemods/issues/new)!
