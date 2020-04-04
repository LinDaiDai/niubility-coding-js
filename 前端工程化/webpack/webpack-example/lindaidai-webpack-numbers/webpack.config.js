const path = require('path')
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'webpack-numbers.js'
            // library: 'webpackNumbers',
            // libraryTarget: 'umd' // 将你的 library 暴露为所有的模块定义下都可运行的方式
    }
    // externals: {
    //     lodash: {
    //         commonjs: 'lodash',
    //         commonjs2: 'lodash',
    //         amd: 'lodash',
    //         root: '_'
    //     }
    // }
}