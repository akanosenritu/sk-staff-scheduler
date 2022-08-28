const path = require("path")
module.exports = {
  mode: "development",
  entry: {
    "get-groups": "./get-groups/index.ts",
    "get-user-schedule": "./get-user-schedule/index.ts",
    "get-user-schedules-by-group": "./get-user-schedules-by-group/index.ts",
    "update-or-create-user-schedule": "./update-or-create-user-schedule/index.ts"
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
    ]
  },
  output: {
    clean: true,
    filename: "[name]/index.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs",
  }
}