/* eslint-disable prefer-rest-params */
// https://habr.com/ru/post/353886/

import { Transform, TransformCallback, TransformOptions } from 'stream'
import { StringDecoder } from 'string_decoder'

const startOrEndDoc = /\r?\n([-.]{3})\s*\r?\n/g

class YamlDocSplitter extends Transform {
   #decoder = new StringDecoder('utf8')
   #yamlString = ''
   #curDocStartPos = 0

   constructor(params?: TransformOptions) {
      super(params)

      this.#reset()
   }

   #reset(): void {
      this.#yamlString = ''
      this.#curDocStartPos = 0
   }

   *#split(): Generator<string, boolean, unknown> {
      let start = this.#curDocStartPos
      const allMatchGen = this.#yamlString.matchAll(startOrEndDoc)

      while (true) {
         const g = allMatchGen.next()
         if (g.done) {
            break
         }
         const m = g.value
         if (!m || m.index === undefined) {
            break
         }

         const isExplicitEnd = m[1] === '...'
         const end = m.index

         let docSlice = ''
         if (!isExplicitEnd) {
            docSlice = this.#yamlString.slice(start, end)
            if (docSlice.includes('%YAML')) {
               // FIXME: over ?
               start = m.index + m[1].length + 1
               continue
            }
         }
         if (!docSlice || this.#curDocStartPos !== start) {
            docSlice = this.#yamlString.slice(this.#curDocStartPos, end)
         }

         yield docSlice

         if (isExplicitEnd) {
            // FIXME: over ?
            start = m.index + m[1].length + 1
         } else {
            start = m.index
         }
         this.#curDocStartPos = start
      }
      return true
   }

   _transform(
      chunk: Buffer,
      encoding: BufferEncoding,
      callback: TransformCallback
   ): void {
      let docsNbr = 0
      let pushError = false

      this.#yamlString += this.#decoder.write(chunk)

      const allDocGen = this.#split()

      for (const yamlDocString of allDocGen) {
         if (this.push(yamlDocString)) {
            docsNbr += 1
         } else {
            pushError = true
            allDocGen.return(false)
         }
      }

      // remove parsed docs string content
      if (docsNbr > 0 && this.#curDocStartPos > 0) {
         this.#yamlString = this.#yamlString.slice(this.#curDocStartPos)
         this.#curDocStartPos = 0
      }

      if (!pushError) callback()
   }

   _flush(callback: TransformCallback): void {
      this.#yamlString += this.#decoder.end()
      if (this.#yamlString.length > 0) {
         // EOF as explicit END of doc "..."
         if (this.push(this.#yamlString)) {
            this.#reset()
         }
      }
      callback()
   }
}

export { YamlDocSplitter }
