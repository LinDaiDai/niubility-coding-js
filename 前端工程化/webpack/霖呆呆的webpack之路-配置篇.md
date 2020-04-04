# 霖呆呆的webpack之路-配置篇

## mode

**类型**:  String

**默认值**: `"none"`

**功能**: 设置用到的模式

其它模式:

- development 开发模式(本地开发)
- production 生成模式(发布到线上环境)

在`webpack4`中, 如果将`mode`设置成`production`就会启用`webpack`内部的`uglifyjs`插件, 进入**压缩输出**.此时的`bundle`是经过了`tree shaking`和代码压缩的.

(关于`tree shaking`和压缩输出可以查看[《霖呆呆的webpack之路-优化篇》](https://github.com/LinDaiDai/webpack-document/blob/master/霖呆呆的webpack之路-优化篇.md))



## 输出(output)

### publicPath

**类型**: String | Function

**默认值**: 空字符串`""`

**功能**: 指定输出目录对应的公开URL, 影响的主要是**外部资源的引用**和`webpack-dev-server`的`publicPath`

**官网地址**: [output.publicPath](https://www.webpackjs.com/configuration/output/#output-publicpath)

**案例一**🌰:

例如我们使用`webpack`打包生成的`dist`文件目录为:

```
/dist
	|- bundle.js
	|- index.html
	|- icon.png
```

默认对于资源的引用, 比如`icon.png`的引用是这样的:

```css
.box {
	background: url('icon.png') 
}
```

如果设置了`output.publicPath`之后:

**webpack.config.js**

```javascript
...
module.exports = {
	output: {
		...
		publicPath: '/assets/'
	}
}
```

浏览器就会在资源文件的引用加上一个前缀, 变成:

```
.box {
	background: url('/assets/icon.png') 
}
```

此时, 图片就会加载失败, 因为`dist`文件夹下并没有`assets`这个文件夹.

**案例二**🌰:

影响了`webpack-dev-server`或者`webpack-dev-middleware`中的`publicPath`

如果了解过`webpack-dev-server`的小伙应该都知道, `webpack-dev-server`的内部就是使用了`webpack-dev-middleware`.

而我们在配置`webpack-dev-middleware`的时候, 是有一个可选项参数的.

比如本地编写的一个`server.js`:

```diff
// server.js
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')

const app = express()
const config = require('./webpack.config')
const compiler = webpack(config)
// 把webpack 处理后的文件传递给一个服务器
app.use(webpackDevMiddleware(compiler 
+	,{
+		publicPath: config.output.publicPath
+	}
))

app.listen(3000, function() {
    console.log('Example app listening on port 3000!\n');
})
```

如果指定了`output.publicPath`, 那就必须也指定一下这里的`publicPath`与`output`的一致, 不然,重新执行`npm run server`, 打开`localhost:3000` 会发现页面显示的是:

```
Cannot GET /
```

你需要打开`localhost:3000/assets/`才能看到正确的页面.

关于此案例具体的可以查看: [《霖呆呆的webpack之路-构建方式篇》](https://github.com/LinDaiDai/webpack-document/blob/master/霖呆呆的webpack之路-构建方式篇.md))



### library

**类型**: String | Object

**默认值**: none

**作用**: 如果你的webpack是用来配置一个library的话, 就需要用到这个属性. 它一般用来指定你编写的library向外暴露的名称.

其实它值的作用取决于`output.libraryTarget`选项的值.

一般你可以这样配置它:

```javascript
output: {
	library: "MyLirary"
}
```

如果生成的输出文件，是在 HTML 页面中作为一个 script 标签引入，则变量 `MyLibrary` 将与入口文件的返回值绑定。

### libraryTarget

**类型**: String

**默认值**: `"var"`

**作用**: 如果你的webpack是用来配置一个library的话, 就需要用到这个属性. 它需要配合`output.library`属性来用, 配置如何暴露library.

主要有以下几个值:

- 变量：作为一个全局变量，通过 `script` 标签来访问（`libraryTarget:'var'`）。
- this：通过 `this` 对象访问（`libraryTarget:'this'`）。
- window：通过 `window` 对象访问，在浏览器中（`libraryTarget:'window'`）。
- UMD：在 AMD 或 CommonJS 的 `require` 之后可访问, 也就是以上几种环境都可以访问（`libraryTarget:'umd'`）

关于此案例具体的可以查看: [《霖呆呆的webpack之路-library篇》](https://github.com/LinDaiDai/webpack-document/blob/master/霖呆呆的webpack之路-library篇.md)



## devtool

**类型**: String | false

**默认值**: none

**作用**:选择一种 [source map](http://blog.teamtreehouse.com/introduction-source-maps) 格式来增强调试过程。不同的值会明显影响到构建(build)和重新构建(rebuild)的速度。

常用的选项:

- `inline-source-map` 开发环境一般设置为这个, 可以使得报的错具体到报错的文件代码里
- `source-map` 生产环境可以设置成这个,  整个 source map 作为一个单独的文件生成。它为 bundle 添加了一个引用注释，以便开发工具知道在哪里可以找到它。



## 命令行CLI

这一小节用于介绍一些webpack常用的命令行语句.

命令行CLI也就是在package.json中编写脚本语句时的语句.

例如🌰:

**package.json**:

```javascript
{
	"scripts": {
		"build": "webpack --config webpack.config.js"
	}
}
```

我在这里配置了一个脚本命令`"build"` , 如果你执行`npm run build`的话就相当于执行后面那段webpack构建语句.



### --config

用于告诉webpack基于哪个配置文件进行构建.

默认为根目录下的`wepack.config.js`或者`webpackfile.js`.

也就是说如果你的根目录下有一个文件为`webpack.config.js`, 则在终端执行:

```
webpack --config webpack.config.js
```

与执行

```
webpack
```

效果是一样的.



### --config-register

简写为`-r`.

类型: 数组

作用: 在 webpack 配置文件加载前先预加载一个或多个模块



### `<entry>` 和 `<output>`

`<entry>`: 一个文件名或一组被命名的文件名，作为构建项目的入口起点。它将映射到配置选项 `entry`.

`<output>`: 要保存的 bundled 文件的路径和文件名。它将映射到配置选项 `output.path` 和 `output.filename`。

**示例一**🌰:

```
webpack src/index.js dist/bundle.js
```

打包源码，入口为 `index.js`，并且输出文件的路径为 `dist`，文件名为 `bundle.js`



**示例二**🌰:

```
webpack index=./src/index.js entry2=./src/index2.js dist/bundle.js
```

以多个入口的打包方式



### --env

作用: 当配置文件是一个函数时，会将环境变量传给这个函数

也就是可以通过 --env 向配置文件中传递环境变量, **可以用于在同一个配置文件中, 根据命令行传递进来的环境变量做对应处理.**

**例如**🌰:

```
webpack --env.custom=local
```

上述命令, 向环境变量中添加自定义属性`custom`.

在webpack.config.js中获取它:

```javascript
module.exports = env => {
	console.log(env.custom) // local
}
```

**注意**⚠️: 此方法并不能改变`process.env`中的`NODE_ENV`

具体案例可以查看: [《霖呆呆的webpack之路-构建方式篇》](https://github.com/LinDaiDai/webpack-document/blob/master/霖呆呆的webpack之路-构建方式篇.md)



### --mode

类型: String

默认值:  "production"

作用: 指定打包生成之后的代码中, 用到的模式.

可选值:

- production 生成环境(发布到线上的环境)
- development 开发环境(本地开发的环境)

用法:

```
webpack --mode production
```

具体案例可以查看: [《霖呆呆的webpack之路-构建方式篇》](https://github.com/LinDaiDai/webpack-document/blob/master/霖呆呆的webpack之路-构建方式篇.md)



### --devtool

类型: String

默认值: none

作用: 为打包好的资源定义 [source map 的类型], 等同于配置中的`devtool`选项.

用法:

```
webpack --devtool inline-source-map
```



### --debug

类型: Boolean

默认值: `false`

作用: 把 loader 设置为 debug 模式



### --progress

类型: Boolean

默认值: `false`

作用: 打印出编译进度的百分比值



### --display-error-details

类型: Boolean

默认值: `false`

作用: 展示错误细节



### --output-pathinfo

类型: Boolean

默认值: `false`

作用: 加入一些依赖的注解信息



### --watch

类型: Boolean

默认值: `false`

简写: `-w`

作用: 观察文件系统的变化

观察者模式, 只需要在`package.json`里配置一个脚本命令:

```javascript
"scripts": {
	"watch": "webpack --watch"
}
```

使用`npm run watch`命令之后, 会看到编译过程, 但是不会退出命令行, 而是实时监控文件.

比如你在重新修改了本地的代码并保存后, 它会重新进行编译, 不需要我们手动再执行编译指令, 缺点**是你需要手动刷新页面**才能看到更改效果.



### --optimize-minimize

作用: 压缩混淆 javascript，并且把 loader 设置为 minimizing

使用插件: [UglifyJsPlugin](https://www.webpackjs.com/plugins/uglifyjs-webpack-plugin/) & [LoaderOptionsPlugin](https://www.webpackjs.com/plugins/loader-options-plugin/)



### --define

作用: 定义 bundle 中的任意自由变量

用法:

```
webpack --define process.env.NODE_ENV='development'
```



### --hot

作用: 开启模块热替换

用法:

```
webpack --hot=true
```



### --target

作用: 目标的执行环境

用法:

```
webpack --target='node'
```



### -d

为以下命令的简写:

```
--debug --devtool cheap-module-eval-source-map --output-pathinfo
```

- 开启loader的debug模式
- 将devtool设置成`cheap-module-eval-source-map`
- 加入一些依赖的注解信息



### -p

为以下命令的简写:

```
--optimize-minimize --define process.env.NODE_ENV="production"
```

- 压缩混淆 javascript，并且把 loader 设置为 minimizing
- 定义环境变量`NODE_ENV`为`production`