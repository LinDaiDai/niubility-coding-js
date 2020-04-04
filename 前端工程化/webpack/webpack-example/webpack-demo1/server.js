const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const config = require('./webpack.config')

const compiler = webpack(config)
const app = express()

app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}))
app.use(webpackHotMiddleware(compiler, { // 热更新, 无效
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
}))

app.listen(3000, function() {
    console.log('listen 3000...')
})