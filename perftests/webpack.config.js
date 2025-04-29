import {CleanWebpackPlugin} from "clean-webpack-plugin";
import path, {dirname} from "path";
import GlobEntries from "webpack-glob-entries";
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default {
  mode: "production",
  entry: GlobEntries("./src/*-test.js"), // Generates multiple entry for each test
  output: {
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs",
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        // by default, it resolves `node_modules`
      },
    ],
  },
  stats: {
    colors: true,
  },
  plugins: [new CleanWebpackPlugin()],
  externals: /^(k6|https?\:\/\/)(\/.*)?/,
};
