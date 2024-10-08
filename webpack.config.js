const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
// const dotenv = require('dotenv');
// const env = dotenv.config().parsed;
// const env = require('cross-env')
const Dotenv = require('dotenv-webpack')
const BUCKET_NAME = process.env.REACT_APP_BUCKET_NAME || 'development';


// const envKeys = Object.keys(env).reduce((prev, next) => {
//   prev[`process.env.${next}`] = JSON.stringify(env[next]);
//   return prev;
// }, {});
module.exports = {
  entry: path.join(__dirname, "src", "index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  devServer: {
    hot: true,
    port: 8088,
    allowedHosts: "all",
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.json$/, // Matches JSON files
        use: {
          loader: "json-loader", // Use json-loader to handle JSON files
        },
      },
      {
        test: /\.?(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        exclude: /node_modules/,
        use: ["file-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".*", ".js", ".jsx"],
    fallback: {
      fs: false,
      buffer: require.resolve("buffer/"),
    },
    alias: {
      process: "process/browser",
    },
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
    }),
    new webpack.DefinePlugin({
      // "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      // "process.env.MY_ENV": JSON.stringify(process.env.MY_ENV),
    //   'process.env': {
    //     'BUCKET_NAME': JSON.stringify(BUCKET_NAME)
    // }
    }),
    // new webpack.DefinePlugin(envKeys),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ],
};
