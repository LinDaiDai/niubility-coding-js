const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: './src/main.js',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: { // 开发环境
        contentBase: './dist',
        open: true
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue'] // // 将 `.ts` 添加为一个可解析的扩展名。
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    // hotReload: false // 关闭热重载(但是还是会Reload, 不会HMR)
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader', // 热重载(必须在css-loader上面)
                    // 'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            // {
            //     test: /\.(sa|sc|c)ss$/,
            //     use: [{
            //             loader: MiniCssExtractPlugin.loader,
            //             options: {
            //                 hmr: process.env.NODE_ENV === 'development',
            //             },
            //         },
            //         'vue-style-loader',
            //         'css-loader',
            //         'sass-loader',
            //     ],
            // },
            {
                test: /.(png|jpg|svg|gif)$/,
                // use: [{
                //     loader: 'file-loader',
                //     options: {
                //         esModule: false // 配置此选项保证能在html中加载图片路径
                //     }
                // }]
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 70000, // 大于该值则交给 file-loader 处理
                        esModule: false // 配置此选项保证能在html中加载图片路径
                    }
                }]
            },
            {
                test: /.js$/,
                exclude: file => ( // 排除依赖 && 但是保证依赖文件夹中的vue单文件
                    /node_modules/.test(file) &&
                    !/\.vue\.js/.test(file)
                ),
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }]
            },
            {
                test: /.ts$/,
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/] // 保证.vue文件中的script能使用lang="ts"
                }
            },
            {
                enforce: 'pre',
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                options: {
                    "failOnError": true
                },
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'webpack-vue',
            template: './public/index.html'
        }),
        new VueLoaderPlugin()
        // new MiniCssExtractPlugin({
        //     // Options similar to the same options in webpackOptions.output
        //     // both options are optional
        //     filename: devMode ? '[name].css' : '[name].[hash].css',
        //     chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        // })
    ]
}