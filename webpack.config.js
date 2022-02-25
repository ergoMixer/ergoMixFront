const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: [
    'react-hot-loader/patch',
    'regenerator-runtime/runtime.js',
    './src/index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|gif|jpe?g)$/,
        type: 'asset/resource'
      },
      {
        test: /\.s?[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // // Compiles Sass to CSS
          // "sass-loader",
          {
            loader: 'resolve-url-loader',
            options: {}
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: true, // <-- !!IMPORTANT!!
            }
          }
        ],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      }
    ]
  },
  devServer: {
    'static': {
      directory: './dist'
    },
    historyApiFallback: {
      rewrites: [
        { from: /.*\..*/, to: (context) => {
          return '/' + context.parsedUrl.pathname.split('/').pop(); // gets just the filename and retrieves it from root where devserver serves it
        } },
        { from: /^.*\/$/, to: '/index.html' },
      ],
    },
  },
  plugins: [
    new CopyPlugin({
      patterns: [{
        from: 'public',
        filter: (filePath) => !filePath.includes('index_template.html')
      }],
    }),
    new HtmlWebpackPlugin({
      template: 'public/index_template.html',
      inject: true,
      filename: 'index.html',
      templateParameters: {
        backendUri: process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:9000/'
      }
    }),
    new webpack.ContextReplacementPlugin(
        /ergo-lib-wasm-browser/,
        (data) => {
            delete data.dependencies[0].critical;
            return data;
        },
    ),
    // Work around for Buffer is undefined:
    // https://github.com/webpack/changelog-v5/issues/10
    // Necessary for some buffer calls done throughout
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    })
  ],
  resolve:{
    fallback: { "stream": require.resolve("stream-browserify") },
  },
  experiments: {
    asyncWebAssembly: true
    // syncWebAssembly: true
  }
};

module.exports = config;

// npm install resolve-url-loader sass-loader sass webpack --save-dev
// @mui/styles interpolate-html-plugin sass-loader react-redux stream-browserify buffer @coinbarn/ergo-ts@latest @testing-library/jest-dom@latest @testing-library/react@latest @testing-library/user-event@latest ergo-lib-wasm-browser@latest json-bigint@latest react@latest react-dom@latest react-hot-loader@latest @babel/core@latest @babel/preset-env@latest @babel/preset-react@latest @hot-loader/react-dom@latest babel-loader@latest copy-webpack-plugin@latest css-loader@latest file-loader@latest html-webpack-plugin@latest regenerator-runtime@latest style-loader@latest url-loader@latest wasm-loader@latest webpack@latest webpack-cli@latest webpack-dev-server@latest @vigosan/react-copy-to-clipboard@latest as-bind@latest axios@latest bootstrap@latest dotenv@latest font-awesome@latest @mui/material @emotion/react @emotion/styled @mui/icons-material moment@latest node-sass@latest react-notifications@latest react-qr-code@latest react-router@latest react-router-dom@latest react-toastify@latest @reduxjs/toolkit@latest assemblyscript@latest