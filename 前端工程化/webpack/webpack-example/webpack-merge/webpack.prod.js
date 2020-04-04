const webpack = require('webpack')
const merge = require('webpack-merge')
const commonConfig = require('./webpack.common')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
module.exports = merge(commonConfig, {
    devtool: 'source-map',
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            // 'process.env.NODE_ENV': JSON.stringify('development')
        })
    ]
})