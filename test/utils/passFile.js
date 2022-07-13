/* eslint-disable @typescript-eslint/no-var-requires */
const { createReadStream } = require('fs')
const util = require('util')
const stream = require('stream')
const { YamlDocSplitter } = require('../../dist/yaml-doc-splitter.js')
const { YamlChecker } = require('./YamlChecker')

const pipeline = util.promisify(stream.pipeline)

async function passFile(mockFilePath, srcHighWaterMark, sinkHighWaterMark) {
   // console.log(mockFilePath, srcHighWaterMark, sinkHighWaterMark)
   const input = createReadStream(mockFilePath, {
      highWaterMark: srcHighWaterMark
   })
   const splitter = new YamlDocSplitter({
      writableHighWaterMark: sinkHighWaterMark
   })
   const checker = new YamlChecker()

   return await pipeline(input, splitter, checker)
}

module.exports = passFile
