import { YamlDocSplitter } from '../dist/yaml-doc-splitter'

test('new YamlDocSplitter()', () => {
   expect(new YamlDocSplitter()).toBeInstanceOf(YamlDocSplitter)
})
