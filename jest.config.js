module.exports = {
   moduleFileExtensions: ['mjs', 'js', 'jsx', 'ts', 'tsx', 'json', 'node'],
   testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
   testPathIgnorePatterns: ['/node_modules/', '/cypress/', '/examples/'],
   transform: {
      '^.+\\.m?js$': 'babel-jest',
      '\\.[jt]sx?$': 'babel-jest'
   },
   transformIgnorePatterns: ['\\.pnp\\.[^\\/]+$']
}
