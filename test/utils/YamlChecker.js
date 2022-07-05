/* eslint-disable @typescript-eslint/no-var-requires */
const { Writable } = require('stream')
const yaml = require('js-yaml')

class YamlChecker extends Writable {
   #docNbr = 0

   _write(chunk, encoding, callback) {
      this.#docNbr += 1
      const yamlStr = chunk.toString()
      try {
         const jsonObj = yaml.load(yamlStr)
         if (jsonObj !== null) {
            // console.dir(jsonObj)
            if (Array.isArray(jsonObj)) {
               if (jsonObj[jsonObj.length - 1] !== this.#docNbr) {
                  this.emit(
                     'error',
                     new Error(`doc #${this.#docNbr} sequence error`)
                  )
               }
            } else if (typeof jsonObj === 'object') {
               if (jsonObj.DOCNBR !== this.#docNbr) {
                  this.emit(
                     'error',
                     new Error(`doc #${this.#docNbr} sequence error`)
                  )
               }
            } else {
               this.emit('error', new Error(`type in doc #${this.#docNbr}`))
            }
         }
      } catch (e) {
         this.emit('error', e)
      }
      callback()
   }
}

module.exports = YamlChecker
