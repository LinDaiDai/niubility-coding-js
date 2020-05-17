# 霖呆呆的webpack之路-自定义plugin篇

你盼世界，我盼望你无`bug`。Hello 大家好！我是霖呆呆！

有很多小伙伴在打算学写一个`webpack`插件的时候，就被官网上那一长条一长条的`API`给吓到了，亦或者翻阅了几篇文章之后但还是不知道从何下手。

而呆呆认为，当你了解了整个插件的创建方式以及执行机制之后，那些个长条的`API`就只是你后期用来开发的`"工具库"`而已，我需要什么，我就去文档上找，大可不必觉得它有多难。

## webpack系列介绍

此系列记录了我在`webpack`上的学习历程。如果你也和我一样想要好好的掌握`webpack`,，那么我认为它对你是有一定帮助的，因为教材中是以一名`webpack`小白的身份进行讲解, 案例`demo`也都很详细, 涉及到：

- [基础篇](https://juejin.im/post/5e9ada576fb9a03c391300a1)
- [构建方式篇](https://juejin.im/post/5ea2a64a51882573a509c426)
- 自定义插件篇(本章)
- 优化篇
- loader篇
- 配置篇

建议先`mark`再花时间来看。

（其实这个系列在很早之前就写了，一直没有发出来，当时还写了一大长串前言可把我感动的，想看废话的可以点这里：[GitHub地址](https://github.com/LinDaiDai/webpack-example)，不过现在让我们正式开始学习吧）

所有文章`webpack`版本号`^4.41.5`, `webpack-cli`版本号`^3.3.10`。

在`webpack3`中，`webpack`本身和它的`CLI`都是在同一个包中，但在第4版中，两者分开来了，也是为了让我们更好地管理它们。



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

- 我们需要调用`compiler.plugin()`并传入第一个参数来指定我们的插件是发生在哪个阶段，也就是这里的`"done"`(一次编译完成之后，也就是打包完成之后)；
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

[《Plugin API》](https://www.webpackjs.com/api/plugins/#tapable)，但并不是说上面的文档就不能看了，我们依然还是可以通过阅读它来了解更多插件相关的知识。


![](https://user-gold-cdn.xitu.io/2020/5/18/1722396a5217689f?w=360&h=308&f=jpeg&s=22054)


### 推荐使用compiler.hooks

既然官方都推荐我们用`compiler.hooks`了，那我们就遵循呗。不过如果你直接去看[Plugin API](https://www.webpackjs.com/api/plugins/#tapable)的话对新手来说好像又有点绕，里面的`Tapable`、`compiler`、`compile`、`compilation`它们直接到底是存在怎样的关系呢？



现在让我们再将`No1-webpack-plugin`使用`compiler.hooks`改造一下吧：

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
- `.tap('No1')`：`tap()`的第一个参数`'No1'`，其实`tap()`这个方法它的第一个参数是可以允许接收一个**字符串**或者一个**Tap**类的对象的，不过在此处我们不深究，你先随便传一个字符串就行了。

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

所以你现在可以看到它两的区别了，一个是代表了整个构建的过程，一个是代表构建过程中的某个模块。

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

好了，看到这里我相信你已经掌握了一个`webpack`插件的基本开发方式了。这个东西咋说呢，只有自己去多试试，多玩玩上手才能快，下面呆呆也会为大家演示一些稍微复杂一些的插件的开发案例。可以跟着一起来玩玩呀。





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



## 参考文章

知识无价，支持原创。

参考文章：

- [揭秘webpack plugin](https://juejin.im/post/5e1ec79751882536a627f655)
- [写一个简单webpack plugin所引发的思考](https://juejin.im/post/5e6e2b326fb9a07cb24ab84c)
- [深入webpack打包原理，loader和plugin的实现](https://juejin.im/post/5eae43f85188256d841a3b8b)


