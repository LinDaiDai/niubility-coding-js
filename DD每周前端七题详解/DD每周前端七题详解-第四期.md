## DD每周前端七题详解-第四期

## 系列介绍

你盼世界，我盼望你无`bug`。Hello 大家好！我是霖呆呆！

呆呆每周都会分享七道前端题给大家，系列名称就是「DD每周七题」。

系列的形式主要是：`3道JavaScript` + `2道HTML` + `2道CSS`，帮助我们大家一起巩固前端基础。

所有题目也都会整合至 [LinDaiDai/niubility-coding-js](https://github.com/LinDaiDai/niubility-coding-js/issues) 的`issues`中，欢迎大家提供更好的解题思路，谢谢大家😁。

一起来看看本周的七道题吧。



## 正题

### 一、following function return?

以下代码输出什么？

```javascript
function getName () {
  return
  {
    name: 'LinDaiDai'
  }
}
console.log(getName())
```

这道题其实涉及到了`JavaScript`中的一个名为`ASI`的机制，全名`Automatic Semicolon Insertion`，好吧，不要整的那么高大上了，其实就是自动插入分号的机制。

按照`ECMAScript`标准，一些 **特定语句**（statement) 必须以分号结尾。分号代表这段语句的终止。但是有时候为了方便，这些分号是有可以省略的。这种情况下解释器会自己判断语句该在哪里终止。这种行为被叫做`“自动插入分号”`，简称`ASI (Automatic Semicolon Insertion)` 。实际上分号并没有真的被插入，这只是个便于解释的形象说法。

也就是说这道题在执行的时候，会在`return`关键字后面自动插入一个分号，所以这道题就相当于是这样：

````javascript
function getName () {
  return;
  {
    name: 'LinDaiDai'
  }
}
console.log(getName())
````

因此最终的结果也就是`undefined`。

[https://github.com/LinDaiDai/niubility-coding-js/issues/23](https://github.com/LinDaiDai/niubility-coding-js/issues/23)



### 二、实现一个pipe函数

(题目来源：[30-seconds-of-interviews](https://github.com/30-seconds/30-seconds-of-interviews))

如下所示，实现一个`pipe`函数：

```javascript
const square = v => v * v
const double = v => v * 2
const addOne = v => v + 1
const res = pipe(square, double, addOne)
console.log(res(3)) // 19; addOne(double(square(3)))
```

首先看到这道题，`pipe`是可以接收任意个数的函数，并且返回的是一个新的函数`res`。

**(1) pipe基本结构**

那么我们可以得出`pipe`的基本结构是这样的：

```javascript
const pipe = function (...fns) {
  return function (param) {}
}
```

它本身是一个函数，然后我们可以利用`...fns`获取到所有传入的函数参数`square、double`这些。

之后它会返回一个函数，且这个函数中是可以接收参数`param`的。

**(2) 返回的函数**

接下来的逻辑主要就是在于返回的函数上了，在这个返回的函数中，我们需要对`param`进行层层处理。

OK👌，这很容易就让人想到了...`reduce`...

我们可以对`fns`函数数组使用`reduce`，之后`reduce`的初始值为传入的参数`param`。

让我们一起来看看最终的代码：

```javascript
const pipe = function (...fns) {
  return function (param) {
    return fns.reduce((pre, fn) => {
      return fn(pre)
    }, param)
  }
}
```

最终返回的是经过`fns`数组中所有函数处理过的值。

当然，我们也可以用简洁点的写法：

```javascript
const pipe = (...fns) => param => fns.reduce((pre, fn) => fn(pre), param)
```

这样就得到了我们想要的`pipe`函数了：

```javascript
const square = v => v * v
const double = v => v * 2
const addOne = v => v + 1
const pipe = (...fns) => param => fns.reduce((pre, fn) => fn(pre), param)
const res = pipe(square, double, addOne)
console.log(res(3)) // 19; addOne(double(square(3)))
```

[https://github.com/LinDaiDai/niubility-coding-js/issues/24](https://github.com/LinDaiDai/niubility-coding-js/issues/24)



### 三、Babel是如何编译Class的？

(参考来源：[相学长-你的Tree-Shaking并没什么卵用](https://juejin.im/post/5a5652d8f265da3e497ff3de))

就拿下面的类来说：

```javascript
class Person {
  constructor ({ name }) {
    this.name = name
    this.getSex = function () {
      return 'boy'
    }
  }
  getName () {
    return this.name
  }
  static getLook () {
    return 'sunshine'
  }
}
```

如果你对`Class`或者里面的`static`还不熟悉的话可得先看看呆呆的这篇文章了：[《【何不三连】比继承家业还要简单的JS继承题-封装篇(牛刀小试)》](https://juejin.im/post/5e707417e51d45272054d5d3#heading-14)

当我们在使用`babel`的这些`plugin`或者使用`preset`的时候，有一个配置属性`loose`它默认是为`false`，在这样的条件下：

`Class`编译后：

- 总体来说`Class`会被封装成一个`IIFE`立即执行函数
- 立即执行函数返回的是一个与类同名的构造函数
- 实例属性和方法定义在构造函数内(如`name`和`getSex()`)
- 类内部声明的属性方法(`getName`)和静态属性方法(`getLook`)是会被`Object.defineProperty`所处理，将其可枚举属性设置为`false`

(下面的代码看着好像很长，其实划分一下并没有什么东西的)

编译后的代码：

```javascript
"use strict";

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var Person = /*#__PURE__*/ (function () {
  function Person(_ref) {
    var name = _ref.name;

    _classCallCheck(this, Person);

    this.name = name;

    this.getSex = function () {
      return "boy";
    };
  }

  _createClass(
    Person,
    [
      {
        key: "getName",
        value: function getName() {
          return this.name;
        },
      },
    ],
    [
      {
        key: "getLook",
        value: function getLook() {
          return "sunshine";
        },
      },
    ]
  );

  return Person;
})();
```

为什么`Babel`对于类的处理会使用`Object.defineProperty`这种形式呢？它和直接使用原型链有什么不同吗？

- 通过原型链声明的属性和方法是可枚举的，也就是可以被`for...of...`搜寻到
- 而类内部声明的方法是不可枚举的

所以，babel为了符合ES6真正的语义，编译类时采取了`Object.defineProperty`来定义原型方法。

但是可以通过设置`babel`的`loose`模式(宽松模式)为`true`，它会不严格遵循ES6的语义，而采取更符合我们平常编写代码时的习惯去编译代码，在`.babelrc`中可以如下设置：

```javascript
{
  "presets": [["env", { "loose": true }]]
}
```

比如上述的`Person`类的属性方法将会编译成直接在原型链上声明方法：

```javascript
"use strict";

var Person = /*#__PURE__*/function () {
  function Person(_ref) {
    var name = _ref.name;
    this.name = name;

    this.getSex = function () {
      return 'boy';
    };
  }

  var _proto = Person.prototype;

  _proto.getName = function getName() {
    return this.name;
  };

  Person.getLook = function getLook() {
    return 'sunshine';
  };

  return Person;
}();
```

**总结**

- 当使用`Babel`编译时默认的`loose`为`false`，即非宽松模式

- 无论哪种模式，转换后的定义在类内部的属性方法是被定义在构造函数的原型对象上的；静态属性被定义到构造函数上

- 只不过非宽松模式时，这些属性方法会被`_createClass`函数处理，函数内通过`Object.defineProperty()`设置属性的可枚举值`enumerable`为`false`

- 由于在`_createClass`函数内使用了`Object`，所以非宽松模式下是会产生副作用的，而宽松模式下不会。

- `webpack`中的`UglifyJS`依旧还是会将宽松模式认为是有副作用的，而`rollup`有**程序流程分析**的功能，可以更好的判断代码是否真正产生副作用，所以它会认为宽松模式没有副作用。

  (副作用大致理解为：一个函数会、或者可能会对函数外部变量产生影响的行为。)

[https://github.com/LinDaiDai/niubility-coding-js/issues/25](https://github.com/LinDaiDai/niubility-coding-js/issues/25)



### 四、JS三种加载方式的区别

(答案参考来源：[前端性能优化-页面加载渲染优化](https://juejin.im/post/5e9abe2a6fb9a03c7762169b))

**正常模式**

这种情况下 JS 会阻塞浏览器，浏览器必须等待 index.js 加载和执行完毕才能去做其它事情。

```html
<script src="index.js"></script>
```

**async(异步) 模式**

async 模式下，JS 不会阻塞浏览器做任何其它的事情。它的加载是异步的，当它加载结束，JS 脚本会立即执行。

```html
<script async src="index.js"></script>
```

**defer(延缓) 模式**

defer 模式下，JS 的加载是异步的，执行是被推迟的。等整个文档解析完成、DOMContentLoaded 事件即将被触发时，被标记了 defer 的 JS 文件才会开始依次执行。

```html
<script defer src="index.js"></script>
```

从应用的角度来说，一般当我们的脚本与 DOM 元素和其它脚本之间的依赖关系不强时，我们会选用 async；当脚本依赖于 DOM 元素和其它脚本的执行结果时，我们会选用 defer。

[https://github.com/LinDaiDai/niubility-coding-js/issues/26](https://github.com/LinDaiDai/niubility-coding-js/issues/26)



### 五、如何让`<p>测试 空格</p>`这两个词之间的空格变大？

(题目来源：https://github.com/haizlin/fe-interview/issues/2440)

这道题的意思是说，原本有一段`HTML`代码如下：

```html
<p>测试 空格</p>
```

在`"测试"`和`"空格"`两个词之间有一个空格，然后如何将这个空格变大。

这边有这么两种方法：

- 通过给`p`标签设置`word-spacing`，将这个属性设置成自己想要的值。
- 将这个空格用一个`span`标签包裹起来，然后设置`span`标签的`letter-spacing`或者`word-spacing`。

我分别用`letter-spacing`和`word-spacing`来处理了`p`和`span`标签：

```html
<style>
  .p-letter-spacing {
    letter-spacing: 10px;
  }
  .p-word-spacing {
    word-spacing: 10px;
  }
  .span-letter-spacing {
    letter-spacing: 10px;
  }
  .span-word-spacing {
    word-spacing: 10px;
  }
</style>
<body>
  <p>测试 空格</p>
  <p class="p-letter-spacing">测试 空格</p>
  <p class="p-word-spacing">测试 空格</p>
  <p>测试<span class="span-letter-spacing"> </span>空格</p>
  <p>测试<span class="span-word-spacing"> </span>空格</p>
</body>
```

让我们一起来看看效果：

![](https://user-gold-cdn.xitu.io/2020/6/17/172c12157aa7f886?w=402&h=454&f=jpeg&s=23658)

大家可以看到效果，我用`letter-spacing`和`word-spacing`处理`p`标签，是会呈现不同的效果的，`letter-spacing`把中文之间的间隙也放大了，而`word-spacing`则不放大中文之间的间隙。

而`span`标签中只有一个空格，所以`letter-spacing`和`word-spacing`效果一样。

因此我们可以得出`letter-spacing`和`word-spacing`的结论：

- `letter-spacing`和`word-spacing`这两个属性都用来添加他们对应的元素中的空白。
- `letter-spacing`添加字母之间的空白，而`word-spacing`添加每个单词之间的空白。
- `word-spacing`对中文无效。

[https://github.com/LinDaiDai/niubility-coding-js/issues/27](https://github.com/LinDaiDai/niubility-coding-js/issues/27)



### 六、如何解决inline-block空白问题？

原本的代码为：

```html
<style>
.sub {
  background: hotpink;
  display: inline-block;
}
</style>
<body>
  <div class="super">
    <div class="sub">
      孩子
    </div>
    <div class="sub">
      孩子
    </div>
    <div class="sub">
      孩子
    </div>
  </div>
</body>
```

效果为：

![](https://user-gold-cdn.xitu.io/2020/6/17/172c1217be8dd2f9?w=392&h=116&f=jpeg&s=12598)

可以看到每个`孩子`之间都会有一个空白。`inline-block`元素间有空格或是换行，因此产生了间隙。

解决办法：

- **(1) 删除html中的空白**：不要让元素之间换行：

  ```html
  <div class="super">
    <div class="sub">
      孩子
    </div><div class="sub">
      孩子
    </div><div class="sub">
      孩子
    </div>
  </div>
  ```

- **(2) 设置负的边距**：你可以用负边距来补齐空白。但你需要调整`font-size`，因为空白的宽度与这个属性有关系。例如下面这个例子：

  ```css
  .sub {
    background: hotpink;
    display: inline-block;
    font-size:16px;
    margin-left: -0.4em;
  }
  ```

- **(3) 给父级设置font-size: 0**：不管空白多大，由于空白跟`font-size`的关系，设置这个属性即可把空白的宽度设置为0。但是如果你的子级有字的话，也得单独给子级设置字体大小。

- **(4) 注释**：

  ```html
  <div class="super">
    <div class="sub">
      孩子
    </div><!--
    --><div class="sub sub2">
      孩子
    </div><!--
    --><div class="sub">
      孩子
    </div>
  </div>
  ```

[https://github.com/LinDaiDai/niubility-coding-js/issues/28](https://github.com/LinDaiDai/niubility-coding-js/issues/28)



### 七、脱离文档流是不是指该元素从DOM树中脱离?

并不会，DOM树是HTML页面的层级结构，指的是元素与元素之间的关系，例如包裹我的是我的父级，与我并列的是我的兄弟级，类似这样的关系称之为层级结构。

而文档流则类似于排队，我本应该在队伍中的，然而我脱离了队伍，但是我与我的父亲，兄弟，儿子的关系还在。

[https://github.com/LinDaiDai/niubility-coding-js/issues/29](https://github.com/LinDaiDai/niubility-coding-js/issues/29)



## 参考文章

知识无价，支持原创。

参考文章：

- [《JavaScript ASI 机制详解》](https://segmentfault.com/a/1190000004548664)
- [《letter-spacing和word-spacing之间的区别》](https://www.cnblogs.com/OrangeManLi/p/4107536.html)



## 后语

你盼世界，我盼望你无`bug`。这篇文章就介绍到这里。

您每周也许会花`48`小时的时间在工作💻上，会花`49`小时的时间在睡觉😴上，也许还可以再花`20`分钟的时间在呆呆的7道题上，日积月累，我相信我们都能见证彼此的成长😊。

什么？你问我为什么系列的名字叫`DD`？因为`呆呆`呀，哈哈😄。

喜欢**霖呆呆**的小伙还希望可以关注霖呆呆的公众号 `LinDaiDai` 或者扫一扫下面的二维码👇👇👇。

![](https://user-gold-cdn.xitu.io/2020/6/17/172c12220c3a29a1?w=900&h=500&f=gif&s=1632550)

我会不定时的更新一些前端方面的知识内容以及自己的原创文章🎉

你的鼓励就是我持续创作的主要动力 😊。


