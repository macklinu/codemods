import jscodeshift from 'jscodeshift'
import prettier from 'prettier'
import { describe, expect, test } from 'vitest'

expect.addSnapshotSerializer({
  test: (val) => typeof val === 'string',
  print: (val) => val,
})

const format = (code) =>
  prettier.format(code, {
    parser: 'babel',
    semi: false,
    singleQuote: true,
    trailingComma: 'es5',
  })

const runTest = ({ module, name, input, options = {} }) => {
  // Handle ES6 modules using default export for the transform
  const transform = module.default || module

  if (!transform) {
    throw new Error('No transform module supplied')
  }

  const mockApi = { jscodeshift, stats: () => {} }
  const output = transform({ source: input }, mockApi, options) || ''

  test(name, async () => {
    expect(await format(input)).toMatchSnapshot('input')
    expect(await format(output)).toMatchSnapshot('output')
  })
}

export const jscodeshiftTester = ({ module, tests = {} }) => {
  describe(module.name, () => {
    Object.entries(tests).forEach(([name, input]) => {
      runTest({ module, name, input })
    })
  })
}
