/* eslint-disable prefer-rest-params */
// https://habr.com/ru/post/353886/

import { Transform, TransformCallback, TransformOptions } from 'stream'
import { StringDecoder } from 'string_decoder'

const startOrEndDoc = /\r?\n([-.]{3})\s*\r?\n/g

class YamlDocSplitter extends Transform {
   #decoder = new StringDecoder('utf8')
   #yamlStream = ''
   #curDocStartPos = 0

   constructor(params?: TransformOptions) {
      super(params)

      this.#reset()
   }

   #reset(): void {
      this.#yamlStream = ''
      this.#curDocStartPos = 0
   }

   _transform(
      chunk: Buffer,
      encoding: BufferEncoding,
      callback: TransformCallback
   ): void {
      let latestMatchIndex = 0
      let latestMatchLen = 0
      let docsNbr = 0
      let pushError = false

      this.#yamlStream += this.#decoder.write(chunk)
      const allMatchGen = this.#yamlStream.matchAll(startOrEndDoc)

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
         const start = latestMatchIndex + latestMatchLen
         const end = m.index
         const ret = this.#tryDoc(isExplicitEnd, start, end)
         if (ret < 0) {
            pushError = true
            break
         }
         if (ret > 0) {
            docsNbr += 1
            if (isExplicitEnd) {
               this.#curDocStartPos = m.index + m[1].length + 1
            } else {
               this.#curDocStartPos = m.index
            }
         }
         latestMatchIndex = m.index
         latestMatchLen = m[0].length
      }

      // remove parsed docs string content
      if (docsNbr > 0 && latestMatchIndex > 0) {
         this.#yamlStream = this.#yamlStream.slice(latestMatchIndex + latestMatchLen)
         this.#curDocStartPos = 0
      }
      if (!pushError) callback()
   }

   _flush(callback: TransformCallback): void {
      this.#yamlStream += this.#decoder.end()
      if (this.#yamlStream.length > 0) {
         // EOF as explicit END of doc "..."
         this.push(this.#yamlStream)
         this.#reset()
      }
      callback()
   }

   #tryDoc(explicitEnd: boolean, start: number, end: number): number {
      // console.log('+++++++++++++++++++++++++++++++++++++++++++')
      // eslint-disable-next-line prefer-rest-params
      // console.log('tryDoc', Array.from(arguments), this.#curDocStartPos)
      // console.log(this.#yamlStream.slice(this.#curDocStartPos, end))
      // console.log('===========================================')
      if (explicitEnd) {
         // ...
         return this.#pushDoc(end)
      } else {
         // ---
         const doc = this.#yamlStream.slice(start, end)
         if (!doc.includes('%YAML')) {
            return this.#pushDoc(end)
         }
      }
      return 0
   }

   #pushDoc(end: number) {
      const pushRet = this.push(this.#yamlStream.slice(this.#curDocStartPos, end))
      return pushRet ? 1 : -1
   }
}

export { YamlDocSplitter }
