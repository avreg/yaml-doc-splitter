/* eslint-disable @typescript-eslint/no-var-requires */
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const path = require('path')

module.exports = (env, argv) => {
   const isProductionBuild = env.production || argv.mode === 'production'

   return {
      target: 'node',

      mode: isProductionBuild ? 'production' : 'development',
      devtool: isProductionBuild ? 'source-map' : 'eval',

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
      optimization: {
         minimize: isProductionBuild,
         minimizer: [new TerserPlugin()]
      },

      plugins: [
         /**
          * All files inside webpack's output.path directory will be removed once, but the
          * directory itself will not be. If using webpack 4+'s default configuration,
          * everything under <PROJECT_DIR>/dist/ will be removed.
          * Use cleanOnceBeforeBuildPatterns to override this behavior.
          *
          * During rebuilds, all webpack assets that are not used anymore
          * will be removed automatically.
          *
          * See `Options and Defaults` for information
          */
         new CleanWebpackPlugin()
      ]
   }
}
