'use strict'
const { VueLoaderPlugin } = require('vue-loader')
var path = require('path');

module.exports = {
  mode: 'development',
  entry: [
    './demo/app.js'
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      }, {
        test: /\.scss$/,
        use: [
          "style-loader", // creates style nodes from JS strings
          "css-loader", // translates CSS into CommonJS
          "sass-loader" // compiles Sass to CSS, using Node Sass by default
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
  ],
  output: {
    path: path.resolve(__dirname, 'demo/built')
  }
}