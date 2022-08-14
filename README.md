# YAML multi-doc stream splitter

The package **@avreg/yaml-doc-splitter** exports **YamlDocSplitter** class as [Node.js Transform stream](https://nodejs.org/api/stream.html#duplex-and-transform-streams) to build parser|decoder|convert [pipeline](https://nodejs.org/api/stream.html#streampipelinesource-transforms-destination-callback).

The YamlDocSplitter reads an multi-document *YAML input stream*, sequentially *splits* it into many individual YAML documents as data arrives, and *pushes* it on to the next streams in the pipeline.

Example of multi-document YAML:

```yml
# Implicit end with version
%YAML 1.2
---
doc: 1

# Explicit end without version
---
doc: 2
...

# Explicit end with another version
%YAML 1.1
---
doc: 3
...
```

Yes, [js-yaml](https://github.com/nodeca/js-yaml) (and many another) package have ```loadAll()``` method, but *YamlDocSplitter* can *useful* in the following cases:

- **if input static file have big size**,
- **realtime input stream**.

## Restrictions

- Node.js >= 12.
- Only UTF-8 encoding supports now.

## Installation

```bash
npm install @avreg/yaml-doc-splitter
# or
yarn add @avreg/yaml-doc-splitter
```

## Usage example

### CommonJS (simplest example)

```javascript
/***
 * Usage:
 *  $ node path/to/yaml-splitter.cjs multi-doc.yaml
 *  # or
 *  $ cat multi-doc.yaml | node path/to/yaml-splitter.cjs
 */

const fs = require('fs')
const stream = require('stream')
const process = require('process')
const { YamlDocSplitter } = require('@avreg/yaml-doc-splitter')

class DocDumper extends stream.Writable {
   constructor() {
      super({
         readableObjectMode: false,
         writableObjectMode: true
      })

      this._docNbr = 0
   }

   _write(yamlDocBuffer, _encoding, callback) {
      const yamlDocString = yamlDocBuffer.toString()

      this._docNbr += 1

      console.log()
      console.log(`@@@@@@@ Yaml doc #${this._docNbr} @@@@@@@`)
      console.log(yamlDocString)

      callback()
   }

   _final(callback) {
      console.log(`Total Yaml docs count: ${this._docNbr}`)

      callback()
   }
}

const inputStream = process.argv[2]
   ? fs.createReadStream(process.argv[2])
   : process.stdio
const splitter = new YamlDocSplitter()
const dumper = new DocDumper()

inputStream.pipe(splitter).pipe(dumper)
```

### ES6 modules (more complete)

```javascript
/***
 * Usage:
 *  $ node path/to/yaml2json-dumper.mjs multi-doc.yaml
 *  # or
 *  $ cat multi-doc.yaml | node path/to/yaml2json-dumper.mjs
 */

import fs from 'node:fs'
import util from 'node:util'
import stream from 'node:stream'
import os from 'node:os'
import process from 'node:process'
import yaml from 'js-yaml'
import { YamlDocSplitter } from '@avreg/yaml-doc-splitter'

const pipeline = util.promisify(stream.pipeline)

class YamlToJson extends stream.Transform {
   constructor() {
      super({
         readableObjectMode: true,
         writableObjectMode: false
      })
   }

   _transform(stringChunk, _encoding, callback) {
      try {
         const jsonObj = yaml.load(stringChunk)
         if (jsonObj !== null &&
             jsonObj !== undefined) {
            callback(null, jsonObj)
         } else {
            // empty object
            callback()
         }
      } catch (err) {
         callback(err)
      }
   }
}

class JsonStringifier extends stream.Transform {
   constructor() {
      super({
         readableObjectMode: false,
         writableObjectMode: true
      })
   }

   _transform(jsonObj, _encoding, callback) {
      try {
         callback(
            null,
            JSON.stringify(jsonObj, null, 3) + os.EOL)
      } catch (err) {
         callback(err)
      }
   }
}

const inputStream = process.argv[2]
   ? fs.createReadStream(process.argv[2])
   : process.stdio
const splitter = new YamlDocSplitter()
const convertor = new YamlToJson()
const stringifier = new JsonStringifier()

;(async () => {
   try {
      await pipeline(
               inputStream,
               splitter,
               convertor,
               stringifier,
               process.stdout
            )
   } catch (err) {
      console.error(
        'Pipeline job failed:',
        err.message || `${err}`
      )
   }
})()
```

## TODO

- publish to NPM;
- support all encodings.

## BUGS

Report bugs to <support@avreg.net>
