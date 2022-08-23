/* eslint-disable @typescript-eslint/no-var-requires */
const { YamlDocSplitter } = require('../dist/yaml-doc-splitter');

test('require() new YamlDocSplitter()', () => {
   expect(new YamlDocSplitter()).toBeInstanceOf(YamlDocSplitter);
});
