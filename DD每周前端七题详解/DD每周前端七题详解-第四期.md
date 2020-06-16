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

[https://github.com/LinDaiDai/niubility-coding-js/issues/22](https://github.com/LinDaiDai/niubility-coding-js/issues/22)



### 二、Babel是如何编译Class的？

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

[https://github.com/LinDaiDai/niubility-coding-js/issues/23](https://github.com/LinDaiDai/niubility-coding-js/issues/23)





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









## 参考文章

知识无价，支持原创。

参考文章：

- [《JavaScript ASI 机制详解》](https://segmentfault.com/a/1190000004548664)



## 后语

你盼世界，我盼望你无`bug`。这篇文章就介绍到这里。

您每周也许会花`48`小时的时间在工作💻上，会花`49`小时的时间在睡觉😴上，也许还可以再花`20`分钟的时间在呆呆的7道题上，日积月累，我相信我们都能见证彼此的成长😊。

什么？你问我为什么系列的名字叫`DD`？因为`呆呆`呀，哈哈😄。

喜欢**霖呆呆**的小伙还希望可以关注霖呆呆的公众号 `LinDaiDai` 或者扫一扫下面的二维码👇👇👇。

![](https://user-gold-cdn.xitu.io/2020/5/27/17254d5d0a277620?w=900&h=500&f=gif&s=1632550)

我会不定时的更新一些前端方面的知识内容以及自己的原创文章🎉

你的鼓励就是我持续创作的主要动力 😊。

