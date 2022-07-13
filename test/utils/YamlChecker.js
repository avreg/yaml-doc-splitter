/* eslint-disable @typescript-eslint/no-var-requires */

const { Writable } = require('stream')
const yaml = require('js-yaml')

class ValidationError extends Error {
   constructor(message, payload) {
      super(message)
      this.name = 'ValidationError'
      this.payload = payload
   }
}

class YamlChecker extends Writable {
   #docNbr = 0

   _write(chunk, encoding, callback) {
      this.#docNbr += 1
      const yamlStr = chunk.toString()

      try {
         const jsonObj = yaml.load(yamlStr)
         if (jsonObj !== null && jsonObj !== undefined) {
            // console.dir(jsonObj)
            if (Array.isArray(jsonObj)) {
               if (jsonObj[jsonObj.length - 1] !== this.#docNbr) {
                  this.emit(
                     'error',
                     new ValidationError(
                        `doc #${this.#docNbr} array sequence error`,
                        jsonObj
                     )
                  )
               }
            } else if (typeof jsonObj === 'object') {
               if (jsonObj.DOCNBR !== this.#docNbr) {
                  this.emit(
                     'error',
                     new ValidationError(
                        `doc #${this.#docNbr} obj sequence error`,
                        jsonObj
                     )
                  )
               }
            } else {
               this.emit(
                  'error',
                  new ValidationError(
                     `unexpected type "${typeof jsonObj}" in doc #${this.#docNbr}`,
                     jsonObj
                  )
               )
            }
         }
      } catch (e) {
         this.emit('error', e)
      }
      callback()
   }
}

module.exports = {
   ValidationError,
   YamlChecker
}
