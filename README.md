# rollup-plugin-mjs-entry

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Build Status](https://travis-ci.com/swansontec/rollup-plugin-mjs-entry.svg?branch=main)](https://travis-ci.com/swansontec/rollup-plugin-mjs-entry)

Node.js finally supports native ES module syntax (hooray)! If you are publishing a package on NPM, you should definitely support this. Older versions of Node.js will still exist for a while, though, so you should keep supporting those too. The [best practice](https://nodejs.org/dist/latest-v15.x/docs/api/packages.html#packages_approach_1_use_an_es_module_wrapper) is to keep shipping your package as CommonJS, and then provide an ES module wrapper so newer versions of Node.js can use named exports.

To accomplish this, rollup-plugin-mjs-entry will generate an ".mjs" wrapper for each CommonJS entry point Rollup produces. Here is an example of one of these generated wrappers:

```js
import cjs from './your-entry.js'

export const name1 = cjs.name1;
export const name2 = cjs.name2;
```

Now newer versions of Node.js can use the named exports in `your-entry.mjs`, while older versions can keep using the CommonJS bundle in `your-entry.js`.

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

With this config, Rollup will generate two output files, `lib/index.js` and `lib/index.mjs`. To expose these files to the outside world, your `package.json` file should include lines like the following:

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

Older versions of Node.js understand the "main" field, while newer versions of Node.js understand the "exports" field, which tells Node.js what to do in each mode. The "exports" field also includes an entry for `package.json`, since many tools expect this file to be importable.

Now your users can import your library using either:

```js
// CommonJS:
const yourPackage = require('your-package')

// ES modules:
import { name1, name2 } from 'your-package'
```

### Adding a Default Export

With the setup above, the following import syntax will no longer work:

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

This could be useful if you are adding ES module support for the first time, and would like to make this a non-breaking change as users transition from the old default-based syntax to the name-based syntax.

If an ES module already provides its own default export, this setting will have no effect.

New projects should just leave this setting turned off.
