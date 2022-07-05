import fs from 'node:fs'
import { Writable } from 'stream'

import { YamlDocSplitter } from '../dist/yaml-doc-splitter.js'
import yaml from 'js-yaml'

class YamlDumper extends Writable {
   #docNbr = 0

   constructor() {
      super({
         decodeStrings: true
      })
   }

   _write(chunk, encoding, callback) {
      this.#docNbr += 1
      console.log(`++++++++++++++ doc #${this.#docNbr} ++++++++++++++`)
      const yamlStr = chunk.toString()
      try {
         const jsonObj = yaml.load(yamlStr)
         console.dir(jsonObj)
      } catch (e) {
         console.error('Load error:', e.message)
         console.log(
            '+++++++++++++++++++++++++\n',
            yamlStr,
            '\n========================'
         )
      }
      callback()
   }
}

const yamlSplitter = new YamlDocSplitter()
const yamlDumper = new YamlDumper()

const input = fs.createReadStream(
   process.argv[2] || 'test/mock/01-withYamlVersion.yaml',
   {
      highWaterMark: 10000
   }
)

input.pipe(yamlSplitter).pipe(yamlDumper)
