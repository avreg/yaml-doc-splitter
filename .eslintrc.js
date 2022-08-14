module.exports = {
   root: true,
   env: {
      browser: false,
      commonjs: false,
      node: true,
      es6: true,
      es2021: true,
      'jest/globals': true
   },
   parser: '@typescript-eslint/parser',
   parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module'
   },
   plugins: ['prettier', 'promise', '@typescript-eslint', 'jest'],
   extends: [
      'standard',
      'eslint:recommended',
      'plugin:node/recommended',
      'plugin:promise/recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier'
   ],
   rules: {
      semi: 'error',
      curly: ['error'],
      'brace-style': ['error', '1tbs', { allowSingleLine: false }],
      'no-process-exit': 'off',
      'node/no-process-exit': ['error'],
      'prettier/prettier': 'error', // Обязательно!! Подсвечивает ошибки из Prettier.
      'node/exports-style': ['error', 'module.exports'],
      'node/file-extension-in-import': 'off',
      'node/no-unpublished-import': 'off',
      'node/no-missing-import': 'off',
      'node/prefer-global/buffer': ['error', 'always'],
      'node/prefer-global/console': ['error', 'always'],
      'node/prefer-global/process': ['error', 'always'],
      'node/prefer-global/url-search-params': ['error', 'always'],
      'node/prefer-global/url': ['error', 'always'],
      'node/prefer-promises/dns': 'error',
      'node/prefer-promises/fs': 'error',
      'node/no-extraneous-require': [
         'error',
         {
            allowModules: ['minimist']
         }
      ],
      'node/no-unsupported-features/es-syntax': 0,
      'node/no-unsupported-features/es-builtins': 0,
      'promise/always-return': 'error',
      'promise/no-return-wrap': 'error',
      'promise/param-names': 'error',
      'promise/catch-or-return': 'error',
      'promise/no-native': 'off',
      'promise/no-nesting': 'warn',
      'promise/no-promise-in-callback': 'warn',
      'promise/no-callback-in-promise': 'warn',
      'promise/avoid-new': 'warn',
      'promise/no-new-statics': 'error',
      'promise/no-return-in-finally': 'warn',
      'promise/valid-params': 'warn',
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error'
   }
}
