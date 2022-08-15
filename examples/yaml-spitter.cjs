/* eslint-disable @typescript-eslint/no-var-requires */
/***
 * Usage:
 *  $ node path/to/yaml-splitter.cjs multi-doc.yaml
 *  # or
 *  $ cat multi-doc.yaml | node path/to/yaml-splitter.cjs
 */

const fs = require('fs')
const stream = require('stream')
const { YamlDocSplitter } = require('../dist/yaml-doc-splitter.js')

class DocDumper extends stream.Writable {
   constructor() {
      super()

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
