/***
 * Usage:
 *  $ node path/to/yaml2json-dumper.mjs multi-doc.yaml
 *  # or
 *  $ cat multi-doc.yaml | node path/to/yaml2json-dumper.mjs
 */

import fs from 'node:fs';
import util from 'node:util';
import stream from 'node:stream';
import os from 'node:os';
import process from 'node:process';
import ydsPkg from '../dist/yaml-doc-splitter.js';
import yaml from 'js-yaml';

const { YamlDocSplitter } = ydsPkg;

const pipeline = util.promisify(stream.pipeline);

class YamlToJson extends stream.Transform {
   constructor() {
      super({
         readableObjectMode: true
      });
   }

   _transform(stringChunk, _encoding, callback) {
      try {
         const jsonObj = yaml.load(stringChunk);
         if (jsonObj !== null && jsonObj !== undefined) {
            callback(null, jsonObj);
         } else {
            // empty object
            callback();
         }
      } catch (err) {
         callback(err);
      }
   }
}

class JsonStringifier extends stream.Transform {
   constructor() {
      super({
         writableObjectMode: true
      });
   }

   _transform(jsonObj, _encoding, callback) {
      try {
         callback(null, JSON.stringify(jsonObj, null, 3) + os.EOL);
      } catch (err) {
         callback(err);
      }
   }
}

const inputStream = process.argv[2]
   ? fs.createReadStream(process.argv[2])
   : process.stdio;
const splitter = new YamlDocSplitter();
const convertor = new YamlToJson();
const stringifier = new JsonStringifier();

(async () => {
   try {
      await pipeline(
         inputStream,
         splitter,
         convertor,
         stringifier,
         process.stdout
      );
   } catch (err) {
      console.error('Pipeline job failed:', err.message || `${err}`);
   }
})();
