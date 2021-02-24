# rollup-plugin-mjs-entry

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Build Status](https://travis-ci.com/swansontec/rollup-plugin-mjs-entry.svg?branch=main)](https://travis-ci.com/swansontec/rollup-plugin-mjs-entry)

Node.js finally supports native ES module syntax! Hooray! If you are publishing a module on NPM, you should definitely support this.

Older versions of Node.js will be around for a while, though, so you'll need to support those too. The [best practice](https://nodejs.org/dist/latest-v15.x/docs/api/packages.html#packages_approach_1_use_an_es_module_wrapper) is to ship your package as CommonJS, and then provide an ES module wrapper so your users can take advantage of named exports. This plugin will generate one of these module wrappers for each CommonJS entry point Rollup produces.

## Usage

Here is an example `rollup.config.js` file using this plugin:

```js
import mjsEntry from 'rollup-plugin-mjs-entry'

export default {
  input: 'src/index.js',
  output: { file: 'lib/index.js', format: 'cjs' },
  plugins: [mjsEntry()]
}
```

With this config, Rollup will generate two output files, `lib/index.js` and `lib/index.mjs`. The `lib/index.mjs` output file might look something like this:

```js
import cjs from './index.js'

export const name1 = cjs.name1;
export const name2 = cjs.name2;
// and so forth for each named export in your package...
```

Finally, your `package.json` file should include lines like the following:

```js
{
  "main": "./lib/index.js",
  "exports": {
    ".": {
      "import": "./lib/index.mjs",
      "require": "./lib/index.js"
    },
    "./package.json": "./package.json"
  }
}
```

Older versions of Node.js understand the "main" field, while newer versions of Node.js understand the "exports" field, which tells Node.js what to do in each mode.

### Default Export

With the setup above, users can import your library using either:

```js
// CommonJS:
const yourPackage = require('your-package')

// ES modules:
import { name1, name2 } from 'your-package'
```

However, the following syntax will not work yet:

```js
import yourPackage from 'your-package'
```

If you would like to enable this style of import, which is half-way between the CommonJS way and the ES module way, just pass the option `{ includeDefault: true }` when initializing this plugin in your `rollup.config.js`:

```js
import mjsEntry from 'rollup-plugin-mjs-entry'

export default {
  input: 'src/index.js',
  output: { file: 'lib/index.js', format: 'cjs' },
  plugins: [mjsEntry({ includeDefault: true })]
}
```

This could be useful if you are adding ES module support for the first time, and would like to avoid making this a breaking change.
