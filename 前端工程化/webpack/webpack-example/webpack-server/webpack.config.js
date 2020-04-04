const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    entry: {
        app: './src/index.js',
        print: './src/print.js'
    },
    devtool: 'inline-source-map', // 仅开发环境报错追踪
    devServer: { // webpack-dev-server
        contentBase: './dist', // 告诉服务器从哪里提供内容, 默认就会取output的输出文件夹
        host: '0.0.0.0', // 默认是 localhost
        port: 8000, // 端口号, 默认是8080
        open: true, // 是否自动打开浏览器
        hot: true, // 启用 webpack 的模块热替换特性
        hotOnly: true // 当编译失败之后不进行热更新
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ['dist']
        }),
        new HtmlWebpackPlugin({
            title: 'Webpack Output2',
            filename: 'index.html',
            template: 'src/index.html'
        })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/assets/'
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(jpg|png|svg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    }
}