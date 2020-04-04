const commonConfig = require('./webpack.common')
const merge = require('webpack-merge')

module.exports = env => {
    console.log('NODE_ENV: ', env.NODE_ENV) // 'local'
    console.log('custom: ', env.custom) // 'local'
    console.log('Production: ', env.production) // true
    return merge(commonConfig, {})
}