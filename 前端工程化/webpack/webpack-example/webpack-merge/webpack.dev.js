const webpack = require('webpack')
const merge = require('webpack-merge')
const commonConfig = require('./webpack.common')

module.exports = merge(commonConfig, {
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new webpack.DefinePlugin({
            // 'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
})