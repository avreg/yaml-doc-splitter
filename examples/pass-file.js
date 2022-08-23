/* eslint-disable @typescript-eslint/no-var-requires */
const passFile = require('../test/utils/passFile');
const { ValidationError } = require('../test/utils/YamlChecker');

const yamlFilePath = process.argv[2];
const srcHighWaterMark = parseInt(process.argv[3]) || undefined;
const sinkHighWaterMark = parseInt(process.argv[4]) || undefined;

(async () => {
   try {
      await passFile(yamlFilePath, srcHighWaterMark, sinkHighWaterMark);
      console.log('PASS FILE DONE');
   } catch (err) {
      console.log('ERROR', err.message);
      if (err instanceof ValidationError) {
         console.dir(err.payload);
      }
   }
})();
