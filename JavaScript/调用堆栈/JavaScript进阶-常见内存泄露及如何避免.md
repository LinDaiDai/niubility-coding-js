## 前言

这一章节给大家介绍的知识点相对比较简单, 但是却是非常重要的. 而且也是在面试过程中经常会被问到的一部分内容.

通过此次阅读你可以学习到:

- 4种常见的内存泄露
- 内存泄露的识别方法

## 4种常见的内存泄露

其实在实际开发中, 我们很容易不经意的就写出内存泄露的代码, 比如以下几种情况可能都是你遇到过的.

### 一、意外的全局变量

#### 未声明的变量

当我们在一个函数中给一个变量赋值但是却没有声明它时:
```javascript
function fn () {
    a = "Actually, I'm a global variable"
}
```
此时变量`a`相当于是`window`对象下的一个变量:
```javascript
function fn () {
    window.a = "Actually, I'm a global variable"
}
```
而之前我们已经说了全局变量是很难被垃圾回收器回收的, 所以要是有这种意外的全局变量应该要避免.

#### 使用`this`创建的变量

还有一种情况是这样的:
```javascript
function fn () {
    this.a = "Actually, I'm a global variable"
}
fn();
```
我们知道, 这里`this `的指向是`window`, 因此此时创建的`a`变量也会被挂载到`window`对象下.

避免此情况的解决办法是`在 JavaScript 文件头部或者函数的顶部加上 'use strict'`, 开启严格模式, 使得`this`的指向为`undefined`, 这样就可以避免了.

> 当然如果你必须使用全局变量存储大量数据时，确保用完以后把它设置为 null 或者重新定义。


### 二、被遗忘的计时器或回调函数

#### 定时器引起
当我们在代码中使用定时器也有可能会造成内存泄露:
```javascript
var serverData = loadData()
setInterval(function() {
	var renderer = document.getElementById('renderer')
	if(renderer) {
		renderer.innerHTML = JSON.stringify(serverData)
	}
}, 5000) 
```
上面的例子🌰中, 节点`renderer`引用了`serverData`.在节点`renderer`或者数据不再需要时，定时器依旧指向这些数据。所以哪怕当`renderer`节点被移除后，interval 仍旧存活并且垃圾回收器没办法回收，它的依赖也没办法被回收，除非终止定时器。

#### 对象观察者

还有一个就是关于观察者模式的案例:
```javascript
var btn = document.getElementById('btn');
function onClick (element) {
    element.innerHTMl = "I'm innerHTML"
}
btn.addEventListener('click', onClick);
```
对于上面观察者的例子，一旦它们不再需要（或者关联的对象变成不可达），明确地移除它们非常重要。老的 IE 6 是无法处理循环引用的。因为老版本的 IE 是无法检测 DOM 节点与 JavaScript 代码之间的循环引用，会导致内存泄漏。

但是，现代的浏览器（包括 IE 和 Microsoft Edge）使用了更先进的垃圾回收算法（标记清除），已经可以正确检测和处理循环引用了。即回收节点内存时，不必非要调用 removeEventListener 了。

### 三、脱离DOM的引用

这种造成内存泄露的原因简单来说就是:

如果把DOM 存成字典（JSON 键值对）或者数组，此时，同样的 DOM 元素存在两个引用：一个在 DOM 树中，另一个在字典中。那么将来需要把两个引用都清除。

比如下面这个例子:
```javascript
// 在对象中引用DOM
var elements = {
    btn: document.getElementById('btn')
}

function doSomeThing () {
    elements.btn.click();
}

function removeBtn () {
    // 将body中的btn移除, 也就是移除 DOM树中的btn
    document.body.removeChild(document.getElementById('button'));
    // 但是此时全局变量elements还是保留了对btn的引用, btn还是存在于内存中,不能被GC回收
}
```
上面👆这种情况, 可以手动将引用给清除: `elements.btn = null`.

### 四、闭包

还有一种情况就是我们之前提到过的闭包. 也就是局部变量销毁时, 闭包的这种情况.

首先让我们明确一点:
**闭包的关键就是匿名函数能够访问父级作用域中的变量**.

来看一个简单的例子🌰:
```javascript
function fn () {
    var a = "I'm a";
    return function () {
        console.log(a);
    };
}
```
因为变量`a`被`fn()`函数内的匿名函数所引用, 因此这种变量是不会被回收的.

那就有人问了, 即使这样会造成什么不妥吗? 在上面👆这个案例中当然看不出有什么. 若是将情况变得复杂一些呢?
```javascript
var globalVar = null; // 全局变量
var fn = function () {
    var originVal = globalVar; // 局部变量
    var unused = function () { // 未使用的函数
        if (originVal) {
            console.log('call')
        }
    }
    globalVar = {
        longStr: new Array(1000000).join('*'),
        someThing: function () {
            console.log('someThing')
        }
    }
}
setInterval(fn, 100);
```
先请你花上一分钟看看上面的案例, 你会发现:

1. 每次调用`fn`函数的时候都会产生一个新的对象`originVal`;
2. 变量`unused`是一个引用了`originVal`的闭包;
3. `unused`虽然未被使用, 但是它引用的`originVal`迫使它留在内存中, 并不会被回收.

解决办法是: 可以在`fn`的最底部, 将`originVal`设置成`null`.

## 内存泄露的识别方法

上面👆介绍了这么多种可能会造成内存泄露的情况, 那么有没有什么实际的办法让我们看到内存泄露的表现呢?

当然是有的. 现在常用的是以下2种方式:

- `Chrome`浏览器的控制台`Performance`或`Memory`
- `Node`提供的`process.memoryUsage`方法

### `Chrome`浏览器的控制台`Performance`或`Memory`

Chrome 浏览器查看内存占用，按照以下步骤操作。

1. 在网页上右键, 点击“检查”打开控制台(`Mac`快捷键`option+command+i`);
2. 选择`Performance`面板(很多教材中用的是`Timeline`面板, 不知道是不是版本的原因);
3. 勾选`Memory`, 然后点击左上角的小黑点`Record`开始录制;
4. 点击弹窗中的`Stop`结束录制, 面板上就会显示这段时间的内存占用情况。

![](https://user-gold-cdn.xitu.io/2020/1/5/16f741f542a25cb2?w=2250&h=1786&f=png&s=141471)


![](https://user-gold-cdn.xitu.io/2020/1/5/16f74223bf9dc5e8?w=2252&h=1830&f=png&s=368043)

如果内存的使用情况一直在做增量, 那么就是内存泄露了:

![](https://user-gold-cdn.xitu.io/2020/1/5/16f741433fd0e0be?w=2262&h=1826&f=png&s=392053)

或者你可以使用我在[《记录一次定时器及闭包问题造成的内存泄漏》](https://juejin.im/post/5d80854d5188253264365f11)中的方法进行检查.

### `Node`提供的`process.memoryUsage`方法

另一个就是`Node`提供的`process.memoryUsage`方法, 这一块我用的不是很多, 这里就贴上教材:

```javascript
console.log(process.memoryUsage());
// { rss: 27709440,
//  heapTotal: 5685248,
//  heapUsed: 3449392,
//  external: 8772 }
```
process.memoryUsage返回一个对象，包含了 Node 进程的内存占用信息。该对象包含四个字段，单位是字节，含义如下:
```
rss（resident set size）：所有内存占用，包括指令区和堆栈。
heapTotal："堆"占用的内存，包括用到的和没用到的。
heapUsed：用到的堆的部分。
external： V8 引擎内部的 C++ 对象占用的内存。
```
判断内存泄露, 是看`heapUsed`字段.

## 总结

总的来说, 常见的内存泄露包括:
- 意外的全局变量
- 被遗忘的定时器或回调函数
- 脱离DOM的引用
- 闭包中重复创建的变量

如何避免内存泄露:
- 注意程序逻辑，避免“死循环”之类的
- 减少不必要的全局变量，或者生命周期较长的对象，及时对无用的数据进行垃圾回收
- 避免创建过多的对象 原则：不用了的东西要及时归还


## 后语

关于`JavaScript`进阶内存堆栈的内容就告一段落了, 总共是有五篇文章. 在文章中我也是尽量用比较通俗的语言来让进行讲解, 希望大家都能搞懂.

如果大家喜欢霖呆呆的文章的话, 还请帮我一个小忙, 关注一波我最近才开始捣鼓的公众号, 我会在上面不定期的发一些关于前端方面的原创文章, 一起学习, 一起进步😊.

![LinDaiDai公众号二维码.jpg](https://user-gold-cdn.xitu.io/2020/1/5/16f743e06846f9fd?w=344&h=344&f=png&s=53202)