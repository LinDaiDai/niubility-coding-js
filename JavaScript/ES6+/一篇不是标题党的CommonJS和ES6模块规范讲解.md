## 前言

你盼世界，我盼望你无`bug`。Hello 大家好！我是霖呆呆。

没错，看着这篇文章的标题你可能就不想看了，`CommonJS`和`ES6 Modules`规范这都是啥时候的知识点了，你还在这写呢...

哭😢...

因为呆呆之前对这些规范还真的就只是看一些教材，没有去实践，然后今日实践起来才发现很多教材中提到的知识点并不是那么回事，所以做了一篇总结想分享给大家。

不过其实在发出来之前自己心里也没有太多底，不知道文章中说的一些东西对不对...唔...因此也是做好了被喷的准备，如果确实有理解不到位的地方还请大大们能够指出，一起学习一下哈。(我这也是翻了很多资料没辙了😂)

![](https://user-gold-cdn.xitu.io/2020/4/30/171cb36fed0f7271?w=500&h=480&f=jpeg&s=22744)


## 正文

通过阅读本篇文章你可以学习到：

- 原始模拟模块的一些写法
- CommonJS规范
- AMD规范
- CMD规范
- AMD和CMD的区别
- ES6 Modules规范
- CommonJS与ES6 Modules规范的区别

📒 本文已被收入[niubility-coding-js](https://github.com/LinDaiDai/niubility-coding-js) 霖呆呆个人博客汇总，欢迎Star~

🌰 本文教材案例地址：[CommonJS-example](https://github.com/LinDaiDai/CommonJS-example)

🔥本文排版工具：[mdnice](https://mdnice.com/)， 感谢作者[画手](https://juejin.im/user/59c3205b6fb9a00a532763e2) 😊。




### 原始写法

在没有`CommonJS`和`ES6`的时候，我们想要达到模块化的效果可能有这么三种：

#### 1. 一个函数就是一个模块

```html
<script>
  function m1 () {
    // ...
  }
  function m2 () {
    // ...
  }
</script>
```

> 缺点：污染了全局变量，无法保证不会与其它模块发生冲突，而且模块成员之间看不出直接关系。

#### 2. 一个对象就是一个模块

对象写法 为了解决上面的缺点，可以把模块写成一个对象，所有的模块成员都放到这个对象里面。

**index.html**

```html
<script>
  var module1 = new Object({
    _sum: 0,
    foo1: function () {},
    foo2: function () {}
  })
</script>
```

> 缺点：会暴露所有模块成员，内部的状态可能被改写。

例如，我们如果只是想暴露出两个方法而不暴露出`_sum`，就做不到。

而此时，`_sum`可能被外部改写：

```javascript
module1._sum = 2;
```

#### 3. 立即执行函数为一个模块

```html
<script>
  var module1 = (function() {
    var _sum = 0;
    var foo1 = function () {};
    var foo2 = function () {};
    return {
      foo1: foo1,
      foo2: foo2
    }
  })();
</script>
```

利用立即执行函数内的作用域已经闭包来实现模块功能，导出我们想要导出的成员。

此时外部代码就不能读取到`_sum`了：

```javascript
console.log(module1._sum) // undefined
```



### CommonJS规范

这里不做具体的介绍了，我只把一些重要的知识点以及混淆点例举出来。

主要是从这四个方面说：

- 暴露模块
- 引用模块
- 模块标识符
- CommonJS规范的特点

#### 1. 暴露(定义)模块

**正确的暴露方式：**

暴露模块有两种方式：

- `module.exports = {}`
- `exports.xxx = 'xxx'`

例如有一个`m1.js`文件：

第一种暴露方式：

```javascript
module.exports = {
    name: 'lindaidai',
    sex: 'boy'
}
```

第二种暴露方式：

```javascript
exports.name = 'lindaidai';
exports.sex = 'boy'
```

为什么可以有这两种写法呢？

我是这样理解的：`module`这个变量它代表的就是整个模块，也就是`m1.js`。而其实这个`module`变量是有一个属性`exports`的，它是一个叫做`exports`变量的引用，我们可以写一下伪代码：

```javascript
var exports = {};
var module = {
    exports: exports
}
return module.exports
```

(当然这只是伪代码啊，实际你这么去用会发现没有效果)

最后导出的是`module.exports`，而不是`exports`。

**容易混淆的暴露方式：**

如果你在代码中试图`exports = { name: 'lindaidai' }`，你会发现在引入的地方根本获取不到`name`属性。

```javascript
// m1.js
exports = {
    name: 'lindaidai'
}
```

```javascript
// test.js
const math = require('./m1.js')

console.log(m1); // {}
```

在控制台执行`node test.js`，发现打印出来的`m1`是一个空的对象。

我是这样理解的：整个模块的导出是靠`module.exports`的，如果你重新对整个`exports`对象赋值的话，它和`module.exports`就不是同一个对象了，因为它们指向的引用地址都不同：

```javascript
module.exports -> {} // 指向一个空的对象
exports -> { name: 'lindaidai' } // 指向的是另一个对象
```

所以你对`exports = {}`做任何操作都影响不到`module.exports`。

让我们来看几个正确和错误的示例吧：

```javascript
// m1.js
// 1. 正确
module.exports = {
    name: 'lindaidai',
    sex: 'boy'
}

// 2. 正确
exports.name = 'lindaidai';
exports.sex = 'boy'

// 3. 正确
module.exports.name = 'lindaidai';
module.exports.sex = 'boy'

// 4. 无效
exports = {
    name: 'lindaidai',
    sex: 'boy'
}
```

可以看到

- `exports.name = xxx`是`module.exports.name = xxx`的缩写。
- `exports = {}`确不是`module.exports = {}`的缩写。

#### 2. 引用(引入)模块

对于模块的引用使用全局方法`require()`就可以了。

注意⚠️这个全局方法是`node`中的方法哈，它不是`window`下面的，所以如果你没做任何处理想直接在`html`里用肯定就是不行的了：

**index.html**:

```html
<body>
    <script>
        var m1 = require('./m1.js')
        console.log(m1);
    </script>
</body>
```

例如上面👆这样你打开页面控制台肯定就报错了：

```
Uncaught ReferenceError: require is not defined
	at index.html:11
```

而如果你是在另一个`js`文件中引用(例如`test.js`)，并在终端执行`node test.js`是可以用的：

**test.js**:

```javascript
var m1 = require('./m1.js')

console.log(m1);
```

那是因为你的电脑上全局安装了`Node.js`，所以可以这样玩。

**所以我们可以发现`require()`它是`Node.js`中的一个全局方法，并不是CommonJS独有的，CommonJS只是众多规范中的其中一种。**

这种规范允许我们：

- 使用`module.exports = {}`或者`exports.name = xxx`导出模块
- 使用`const m1 = require('./m1')`引入模块



注意⚠️：

另外还有一点比较重要，那就是`require()`的参数甚至能允许你是一个表达式。

也就是说你可以把它设置为一个变量：

**test.js**:

```javascript
var m1Url = './m1.js';
var m1 = require(m1Url);

// 甚至做一些字符串拼接：
var m1 = require('./m' + '1.js');
```

但是需要注意咯，这个传参可以为表达式并不是`require`特有的。因为`JS`语言是传值调用，函数或者方法在调用的时候参数会被先计算出来，因此在我们使用`require`方法并传入表达式的时候，会先计算出表达式的值再传递给`require`。(感谢掘友[骑自行车](https://juejin.im/user/5a91606ef265da4e7e10d527)的指出)



#### 3. 模块标识符(标识)

模块标识符其实就是你在引入模块时调用`require()`函数的参数。

你会看到我们经常会有这样的用法：

```javascript
// 直接导入
const path = require('path');
// 相对路径
const m1 = require('./m1.js');
// 直接导入
const lodash = require('lodash');
```

这其实是因为我们引入的模块会有不同的分类，像`path`这种它是`Node.js`就自带的模块，`m1`是路径模块，`lodash`是我们使用`npm i lodash`下载到`node_modules`里的模块。

分为以下三种：

- 核心模块(`Node.js`自带的模块)
- 路径模块(相对或绝对定位开始的模块)
- 自定义模块(`node_modules`里的模块)

三种模块的查找方式：

- 核心模块，直接跳过路径分析和文件定位
- 路径模块，直接得出相对路径就好了
- 自定义模块，先在当前目录的`node_modules`里找这个模块，如果没有，它会往上一级目录查找，查找上一级的`node_modules`，依次往上，直到根目录下都没有, 就抛出错误。

**自定义模块的查找过程：**

这个过程其实也叫做**路径分析**。

现在我把刚刚的`test.js`来改一下：

```javascript
// var m1 = require('./m1.js');

// console.log(m1);
console.log(module.paths)
```

然后在终端执行：

```
node test.js
```

会发现输出了下面的一个数组：

```javascript
LinDaiDaideMBP:commonJS lindaidai$ node test.js
[
  '/Users/lindaidai/codes/test/CommonJS和ES6/commonJS/node_modules',
  '/Users/lindaidai/codes/test/CommonJS和ES6/node_modules',
  '/Users/lindaidai/codes/test/node_modules',
  '/Users/lindaidai/codes/node_modules',
  '/Users/lindaidai/node_modules',
  '/Users/node_modules',
  '/node_modules'
]
```

这里所说的查找，是指查找你现在用的这个模块，我现在用的是`test.js`，你可能看不出什么效果。现在让我们来模拟一个我们使用`npm i`安装的一个自定义模块功能。

首先，我在根目录下新建了一个名叫`node_modules`的文件夹，并在其中新建了一个名叫`lindaidai.js`的文件，用来模拟一个`npm`安装的依赖。

目录结构：

![](https://user-gold-cdn.xitu.io/2020/4/30/171cb33ec4f5e5ab?w=608&h=324&f=jpeg&s=32834)

稍微编写一下`lindaidai.js`:

```javascript
module.exports = {
  print: function () {
    console.log('lindaidai')
  }
}
console.log('lindaidai模块：', module.paths)
```

然后在`test.js`中引入这个`lindaidai`模块:

```javascript
// var m1 = require('./m1.js');
// console.log(m1);
// console.log(module.paths)

var lindaidai = require('lindaidai');
lindaidai.print();
```

现在执行`node test.js`，会发现输出了：

```javascript
LinDaiDaideMBP:commonJS lindaidai$ node test.js
lindaidai模块： [
  '/Users/lindaidai/codes/test/CommonJS和ES6/commonJS/node_modules',
  '/Users/lindaidai/codes/test/CommonJS和ES6/node_modules',
  '/Users/lindaidai/codes/test/node_modules',
  '/Users/lindaidai/codes/node_modules',
  '/Users/lindaidai/node_modules',
  '/Users/node_modules',
  '/node_modules'
]
lindaidai
```

所以现在你可以知道，平常我们使用这种依赖的时候，它是怎样的一个查找顺序了吧，它其实就是按照自定义模块的顺序来进行查找。

**文件定位：**

上面👆已经介绍完了路径分析，但是还有一个问题，就是我们导入的模块它的后缀(扩展名)是可以省略的啊，那`Node`怎么知道我们是导入了一个`js`还是一个`json`呢？这其实就涉及到了文件定位。

在NodeJS中, 省略了扩展名的文件, 会依次补充上.js, .node, .json来尝试, 如果传入的是一个目录, 那么NodeJS会把它当成一个包来看待, 会采用以下方式确定文件名

第一步, 找出目录下的package.json, 用JSON.parse()解析出main字段

第二步, 如果main字段指定的文件还是省略了扩展, 那么会依次补充.js, .node, .json尝试.

第三部, 如果main字段制定的文件不存在, 或者根本就不存在package.json, 那么会默认加载这个目录下的index.js, index.node, index.json文件.

以上就是文件定位的过程, 再搭配上路径分析的过程, 进行排列组合, 这得有多少种可能呀. 所以说, 自定义模块的引入, 是最费性能的.

(总结来源：https://zhuanlan.zhihu.com/p/27644026)

#### 4. CommonJS规范的特点

唔...呆呆我先把`CommonJS`规范的一些特点列举出来吧，然后我们再一点一点的去看例子。

- 所有代码都运行在模块作用域，不会污染全局作用域；

- 模块是同步加载的，即只有加载完成，才能执行后面的操作；

- 模块在首次执行后就会缓存，再次加载只返回缓存结果，如果想要再次执行，可清除缓存；

- CommonJS输出是值的拷贝(即，`require`返回的值是被输出的值的拷贝，模块内部的变化也不会影响这个值)。

(总结来源：https://juejin.im/post/5db95e3a6fb9a020704bcd8d)

第一点还是好理解的，咱模块的一个重要的功能不就是这个吗。



第二点**同步加载**，这个写个案例我们来验证一下。

**同步加载案例**：

*m1.js*:

```javascript
console.log('我是m1模块')
module.exports = {
    name: 'lindaidai',
    sex: 'boy'
}
```

*test.js*

```javascript
var m1 = require('./m1');
console.log('我是test模块');
```

可以看到，`test`模块依赖于`m1`，且是先下载的`m1`模块，所以如果我执行`node test.js`，会有以下的执行结果：

```javascript
LinDaiDaideMBP:commonJS lindaidai$ node test.js
我是m1模块
我是test模块
```

这也就验证了`CommonJS`中，模块是同步加载的，即只有加载完成，才能执行后面的操作。



第三点**模块首次执行后会缓存**，我们也可以写个案例来验证一下。

**模块首次执行后会缓存案例：**

*m1.js*:

```javascript
var name = 'lindaidai';
var sex = 'boy';

exports.name = name;
exports.sex = sex;
```

*test.js*:

```javascript
var m1 = require('./m1');
m1.sex = 'girl';
console.log(m1);

var m2 = require('./m1');
console.log(m2);
```

`test`同样依赖于`m1`，但是我会在其中导入两次`m1`，第一次导入的时候修改了`m1.sex`的值，第二次的时候命名为`m2`，但是结果`m1`和`m2`竟然是相等的：

```javascript
LinDaiDaideMBP:commonJS lindaidai$ node test.js
{ name: 'lindaidai', sex: 'girl' }
{ name: 'lindaidai', sex: 'girl' }
```

也就是说模块在首次执行后就会缓存，再次加载只返回缓存结果，这里我是用了改变`m1.sex`的值来证明它确实是取了缓存结果。

那么就有小伙伴会疑惑了，其实你这样写也并不能证明啊，因为你改变了`m1.sex`也可能是影响原本`m1`模块里的`sex`属性呀，这样的话第二次`m2`拿到的肯定就是被改变的值了。

唔...我正想证明来着呢。因为`CommonJS`的第四个特点就可以很好的解决你这个疑问。



第四点**CommonJS输出是值的拷贝**，也就是说你用`require()`引入了模块，但是你在最新的模块中怎样去改变，也不会影响你已经`require()`的模块。来看个案例。

**CommonJS输出是值的拷贝案例**：

*m1.js*:

```javascript
var name = 'lindaidai';
var sex = 'boy';
var advantage = ['handsome']

setTimeout(function () {
  sex = 'girl';
  advantage.push('cute');
}, 500)

exports.name = name;
exports.sex = sex;
exports.advantage = advantage;
```

*test.js*:

```javascript
var m1 = require('./m1');
setTimeout(function () {
  console.log('read count after 1000ms in commonjs is', m1.sex)
  console.log('read count after 1000ms in commonjs is', m1.advantage)
}, 1000)
```

执行`node test.js`之后的执行结果是：

```javascript
LinDaiDaideMBP:commonJS lindaidai$ node test.js
read count after 1000ms in commonjs is boy
read count after 1000ms in commonjs is [ 'handsome', 'cute' ]
```

也就是说，在开始`var m1 = require('./m1')`的时候，`m1`已经被引入进来了，但是过了`500ms`后我改变了原本`m1`里的一些属性，`sex`这种基本数据类型是不会被改变的，但是`advantage`这种引用类型共用的还是同一个内存地址。（这种复制的关系让我想到了之前学原型链继承的时候，它那里也是，会影响`Father.prototype`上的引用类型）

（这也再次证明了霖呆呆真的是个`boy`，就算你试图改变他的性别也是不能成功的）

![](https://user-gold-cdn.xitu.io/2020/4/30/171cb4a244f4cac6?w=780&h=598&f=jpeg&s=75001)

如果这里你是这样写的话：

*m1.js*:

```javascript
var name = 'lindaidai';
var sex = 'boy';
var advantage = ['handsome']

setTimeout(function () {
  sex = 'girl';
  // advantage.push('cute');
  advantage = ['cute'];
}, 500)

exports.name = name;
exports.sex = sex;
exports.advantage = advantage;
```

现在的执行结果肯定就是：

```javascript
LinDaiDaideMBP:commonJS lindaidai$ node test.js
read count after 1000ms in commonjs is boy
read count after 1000ms in commonjs is [ 'handsome' ]
```

因为相当于对`m1`的`advantage`重新赋值了。

当然，或者如果你的`m1.js`中返回的值是会有一个函数的话，在`test.js`也能拿到变化之后的值了，比如这里的一个例子：

```javascript
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  get counter() {
    return counter
  },
  incCounter: incCounter,
};
```

因为在这里实际就形成了一个闭包，而`counter`属性就是一个取值器函数。



好滴，这基本就是`CommonJS`的特点了，总结就不写了，在开头已经说过了，不过对于最后一点：**CommonJS输出是值的拷贝**，这个对于引用类型的变量来说还是会有一点歧义的，比如上面的`advantage`那个例子，大家知道就行了。

![](https://user-gold-cdn.xitu.io/2020/4/30/171cb379ad1d75e1?w=750&h=739&f=jpeg&s=117209)


### AMD规范

#### 1. 产生原因

上面介绍的`CommonJS`规范看起来挺好用的啊，为什么又还要有其它的规范呢？比如`AMD、CMD`，那它们和`CommonJS`又有什么渊源呢？

我们知道，模块化这种概念不仅仅适用于服务器端，客户端同样也适用。

而`CommonJS`规范就不太适合用在客户端(浏览器)环境了，比如上面的那个例子，也就是:

**test.js**:

```javascript
const m1 = require('./m1.js')
console.log(m1);

// 与m1模块无关的一些代码
function other () {}
other();
```

这段代码放在浏览器环境中，它会如何运行呢？

- 首先加载`m1.js`
- 等`m1.js`加载完毕之后才执行后面的内容

这点其实在**CommonJS规范的特点**中已经提到过了。

后面的内容要等待`m1`加载完才会执行，如果`m1`加载的很慢呢？那不就照成了卡顿，这对于客户端来说肯定是不友好的。像这种要等待上一个加载完才执行后面内容的情况我们可以叫做`"同步加载"`，很显然，这里我们更希望的是`other()`的执行不需要等`m1`加载完才执行，也就是我们希望`m1`它是`"异步加载"`的，这也就是`AMD`。

在介绍`AMD`之前让我们看看`CommonJS`规范对服务器端和浏览器的不同，它有助于让你理解为什么说`CommonJS`不太适合于客户端：

- 服务器端所有的模块都存放在本地硬盘中，可以同步加载完成，等待时间就是硬盘的读取时间。
- 浏览器，所有的模块都放在服务器端，等待时间取决于网速的快慢，可能要等很长时间，浏览器处于”假死”状态。

#### 2. 定义并暴露模块

有了上面这层背景，我们就知道了，`AMD`它的产生很大一部分原因就是为了能让我们采用**异步的方式加载模块**。

所以现在来让我们看看它的介绍吧。

`AMD`是`Asynchronous Module Definition`的缩写，也就是`"异步模块定义"`。（前面的`A`就很好记了，它让我不自觉的就想到`async`这个定义异步函数的修饰符）

> 它采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。

此时就需要另一个重要的方法来定义我们的模块：`define()`。

它其实是会有三个参数：

```javascript
define(id?, dependencies?, factory)
```

- id: 一个字符串，表示模块的名称，但是是可选的
- dependencies: 一个数组，是我们当前定义的模块要依赖于哪些模块，数组中的每一项表示的是要依赖模块的相对路径，且这个参数也是可选的
- factory: 工厂方法，一个函数，这里面就是具体的模块内容了

**坑一**：

那其实就有一个问题了，看了这么多的教材，但我想要去写案例的时候，我以为这个`define`能直接像`require`一样去用，结果发现控制台一直再报错：

```javascript
ReferenceError: define is not defined
```

看来它还并不是`Node.js`自带的一个方法啊，搜寻了一下，原来它只是名义上规定的这样一个方法，但是你真的想要去用还是得使用对应的`JavaScript`库，也就是我们常常听到的：

>目前，主要有两个Javascript库实现了AMD规范：require.js和curl.js。

我酸了...

让我们去[requirejs](https://requirejs.org/docs/download.html)的官网看看如何使用它，由于我的案例都是在`Node`执行环境中，于是我采用`npm install`的方式来下载了：

我新建了一个叫`AMD`的文件夹，作为`AMD`的案例。

在项目的根目录下执行：

```javascript
npm i requirejs
```

（找了一圈[NPM](https://www.npmjs.com/)也没看到能使用`CDN`远程引入的）

执行完毕之后，项目的根目录下出现了依赖包，打开看了看，确实是下载下来了：

![](https://user-gold-cdn.xitu.io/2020/4/30/171cb3507d7a13be?w=616&h=586&f=jpeg&s=39552)

现在可以开心的在项目里用`define()`了 😊。

来看个小例子，我重新定义了一个`math.js`：

**math.js**

```javascript
define(function () {
  var add = function (a, b) {
    return a + b;
  }
  return {
    add: add
  }
})
```

这里模块很简单，导出了一个加法函数。

(至于这里为什么`add: add`要这样写，而不是只简写为`add`呢？别忘了这种对象同名属性简写是`ES6`才出来的哦)



#### 3. 引用模块

**坑二**：

OK👌，既然模块已经能导出了，那就让我们来看看如何引用吧，依照着教材，我在`test.js`中引入了`math`模块并想要调用`add()`方法：

**test.js**:

```javascript
require(['math'],function(math) {
  console.log(math)
  console.log(math.add(1, 2));
})
```

之后熟练的执行`node test.js`。

我酸了...

又报错了，擦...

```javascript
 throw new ERR_INVALID_ARG_TYPE(name, 'string', value);
 TypeError [ERR_INVALID_ARG_TYPE]: The "id" argument must be of type string. Received an instance of Array
```

确认了一下，和教材们中的写法一样啊，第一个参数为要加载的模块数组，第二个参数为加载完之后的回调。

难受😣...原来上面👆`require([modules], callback)`这样的写法它和`define`一样都只是个噱头，如果你真得用的话，还是得用`JavaScript`库中的方法。

由于上面已经安装过`requirejs`了，这里我直接使用就可以了，现在我修改了一下`test.js`文件：

```javascript
var requirejs = require("requirejs"); //引入requirejs模块

requirejs(['math'],function(math) {
  console.log(math)
  console.log(math.add(1, 2));
})
```

好了，现在执行`node test.js`就可以正常使用了...

（很难受...感觉明明已经是很常见耳熟能详的一些知识了，真的要去用的时候发现和很多教材中说的不是那么一回事...也希望大家在看完了一些教材之后最好能亲自去实践一下，因为呆呆自己也是写博客的，所以也知道有些时候一些知识点可能也是从别人的文章那里看来但是没有经过实践的，所以最好也还是自己动动手）



#### 4. 依赖其它模块的define

可以看到`define`它还有另外两个参数的，第一个是模块的名称，没啥好说的，让我们来看看第二个它所依赖的模块。

还记得在`CommonJS`规范那里我们写了一个`m1.js`吗？现在就让我们把这个模块拿来用下，把它作为`math.js`中的一个依赖。

**m1.js**:

```javascript
console.log('我是m1, 我被加载了...')
module.exports = {
    name: 'lindaidai',
    sex: 'boy'
}
```

然后修改一下`math.js`：

**math.js**:

```javascript
define(['m1'], function (m1) {
  console.log('我是math, 我被加载了...')
  var add = function (a, b) {
    return a + b;
  }
  var print = function () {
    console.log(m1.name)
  }
  return {
    add: add,
    print: print
  }
})
```

另外，为了方便大家看，我们再来修改一下刚刚的`test.js`：

```javascript
var requirejs = require("requirejs"); //引入requirejs模块

requirejs(['math'],function(math) {
  console.log('我是test, 我被加载了...')
  console.log(math.add(1, 2));
  math.print();
})
function other () {
  console.log('我是test模块内的, 但是我不依赖math')
};
other();
```

所以我们可以看到，依赖关系依次为：

```
test -> math -> m1
```

如果按照`AMD`的规范，模块的加载需要依靠前一个模块加载完才会执行回调函数内的内容，那么我们可以想象当我在终端输入`node test.js`的时候，要出现的结果应该是：

```javascript
LinDaiDaideMBP:commonJS lindaidai$ node test.js
我是test模块内的, 但是我不依赖math
我是m1, 我被加载了...
我是math, 我被加载了...
我是test, 我被加载了...
3
lindaidai
```

(这个，相信大家应该都看清了彼此的依赖关系吧😢)

但是现实总是那么的残酷，当我按下回车的时候，又报错了...

再酸...

```javascript
 ReferenceError: module is not defined
```

看了一下这个报错的内容，是在`m1.js`中...呆了几秒钟反应了过来...

既然是使用`AMD`的规范，那我们肯定是要一统到底了，`m1.js`中用的还是`CommonJS`的规范，当然不行了。

OK，来修改一下`m1.js`：

**m1.js**:

```javascript
define(function () {
  console.log('我是m1, 我被加载了...')
  return {
    name: 'lindaidai',
    sex: 'boy'
  }
})
```

OK👌，这次没啥问题了，按照我们预期的去执行了...😊。

（当然据我的了解，`requirejs`还可用于在`script`中引用然后定义网页程序的主模块等使用，可以看一下：

http://www.ruanyifeng.com/blog/2012/11/require_js.html）

`AMD`的知识点大概就介绍到了这里，相信大家也知道它的基本使用了吧，至于其中的一些区别什么的我在最后也会列一份清单，不过现在让我们先来看看`CMD`吧。



### CMD规范

> CMD (Common Module Definition), 是seajs推崇的规范，CMD则是依赖就近，用的时候再require。

来看段代码，大概感受一下它是怎样用的：

```javascript
define(function(require, exports, module) {
  var math = require('./math');
  math.print()
})
```

看着和`AMD`有点像的，没错，其实`define()`的参数甚至都是一样的：

```
define(id?, dependencies?, factory)
```

但是区别在于哪里呢？让我们来看看最后一个`factory`它参数。

`factory`函数中是会接收三个参数：

- `require`
- `exports`
- `module`

  这三个很好理解，对应着之前的`CommonJS`那不就是：

- `require`：引入某个模块
- `exports`：当前模块的`exports`，也就是`module.exports`的简写
- `module`：当前这个模块

现在再来说说`AMD`和`CMD`的区别。

虽然它们的`define()`方法的参数都相同，但是:

- `AMD`中会把当前模块的依赖模块放到`dependencies`中加载，并在`factory`回调中拿到加载成功的依赖
- `CMD`一般不在`dependencies`中加载，而是写在`factory`中，使用`require`加载某个依赖模块

因此才有了我们常常看到的一句话：

> AMD和CMD最大的区别是对依赖模块的执行时机处理不同，注意不是加载的时机或者方式不同，二者皆为异步加载模块。

（好吧，仔细读了2遍感觉还是没太明白，没事，后面呆呆还会详细说到）

比较有名一点的，`seajs`，来看看它推荐的CMD 模块书写格式吧：

```javascript
// 所有模块都通过 define 来定义
define(function(require, exports, module) {

  // 通过 require 引入依赖
  var $ = require('jquery');
  var Spinning = require('./spinning');

  // 通过 exports 对外提供接口
  exports.doSomething = ...

  // 或者通过 module.exports 提供整个接口
  module.exports = ...

});
```

这是官网的一个小案例，我也去[seajs的文档](https://seajs.github.io/seajs/docs/#docs)中看了一下没啥太大问题，这里就不举例了。

![](https://user-gold-cdn.xitu.io/2020/4/30/171cb39ca85befb6?w=500&h=494&f=jpeg&s=28969)

### AMD和CMD的区别

> AMD和CMD最大的区别是对依赖模块的执行时机处理不同，注意不是加载的时机或者方式不同，二者皆为异步加载模块。

还是上面那句话，让我们来看个小例子理解一下。

同样是`math`模块中需要加载`m1`模块。

在`AMD`中我们会这样写：

**math.js**

```javascript
define(['m1'], function (m1) {
  console.log('我是math, 我被加载了...')
  var add = function (a, b) {
    return a + b;
  }
  var print = function () {
    console.log(m1.name)
  }
  return {
    add: add,
    print: print
  }
})
```

但是对于`CMD`，我们会这样写：

**math.js**

```javascript
define(function (require, exports, module) {
  console.log('我是math, 我被加载了...')
  var m1 = require('m1');
  var add = function (a, b) {
    return a + b;
  }
  var print = function () {
    console.log(m1.name)
  }
  module.exports = {
    add: add,
    print: print
  }
})
```

假如此时`m1.js`中有一个语句是在`m1`模块被加载的时候打印出`"我是m1, 我被加载了..."`。

执行结果区别：

- `AMD`，会先加载`m1`，`"我是m1"`会先执行
- `CMD`，我是`"我是math"`会先执行，因为本题中`console.log('我是math, 我被加载了...')`是放在`require('m1')`前面的。

现在可以很明显的看到区别了。

`AMD`依赖前置，`js`很方便的就知道要加载的是哪个模块了，因为已经在`define`的`dependencies`参数中就定义好了，会立即加载它。

`CMD`是就近依赖，需要使用把模块变为字符串解析一遍才知道依赖了那些模块。

OK👌，来看个总结：

两者之间，最明显的区别就是在模块定义时对依赖的处理不同

**1、AMD推崇依赖前置，在定义模块的时候就要声明其依赖的模块**

**2、CMD推崇就近依赖，只有在用到某个模块的时候再去require**



### ES6 Modules规范

`ES6`标准出来后，`ES6 Modules`规范算是成为了前端的主流吧，以`import`引入模块，`export`导出接口被越来越多的人使用。

下面，我也会从这么几个方面来介绍`ES6 Modules`规范：

- `export`导出模块
- `import`导入模块
- `export...from...`
- `ES6 Modules规范的特点`
- `Babel下的ES6模块转换`

`export`命令和`import`命令可以出现在模块的任何位置，只要处于模块顶层就可以。 如果处于块级作用域内，就会报错，这是因为处于条件代码块之中，就没法做静态优化了，违背了ES6模块的设计初衷。

#### 1. export导出模块

export有两种模块导出方式：

- 命名式导出(名称导出)
- 默认导出(自定义导出)

**命名式导出**

来看几种正确和错误的写法吧：

```javascript
// 以下两种为错误
// 1.
export 1;
// 2.
const a = 1;
export a;

// 以下为正确
// 3.
const a = 1;
export { a };

// 4. 接口名与模块内部变量之间，建立了一一对应的关系
export const a = 1, b = 2;

// 5. 接口名与模块内部变量之间，建立了一一对应的关系
export const a = 1;
export const b = 2;

// 或者用 as 来命名
const a = 1;
export { a as outA };

const a = 1;
const b = 2;
export { a as outA, b as outB };
```

容易混淆的可能是`2`和`4`两种写法了，看着很像，但是`2`却不行。`2`直接导出一个值为`1`的变量是和情况一一样，没有什么意义，因为你在后面要用的时候并不能完成解构。

但是`4`中，接口名与模块内部变量之间，建立了一一对应的关系，所以可以。



**默认导出**

默认导出会在`export`后面加上一个`default`：

```javascript
// 1.
const a = 1;
export default a;

// 2.
const a = 1;
export default { a };

// 3.
export default function() {}; // 可以导出一个函数
export default class(){}; // 也可以出一个类
```

其实，默认导出可以理解为另一种形式上的命名导出，也就是说`a`这个属性名相当于是被我重写了成了`default`：

```javascript
const a = 1;
export defalut a;
// 等价于
export { a as default }
```

所以，我们才可以用`const a = 1; export default a;`这种方式导出一个值。



#### 2. import导入模块

import模块导入与export模块导出功能相对应，也存在两种模块导入方式：命名式导入（名称导入）和默认导入（定义式导入）。

来看看写法：

```javascript
// 某个模块的导出 moudule.js
export const a = 1;

// 模块导入
// 1. 这里的a得和被加载的模块输出的接口名对应
import { a } from './module'

// 2. 使用 as 换名
import { a as myA } from './module'

// 3. 若是只想要运行被加载的模块可以这样写，但是即使加载2次也只是运行一次
import './module'

// 4. 整体加载
import * as module from './module'

// 5. default接口和具名接口
import module, { a } from './module'
```

第四种写法会获取到`module`中所有导出的东西，并且赋值到`module`这个变量下，这样我们就可以用`module.a`这种方式来引用`a`了。



#### 3. export ... from...

其实还有一种写法，可以将`export`和`from`结合起来用。

例如，我有三个模块`a、b、c`。

`c`模块现在想要引入`a`模块，但是它不不直接引用`a`，而是通过`b`模块来引用，那么你可能会想到`b`应该这样写：

```javascript
import { someVariable } from './a';

export { someVariable };
```

引入`someVariable`然后再导出。

这还只是一个变量，我们得导入再导出，若是有很多个变量需要这样，那无疑会增加很多代码量。

所以这时候可以用下面这种方式来实现：

```javascript
export { someVariable } from './a';
```

不过这种方式有一点需要注意：

- 这样的方式不会将数据添加到该聚合模块的作用域, 也就是说, 你无法在该模块(也就是`b`)中使用`someVariable`。



#### 4. ES6 Modules规范的特点

总结一下它的特点哈：

- 输出使用`export`
- 输入使用`import`
- 可以使用`export...from...`这种写法来达到一个`"中转"`的效果
- 输入的模块变量是不可重新赋值的，它只是个可读引用，不过却可以改写属性
- `export`命令和`import`命令可以出现在模块的任何位置，只要处于模块顶层就可以。 如果处于块级作用域内，就会报错，这是因为处于条件代码块之中，就没法做静态优化了，违背了ES6模块的设计初衷。
- `import`命令具有提升效果，会提升到整个模块的头部，首先执行。



#### 5. Bable下的ES6模块转换

还有一点就是，如果你有使用过一些ES6的Babel的话，你会发现当使用`export/import`的时候，Babel也会把它转换为`exports/require`的形式。

例如我的输出：

*m1.js*:

```javascript
export const count = 0;
```

我的输入：

*index.js*:

```javascript
import {count} from './m1.js'
console.log(count)
```

当使用Babel编译之后，各自会被转换为：

*m1.js*:

```javascript
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.count = void 0;
const count = 0;
exports.count = count;
```

*index.js*:

```javascript
"use strict";

var _m = require("./m1.js");

console.log(_m.count);
```

正是因为这种转换关系，才能让我们把`exports`和`import`结合起来用：

也就是说你可以这样用：

```javascript
// 输出模块 m1.js
exports.count = 0;


// index.js中引入
import {count} from './m1.js'
console.log(count)
```



### CommonJS与ES6 Modules规范的区别

😂，我相信很多人就比较关心它两区别的问题，因为基本上面试问的就是这个。好吧，这里来做一个算是比较详细的总结吧。

- CommonJS模块是运行时加载，ES6 Modules是编译时输出接口

- CommonJS输出是值的拷贝；ES6 Modules输出的是值的引用，被输出模块的内部的改变会影响引用的改变
- CommonJs导入的模块路径可以是一个表达式，因为它使用的是`require()`方法；而ES6 Modules只能是字符串

- CommonJS `this`指向当前模块，ES6 Modules `this`指向`undefined`
- 且ES6 Modules中没有这些顶层变量：`arguments`、`require`、`module`、`exports`、`__filename`、`__dirname`

关于第一个差异，是因为CommonJS 加载的是一个对象（即`module.exports`属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

（应该还一些区别我没想到的，欢迎补充👏😊）



## 参考文章

知识无价，支持原创。

参数文章：

- [《这几个概念你可能还是没搞清require、import和export》](https://juejin.im/post/5ccf98eae51d453a4a357e4a)
- [《前端模块化，AMD与CMD的区别》](https://juejin.im/post/5a422b036fb9a045211ef789)
- [《node.js中使用define和require》](https://blog.csdn.net/qq_26542493/article/details/102497132)
- [《必须要知道的CommonJS和ES6 Modules规范》](https://zhuanlan.zhihu.com/p/27644026)
- [《再次梳理AMD、CMD、CommonJS、ES6 Module的区别》](https://juejin.im/post/5db95e3a6fb9a020704bcd8d)
- [《阮一峰-Module 的加载实现》](https://es6.ruanyifeng.com/#docs/module-loader#ES6-模块与-CommonJS-模块的差异)



## 后语

你盼世界，我盼望你无`bug`。这篇文章就介绍到了这里。

唔...怎么说呢，虽然最后的总结记都很好记，但是如果不深入理解的话就只能知道一些浅显的知识，那样是不可以的哦。

（霖呆呆，你叫别人深入了解，你自己了解多少呢？）

![](https://user-gold-cdn.xitu.io/2020/4/30/171cb3bf0055ca80?w=255&h=255&f=jpeg&s=10612)

喜欢**霖呆呆**的小伙还希望可以关注霖呆呆的公众号 `LinDaiDai` 或者扫一扫下面的二维码👇👇👇.


![](https://user-gold-cdn.xitu.io/2020/4/30/171cb3c33355914d?w=900&h=500&f=gif&s=1632550)

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


