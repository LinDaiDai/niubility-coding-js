## 描述

此项目为《霖呆呆的 webpack 之路-构建方式篇》中的教材案例.

主要讲解了以下功能:

- 可以安装 webpack-merge 工具帮助我们将多个配置文件合并成一个
- 在 webpack.config.js 获取不到环境变量`process`
- 可以通过 webpack.DefinePlugin 插件帮助我们修改 process.env 的值
- 还可以通过命令行 CLI 中的 --mode 来修改环境变量的模式
- 若是 webpack.config.js 导出的是一个函数, 则允许我们在命令行中用 --env 传递环境变量
