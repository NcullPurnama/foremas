const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');  // <-- import plugin

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  // hapus saja devServer.static bagian public kalau mau deploy ke produksi,
  // karena ini hanya untuk dev server
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    ],
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: '' },  // copy semua dari public ke dist root
      ],
    }),
  ],
  mode: 'production',  // ganti mode jadi production untuk build yang optimal
};
