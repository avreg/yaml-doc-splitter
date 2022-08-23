/* eslint-disable @typescript-eslint/no-var-requires */
// https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
const path = require('path');
const getFilesSync = require('./utils/getFilesSync.js');
const passFile = require('./utils/passFile');

const MOCK_ROOT_DIR = 'test/mock';

const mockFiles = getFilesSync(MOCK_ROOT_DIR, /\.ya?ml$/i);
const highWaterMarks = [...Array(300).keys()];
highWaterMarks[0] = undefined;

describe.each(['src', 'sink'])('%s traffic shaper', (dir) => {
   describe.each(highWaterMarks)('highWatermark=%i', (highWatermark) => {
      test.each(mockFiles)('given %s', async (mockYaml) => {
         const isSrcShaper = dir === 'src';
         const ret = await passFile(
            path.join(MOCK_ROOT_DIR, mockYaml),
            isSrcShaper ? highWatermark : undefined,
            isSrcShaper ? undefined : highWatermark
         );
         expect(ret).toBeUndefined();
      });
   });
});
