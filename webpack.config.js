const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.jsx",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
    publicPath: "/",
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },

      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
        ],
      },
    ],
  },

  resolve: {
    extensions: [".js", ".jsx"],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./public/jogadores.txt",
          to: "jogadores.txt",
        },

        {
          from: "./public/cards.txt",
          to: "cards.txt",
        },

        {
          from: "./public/fotos",
          to: "fotos",
        },
      ],
    }),
  ],

  devServer: {
    port: 3000,
    open: true,
    historyApiFallback: true,
  },
};