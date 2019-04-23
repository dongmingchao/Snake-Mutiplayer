const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const StartServerPlugin = require("start-server-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const root = path.normalize(`${__dirname}`);

module.exports = {
    entry: ["webpack/hot/poll?1000", "./server/index"],
    watch: true,
    mode: 'development',
    target: "node",
    externals: [nodeExternals({
        whitelist: ["webpack/hot/poll?1000"]
    })],
    module: {
        rules: [{
            test: /\.js?$/,
            exclude: /node_modules/
        }, {
            test: /\.coffee$/,
            use: ['coffee-loader']
        }]
    },
    plugins: [
        new CleanWebpackPlugin([path.join(root, '.build')]),
        new StartServerPlugin("server.js"),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                BUILD_TARGET: JSON.stringify("server")
            },
        }),
    ],
    output: {
        path: path.join(__dirname, ".build"),
        filename: "server.js"
    },
};