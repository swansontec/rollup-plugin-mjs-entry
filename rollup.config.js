import babel from '@rollup/plugin-babel'

import packageJson from './package.json'

const babelOpts = {
  babelHelpers: 'bundled',
  babelrc: false,
  presets: ['@babel/preset-env']
}

export default {
  input: './src/index.js',
  output: {
    exports: 'default',
    file: packageJson.main,
    format: 'cjs'
  },
  plugins: [babel(babelOpts)]
}
