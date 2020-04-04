const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        index: './src/index.js',
        another: './src/another-module.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'webpack3'
        })
        // new webpack.optimize.CommonsChunkPlugin({ // 打开此备注进行代码分离
        //     name: 'common'
        // })
    ]
}