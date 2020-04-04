

### Babel的几种配置方式

在使用上来说, Babel是有几种配置方式的:

1. 如果你使用**[monorepo](https://segmentfault.com/a/1190000019309820?utm_source=tag-newest)**或者你需要**编译node_modules**则可以用`babel.config.js`的方式
2. 如果你仅适用于简单单个软件包的静态配置则可以用`.babelrc`的方式
3. 另外还可以直接在`package.json`中进行配置
4. 在`webapck` 中通过`babel-loader`进行配置

