/* eslint-disable @typescript-eslint/no-var-requires */
const TerserPlugin = require('terser-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const path = require('path')

module.exports = (env, argv) => {
   const isProductionBuild = env.production || argv.mode === 'production'

   return {
      target: 'node',

      mode: isProductionBuild ? 'production' : 'development',
      devtool: isProductionBuild ? 'source-map' : 'eval-source-map',

      entry: './src/index.ts', // webpack entry point. Module to start building dependency graph

      output: {
         path: path.join(__dirname, 'dist'), // Folder to store generated bundle
         filename: 'yaml-doc-splitter.js', // Name of generated bundle after build
         library: {
            type: 'commonjs2'
         },
         globalObject: "typeof self === 'undefined' ? this : self"
      },
      resolve: {
         // Add '.ts' and '.tsx' as resolvable extensions.
         extensions: [
            '',
            '.webpack.js',
            '.web.js',
            '.ts',
            '.tsx',
            '.js',
            '.cjs',
            '.mjs'
         ]
      },
      module: {
         rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.tsx?$/, loader: 'ts-loader' },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.[mc]?js$/, loader: 'source-map-loader' }
         ]
      },
      plugins: [new ESLintPlugin({ extensions: ['ts'] })],
      optimization: {
         minimize: isProductionBuild,
         minimizer: [new TerserPlugin()]
      }
   }
}
