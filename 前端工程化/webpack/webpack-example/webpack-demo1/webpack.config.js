const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    // mode: 'none',
    entry: [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', // 热更新, 无效
        './src/index.js'
    ],
    devServer: {
        contentBase: './dist',
        open: true
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ['dist']
        }),
        new HtmlWebpackPlugin({
            title: 'html-webpack',
            filename: 'index.html',
            template: './src/index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.(jpg|png|svg|gif)$/,
                use: [
                    "file-loader"
                ]
            }
        ]
    }
}