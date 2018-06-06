/* global describe, it */

import { expect } from 'chai'
import { rollup } from 'rollup'

import mjsEntry from '../src/index.js'

function getSource(output, fileName) {
  const file = output.find(file => file.fileName === fileName)
  if (file == null || file.type !== 'asset') return
  return file.source
}

describe('rollup-plugin-mjs-entry', function () {
  it('handles named exports', async function () {
    const bundle = await rollup({
      input: 'test/demo/named-only.js',
      plugins: [mjsEntry()]
    })
    const { output } = await bundle.generate({
      file: 'test/tmp/named-only.js',
      format: 'cjs'
    })

    expect(output).has.lengthOf(2)
    expect(getSource(output, 'named-only.mjs')).equals(
      "import cjs from './named-only.js';\n" +
        '\n' +
        'export const another = cjs.another;\n' +
        'export const named = cjs.named;\n'
    )
  })

  it('handles includeDefault option', async function () {
    const bundle = await rollup({
      input: 'test/demo/named-only.js',
      plugins: [mjsEntry({ includeDefault: true })]
    })
    const { output } = await bundle.generate({
      file: 'test/tmp/named-only.js',
      format: 'cjs'
    })

    expect(output).has.lengthOf(2)
    expect(getSource(output, 'named-only.mjs')).equals(
      "import cjs from './named-only.js';\n" +
        '\n' +
        'export const another = cjs.another;\n' +
        'export const named = cjs.named;\n' +
        'export default cjs;\n'
    )
  })

  it('handles mixed exports', async function () {
    const bundle = await rollup({
      input: 'test/demo/mixed.js',
      plugins: [mjsEntry()]
    })
    const { output } = await bundle.generate({
      file: 'test/tmp/mixed.js',
      exports: 'named',
      format: 'cjs'
    })

    expect(output).has.lengthOf(2)
    expect(getSource(output, 'mixed.mjs')).equals(
      "import cjs from './mixed.js';\n" +
        '\n' +
        'export default cjs["default"];\n' +
        'export const named = cjs.named;\n'
    )
  })

  it('handles default exports', async function () {
    const bundle = await rollup({
      input: 'test/demo/default-only.js',
      plugins: [mjsEntry()]
    })
    const { output } = await bundle.generate({
      file: 'test/tmp/default-only.js',
      exports: 'auto',
      format: 'cjs'
    })

    expect(output).has.lengthOf(2)
    expect(getSource(output, 'default-only.mjs')).equals(
      "import cjs from './default-only.js';\n\nexport default cjs;\n"
    )
  })
})
