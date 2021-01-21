const path = require('path');
const CleanPlugin = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    index:"./src/app.js"
    },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist", "assets", "scripts"),
    publicPath: 'assets/scripts/'
  }, 
  devServer: {
    contentBase: './'
  },
  devtool: "cheap-module-eval-source-map",
  plugins: [
    new CleanPlugin.CleanWebpackPlugin()
  ]

};