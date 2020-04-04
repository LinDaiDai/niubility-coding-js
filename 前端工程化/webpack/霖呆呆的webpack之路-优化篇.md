# 霖呆呆的webpack之路-优化篇

## 一、删除未引用代码

在实际开发中, 我们无意间可能会产生很多未使用的代码, 但是你又因为业务的原因不想把它删除, 同时又不希望在打包的时候将这些无用的代码包含进去.

**(案例GitHub地址: [《LinDaiDai/webpack-basic》])**

### 1.1 Tree shaking

像刚刚我描述的这个**移除`js`上下文中未引用的代码**就被称为**`tree shaking`**, 它依赖于 ES2015 模块系统中的[静态结构特性](http://exploringjs.com/es6/ch_modules.html#static-module-structure)，例如 [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 和 [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)。

而在`webpack4`中, 也扩展了这样的能力, 让我们看看它具体是如何使用的.

### 1.2 一个小案例

让我们先来看一个案例, 以确保让你能够完全了解`tree shaking`.

- 在`src`文件夹下新建一个`math.js`并导出两个方法:

```javascript
export function square(x) {
    return x * x;
}

export function cube(x) {
    return x * x * x;
}
```

- 在`src/index.js`中使用`cube()`方法:

```diff
import './style.css'
+ import { cube } from './math'

function component() {
    var element = document.createElement('div');

    element.innerHTML = '孔子曰：中午不睡，下午崩溃!孟子曰：孔子说的对!';
    element.classList.add('color_red')

+   console.log(cube(3)) // 使用了cube
    return element;
}

document.body.appendChild(component());
```

- 修改`webpack.config.js`中的`mode`:

```diff
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
+   mode: 'development',
    entry: [
        './src/index.js'
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
    	new HtmlWebpackPlugin({
    	 	title: 'html-webpack',
    	})
    ],
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            }
        ]
    }
}
```

完成上述的三个步骤之后, 执行`npm run build`指令, 来进行打包.

可以看到生成的`dist`文件夹目录长这样:

```
/dist
	|- index.html
	|- main.bundle.js
```

让我们打开`main.bundle.js`看看里面的内容, 使用`Ctrl + F`查找`square`, 发现它竟然还是能够搜索的到.

这就是我想要表达的:

**明明`square`方法没有在代码使用, 但是它还是会被包含在构建完之后的bundle中.**



### 1.3 找出未引用代码

通过上面👆这个案例, 我想你大概已经明白**未引用代码**的意思了吧.

现在让我们来看看如何在打包的时候找出这些未引用的代码.

说是**找出这些未引用的代码**, 但其实这种说法是不太全面的.

而是要**找出并删除这些无副作用的代码**.

*「副作用」的定义是，在导入时会执行特殊行为的代码，而不是仅仅暴露一个 export 或多个 export。*

有些代码是有副作用的, 但是你也不能把它删除.

比如`polyfill`, 它会影响全局作用域, 但是它通常不会提供`export`.

而将文件标记为**无副作用**(也就是纯粹部分), 是通过在`package.json`设置`sideEffects`属性来实现的:

```javascript
{
  "name": "your-project",
  "sideEffects": false
}
```

若是将`sideEffects`设置成了`false`则表示所有文件都是无副作用的, 来告知`webpack`你可以大胆放心的删除未用到的`export`导出.

如果你的代码中确实又一些副作用, 那么可以改为提供一个数组：

```javascript
{
  "name": "your-project",
  "sideEffects": [
    "./src/some-side-effectful-file.js",
    "*.css"
  ]
}
```



### 1.4 压缩输出

我们已经明白了什么是**未使用的代码**, 也知道了利用`sideEffects`找到这些未使用的代码.

其实如果你没有在`package.json`中设置`sideEffects`也没事, 它默认会认为所有的文件都是无副作用可供`webpack`删除的.

所以接下来就是要在构建的时候将它们从`bundle`中删除.

像这种**删除未使用代码并进行代码压缩**就被称为**压缩输出**, 非常好记.

而实现压缩输出的方式, 是要启用`webpack`内部的`uglifyjs`插件.



**它主要有以下几种方式启用:**

- `webpack4`直接通过`mode`配置成`production`就可以了
- `webpack4`如果没有配置`mode`的话它默认也会启用
- 通过在命令行中添加`--optimize-minimize`, 比如`"build": "webpack --optimize-minimize"`



通过压缩输出, 我们此时再看看`npm run build`之后的效果:

- `main.bundle.js`里的代码被压缩成了我们看不懂的代码...

- 同时也查找不到`square`函数了.



### 1.5 总结

其实说了这么多, 一是为了介绍什么是`tree shaking`, 二就是为了说明**压缩输出**的实现.

这项优化功能在我们实际开发中有很大的作用.



## 二、代码分离

**代码分离**的特性主要是: 能够把代码分离到不同的`bundle`中, 然后按需加载或并行加载这些模块.

常用的代码分离方法:

- 多个入口起点, 通过配置entry
- 防止重复, 使用`webpack.optimize.CommonsChunkPlugin`插件去重和分离chunk (**但是在webpack4中已废弃**)
- 动态导入: 通过模块的内联函数调用来分离代码。



### 2.1 多个入口起点

配置多个入口起点其实我们在《霖呆呆的webpack之路-基础篇》中已经介绍过了, 通过在`webpack.config.js`设置`entry`就可以了:

```javascript
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
    another: './src/another-module.js'
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: 'Webpack Code Splitting'
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```



### 2.2 防止重复(CommonsChunkPlugin废弃)

在学习官网给出的文档[《 webpack文档-代码分离-防止重复》](https://www.webpackjs.com/guides/code-splitting/#防止重复-prevent-duplication-)这一章节的时候, 发现使用`webpack.optimize.CommonsChunkPlugin`之后, 在构建的过程中会报错.

后来了解到这个插件在`webpack4`中已经被废弃了, `webpack4`中已经默认做了这方面的优化了.

这里我就简单介绍一下`CommonsChunkPlugin`这个功能就是了, 如果你对此不感兴趣可以跳过这块内容阅读下一节.

案例🌰:

**此案例基于`webpack3`, GitHub案例地址: [LinDaiDai/webpack3-demo]()**

假设我们有这样一个场景:

`lodash`这个依赖在不同的`js`文件中被使用, 例如在`index.js`和`another-module.js`中都被使用了:

```javascript
// src/index.js
import _ from 'lodash'
```

```javascript
// src/another-module.js
import _ from 'lodash'
```

然后在`webpack.config.js`中配置两个入口:

```javascript
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
    another: './src/another-module.js'
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: 'Webpack Code Splitting'
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

此时如果你执行`npm run build`进行打包, 会看到:

```diff
lindaidai@LinDaiDaideMacBook-Pro webpack3-demo % npm run build

> webpack3-demo@1.0.0 build /Users/lindaidai/codes/webpack/webpack3-demo
> webpack

Hash: 273be9a48e0799049788
Version: webpack 3.12.0
Time: 422ms
            Asset       Size  Chunks                    Chunk Names
+ index.bundle.js     546 kB    0, 1  [emitted]  [big]  index
+ another.bundle.js     545 kB       1  [emitted]  [big]  another
       index.html  249 bytes          [emitted]         
   [1] (webpack)/buildin/global.js 509 bytes {0} {1} [built]
   [2] (webpack)/buildin/module.js 517 bytes {0} {1} [built]
   [3] ./src/another-module.js 122 bytes {0} {1} [built]
   [4] ./src/index.js 274 bytes {0} [built]
    + 1 hidden module
Child html-webpack-plugin for "index.html":
     1 asset
       [2] (webpack)/buildin/global.js 509 bytes {0} [built]
       [3] (webpack)/buildin/module.js 517 bytes {0} [built]
        + 2 hidden modules
```

生成的`index.bundle.js`和`another.bundle.js`中都有`lodash`依赖, 导致依赖重复, 生成的`bundle`很大.

`dist`文件目录为:

```
/webpack3-demo
	|- /dist
		|- index.bundle.js
		|- another.bundle.js
		|- index.html
```



而如果你在`webpack.config.js`中使用配置:

```diff
const path = require('path');
+ const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
    another: './src/another-module.js'
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: 'Webpack Code Splitting'
    })
+    ,
+    new webpack.optimize.CommonsChunkPlugin({
+    	name: 'common'
+    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

此时执行`npm run build`, 可以看到公共的依赖部分被合并到了`common.bundle.js`中, 大大减少了`bundle`的体积:

```diff
lindaidai@LinDaiDaideMacBook-Pro webpack3-demo % npm run build

> webpack3-demo@1.0.0 build /Users/lindaidai/codes/webpack/webpack3-demo
> webpack

Hash: 922e0214e76a536f1fd2
Version: webpack 3.12.0
Time: 402ms
            Asset       Size  Chunks                    Chunk Names
+ index.bundle.js  844 bytes       0  [emitted]         index
+ another.bundle.js   25 bytes       1  [emitted]         another
+ common.bundle.js     546 kB       2  [emitted]  [big]  common
       index.html  312 bytes          [emitted]         
   [1] ./src/index.js 274 bytes {0} [built]
   [2] (webpack)/buildin/global.js 509 bytes {2} [built]
   [3] (webpack)/buildin/module.js 517 bytes {2} [built]
   [4] ./src/another-module.js 122 bytes {2} [built]
    + 1 hidden module
Child html-webpack-plugin for "index.html":
     1 asset
       [2] (webpack)/buildin/global.js 509 bytes {0} [built]
       [3] (webpack)/buildin/module.js 517 bytes {0} [built]
        + 2 hidden modules
```

并且生成的`dist`文件目录如下:

```diff
/webpack3-demo
	|- /dist
		|- index.bundle.js
		|- another.bundle.js
+		|- common.bundle.js
		|- index.html
```



### 2.3 防止重复(SplitChunksPlugin)

如果你使用的是`webpack4`, 那么对于防止重复这一块你可以不需要做其他配置了.

因为在`webpack`内部默认帮你做了这方面的优化.

`webpack`将根据以下条件自动分割块：

- 可以共享新块，或者模块来自`node_modules`文件夹
- 新的块将大于30kb（在min + gz之前）
- 按需加载块时并行请求的最大数量将小于或等于6
- 初始页面加载时并行请求的最大数量将小于或等于4

而在`webpack4`中进行这种防止重复优化使用的是`SplitChunksPlugin`这个插件.

**(此案例GitHub项目地址: [LinDaiDai/webpack-code-splitting]())**

它在`webpack.config.js`中是有一个默认配置的:

```javascript
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      // minRemainingSize: 0, // 我在编写案例的时候报错, 原因是这个属性是webpack5中的属性
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 6,
      maxInitialRequests: 4,
      automaticNameDelimiter: '~',
      automaticNameMaxLength: 30,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

**所以如果你是在webpack4中运行和 上面👆一节`CommonsChunkPlugin`一样的场景时, 打包体积大大的减少了**:

```diff
lindaidai@LinDaiDaideMacBook-Pro webpack-code-splitting % npm run build

> webpack-code-splitting@1.0.0 build /Users/lindaidai/codes/webpack/webpack-code-splitting
> webpack

Hash: 4d4e2e7e186563eab28c
Version: webpack 4.41.5
Time: 1708ms
Built at: 2020-02-09 1:52:52 PM
            Asset       Size  Chunks             Chunk Names
+ another.bundle.js     72 KiB       0  [emitted]  another
+  index.bundle.js   72.1 KiB       1  [emitted]  index
       index.html  259 bytes          [emitted]  
Entrypoint index = index.bundle.js
Entrypoint another = another.bundle.js
[1] (webpack)/buildin/global.js 472 bytes {0} {1} [built]
[2] (webpack)/buildin/module.js 497 bytes {0} {1} [built]
[3] ./src/index.js 209 bytes {1} [built]
[4] ./src/another-module.js 101 bytes {0} [built]
    + 1 hidden module
```

可以看到使用`webpack3`, 单个打包体积为`546 kB`.

使用`webpack4`, 单个打包体积为为`72KiB`.

(1kB = 10^3=1000B)

(1KiB = 2^10=1024B)

在`webpack4`中体积明显减少了.

以下是由社区提供的，一些对于代码分离很有帮助的插件和 loaders：

- [`ExtractTextPlugin`](https://www.webpackjs.com/plugins/extract-text-webpack-plugin): 用于将 CSS 从主应用程序中分离。
- [`bundle-loader`](https://www.webpackjs.com/loaders/bundle-loader): 用于分离代码和延迟加载生成的 bundle。
- [`promise-loader`](https://github.com/gaearon/promise-loader): 类似于 `bundle-loader` ，但是使用的是 promises。



### 2.4 动态导入

还有一种实现代码分离的方式就是使用**动态导入**.

#### import

**(案例项目GitHub地址: [LinDaiDai/webpack-dynamic-imports]())**

它的用法主要是这样:

```javascript
import(/** webpackChunkName: "lodash" **/ 'lodash').then(_ => {
 // doSomething
})
```

关于动态导入, 在`webpack.config.js`的配置中也有一个叫做`output.chunkFilename` 的属性与它相关.

一般你可以将这个属性设置成:

```diff
{
	"output": {
		filename: '[name].bundle.js',
+		chunkFilename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	}
}
```

`[name]`就是你在`import`时`webpackChunkName`的值.

(如果没有配置`output.chunkFilename`属性的话, 它默认的值是`[id].bundle.js`)

让我们来写个案例看看.

首先编写`src/index.js`:

```javascript
function getComponent() {
    return import ( /* webpackChunkName: "custom-lodash" */ 'lodash').then(_ => {
        var element = document.createElement('div')
        element.innerHTML = _.join(["Hello", "LinDaiDai"])

        return element
    }).catch(error => 'An error occurred while loading the component')
}

getComponent().then(component => {
    document.body.appendChild(component)
})
```

然后配置一下`webpack.config.js`:

```javascript
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: './src/index.js'
    },
    plugins: [
        new HTMLWebpackPlugin()
    ],
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}
```

代码都很简单, 让我们来`npm run build`一下,

输出结果为:

```diff
lindaidai@LinDaiDaideMacBook-Pro webpack-dynamic-imports % npm run build

> webpack-dynamic-imports@1.0.0 build /Users/lindaidai/codes/webpack/webpack-dynamic-imports
> webpack

Hash: 533402c3bd125d8c853e
Version: webpack 4.41.5
Time: 368ms
Built at: 2020-02-09 8:20:07 PM
                   Asset       Size  Chunks             Chunk Names
+         index.bundle.js   2.27 KiB       0  [emitted]  index
+              index.html  188 bytes          [emitted]  
+ vendors~lodash.bundle.js   71.1 KiB       1  [emitted]  vendors~lodash
Entrypoint index = index.bundle.js
[0] ./src/index.js 388 bytes {0} [built]
[2] (webpack)/buildin/global.js 472 bytes {1} [built]
[3] (webpack)/buildin/module.js 497 bytes {1} [built]
    + 1 hidden module
```

输出的`dist`目录为:

```
/webpack-dynamic-imports
	|- /dist
		|- index.bundle.js
		|- index.html
		|- vendors~lodash.bundle.js
```

**通过输出结果可以看出, 使用`import`动态导入的方式, 可以将要导入的模块单独分离到一个`bundle`中, 以此来实现代码分离.**



####  使用async函数

由于`import()`返回的是一个`promise`, 因此我们可以使用`async`函数来简化它.

但是，需要使用像 Babel 这样的预处理器和[Syntax Dynamic Import Babel Plugin](https://babeljs.io/docs/plugins/syntax-dynamic-import/#installation), `webpack`中应该内置了它, 你不需要额外安装.

新改编之后的`src/index.js`:

```diff
- function getComponent() {
+ async function getComponent() {
-   return import(/* webpackChunkName: "lodash" */ 'lodash').then(_ => {
-     var element = document.createElement('div');
-
-     element.innerHTML = _.join(['Hello', 'LinDaiDai'], ' ');
-
-     return element;
-
-   }).catch(error => 'An error occurred while loading the component');
+   var element = document.createElement('div');
+   const _ = await import(/* webpackChunkName: "lodash" */ 'lodash');
+
+   element.innerHTML = _.join(['Hello', 'LinDaiDai'], ' ');
+
+   return element;
  }

  getComponent().then(component => {
    document.body.appendChild(component);
  });
```



### 2.5 css代码分离

我们知道使用`style-loader`和`css-loader`能帮助我们在项目中使用css文件.

但是它的实现方式是将css代码添加到页面head的style标签里.

也就是说并不会在最终的bundle中生成对应的css文件.

但是在实际使用来说, 我们更希望能将less或者css文件提取出来作为一个单独的文件加载到页面上.

通过[Vue Loader中的CSS提取](https://vue-loader.vuejs.org/zh/guide/extract-css.html)我发在webpack4中使用**mini-css-extract-plugin**

(官网推荐的是使用`extract-text-webpack-plugin`, 在`Vue Loader`中表示它最好在`webpack3`中使用)

#### mini-css-extract-plugin

在webpack4中我们最好使用`mini-css-extract-plugin`来达到css代码分离的效果.

1. 安装插件

```
$ cnpm i --save-dev mini-css-extract-plugin
```

2. 在webpack.config.js中配置:

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
};
```



#### extract-text-webpack-plugin

这时候就需要用到**extract-text-webpack-plugin** 插件.

1. 安装插件

```
$ cnpm i --save-dev extract-text-webpack-plugin
```

2. 在webpack.config.js中配置:

```diff
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
+ const ExtractTextPlugin = require('extract-text-webpack-plugin');
+ const extractCss = new ExtractTextPlugin({
+    filename: "[name].[hash].css",
+    disable: process.env.NODE_ENV === "development"
+ });
module.exports = {
	entry: {
        index: './src/index.js'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin(),
+       extractCss
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
+    module: {
+    	rules: [
+    		{
+    			test: /.css$/,
+    			use: extractCss.extract({
+            use: [{
+                loader: "css-loader"
+            }],
+            fallback: "style-loader"
+          })
+    		}
+    	]
+    }
}
```

less或者sass代码分离的方式和它一样,具体案例可以查看GitHub案例地址: [LinDaiDai/webpack-loader]()



## 三、懒加载

**懒加载**又名**按需加载**, 相信大家平常都有听过.

> 这种方式实际上是先把你的代码在一些逻辑断点处分离开，然后在一些代码块中完成某些操作后，立即引用或即将引用另外一些新的代码块。这样加快了应用的初始加载速度，减轻了它的总体体积，因为某些代码块可能永远不会被加载。

通俗点说就是**需要用到时才加载这个资源, 没用到时是不会加载的.**

上一节我们提到了使用`import`引入模块的这种模式, 是可以帮助我们进行**代码分离**的.

它其实还有另一个功能, 就是在技术概念上**懒加载**它.

以下的内容都是为了说明这个观点.👇👇👇

### lodash案例

在上面👆《代码分离-`import`动态导入》的案例中, 我们是在调用`getComponent`函数的时候, 就加载了`lodash`模块, 为了让大家看到懒加载的效果, 我们换一种实现方式:

- 给页面添加一个按钮, 给按钮添加一个点击事件
- 在点击事件中使用`import`加载`lodash`

```javascript
// src/index.js
/**
 * 代码分离-import动态导入
 */
// function getComponent() {
//     return import ( /* webpackChunkName: "custom-lodash" */ 'lodash').then(_ => {
//         var element = document.createElement('div')
//         element.innerHTML = _.join(["Hello", "LinDaiDai"])

//         return element
//     }).catch(error => 'An error occurred while loading the component')
// }

// getComponent().then(component => {
//     document.body.appendChild(component)
// })
/**
 * 懒加载效果
 */
function getComponent() {
    var element = document.createElement('div')
    element.innerHTML = 'Hello LinDaiDai'

    var btn = document.createElement('button')
    btn.innerHTML = '点击按钮'
    element.appendChild(btn)

    btn.onclick = e =>
        import ( /* webpackChunkName: "lodash" */ "lodash").then(_ => {
            console.log(_.join(['点击了按钮', '加载了lodash']))
        })
    return element
}
document.body.appendChild(getComponent())
```

修改完`index.js`之后, 让我们`npm run build`一下, 产生的`bundle`和之前的没什么区别:

```
/webpack-dynamic-imports
	|- /dist
		|- index.bundle.js
		|- index.html
		|- vendors~lodash.bundle.js
```

但是当你打开`dist/index.html`的时候, 并且打开控制台查看`Sources`选项, 你会发现资源中只加载了`index.html`和`index.bundle.js`文件, 而暂时未使用到的`vendors~lodash.bundle.js`则没有被加载.

点击页面上的按钮时, `vendors~lodash.bundle.js`才被加载出来.并且重复点击, 它只会加载一次.

**(案例项目GitHub地址: [LinDaiDai/webpack-dynamic-imports]())**



### print.js案例

如果上面👆的案例还无法说明问题的话, 这个案例能更好的帮助你理解懒加载.

还是使用上面👆案例的项目.在原来的基础上, 我们添加一个 `print.js`文件:

```javascript
// src/print.js
console.log('print.js 模块被加载了')

export default () => {
    console.log('点击按钮')
}
```

然后修改一下`src/index.js`:

```javascript
function getComponent() {
    var element = document.createElement('div')
    element.innerHTML = 'Hello LinDaiDai'

    var btn = document.createElement('button')
    btn.innerHTML = '点击按钮'
    element.appendChild(btn)
        // btn.onclick = e =>
        //     import ( /* webpackChunkName: "lodash" */ "lodash").then(_ => {
        //         console.log(_.join(['点击了按钮', '加载了lodash']))
        //     })
    btn.onclick = e =>
        import ( /* webpackChunkName: "print" */ "./print").then(module => {
            var print = module.default
            print()
        })

    return element
}
document.body.appendChild(getComponent())
```

在这个案例中, 我们没有引用`lodash`依赖, 而是引用了我们本地编写的一个`print.js`模块.

重新`npm run build`一下, 生成了以下文件, 这个应该没有问题:

```diff
/webpack-dynamic-imports
	|- /dist
		|- index.bundle.js
		|- index.html
+		|- print.bundle.js
-   |- vendors~lodash.bundle.js
```

当我们打开页面和控制台的时候, 开始控制台是不会有任何东西的.

点击按钮之后, 控制台依次打印出:

```
print.js 模块被加载了
点击按钮
```

并且后续再点击按钮的时候, 只会打印出`点击按钮`.

由此可以证明`print.js`确实被懒加载了.



### 其它懒加载技术

许多框架和类库对于如何用它们自己的方式来实现（懒加载）都有自己的建议。这里有一些例子：

- React: [Code Splitting and Lazy Loading](https://reacttraining.com/react-router/web/guides/code-splitting)
- Vue: [Lazy Load in Vue using Webpack's code splitting](https://alexjoverm.github.io/2017/07/16/Lazy-load-in-Vue-using-Webpack-s-code-splitting/)
- AngularJS: [AngularJS + Webpack = lazyLoad](https://medium.com/@var_bin/angularjs-webpack-lazyload-bb7977f390dd) by [@var_bincom](https://twitter.com/var_bincom)

