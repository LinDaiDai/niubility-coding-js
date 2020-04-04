# 霖呆呆的webpack之路-构建方式篇

## 一、几种开发工具

每次要编译代码时，手动运行 `npm run build` 就会变得很麻烦。

不知道你有没有使用过类似于`vue-cli`这样的脚手架工具, 在使用它们的时候, 每次只要执行`npm run start`这样的指令就可以创建一个本地的`web`服务器, 然后打开一个例如`localhost:8080`这样的端口页面, 同时还有热更新等功能.

其实这些功能的实现都是`vue-cli`内部使用了一些`webpack`的开发工具.

webpack 中有几个不同的选项，可以帮助你在代码发生变化后自动编译代码.

**(以下教材案例GitHub地址: [LinDaidai/webpak-server])**

### webpack's Watch Mode(观察者模式)

观察者模式, 只需要在`package.json`里配置一个脚本命令:

```javascript
"scripts": {
	"watch": "webpack --watch"
}
```

使用`npm run watch`命令之后, 会看到编译过程, 但是不会退出命令行, 而是实时监控文件.

比如你在重新修改了本地的代码并保存后, 它会重新进行编译, 不需要我们手动再执行编译指令, 缺点**是你需要手动刷新页面**才能看到更改效果.

(`--watch`也可以简写为`-w`)

### webpack-dev-server

使用`webpack-dev-server`会为你提供一个简单的web服务器, 它的作用就是监听文件的改变并自动编译, **同时会自动刷新页面**. 比观察者模式厉害.

使用步骤:

- 安装: `$ npm i --save-dev webpack-dev-server`

- 添加脚本命令: `"start": "webpack-dev-server --open"`

**使用此指令效果**:

不会生成`dist`文件夹, 而是开启了一个本地的web服务器`localhost:8080`

每次修改了本地代码之后, 都会重新自动编译, 并刷新页面

**其它配置项**:

`webpack-dev-server`也有很多配置项能在`webpack.config.js`中配置

只需要在`devServer`里进行配置, 例如:

```javascript
module.exports = {
	devServer: {
		contentBase: './dist', // 告诉服务器从哪里提供内容
		host: '0.0.0.0', // 默认是 localhost
		port: 8000, // 端口号, 默认是8080
    open: true, // 是否自动打开浏览器
		hot: true, // 启用 webpack 的模块热替换特性
		hotOnly: true // 当编译失败之后不进行热更新
	}
}
```

如果你使用了这个功能之后, 你就会发现, 它就有点`vue-cli`的样子了.

更多关于`devServer`的配置可以查看这里: [开发中Server](https://www.webpackjs.com/configuration/dev-server/)



### webpack-dev-middleware

#### 基本使用

`webpack-dev-middleware` 是一个容器(wrapper)，它可以把 webpack 处理后的文件传递给一个服务器(server)。 

`webpack-dev-server` 能够开启一个本地的`web`服务器, 就是因为在内部使用了它，但是, 它也可以作为一个包来单独使用.

这里我就以官方的案例来进行讲解.

使用`webpack-dev-middleware`配合`express server`来介绍它的功能.

先来说下我的需求, 我想要实现一个这个功能:

- 配置一条`script`指令让它能运行一个本地`web`服务器(也就是能够在`localhost: 3000`中查看页面)
- 每次修改本地代码能够重新编译
- 但是不会自动刷新页面

1. **安装所需的依赖**:

```
$ npm i --save-dev webpack-dev-middleware express
```

2. **在项目的根目录下创建一个`server.js`文件用来编写本地服务**:

```javascript
// server.js
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')

const app = express()
const config = require('./webpack.config')
const compiler = webpack(config)
    // 把webpack 处理后的文件传递给一个服务器
app.use(webpackDevMiddleware(compiler))

app.listen(3000, function() {
    console.log('Example app listening on port 3000!\n');
})
```

3. **在`package.json`里配置指令运行`server.js`**:

```json
{
  "scripts": {
		"server": "node server.js"
	}
}
```

#### publicPath配置项

在学习这里的时候, 我顺便也了解到了`webpack.config.js` 中`output`的另一个属性`publicPath`.

开始看文档 [output.outputPath](https://www.webpackjs.com/configuration/output/#output-publicpath)的时候没太看懂.

后来我结合`webpack-dev-middleware`来试了一下它.

首先修改一下`webpack.config.js`的配置:

```diff
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    entry: {
        app: './src/index.js',
        print: './src/print.js'
    },
    devtool: 'inline-source-map', // 仅开发环境报错追踪
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
+        publicPath: '/assets/'
    }
}
```

然后修改一下`server.js`:

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

保存上面👆两个文件, 然后重新执行`npm run server`, 打开`localhost:3000` 会发现页面显示的是:

 ```html
Cannot GET /
 ```

你需要打开`localhost:3000/assets/`才能看到正确的页面.

并且如果项目里有对资源的引用的话, 也会自动加上`publicPath`的前缀:

```
icon.png => 变为 /assets/icon.png
```



**注**⚠️:

如果没有配置`output.publicPath`和`webpack-dev-middleware`的`publicPath`, 则默认都会以根目录`/`作为配置项.

如果配置了`output.publicPath`, 则`webpack-dev-middleware`中的`publicPath`也要和它一样才行.



## 二、不同环境的构建

开发环境和生产环境的构建目标差异是非常大的.

- 开发环境中, 我们可能有实时重新加载(live reloading) 、热模块替换(hot module replacement)等能力
- 生产环境中, 我们更加关注更小的bundle(压缩输出), 更轻量的source map, 还有更优化的资源等.

所以为了遵循逻辑分离, 我们可以为每个环境编写彼此独立的webpack配置.

虽说是想要编写各自独立的配置, 但是肯定也有一些公用的配置项, 我们可以将这些公用的配置项提取出来, 然后不同的配置写在不同的文件中.

**(以下教材案例GitHub地址: [LinDaidai/webpak-merge])**

### webpack-merge

最终, 为了将这些配置项合并在一起, 我们需要用到`webpack-merge`工具.

首先安装这个工具:

```
$ npm i --save-dev webpack-merge
```

然后让我们将原本的`webpack.config.js`拆开, 编写成三个不同的webpack配置文件:

```diff
  webpack-demo
  |- package.json
- |- webpack.config.js
+ |- webpack.common.js
+ |- webpack.dev.js
+ |- webpack.prod.js
  |- /dist
  |- /src
    |- index.js
    |- math.js
  |- /node_modules
```

**webpack.common.js**:

```javascript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'webpack bundle'
        })
    ]
}
```

**webpack.dev.js**:

```javascript
const merge = require('webpack-merge')
const commonConfig = require('./webpack.common')

module.exports = merge(commonConfig, {
    devtool: 'inline-source-map', // 错误追踪
    devServer: { // 设置 webpack-dev-server 监听的文件
        contentBase: './dist'
    }
})
```

**webpack.prod.js**:

```javascript
const merge = require('webpack-merge')
const commonConfig = require('./webpack.common')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = merge(commonConfig, {
    plugins: [
        new UglifyJSPlugin() // 压缩输出
    ]
})
```

可以看到, `webpack-merge`的功能就是将多个`webpack`的配置合并成一个.

现在让我们再来配置一下`package.json`的脚本命令:

**package.json**:

```json
{
    "name": "webpack-bundle",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "start": "webpack-dev-server --open --config webpack.dev.js",
        "build": "webpack --config webpack.prod.js"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
        "clean-webpack-plugin": "^3.0.0",
        "html-webpack-plugin": "^3.2.0",
        "uglifyjs-webpack-plugin": "^2.2.0",
        "webpack": "^4.41.5",
        "webpack-cli": "^3.3.10",
        "webpack-dev-server": "^3.10.3",
        "webpack-merge": "^4.2.2"
    }
}
```

- 执行`npm run start`为开发环境, 会自动打开`localhost:8080`页面并且有自动重载功能
- 执行`npm run build`为生产环境, 会打包生成`dist`文件夹, 且`bundle`中`js`为压缩过后的代码.



### process.env.NODE_ENV

#### 基本用法

`process.env.NODE_ENV`的作用主要是帮我们判断是开发环境(development)还是生产环境(production).

技术上讲，`NODE_ENV` 是一个由 Node.js 暴露给执行脚本的系统环境变量。

1. 你可以在任何`src`的本地代码中引用到它:

```javascript
// print.js
export function print() {
    console.log(process.env.NODE_ENV) // development 或者 prodution
}
```

2. 但是你在`webpack.config.js`中却获取不到它, 打印出来是`undefined`.所以像以下代码是**不能像预期一样实现的**:

```javascript
process.env.NODE_ENV === 'production' ? '[name].[hash].bundle.js' : '[name].bundle.js'
```

#### webpack.DefinePlugin插件

之前介绍过了, 我们是不能在`webpack.config.js`中获取到`process.env.NODE_ENV`的值的, 但是我们可以使用`webpack`内置的`DefinePlugin`插件来修改这个变量.

例如我在`webpack.prod.js`中的配置:

```diff
+ const webpack = require('webpack');
  const merge = require('webpack-merge');
  const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
  const commonConfig = require('./webpack.common.js');

  module.exports = merge(commonConfig, {
    devtool: 'source-map',
    plugins: [
      new UglifyJSPlugin({
        sourceMap: true
-     })
+     }),
+     new webpack.DefinePlugin({
+       'process.env.NODE_ENV': JSON.stringify('production')
+     })
    ]
  });
```

使用`webpack.DefinePlugin()`方法修改了`process.env.NODE_ENV`.

你可以设置成`JSON.stringify('production')`, 也可以设置成:

```javascript
new webpack.DefinePlugin({
      'process.env': {
          'NODE_ENV': `"production"`
      }
  })
```

#### 命令行配置模式mode

除了使用`webpack.DefinePlugin`插件来修改环境变量的模式, 还可以在命令行中修改它:

```
webpack --mode=production
或者
webpack --mode=development
```

使用了`--mode`设置环境变量模式, 在本地代码上获取到的`process.env.NODE_ENV`的值就是`mode`的值.

**不过如果你同时在命令行中设置的`--mode`, 又使用了`webpac.definePlugin`插件, 后者的优先级高点.**



#### 命令行传递环境变量

如果我们在命令行中通过`--env`来设置一些变量值, 这些变量值能使我们在webpack.config.js的配置中访问到.

**在webpack命令行配置中, 通过设置 `--env` 可以使你根据需要，传入尽可能多的环境变量**

例如我新建了一个命令行:

```diff
{
	"scripts": {
		"start": "webpack-dev-server --open --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js",
+   "local": "webpack --env.custom=local --env.production --progress --config webpack.local.js"
	}
}
```

拆开来看:

- `--env.custom=local` 给环境变量中设置一个自定义的属性 `custom`, 它的值为`local`
- `--env.production`  设置`env.production == true`(这里的`env`并不会影响`process.env`)
- `--progress` 打印出编译进度的百分比值
- `--config webpack.local.js` 以`webpack.local.js`中的内容执行webpack构建

同时我在项目根目录下创建一个`wepack.local.js`:

```javascript
const commonConfig = require('./webpack.common')
const merge = require('webpack-merge')

module.exports = env => {
    console.log('custom: ', env.custom) // 'local'
    console.log('Production: ', env.production) // true
    return merge(commonConfig, {})
}
```

可以看到它与普遍的`webpack.config.js`的区别在于, 它导出的是一个函数, 且这个函数中能访问`env`环境变量.

这样我们就可以将在命令行中设置的变量获取到了.

#### 命令行传递环境变量判断NODE_ENV

还记得我们之前说, 在`webpack.config.js`中是不能获取到环境变量`process.env.NODE_ENV` , 也就是不能做以下判断:

```
process.env.NODE_ENV === 'production' ? '[name].[hash].bundle.js' : '[name].bundle.js'
```

但是现在我们在命令行里传递一个变量进去, 比如叫做`NODE_ENV`, 这样就可以在`webpack.config.js`里作区分了.

让我们在根目录下创建一个名为`webpack.combine.js`的配置文件:

**webpack.combine.js**:

```javascript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = env => {
    return {
        entry: './src/index.js',
        output: {
            filename: env.NODE_ENV === 'production' ? '[name].[hash].bundle.js' : '[name].bundle.js',
            path: path.resolve(__dirname, 'dist')
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                title: '合并成同一个webpack配置'
            })
        ]
    }
}
```

我们可以看到`ouput.filename`,可以通过`NODE_ENV`来判断.

所以我需要在`package.json` 中进行参数的传递:

```diff
{
    "name": "webpack-bundle",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "start": "webpack-dev-server --open --config webpack.dev.js",
        "build": "webpack --config webpack.prod.js",
        "local": "webpack --env.custom=local --env.production=false --mode=development --progress --config webpack.local.js",
+       "combine-dev": "webpack --env.NODE_ENV=development --config webpack.combine.js",
+       "combine-prod": "webpack --env.NODE_ENV=production --config webpack.combine.js"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
        "clean-webpack-plugin": "^3.0.0",
        "html-webpack-plugin": "^3.2.0",
        "lodash": "^4.17.15",
        "uglifyjs-webpack-plugin": "^2.2.0",
        "webpack": "^4.41.5",
        "webpack-cli": "^3.3.10",
        "webpack-dev-server": "^3.10.3",
        "webpack-merge": "^4.2.2"
    }
}
```

现在分别执行`combine-dev`和`combine-prod`, 可以看到生成的bundle又不同的效果.

`combine-dev`生成的js文件是`main.bundle.js`

`combine-prod`生成的js文件是`main.a79eb0c94212b905d48b.bundle.js`

**但是有一点需要注意的是这里的env.NODE_ENV并不是process.env.NODE_ENV**, 所以它并不能改变process.env.

也就是说不管你通过哪种方式生成的页面, 你在页面中获取到的`process.env.NODE_ENV`都还是`production`.



### 总结

**第二节中所有案例的GitHub地址: [LinDaiDai/webpack-merge]()**

- 可以安装webpack-merge工具帮助我们将多个配置文件合并成一个
- 在webpack.config.js获取不到环境变量`process`
- 可以通过webpack.DefinePlugin插件帮助我们修改process.env的值
- 还可以通过命令行CLI中的 --mode 来修改环境变量的模式
- 若是webpack.config.js导出的是一个函数, 则允许我们在命令行中用 --env 传递环境变量