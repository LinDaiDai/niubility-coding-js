const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // webpack3
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const extractLess = new ExtractTextPlugin({
    filename: "[name].[hash].css",
    disable: process.env.NODE_ENV === "development"
});

const miniCssExtract = new MiniCssExtractPlugin({
    filename: "[name].[hash].css",
    disable: process.env.NODE_ENV === "development"
})

module.exports = {
    entry: {
        index: './src/index.js'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin(),
        extractLess
        // miniCssExtract
    ],
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
    module: {
        rules: [{
                test: /.txt$/,
                use: 'raw-loader' // 获取到内容
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    // 'file-loader' // 得到的是bundle中的相对路径 4sj89003nknkdsdf.png
                    {
                        loader: 'file-loader',
                        // loader: 'url-loader', // 得到的是base64格式: data:image/png;base64
                        options: {
                            esModule: false
                                // limit: 30000,
                                // mimetype: 'image/jpg'
                        }
                    }
                ]
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader?classPrefix'
            },
            {
                test: /\.ts$/,
                use: 'ts-loader'
            },
            {
                test: /.css$/,
                // use: [ // 普通用法
                //     "style-loader",
                //     "css-loader",
                //     "less-loader"
                // ]
                // use: [
                //         MiniCssExtractPlugin.loader,
                //         'style-loader',
                //         'css-loader'
                //     ]
                use: extractLess.extract({ // webpack3
                    use: [{
                        loader: "css-loader"
                    }],
                    fallback: "style-loader"
                })
            },
            {
                test: /.less$/,
                // use: [{ // 普通用法
                //     loader: "style-loader" // creates style nodes from JS strings
                // }, {
                //     loader: "css-loader" // translates CSS into CommonJS
                // }, {
                //     loader: "less-loader" // compiles Less to CSS
                // }]
                use: extractLess.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                test: /\.js/,
                exclude: /(node_modules|bower_components)/,
                use: [{
                        loader: 'eslint-loader'
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true, // 开启缓存, 缓存到系统
                            presets: ['@babel/preset-env'], // ES6+ 转ES5
                            plugins: ['@babel/plugin-transform-runtime'] // (报错)
                                // plugins: [require('@babel/plugin-transform-arrow-functions')] // 单独使用插件
                        }
                    }
                ]
            }
        ]
    }
}