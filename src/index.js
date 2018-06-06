export default function mjsEntry(pluginOptions = {}) {
  return {
    name: 'rollup-plugin-mjs-entry',

    generateBundle(options, bundle) {
      const { exports, format } = options
      if (format !== 'cjs') return

      for (const fileName of Object.keys(bundle)) {
        const chunk = bundle[fileName]
        if (chunk.type !== 'chunk' || !chunk.isEntry) continue

        let source = `import cjs from './${fileName}';\n\n`
        let { includeDefault } = pluginOptions
        for (const name of chunk.exports) {
          if (name === 'default') {
            if (exports === 'named' || chunk.exports.length > 1) {
              source += 'export default cjs["default"];\n'
              includeDefault = false
            } else {
              includeDefault = true
            }
          } else {
            source += `export const ${name} = cjs.${name};\n`
          }
        }
        if (includeDefault) {
          source += 'export default cjs;\n'
        }

        this.emitFile({
          type: 'asset',
          fileName: fileName.replace(/\.js$/, '') + '.mjs',
          source
        })
      }
    }
  }
}
