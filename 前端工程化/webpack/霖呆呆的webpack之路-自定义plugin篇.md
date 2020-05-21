# 霖呆呆的webpack之路-自定义plugin篇

你盼世界，我盼望你无`bug`。Hello 大家好！我是霖呆呆！

有很多小伙伴在打算学写一个`webpack`插件的时候，就被官网上那一长条一长条的`API`给吓到了，亦或者翻阅了几篇文章之后但还是不知道从何下手。

而呆呆认为，当你了解了整个插件的创建方式以及执行机制之后，那些个长条的`API`就只是你后期用来开发的`"工具库"`而已，我需要什么，我就去文档上找，大可不必觉得它有多难 😊。

本篇文章会教大家从浅到深的实现一个个`webpack`插件，案例虽然都不是什么特别难的插件，但是一旦你掌握了如何写一个插件的方法之后，剩下的就只是在上面做增量了。呆呆还是那句话：`"授人予鱼不如授人予渔"`。

OK👌，让我们来看看通过阅读本篇文章你可以学习到：

- `No1-webpack-plugin`案例
- `Tapable`
- `compiler?compile?compilation?`
- `No2-webpack-plugin`案例
- `fileList.md`案例
- `Watch-plugin`案例
- `Decide-html-plugin`案例
- `Clean-plugin`案例

所有文章内容都已整理至 [LinDaiDai/niubility-coding-js](https://github.com/LinDaiDai/niubility-coding-js) 快来给我Star呀😊~

## webpack系列介绍

此系列记录了我在`webpack`上的学习历程。如果你也和我一样想要好好的掌握`webpack`，那么我认为它对你是有一定帮助的，因为教材中是以一名`webpack`小白的身份进行讲解， 案例`demo`也都很详细， 涉及到：

- [基础篇](https://juejin.im/post/5e9ada576fb9a03c391300a1)
- [构建方式篇](https://juejin.im/post/5ea2a64a51882573a509c426)
- 自定义插件篇(本章)
- 优化篇
- loader篇
- 配置篇

建议先`mark`再花时间来看。

（其实这个系列在很早之前就写了，一直没有发出来，当时还写了一大长串前言可把我感动的，想看废话的可以点这里：[GitHub地址](https://github.com/LinDaiDai/webpack-example)，不过现在让我们正式开始学习吧）

所有文章`webpack`版本号`^4.41.5`, `webpack-cli`版本号`^3.3.10`。

**(本章节教材案例GitHub地址: [LinDaiDai/webpack-example/tree/webpack-custom-plugin](https://github.com/LinDaiDai/webpack-example/tree/webpack-custom-plugin) ⚠️：请仔细查看README说明)**

## 前期准备

### 从使用的角度来看插件

好了，我已经准备好阅读呆呆的这篇文章然后写一个炒鸡牛x的插件了，赶紧的。

额，等等，在这之前我们不是得知道需要怎么去做吗？我们总是听到的插件插件的，它到底是个啥啊？

对象？函数？类？

小伙伴们不妨结合我们已经用过的一些插件来猜猜，比如`HtmlWebpackPlugin`，我们会这样使用它：

```javascript
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: 'custom-plugin'
    })
  ]
}
```

可以看到，这很明显的就是个构造函数，或者是一个类嘛。我们使用`new`就可以实例化一个插件的对象。并且，这个函数或者类是可以让我们传递参数进去的。

那你脑子里是不是已经脑补出一个轮廓了呢？

```javascript
function CustomPlugin (options) {}

// or
class CustomPlugin {
  constructor (options) {}
}
```



### 从构建的角度来看插件

知道了`plugin`大概的轮廓，让我们从构建的角度来看看它。插件不同于`loader`一个很大的区别就是，`loader`它是一个转换器，它只专注于**转换**这一个领域，例如`babel-loader`能将`ES6+`的代码转换为`ES5`或以下，以此来保证兼容性，那么它是运行在打包之前的。

而`plugin`呢？你会发现市场上有各种让人眼花缭乱的插件，它可能运行在打包之前，也可能运行在打包的过程中，或者打包完成之后。总之，**它不局限于打包，资源的加载，还有其它的功能**。所以它是在整个编译周期都起作用。

那么如果让我们站在一个编写插件者的角度上来看的话，是不是在编写的时候需要明确两件事情：

- 我要如何拿到完整的`webpack`环境配置呢？因为我在编写插件的时候肯定是要与`webpack`的主环境结合起来的
- 我如何告诉`webpack`我的插件是在什么时候发挥作用呢？在打包之前？还是之后？也就是我们经常听到的钩子。

所以这时候我们就得清楚这几个硬知识点：

(看不懂？问题不大，呆呆也是从官网cv过来的，不过后面会详细讲到它们哦)

- `compiler` 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。

- `compilation` 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。
- 钩子的本质其实就是事件


![](https://user-gold-cdn.xitu.io/2020/5/18/1722394571c04f9f?w=440&h=378&f=jpeg&s=20765)


### 案例准备

老规矩，为了能更好的让我们掌握本章的内容，我们需要本地创建一个案例来进行讲解。

创建项目的这个过程我就快速的用指令来实现一下哈：

```javascript
mkdir webpack-custom-plugin && cd webpack-custom-plugin
npm init -y
cnpm i webpack webpack-cli clean-webpack-plugin html-webpack-plugin --save-dev
touch webpack.config.js
mkdir src && cd src
touch index.js
```

(`mkdir`：创建一个文件夹；`touch`：创建一个文件)

OK👌，此时项目目录变成了：

```javascript
 webpack-custom-plugin
    |- package.json
    |- webpack.config.js
    |- /src
      |- index.js
```

接着让我们给`src/index.js`随便加点东西意思一下，省得太空了：

*src/index.js*

```javascript
function createElement () {
  const element = document.createElement('div')
  element.innerHTML = '孔子曰：中午不睡，下午崩溃!孟子曰：孔子说的对!';

  return element
}
document.body.appendChild(createElement())
```

`webpack.config.js`也简单的来配置一下吧，这些应该都是基础了，之前有详细说过了哟：

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'custom-plugin'
    }),
    new CleanWebpackPlugin()
  ]
}
```

(`clean-webpack-plugin`插件会在我们每次打包之前自动清理掉旧的`dist`文件夹，对这些内容还不熟悉的小伙伴得再看看这篇文章了：[跟着"呆妹"来学webpack(基础篇)](https://juejin.im/post/5e9ada576fb9a03c391300a1))

另外还需要在`package.json`中配置一条打包指令哈：

```javascript
{
  "script": {
    "build": "webpack --mode development"
  }
}
```

这里的`"webpack"`实际上是`"webpack --config webpack.config.js"`的缩写，这点在基础篇中也有说到咯。

`--mode development`就是指定一下环境为开发环境，因为我们后续可能有需要看到打包之后的代码内容，如果指定了为`production`的话，那么`webpack`它会自动开启`UglifyJS`的也就是会对我们打包成功之后的代码进行压缩输出，那一坨一坨的代码我们就不利于我们查看了。



## No1-webpack-plugin案例

好的了，基本工作已经准备完毕了，让我们动手来编写我们的第一个插件吧。

这个插件案例主要是为了帮助你了解插件大概的创建流程。

### 传统形式的compiler.plugin

从易到难，让我们来实现这么一个简单的功能：

- 当我们在完成打包之后，控制台会输出一个`"good boy!"`

在刚刚的案例目录中新建一个`plugins`文件夹，然后在里面创建上我们的第一个插件: `No1-webpack-plugin`：

```diff
 webpack-custom-plugin
  |- package.json
  |- webpack.config.js
  |- /src
    |- index.js
+ |- /plugins
+   |-No1-webpack-plugin.js
```

现在依照前面所说的插件的结构，以及我们的需求，可以写出以下代码：

*plugins/No1-webpack-plugin.js*:

```javascript
// 1. 创建一个构造函数
function No1WebpackPlugin (options) {
  this.options = options
}
// 2. 重写构造函数原型对象上的 apply 方法
No1WebpackPlugin.prototype.apply = function (compiler) {
  compiler.plugin('done', () => {
    console.log(this.options.msg)
  })
}
// 3. 将我们的自定义插件导出
module.exports = No1WebpackPlugin;
```

接着，让我们来看看如何使用它，也就是：

*webpack.config.js*:

```diff
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
+ const No1WebpackPlugin = require('./plugins/No1-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'custom-plugin'
    }),
    new CleanWebpackPlugin(),
+   new No1WebpackPlugin({ msg: 'good boy!' })
  ]
}
```

OK👌，代码已经编写完啦，快`npm run build`一下看看效果吧：


![](https://user-gold-cdn.xitu.io/2020/5/18/172238a91b9c7192?w=1558&h=712&f=jpeg&s=187727)

可以看到，控制台已经在夸你`"good boy!"`了😄。

那么让我们回到刚刚的那段自定义插件的代码中：

*plugins/No1-webpack-plugin.js*:

```javascript
// 1. 创建一个构造函数
function No1WebpackPlugin (options) {
  this.options = options
}
// 2. 在构造函数原型对象上定义一个 apply 方法
No1WebpackPlugin.prototype.apply = function (compiler) {
  compiler.plugin('done', () => {
    console.log(this.options.msg)
  })
}
// 3. 将我们的自定义插件导出
module.exports = No1WebpackPlugin;
```

注意到这里，我们一共是做了这么三件事情，也就是我在代码中的注释。

很显然，为了能拿到`webpack.config.js`中我们传递的那个参数，也就是`{ msg: 'good boy!' }`，我们需要在构造函数中定义一个实例对象上的属性`options`。

并且在`prototype.apply`中呢：

- 我们需要调用`compiler.plugin()`并传入第一个参数来指定我们的插件是发生在哪个阶段，也就是这里的`"done"`(一次编译完成之后，即打包完成之后)；
- 在这个阶段我们要做什么事呢？就可以在它的第二个参数回调函数中来写了，请注意这里我们的回调函数是一个箭头函数哦，这也是能够保证里面的`this`获取到的是我们的实例对象，也就是为了能保证我们拿到`options`，并成功的打印出`msg`。(如果对`this`还不熟悉的小伙伴你该看看呆呆的这篇文章了：[【建议👍】再来40道this面试题酸爽继续(1.2w字用手整理)](https://juejin.im/post/5e6358256fb9a07cd80f2e70))

所以，现在你的思维是不是已经很清晰了呢？我们想要编写一个插件，只需要这么几步：

1. 明确你的插件是要怎么调用的，需不需要传递参数(对应着`webpack.config.js`中的配置)；
2. 创建一个构造函数，以此来保证用它能创建一个个插件实例；
3. 在构造函数原型对象上定义一个 apply 方法，并在其中利用`compiler.plugin`注册我们的自定义插件。

![](https://user-gold-cdn.xitu.io/2020/5/18/17223962d8d56b44?w=255&h=255&f=jpeg&s=7968)

那么除了用构造函数的方式来创建插件，是否也可以用类呢？让我们一起来试试，将刚刚的代码改动一下：

*plugins/No1-webpack-plugin.js*:

```javascript
// // 1. 创建一个构造函数
// function No1WebpackPlugin (options) {
//   this.options = options
// }
// // 2. 重写构造函数原型对象上的 apply 方法
// No1WebpackPlugin.prototype.apply = function (compiler) {
//   compiler.plugin('done', () => {
//     console.log(this.options.msg)
//   })
// }
class No1WebpackPlugin {
  constructor (options) {
    this.options = options
  }
  apply (compiler) {
    compiler.plugin('done', () => {
      console.log(this.options.msg)
    })
  }
}
// 3. 将我们的自定义插件导出
module.exports = No1WebpackPlugin;
```

这时候你执行打包指令效果也是一样的哈。这其实也很好理解，`class`它不就是咱们构造函数的一个语法糖吗，所以它肯定也可以用来实现一个插件啦。



不过不知道小伙伴们注意到了，在我们刚刚输出`"good boy!"`的上面，还有一段小小的警告：


![](https://user-gold-cdn.xitu.io/2020/5/18/172238ab6896a59a?w=1568&h=692&f=jpeg&s=195188)
它告诉我们`Tabable.plugin`这种的调用形式已经被废弃了，请使用新的`API`，也就是`.hooks`来替代`.plugin`这种形式。

如果你和呆呆一样，开始看的官方文档是[  《编写一个插件》](https://www.webpackjs.com/contribute/writing-a-plugin/)这里的话，那么现在请让我们换个方向了戳这里了：
[《Plugin API》](https://www.webpackjs.com/api/plugins/#tapable)。

但并不是说上面的文档就不能看了，我们依然还是可以通过阅读它来了解更多插件相关的知识。


![](https://user-gold-cdn.xitu.io/2020/5/18/1722396a5217689f?w=360&h=308&f=jpeg&s=22054)


### 推荐使用compiler.hooks

既然官方都推荐我们用`compiler.hooks`了，那我们就遵循呗。不过如果你直接去看[Plugin API](https://www.webpackjs.com/api/plugins/#tapable)的话对新手来说好像又有点绕，里面的`Tapable`、`compiler`、`compile`、`compilation`它们直接到底是存在怎样的关系呢？

没关系，呆呆都会依次的进行讲解。

现在让我们将`No1-webpack-plugin`使用`compiler.hooks`改造一下吧：

*plugins/No1-webpack-plugin.js*:

```javascript
// 第一版
// function No1WebpackPlugin (options) {
//   this.options = options
// }
// No1WebpackPlugin.prototype.apply = function (compiler) {
//   compiler.plugin('done', () => {
//     console.log(this.options.msg)
//   })
// }
// 第二版
// class No1WebpackPlugin {
//   constructor (options) {
//     this.options = options
//   }
//   apply (compiler) {
      // compiler.plugin('done', () => {
      //   console.log(this.options.msg)
      // })
//   }
// }
// 第三版
function No1WebpackPlugin (options) {
  this.options = options
}
No1WebpackPlugin.prototype.apply = function (compiler) {
  compiler.hooks.done.tap('No1', () => {
    console.log(this.options.msg)
  })
}
module.exports = No1WebpackPlugin;
```

可以看到，第三版中，关键点就是在于：

```javascript
compiler.hooks.done.tap('No1', () => {
  console.log(this.options.msg)
})
```

它替换了我们之前的：

```javascript
compiler.plugin('done', () => {
  console.log(this.options.msg)
})
```

让我们来拆分一下`compiler.hooks.done.tap('No1', () => {})`：

- `compiler`：一个扩展至`Tapable`的对象
- `compiler.hooks`：`compiler`对象上的一个属性，允许我们使用不同的钩子函数
- `.done`：`hooks`中常用的一种钩子，表示在一次编译完成后执行，它有一个回调参数`stats`(暂时没用上)
- `.tap`：表示可以注册同步的钩子和异步的钩子，而在此处因为`done`属于异步`AsyncSeriesHook`类型的钩子，所以这里表示的是注册`done`异步钩子。
- `.tap('No1')`：`tap()`的第一个参数`'No1'`，其实`tap()`这个方法它的第一个参数是可以允许接收一个**字符串**或者一个**Tap**类的对象的，不过在此处我们不深究，你先随便传一个字符串就行了，我把它理解为这次调用钩子的方法名。

所以让我们连起来理解这段代码的意思就是：

1. 在程序执行`new No1WebpackPlugin()`的时候，会初始化一个插件实例且调用其原型对象上的`apply`方法
2. 该方法会告诉`webpack`当你在一次编译完成之后，得执行一下我的箭头函数里的内容，也就是打印出`msg`

现在我们虽然会写一个简单的插件了，但是对于上面的一些对象、属性啥的好像还不是很懂耶。想要一口气吃完一头大象🐘是有点难的哦(而且那样也是犯法的)，所以接下来让我们来大概了解一下这些`Tapable`、`compiler`等等的东西是做什么的😊。


![](https://user-gold-cdn.xitu.io/2020/5/18/1722397137d5f013?w=320&h=352&f=jpeg&s=17735)

## Tapable

首先是`Tapable`这个东西，我看了一下网上有很多对它的描述：

1. tapable 这个小型 library 是 webpack 的一个核心工具
2. Webpack 的 Tapable 事件流机制保证了插件的有序性，使得整个系统扩展性良好
3. Tapable 为 webpack 提供了统一的插件接口（钩子）类型定义，它是 webpack 的核心功能库、

当然这些说法肯定都是对的哈，所以总结一下：

- 简单来说Tapable就是webpack用来创建钩子的库，为webpack提供了插件接口的支柱。

其实如果你去看了它[Git上的文档](https://github.com/webpack/tapable)的话，它就是暴露了9个`Hooks`类，以及3种方法(`tap、tapAsync、tapPromise`)，可用于为插件创建钩子。


![](https://user-gold-cdn.xitu.io/2020/5/18/172238ad2787f051?w=1760&h=1662&f=jpeg&s=231166)

9种`Hooks`类与3种方法之间的关系：

- `Hooks`类表示的是你的钩子是哪一种类型的，比如我们上面用到的`done`，它就属于`AsyncSeriesHook`这个类
- `tap、tapAsync、tapPromise`这三个方法是用于注入不同类型的自定义构建行为，因为我们的钩子可能有同步的钩子，也可能有异步的钩子，而我们在注入钩子的时候就得选对这三种方法了。

对于`Hooks`类你大可不必全都记下，一般来说你只需要知道我们要用的每种钩子它们实际上是有类型区分的，而区分它们的就是`Hooks`类。

如果你想要清楚它们之前的区别的话，呆呆这里也有找到一个解释的比较清楚的总结：

`Sync*`

- SyncHook --> 同步串行钩子，不关心返回值
- SyncBailHook  --> 同步串行钩子，如果返回值不为null 则跳过之后的函数
- SyncLoopHook --> 同步循环，如果返回值为true 则继续执行，返回值为false则跳出循环
- SyncWaterfallHook --> 同步串行，上一个函数返回值会传给下一个监听函数

`Async*`

- AsyncParallel*：异步并发
  - AsyncParallelBailHook -->  异步并发，只要监听函数的返回值不为 null，就会忽略后面的监听函数执行，直接跳跃到callAsync等触发函数绑定的回调函数，然后执行这个被绑定的回调函数
  - AsyncParallelHook --> 异步并发，不关心返回值
- AsyncSeries*：异步串行
  - AsyncSeriesHook --> 异步串行，不关心callback()的参数
  - AsyncSeriesBailHook --> 异步串行，callback()的参数不为null，就会忽略后续的函数，直接执行callAsync函数绑定的回调函数
  - AsyncSeriesWaterfallHook --> 异步串行，上一个函数的callback(err, data)的第二个参数会传给下一个监听函数

(总结来源：[XiaoLu-写一个简单webpack plugin所引发的思考](https://juejin.im/post/5e6e2b326fb9a07cb24ab84c))

而对于这三种方法，我们必须得知道它们分别是做什么用的：

- `tap`：可以注册同步钩子也可以注册异步钩子
- `tapAsync`：回调方式注册异步钩子
- `tapPromise`：`Promise`方式注册异步钩子

OK👌，听了霖呆呆这段解释之后，我相信你起码能看得懂[官方文档-compiler 钩子](https://www.webpackjs.com/api/compiler-hooks/#hooks)这里面的钩子是怎样用的了：


![](https://user-gold-cdn.xitu.io/2020/5/18/172238af4f61b6a7?w=3352&h=1790&f=jpeg&s=424529)

就比如，我现在想要注册一个`compile`的钩子，根据官方文档，我发现它是`SyncHook`类型的钩子，那么我们就只能使用`tap`来注册它。如果你试图用`tapAsync`的话，打包的话你就会发现控制台已经报错了，比如这样：


![](https://user-gold-cdn.xitu.io/2020/5/18/172238b1eb3c0320?w=3360&h=1888&f=jpeg&s=882280)

（额，不过我在使用`compiler.hooks.done.tapAsync()`的时候，查阅文档上它也是`SyncHook`类，但是却可以用`tapAsync`方法注册，这边呆呆也有点没搞明白是为什么，有知道的小伙伴还希望可以评论区留言呀😄）



## compiler?compile?compilation?

接下来就得说一说插件中几个重要的东西了，也就是这一小节的标题里的这三个东西。

首先让我们在官方的文档上找寻一下它们的足迹：


![](https://user-gold-cdn.xitu.io/2020/5/18/172238b4baa642c9?w=2110&h=1662&f=jpeg&s=443064)

可以看到，这几个属性都长的好像啊，而且更过分的是，`compilation`竟然还有两个同名的，你这是给👴整真假美猴王呢？

那么呆呆这边就对这几个属性做一下说明。

首先对于文档左侧菜单上的`compiler`钩子和`compilation`钩子(也就是第一个和第四个)我们在之后称它们为`Compiler`和`Compilation`好了，也是为了和`compile`做区分，其实我认为你可以把`"compiler钩子"`理解为`"compiler的钩子"`，这样会更好一些。

- `Compiler`：是一个对象，该对象代表了**完整的`webpack`环境配置**。整个`webpack`在构建的时候，会先**初始化参数**也就是从配置文件(`webpack.config.js`)和`Shell`语句(`"build": "webpack --mode development"`)中去读取与合并参数，之后**开始编译**，也就是将最终得到的参数初始化这个`Compiler`对象，然后再会加载所有配置的插件，执行该对象的`run()`方法开始执行编译。因此我们可以理解为它是`webpack`的支柱引擎。
- `Compilation`：也是一个对象，不过它表示的是**某一个模块**的资源、编译生成的资源、变化的文件等等，因为我们知道我们在使用`webpack`进行构建的时候可能是会生成很多不同的模块的，而它的颗粒度就是在每一个模块上。

所以你现在可以看到它俩的区别了，一个是代表了整个构建的过程，一个是代表构建过程中的某个模块。

还有很重要的一点，它们两都是扩展至我们上面👆提到的`Tapable`类，这也就是为什么它两都能有这么多生命周期钩子的原因。

再来看看两个小写的`compile和compilation`，这两个其实就是`Compiler`对象下的两个钩子了，也就是我们可以通过这样的方式来调用它们：

```javascript
No1WebpackPlugin.prototype.apply = function (compiler) {
  compiler.hooks.compile.tap('No1', () => {
    console.log(this.options.msg)
  })
  compiler.hooks.compilation.tap('No1', () => {
    console.log(this.options.msg)
  })
}
```

区别在于：

- `compile`：一个新的编译(compilation)创建之后，钩入(hook into) compiler。
- `compilation`：编译(compilation)创建之后，执行插件。

(为什么感觉还是没太读懂它们的意思呢？别急，呆呆会在下个例子中来进行说明的)



## No2-webpack-plugin案例

这个插件案例主要是为了帮你理解`Compiler、Compilation、compile、compilation`四者之间的关系。

### compile和compilation

还是在上面👆那个项目中，让我们在`plugins`文件夹下再新增一个插件，叫做`No2-webpack-plugin`：

*plugins/No2-webpack-plugin.js*:

```javascript
function No2WebpackPlugin (options) {
  this.options = options
}
No2WebpackPlugin.prototype.apply = function (compiler) {
  compiler.hooks.compile.tap('No2', () => {
    console.log('compile')
  })
  compiler.hooks.compilation.tap('No2', () => {
    console.log('compilation')
  })
}
module.exports = No2WebpackPlugin;
```

在这个插件中，我分别调用了`compile`和`compilation`两个钩子函数，等会让我们看看会发生什么事情。

同时，把`webpack.config.js`中的`No1`插件替换成`No2`插件：

*webpack.config.js*:

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const No1WebpackPlugin = require('./plugins/No1-webpack-plugin');
const No2WebpackPlugin = require('./plugins/No2-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'custom-plugin'
    }),
    new CleanWebpackPlugin(),
    // new No1WebpackPlugin({ msg: 'good boy!' })
    new No2WebpackPlugin({ msg: 'bad boy!' })
  ]
}
```

现在项目的目录结构是这样的：

```diff
 webpack-custom-plugin
  |- package.json
  |- webpack.config.js
  |- /src
    |- index.js
  |- /plugins
    |-No1-webpack-plugin.js
+   |-No2-webpack-plugin.js
```

OK👌，来执行`npm run build`看看：


![](https://user-gold-cdn.xitu.io/2020/5/18/172238b7e134cbd7?w=3360&h=1888&f=jpeg&s=537282)

哈哈哈😄，是不是给了你点什么启发呢？

我们最终生成的`dist`文件夹下会有两个文件，那么`compilation`这个钩子就被调用了两次，而`compile`钩子就只被调用了一次。

有小伙伴可能就要问了，我们这里的`src`下明明就只有一个`index.js`文件啊，为什么最终的`dist`下会有两个文件呢？

- `main.bundle.js`
- `index.html`

别忘了，在这个项目中我们可是使用了`html-webpack-plugin`这个插件的，它会帮我自动创建一个`html`文件。

为了验证这个`compilation`是跟着文件的数量走的，我们暂时先把`new HtmlWebpackPlugin`给去掉看看：

```javascript
const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const No1WebpackPlugin = require('./plugins/No1-webpack-plugin');
const No2WebpackPlugin = require('./plugins/No2-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   title: 'custom-plugin'
    // }),
    new CleanWebpackPlugin(),
    // new No1WebpackPlugin({ msg: 'good boy!' })
    new No2WebpackPlugin({ msg: 'bad boy!' })
  ]
}
```

试试效果？


![](https://user-gold-cdn.xitu.io/2020/5/18/172238b96ebe58d9?w=3360&h=1888&f=jpeg&s=545637)

这时候，`compilation`就只执行一次了，而且`dist`中也没有再生成`html`文件了。

(当然，我这里只是为了演示哈，在确定完了之后，我又把`html-webpack-plugin`给启用了)



### Compiler和Compilation

想必上面两个钩子函数的区别大家应该都搞懂了吧，接下来就让我们看看`Compiler`和`Compilation`这两个对象的区别。

通过查看官方文档，我们发现，刚刚用到的`compiler.hooks.compilation`这个钩子，是能够接收一个参数的：


![](https://user-gold-cdn.xitu.io/2020/5/18/172238bba9726d74?w=1810&h=1646&f=jpeg&s=255435)

貌似这个形参的名字就是叫做`compilation`，它和`Compilation`对象是不是有什么联系呢？或者说，它就是一个`Compilation`？。

OK👌，我就假设它是吧，接下来我去查看了一下`compilation钩子`，哇，这钩子的数量是有点多哈，随便挑个顺眼的来玩玩？额，翻到最下面，有个`chunkAsset`，要不就它吧：


![](https://user-gold-cdn.xitu.io/2020/5/18/172238bd3784a6de?w=1534&h=1124&f=jpeg&s=177079)

可以看到这个钩子函数是有两个参数的：

- `chunk`：表示的应该就是当前的模块吧
- `filename`：模块的名称

接着让我们来改写一下`No2-webpack-plugin`插件：

*src/No2-webpack-plugin.js*:

```diff
function No2WebpackPlugin (options) {
  this.options = options
}
No2WebpackPlugin.prototype.apply = function (compiler) {
  compiler.hooks.compile.tap('No2', (compilation) => {
    console.log('compile')
  })
  compiler.hooks.compilation.tap('No2', (compilation) => {
    console.log('compilation')
+   compilation.hooks.chunkAsset.tap('No2', (chunk, filename) => {
+     console.log(chunk)
+     console.log(filename)
+   })
  })
}
module.exports = No2WebpackPlugin;
```

我们做了这么几件事：

- 在`Compiler`的`compilation`钩子函数中，获取到`Compilation`对象
- 之后对每一个`Compilation`对象调用它的`chunkAsset`钩子
- 根据文档我们发现`chunkAsset`钩子是一个`SyncHook`类型的钩子，所以只能用`tap`去调用

如果和我们猜测的一样，每个`Compilation`对象都对应着一个输出资源的话，那么当我们执行`npm run build`之后，控制台肯定会打印出两个`chunk`以及两个`filename`。

一个是`index.html`，一个是`main.bundle.js`。

OK👌，来瞅瞅。

现在看看你的控制台是不是打印出了一大长串呢？呆呆这里简写一下输出结果：

```
'compile'
'compilation'
'compilation'
Chunk {
  id: 'HtmlWebpackPlugin_0',
  ...
}
'__child-HtmlWebpackPlugin_0'
Chunk {
  id: 'main',
  ...
}
'main.bundle.js'
```

可以看到，确实是有两个`Chunk`对象，还有两个文件名称。

只不过`index.html`不是按照我们预期的输出为`"index.html"`，而是输出为了`__child-HtmlWebpackPlugin_0`，这点呆呆猜测是`html-webpack-plugin`插件本身做了一些处理吧。



### Compiler和Compilation对象的内容

如果大家把这两个对象打印在控制台上的话会发现有一大长串，呆呆这边找到了一份比较全面的对象属性的清单，大家可以看一下：

(图片与总结来源：[编写一个自己的webpack插件plugin](https://juejin.im/post/5d70b3e551882546ce277687#heading-3))

**Compiler 对象包含了 Webpack 环境所有的的配置信息**，包含 `options`，`hook`，`loaders`，`plugins` 这些信息，这个对象在 `Webpack` 启动时候被实例化，它是**全局唯一**的，可以简单地把它理解为 `Webpack` 实例；`Compiler`中包含的东西如下所示：


![](https://user-gold-cdn.xitu.io/2020/5/18/172286136973404c?w=373&h=508&f=jpeg&s=68676)

**Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等**。当 `Webpack` 以开发模式运行时，每当检测到一个文件变化，一次新的 `Compilation` 将被创建。`Compilation` 对象也提供了很多事件回调供插件做扩展。通过 `Compilation` 也能读取到 `Compiler` 对象。


![](https://user-gold-cdn.xitu.io/2020/5/18/17228614ac66a63c?w=467&h=973&f=jpeg&s=148141)



好了，看到这里我相信你已经掌握了一个`webpack`插件的基本开发方式了。这个东西咋说呢，只有自己去多试试，多玩玩上手才能快，下面呆呆也会为大家演示一些稍微复杂一些的插件的开发案例。可以跟着一起来玩玩呀。


![](https://user-gold-cdn.xitu.io/2020/5/18/1722864ccd494012?w=255&h=255&f=jpeg&s=5937)

## fileList.md案例

唔...看了网上挺多这个`fileList.md`案例的，要不咱也给整一个？

### 明确需求

它的功能点其实很简单：

- 在每次`webpack`打包之后，自动产生一个打包文件清单，实际上就是一个`markdown`文件，上面记录了打包之后的文件夹`dist`里所有的文件的一些信息。

大家在接收到这个需求的时候，可以先想想要如何去实现：

- 首先要确定我们的插件是不是需要传递参数进去
- 确定我们的插件是要在那个钩子函数中执行
- 我们如何创建一个`markdown`文件并塞到`dist`里
- `markdown`文件内的内容是长什么样的

针对第一点，我认为我们可以传递一个最终生成的文件名进去，例如这样调用：

```javascript
module.exports = {
  new FileListPlugin({
    filename: 'fileList.md'
  })
}
```

第二点，因为是在打包完成之前，所以我们可以去[compiler 钩子](https://www.webpackjs.com/api/compiler-hooks/#emit)来查查有没有什么可以用的。

咦～这个叫做`emit`的好像挺符合的：

- 类型： `AsyncSeriesHook`
- 触发的事件：生成资源到 `output` 目录之前。
- 参数：`compilation`

第三点的话，难道要弄个`node`的`fs`？再创建个文件之类的？唔...不用搞的那么复杂，等会让我们看个简单点的方式。

第四点，我们就简单点，例如写入这样的内容就可以了：

```markdown
# 一共有2个文件

- main.bundle.js
- index.html

```



### 代码分析

由于功能也并不算很复杂，呆呆这里就直接上代码了，然后再来一步一步解析。

还是基于刚刚的案例，让我们继续在`plugins`文件夹下创建一个新的插件：

*plugins/File-list-plugin.js*:

```javascript
function FileListPlugin (options) {
  this.options = options || {};
  this.filename = this.options.filename || 'fileList.md'
}

FileListPlugin.prototype.apply = function (compiler) {
  // 1.
  compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, cb) => {
    // 2.
    const fileListName = this.filename;
    // 3.
    let len = Object.keys(compilation.assets).length;
    // 4.
    let content = `# 一共有${len}个文件\n\n`;
    // 5.
    for (let filename in compilation.assets) {
      content += `- ${filename}\n`
    }
    // 6.
    compilation.assets[fileListName] = {
      // 7.
      source: function () {
        return content;
      },
      // 8.
      size: function () {
        return content.length;
      }
    }
    // 9.
    cb();
  })
}
module.exports = FileListPlugin;
```

代码分析：

1. 通过`compiler.hooks.emit.tapAsync()`来触发生成资源到`output`目录之前的钩子，且回调函数会有两个参数，一个是`compilation`，一个是`cb`回调函数
2. 要生成的`markdown`文件的名称
3. 通过`compilation.assets`获取到所有待生成的文件，这里是获取它的长度
4. 定义`markdown`文件的内容，也就是先定义一个一级标题，`\n`表示的是换行符
5. 将每一项文件的名称写入`markdown`文件内
6. 给我们即将生成的`dist`文件夹里添加一个新的资源，资源的名称就是`fileListName`变量
7. 写入资源的内容
8. 指定新资源的大小，用于`webpack`展示
9. 由于我们使用的是`tapAsync`异步调用，所以必须执行一个回调函数`cb`，否则打包后就只会创建一个空的`dist`文件夹。

好滴，大功告成，让我们赶紧来试试这个新插件吧，修改`webpack.config.js`的配置：

*webpack.config.js*:

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const No1WebpackPlugin = require('./plugins/No1-webpack-plugin');
// const No2WebpackPlugin = require('./plugins/No2-webpack-plugin');
const FileListPlugin = require('./plugins/File-list-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'custom-plugin'
    }),
    new CleanWebpackPlugin(),
    // new No1WebpackPlugin({ msg: 'good boy!' })
    // new No2WebpackPlugin({ msg: 'bad boy!' })
    new  FileListPlugin()
  ]
}
```

来执行一下`npm run build`看看吧：


![](https://user-gold-cdn.xitu.io/2020/5/18/172238beb58e1370?w=3360&h=1888&f=jpeg&s=653798)



### 使用tapPromise重写

可以看到，上面👆的案例我们是使用`tapAsync`来调用钩子函数，这个`tapPromise`好像还没有玩过，唔...我们看看它是怎样用的。

现在让我们来改下需求，刚刚我们好像看不太出来是异步执行的。现在我们改为`1s`后才输出资源。

重写一下刚刚的插件：

*plugins/File-list-plugin.js*:

```javascript
function FileListPlugin (options) {
  this.options = options || {};
  this.filename = this.options.filename || 'fileList.md'
}

FileListPlugin.prototype.apply = function (compiler) {
  // 第二种 Promise
  compiler.hooks.emit.tapPromise('FileListPlugin', compilation => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 1000)
    }).then(() => {
      const fileListName = this.filename;
      let len = Object.keys(compilation.assets).length;
      let content = `# 一共有${len}个文件\n\n`;
      for (let filename in compilation.assets) {
        content += `- ${filename}\n`;
      }
      compilation.assets[fileListName] = {
        source: function () {
          return content;
        },
        size: function () {
          return content.length;
        }
      }
    })
  })
}
module.exports = FileListPlugin;
```

可以看到它与第一种`tapAsync`写法的区别了：

- 回调函数中只需要一个参数`compilation`，不需要再调用一下`cb()`
- 返回的是一个`Promise`，这个`Promise`在`1s`后才`resolve()`。

大家可以自己写写看看效果，应该是和我们预期的一样的。

另外，`tapPromise`还允许我们使用`async/await`的方式，比如这样：

```javascript
function FileListPlugin (options) {
  this.options = options || {};
  this.filename = this.options.filename || 'fileList.md'
}

FileListPlugin.prototype.apply = function (compiler) {
  // 第三种 await/async
  compiler.hooks.emit.tapPromise('FileListPlugin', async (compilation) => {
    await new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })
    const fileListName = this.filename;
    let len = Object.keys(compilation.assets).length;
    let content = `# 一共有${len}个文件\n\n`;
    for (let filename in compilation.assets) {
      content += `- ${filename}\n`;
    }
    compilation.assets[fileListName] = {
      source: function () {
        return content;
      },
      size: function () {
        return content.length;
      }
    }
  })
}
module.exports = FileListPlugin;
```

嘻嘻😁，貌似真的也不难。


![](https://user-gold-cdn.xitu.io/2020/5/18/17228685289a64be?w=500&h=500&f=jpeg&s=25712)


## Watch-plugin案例

### 明确需求

话不多说，让我们接着来看一个监听的案例。需求如下：

- 当项目在开启观察者`watch`模式的时候，监听每一次资源的改动
- 当每次资源变动了，将改动资源的个数以及改动资源的列表输出到控制台中
- 监听结束之后，在控制台输出`"本次监听停止了哟～"`

那么首先为了满足第一个条件，我们得设计一条`watch`的指令，以保证使用`npm run watch`命令之后，会看到编译过程，但是不会退出命令行，而是实时监控文件。这也很简单，加一条脚本命令就可以了。

呆呆在[霖呆呆向你发起了多人学习webpack-构建方式篇(2)](https://juejin.im/post/5ea2a64a51882573a509c426#heading-4)中也有说的很详细了。

*package.json*:

```json
{
  "script": "webpack --watch --mode development"
}
```

然后想一想我们的插件该如何设计，这时候就要知道我们需要调用哪个钩子函数了。

去官网上看一看，这个`watchRun`就很符合呀：

- 类型：`AsyncSeriesHook`
- 触发的事件：监听模式下，一个新的编译(compilation)触发之后，执行一个插件，但是是在实际编译开始之前。
- 参数：`compiler`

针对第三点，监听结束之后，`watchClose`就可以了：

- 类型：`SyncHook`
- 触发的事件：监听模式停止。
- 参数：无



### 代码分析

好的👌，让我们开干吧。在此项目的`plugins`文件夹下再新建一个叫做`Watch-plugin`的插件。

先搭一下插件的架子吧：

*plugins/Watch-plugin.js*:

```javascript
function WatcherPlugin (options) {
  this.options = options || {};
}

WatcherPlugin.prototype.apply = function (compiler) {
  compiler.hooks.watchRun.tapAsync('WatcherPlugin', (compiler, cb) => {
    console.log('我可是时刻监听着的 🚀🚀🚀')
    console.log(compiler)
    cb()
  })
  compiler.hooks.watchClose.tap('WatcherPlugin', () => {
    console.log('本次监听停止了哟～👋👋👋')
  })
}
module.exports = WatcherPlugin;
```

(额，这个火箭🚀呆呆是用Mac自带的输入法打出来的，其它输入法应该也有吧)

通过上面几个案例的讲解，这段代码大家应该都没有什么疑问了吧。

那么现在的问题就是如何知道哪些文件改变了。其实我们在研究一个新东西的时候，如果没啥思路，不如就在已有的条件上先找一下，比如这里我们就只知道一个`compiler`，那么我们就可以查找一下它里面的属性，看看有什么是我们能用的吗。

也就是上面的这张图：


![](https://user-gold-cdn.xitu.io/2020/5/18/17228696e67db7a9?w=373&h=508&f=jpeg&s=68676)

可以看到，有一个叫做`watchFileSystem`的属性应该就是我们想要的监听文件的属性了，打印出来看看？

好滴👌，那就先让我启动这个插件吧，也就是改一下`webpack.config.js`那里的配置，由于上面几个案例都已经演示过了，呆呆这里就不再累赘，直接跳过讲解这一步了。

直接让我们来`npm run watch`一下吧，控制台已经输出了它，可是由于我们是需要监听文件的改变，所以虽然控制台输出了`watchFileSystem`，但是这一次是初始化时打印的，也就是说我们需要改动一下本地的一个资源然后保存再来看看效果。

例如，我随便改动一下`src/index.js`中的内容然后保存。这时候就触发了监听事件了，让我们来看一下打印的结果：


![](https://user-gold-cdn.xitu.io/2020/5/18/1722869df43ee834?w=1606&h=998&f=jpeg&s=258865)

可以看到`watchFileSystem`中确实有一个`watch`属性，而且里面有一个`fileWatchers`的列表，还有一个`mtimes`对象。这两个属性引起了我的注意。貌似`mtimes`对象就是我们想要的了。

它是一个键值对，键名为改动的文件的路径，值为时间。

那么我们就可以直接来获取它了：

```javascript
function WatcherPlugin (options) {
  this.options = options || {};
}

WatcherPlugin.prototype.apply = function (compiler) {
  compiler.hooks.watchRun.tapAsync('WatcherPlugin', (compiler, cb) => {
    console.log('我可是时刻监听着的 🚀🚀🚀')
    let mtimes = compiler.watchFileSystem.watcher.mtimes;
    let mtimesKeys = Object.keys(mtimes);
    if (mtimesKeys.length > 0) {
      console.log(`本次一共改动了${mtimesKeys.length}个文件,目录为:`)
      console.log(mtimesKeys)
      console.log('------------分割线-------------')
    }
    cb()
  })
  compiler.hooks.watchClose.tap('WatcherPlugin', () => {
    console.log('本次监听停止了哟～👋👋👋')
  })
}
module.exports = WatcherPlugin;
```

好滴，接着：

- 保存文件
- 重新执行`npm run watch`
- 第一次打印看不出效果，接着让我们改动一下`src/index.js`，随便加个注释
- 再保存`src/index.js`文件，打印结果如下：


![](https://user-gold-cdn.xitu.io/2020/5/18/172286acbefe2f81?w=3360&h=1888&f=jpeg&s=670016)

好滴👌，这样就实现了一个简单的文件监听功能。不过使用`mtimes`只能获取到简单的文件的路径和修改时间。如果要获取更加详细的信息可以使用`compiler.watchFileSystem.watcher.fileWatchers`，但是我试了一下这里面的数组是会把`node_modules`里的改变也算上的，例如这样：


![](https://user-gold-cdn.xitu.io/2020/5/18/172286ae89fa2ce7?w=2370&h=1482&f=jpeg&s=432034)

所以如果针对于这道题的话，我们可以写一个正则小小的判断一下，去除`node_modules`文件夹里的改变，代码如下：

```javascript
function WatcherPlugin (options) {
  this.options = options || {};
}

WatcherPlugin.prototype.apply = function (compiler) {
  compiler.hooks.watchRun.tapAsync('WatcherPlugin', (compiler, cb) => {
    console.log('我可是时刻监听着的 🚀🚀🚀')
    // let mtimes = compiler.watchFileSystem.watcher.mtimes;
    // let mtimesKeys = Object.keys(mtimes);
    // if (mtimesKeys.length > 0) {
    //   console.log(`本次一共改动了${mtimesKeys.length}个文件,目录为:`)
    //   console.log(mtimesKeys)
    //   console.log('------------分割线-------------')
    // }
    const fileWatchers = compiler.watchFileSystem.watcher.fileWatchers;
    console.log(fileWatchers)
    let paths = fileWatchers.map(watcher => watcher.path).filter(path => !/(node_modules)/.test(path))
    
    if (paths.length > 0) {
      console.log(`本次一共改动了${paths.length}个文件,目录为:`)
      console.log(paths)
      console.log('------------分割线-------------')
    }
    cb()
  })
  compiler.hooks.watchClose.tap('WatcherPlugin', () => {
    console.log('本次监听停止了哟～👋👋👋')
  })
}
module.exports = WatcherPlugin;
```

另外呆呆在读[ 《深入浅出Webpack》](https://webpack.wuhaolin.cn/5%E5%8E%9F%E7%90%86/5-4%E7%BC%96%E5%86%99Plugin.html)的时候，里面也有提到：

默认情况下 Webpack 只会监视入口和其依赖的模块是否发生变化，在有些情况下项目可能需要引入新的文件，例如引入一个 HTML 文件。 由于 JavaScript 文件不会去导入 HTML 文件，Webpack 就不会监听 HTML 文件的变化，编辑 HTML 文件时就不会重新触发新的 Compilation。 为了监听 HTML 文件的变化，我们需要把 HTML 文件加入到依赖列表中，为此可以使用如下代码：

```javascript
compiler.plugin('after-compile', (compilation, callback) => {
  // 把 HTML 文件添加到文件依赖列表，好让 Webpack 去监听 HTML 模块文件，在 HTML 模版文件发生变化时重新启动一次编译
    compilation.fileDependencies.push(filePath);
    callback();
})
```

感兴趣的小伙伴可以自己去实验一下，呆呆这里就不做演示了。


## Decide-html-plugin案例

再来看个案例，这个插件是用来检测我们有没有使用`html-webpack-plugin`插件的。

还记得我们前面说的`Compiler`对象中，包含了 Webpack 环境所有的的配置信息，包含 `options`，`hook`，`loaders`，`plugins` 这些信息。

那么这样我就可以通过`plugins`来判断是否使用了`html-webpack-plugin`了。

由于功能不复杂，呆呆这就直接上代码了：

```javascript
function DecideHtmlPlugin () {}

DecideHtmlPlugin.prototype.apply = function (compiler) {
  compiler.hooks.afterPlugins.tap('DecideHtmlPlugin', compiler => {
    const plugins = compiler.options.plugins;
    const hasHtmlPlugin = plugins.some(plugin => {
      return plugin.__proto__.constructor.name === 'HtmlWebpackPlugin'
    })
    if (hasHtmlPlugin) {
      console.log('使用了html-webpack-plugin')
    }
  })
}

module.exports = DecideHtmlPlugin
```

有需要注意的点⚠️：

- `afterPlugins`：设置完初始插件之后，执行插件。
- `plugins`拿到的会是一个插件列表，包括我们的自定义插件`DecideHtmlPlugin`也会在里面
- `some()`是`Array.prototype`上的方法，用于判断某个数组是否有符合条件的项，只要有一项满足就返回`true`，否则返回`false`

配置一下`webpack.config.js`，来看看效果是可以的：


![](https://user-gold-cdn.xitu.io/2020/5/18/172286ed154d1866?w=3360&h=1888&f=jpeg&s=579510)


## Clean-plugin案例

还记得上面👆的项目我们用到的那个`clean-webpack-plugin`，现在我们自己来实现一个简易版的`clean-webpack-plugin`吧，名称就叫`Clean-plugin`。

### 明确需求

一样的，首先还是明确一下我们的需求：

我们需要设计这么一个插件，在每次重新编译之后，都会自动清理掉上一次残余的`dist`文件夹中的内容，不过需要满足以下需求：

- 插件的`options`中有一个属性为`exclude`，为一个数组，用来定义不需要清除的文件列表
- 每次打包如果文件有修改则会生成新的文件且文件的指纹也会变(文件名以`hash`命名)
- 生成了新的文件，则需要把以前的文件给清理掉。

例如我第一次打包之后，生成的`dist`目录结构是这样的：

```
/dist
  |- main.f89e7ffee29ee9dbf0de.js
  |- main.f97284d8479b13c49723.css
```

然后我修改了一下`js`文件并重新编译，新的目录结构应该是这样的：

```
/dist
  |- main.e0c6be8f72d73a68f73a.js
  |- main.f97284d8479b13c49723.css
```

可以看到，如果我们是用`chunkhash`给输出文件命名的话，只改变`js`文件，则`js`文件的文件名会发生变化，而不会影响`css`文件。 

如果对三种`hash`命名还不清楚的小伙伴，可以花上十分种看下我的这篇文章：[霖呆呆的webpack之路-三种hash的区别](https://www.jianshu.com/p/486453d81088)，里面对三种`hash`的使用场景以及区别都说的很清楚。

此时，我们就需要将旧的`js`文件给替换成新的，也就是只删除`main.f89e7ffee29ee9dbf0de.js`文件。

而如果我们在配置插件的时候加了`exclude`属性的话，则不需要把这个属性中的文件给删除。例如如果我是这样配置的话：

```javascript
module.exports = {
  new CleanPlugin({
    exclude: [
      "main.f89e7ffee29ee9dbf0de.js"
    ]
  })
}
```

那么这时候就算你修改了`js`文件，结果虽然会生成新的`js`文件，但是也不会把旧的给删除，而是共存：

```
/dist
  |- main.f89e7ffee29ee9dbf0de.js
  |- main.e0c6be8f72d73a68f73a.js
  |- main.f97284d8479b13c49723.css
```



### 代码分析

所以针对于上面这个需求，我们先给自己几个灵魂拷问：

1. 此插件在哪个钩子函数中执行
2. 如何获取旧的`dist`文件夹中的所有文件
3. 如何获取新生成的所有文件，以及`options.exclude`中的文件名称，并合并为一个无重复项的数组
4. 如何将旧的所有文件和新的所有文件做一个对比得出需要删除的文件列表
5. 如何删除被废弃的文件

(在这个过程中我们肯定会碰到很多自己不知道的知识点，请不要慌，大家都是有这么一个不会到会的过程)

**问题一**

在哪个钩子函数中执行，我觉得可以在`"done"`中，因为我们其中的一个目的就是既能拿到旧的文件夹内容，又能拿到新的。而在这个阶段，表示已经编译完成了，所以是可以拿到最新的资源了。

**问题二**

获取旧的`dist`文件夹内的内容。还记得我们的`dist`文件夹是怎么来的吗？它是在我们`webpack.config.js`这个文件中配置的`output`项：

```javascript
module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist')
  }
}
```

所以很轻松的我们可以通过`compiler.options.output.path`就拿到这个旧的输出路径了，然后我们需要去读取这个路径文件夹下的所有文件，也就是遍历`dist`文件夹。

这边我们需要用到一个叫`recursive-readdir-sync`的东西，稍后我们需要安装它，它的作用就是**以递归方式同步读取目录路径的内容**。(github地址为：[https://github.com/battlejj/recursive-readdir-sync](https://github.com/battlejj/recursive-readdir-sync))

**问题三**

获取新生成的所有文件，也就是所有的资源。这点得看`"done"`回调函数中的参数`stats`了。如果你把这个参数打印出来看的话会发现它包括了`webpack`中的很多配置，包括`options`包括`assets`等等。而这里我们就是需要获取打包完之后的所有最新资源也就是`assets`属性。

你以为直接`stats.assets`获取就完了吗？如果你试图这样去做的话，就会报错了。在`webpack`中它鼓励你用`stats.toJson().assets`的方式来获取。这点呆呆也不是很清楚原因，大家可以看一下这里：

[https://www.codota.com/code/javascript/functions/webpack/Stats/toJson](https://www.codota.com/code/javascript/functions/webpack/Stats/toJson)

然后至于`options.exclude`中的文件名称，这个在插件的构造函数中定义一个`options`属性就可以拿到了。

合并无重复项我们可以使用`lodash.union`方法，[lodash](https://www.lodashjs.com/docs/latest)它是一个高性能的 JavaScript 实用工具库，里面提供了许多的方法来使我们更方便的操作数组、对象、字符串等。而这里的`union`方法就是能把多个数组合并成一个无重复项的数组，例如🌰：

```javascript
_.union([2], [1, 2]);
// => [2, 1]
```

至于为什么要把这两个数组组合起来呢？那也是为了保证`exclude`中定义的文件在后面比较的过程中不会被删除。

**问题四**

将新旧文件列表做对比，得出最终需要删除的文件列表。

唔...其实最难的点应该就是在这里了。因为这里并不是简单的文件名称字符串匹配，它需要涉及到路径问题。

例如，我们前面说到可以通过`compiler.options.output.path`拿到文件的输出路径，也就是`dist`的绝对路径，我们命名为`outputPath`，它可能是长这样的：

```
/Users/lindaidai/codes/webpack/webpack-example/webpack-custom-plugin/dist
```

而后我们会用一个叫`recursive-readdir-sync`的东西去处理这个绝对路径，获取里面的所有文件：

```javascript
recursiveReadSync(outputPath)
```

这里得到的会是各个文件：

```
[
  file /Users/lindaidai/codes/webpack/webpack-example/webpack-custom-plugin/dist/main.f89e7ffee29ee9dbf0de.js,
  file /Users/lindaidai/codes/webpack/webpack-example/webpack-custom-plugin/dist/css/main.124248e814cc2eeb1fd4.css
]
```

以上得到的列表就是旧的`dist`文件夹中的所有文件列表。

而后，我们需要得到新生成的文件的列表，也就是`stats.toJson().assets.map(file => file.name)`和`exclude`合并后的那个文件列表，我们称为`newAssets`。但是这里需要注意的就是`newAssets`中的是各个新生成的文件的名称，也就是这样：

```javascript
[
  "main.e0c6be8f72d73a68f73a.js",
  "main.124248e814cc2eeb1fd4.css"
]
```

所以我们需要做一些额外的路径转换的处理，再来进行比较。

而如果在路径前缀相同的情况下，我们只需要把`recursiveReadSync(outputPath)`处理之后的结果做一层过滤，排除掉`newAssets`里的内容，那么留下来的就是需要删除的文件，也就是`unmatchFiles`这个数组。

有点绕？让我们来写下伪代码：

```javascript
const unmatchFiles = recursiveReadSync(outputPath).filter(file => {
  // 这里与 newAssets 做对比
  // 过滤掉存在 newAssets 中的文件
})

// unmatchFiles 就是为我们需要清理的所有文件
```

在这个匹配的过程中，我们会需要用到一个`minimatch`的工具库，它很适合用来做这种文件路径的匹配。

github地址可以看这里：[https://github.com/isaacs/minimatch](https://github.com/isaacs/minimatch)

**问题五**

在上一步中我们会得到需要删除的文件列表，这时候只需要调用一下`fs`模块中的`unlinkSync`方法就可以删除了。

例如：

```javascript
// 删除未匹配文件
unmatchFiles.forEach(fs.unlinkSync);
```



### 案例准备

好滴，分析了这么多，是时候动手来写一写了，还是基于之前的那个案例。让我们先来安装一下上面提到的一些模块或者工具：

```
cnpm i --save-dev recursive-readdir-sync minimatch lodash.union
```

唔。然后为了能看到之后修改文件有没有删除掉旧的文件这个效果，我们可以来写一些`css`的样式，然后用`MiniCssExtractPlugin`这个插件去提取出`css`代码，这样打包之后就可以放到一个单独的`css`文件中了。

关于这个插件，不清楚的小伙伴你就理解它为下面这个场景：

我的`src`下有一个`index.js`和一个`style.css`，如果在`index.js`中引用了`style.css`的话：

```javascript
import './style.css';
```

最终的`css`代码是会被打包进`js`文件中的，`webpack`并不会那么智能的把它拆成一个单独的`css`文件。

所以这时候就可以用`MiniCssExtractPlugin`这个插件来单独的提前`css`。(不过这个插件的主要作用还是为了提取公共的`css`代码哈，在这里我们只是为了将`css`提取出来)

更多有关`MiniCssExtractPlugin`的功能可以看我的这篇介绍：[霖呆呆的webpack之路-优化篇](https://github.com/LinDaiDai/niubility-coding-js/blob/master/前端工程化/webpack/霖呆呆的webpack之路-优化篇.md#mini-css-extract-plugin)

好滴，首先让我们来安装它，顺便安装一下另两个`loader`：

```
cnpm i --save-dev style-loader css-loader mini-css-extract-plugin
```

然后在`src`目录下新建一个`style.css`文件，并写点样式：

*src/style.css*:

```css
.color_red {
  color: red;
}
.color_blue {
  color: blue;
}
```

接着快速来配置一下`webpack.config.js`:

(这里面有用到一个`CleanPlugin`的插件，它是我们接下来要创建的文件)

*webpack.config.js*:

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('./plugins/Clean-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: [
    './src/index.js',
    './src/style.css'
  ],
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'custom-plugin'
    }),
    new CleanPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  }
}
```

这里有一点前面也提到了，就是关于`output.filename`的命名和`MiniCssExtractPlugin`中生成`css`文件的命名，我们采用`contenthash`的方式，这样的话，如果我们只改变了`js`文件的话，那么重新打包之后，就只有`js`文件的`hash`会被重新生成，而`css`不会。这也是为了之后看到效果。

### coding

最后，在`plugins`文件夹下创建我们的`Clean-plugin.js`吧：

*plugins/Clean-plugin.js*:

```javascript
const recursiveReadSync = require("recursive-readdir-sync");
const minimatch = require("minimatch");
const path = require("path");
const fs = require("fs");
const union = require("lodash.union");
function CleanPlugin (options) {
  this.options = options;
}
// 匹配文件
function getUnmatchFiles(fromPath, exclude = []) {
  const unmatchFiles = recursiveReadSync(fromPath).filter(file =>
    exclude.every(
      excluded => {
        return !minimatch(path.relative(fromPath, file), path.join(excluded), {
          dot: true
        })
      }
    )
  );
  return unmatchFiles;
}
CleanPlugin.prototype.apply = function (compiler) {
  const outputPath = compiler.options.output.path;
  compiler.hooks.done.tap('CleanPlugin', stats => {
    if (compiler.outputFileSystem.constructor.name !== "NodeOutputFileSystem") {
      return;
    }
    const assets = stats.toJson().assets.map(asset => asset.name);
    // 多数组合并并且去重
    const newAssets = union(this.options.exclude, assets);
    // 获取未匹配文件
    const unmatchFiles = getUnmatchFiles(outputPath, newAssets);
    // 删除未匹配文件
    unmatchFiles.forEach(fs.unlinkSync);
  })
}

module.exports = CleanPlugin;
```

比较难的技术难点在「代码分析」中都已经说明了，这里主要说下：

`path.relative()`：

`path.relative()` 方法根据当前工作目录返回 `from` 到 `to` 的相对路径。 如果 `from` 和 `to` 各自解析到相同的路径（分别调用 `path.resolve()` 之后），则返回零长度的字符串。

```javascript
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
// 返回: '../../impl/bbb'
```



### 试试效果

先来看看我们现在的目录结构：


![](https://user-gold-cdn.xitu.io/2020/5/18/1722870e8d37aaef?w=602&h=710&f=jpeg&s=74653)

首先执行一遍`npm run build`，生成如下内容：


![](https://user-gold-cdn.xitu.io/2020/5/18/1722870fed2c5bb4?w=3360&h=1888&f=jpeg&s=724902)



然后修改一下`src/index.js`中的内容，例如添加一行代码，之后再重新执行`npm run build`：


![](https://user-gold-cdn.xitu.io/2020/5/18/1722871394d9cc6e?w=3360&h=1888&f=jpeg&s=706160)

可以看到，只有改变的`index.js`被重新删除替换了，而`css`文件没有。

再来验证一下`options.exclude`，在`webpack.config.js`中添加一个插件的参数，就用上一次生成的`js`的名称吧：

```javascript
module.exports = {
  plugins: [
    new CleanPlugin({
      exclude: [
        "main.e0c6be8f72d73a68f73a.js"
      ]
    }),
  ]
}
```

再去修改一下`index.js`的内容，例如加两个注释，然后执行`npm run build`，会发现这次旧的`js`文件并不会被删除，而是会在原来的基础上添加一个新的`js`文件。这也证明了我们的`exclude`属性是可用的：

![](https://user-gold-cdn.xitu.io/2020/5/18/17228711eaf8ee1d?w=3360&h=1888&f=jpeg&s=729281)





## 参考文章

知识无价，支持原创。

参考文章：

- [揭秘webpack plugin](https://juejin.im/post/5e1ec79751882536a627f655)
- [写一个简单webpack plugin所引发的思考](https://juejin.im/post/5e6e2b326fb9a07cb24ab84c)
- [深入webpack打包原理，loader和plugin的实现](https://juejin.im/post/5eae43f85188256d841a3b8b)
- [编写一个自己的webpack插件plugin](https://juejin.im/post/5d70b3e551882546ce277687)
- [深入浅出Webpack](https://webpack.wuhaolin.cn/)


## 后语

你盼世界，我盼望你无bug。这篇文章就介绍到这里。

可算是写完了，希望这6个小小的插件案例能够帮助你对`webpack`的执行机制有一个更深入的了解，呆呆也会和你一起，一起加油⛽️。

**(本章节教材案例GitHub地址: [LinDaiDai/webpack-example/tree/webpack-custom-plugin](https://github.com/LinDaiDai/webpack-example/tree/webpack-custom-plugin) ⚠️：请仔细查看README说明)**

喜欢**霖呆呆**的小伙还希望可以关注霖呆呆的公众号 `LinDaiDai` 或者扫一扫下面的二维码👇👇👇.


![](https://user-gold-cdn.xitu.io/2020/5/18/1722874dd307dfbc?w=900&h=500&f=gif&s=1632550)

我会不定时的更新一些前端方面的知识内容以及自己的原创文章🎉

你的鼓励就是我持续创作的主要动力 😊.

相关推荐:

[《全网最详bpmn.js教材》](https://juejin.im/post/5def372af265da33c84a4818)

[《【建议改成】读完这篇你还不懂Babel我给你寄口罩》](https://juejin.im/post/5e477139f265da574c566dda)

[《【建议星星】要就来45道Promise面试题一次爽到底(1.1w字用心整理)》](https://juejin.im/post/5e58c618e51d4526ed66b5cf)

[《【建议👍】再来40道this面试题酸爽继续(1.2w字用手整理)》](https://juejin.im/post/5e6358256fb9a07cd80f2e70)

[《【何不三连】比继承家业还要简单的JS继承题-封装篇(牛刀小试)》](https://juejin.im/post/5e707417e51d45272054d5d3)

[《【何不三连】做完这48道题彻底弄懂JS继承(1.7w字含辛整理-返璞归真)》](https://juejin.im/post/5e75e22951882549027687f9)

[《【精】从206个console.log()完全弄懂数据类型转换的前世今生(上)》](https://juejin.im/post/5d89b2a7f265da03dd3db2ca)

[《霖呆呆的近期面试128题汇总(含超详细答案) | 掘金技术征文》](https://juejin.im/post/5eb55ceb6fb9a0436748297d)