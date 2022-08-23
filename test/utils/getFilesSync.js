/* eslint-disable @typescript-eslint/no-var-requires */
const { readdirSync } = require('fs');

module.exports = function (rootDir, fileMaskRegex) {
   const dirents = readdirSync(rootDir, { withFileTypes: true });

   let regexObj = false;
   if (fileMaskRegex) {
      regexObj = new RegExp(fileMaskRegex);
   }

   return dirents
      .filter((dirent) => {
         if (dirent.isFile()) {
            if (regexObj) {
               return regexObj.test(dirent.name);
            } else {
               return false;
            }
         } else {
            return false;
         }
      })
      .map((dirent) => dirent.name)
      .sort();
};
