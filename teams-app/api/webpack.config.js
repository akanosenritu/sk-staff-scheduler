const path = require("path")
module.exports = {
  mode: "development",
  entry: {
    "userSchedule": "./userSchedule/index.ts"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader"
      }
    ]
  },
  target: "node",
  resolve: {
    extensions: [
      ".ts", ".js"
    ],
    alias: {
      "cldr$": "cldrjs",
      "cldr": "cldrjs/dist/cldr"
    }
  },
  output: {
    clean: true,
    filename: "[name]/index.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs",
  },
  externals: {
    bufferutil: "bufferutil",
    "utf-8-validate": "utf-8-validate",
  }
}