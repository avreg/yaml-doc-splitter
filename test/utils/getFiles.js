/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path')
const { readdir } = require('fs').promises

async function* _getFiles(dir) {
   const dirents = await readdir(dir, { withFileTypes: true })
   for (const dirent of dirents) {
      const res = resolve(dir, dirent.name)
      if (dirent.isDirectory()) {
         yield* _getFiles(res)
      } else {
         yield res
      }
   }
}

module.exports = async function (rootDir) {
   const files = []

   for await (const f of _getFiles(rootDir)) {
      files.push(f)
   }
   return files
}
