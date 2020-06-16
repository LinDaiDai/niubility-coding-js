## DD每周七题-第一期

## 系列介绍

你盼世界，我盼望你无`bug`。Hello 大家好！我是霖呆呆！

从这周起呆呆每周都会分享七道前端题给大家，系列名称就是「DD每周七题」。

系列的形式主要是：`3道JavaScript` + `2道HTML` + `2道CSS`，帮助我们大家一起巩固前端基础。

所有题目也都会整合至 [LinDaiDai/niubility-coding-js](https://github.com/LinDaiDai/niubility-coding-js/issues) 的`issues`中，欢迎大家提供更好的解题思路，谢谢大家😁。

一起来看看本周的七道题吧。

## 正题

### 一、Array(3)和Array(3, 4)的区别？

```javascript
console.log(Array(3))
console.log(Array(3, 4))

console.log(new Array(3))
console.log(new Array(3, 4))

console.log(Array.of(3))
console.log(Array.of(3, 4))
```

**考察知识点：**

- `Array()`和`new Array()`
- `Array()`参数个数不同时的不同表现
- `Array.of()`的作用

**结果：**

```javascript
console.log(Array(3)) // [empty x 3]
console.log(Array(3, 4)) // [3, 4]

console.log(new Array(3)) // [empty x 3]
console.log(new Array(3, 4)) // [3, 4]

console.log(Array.of(3)) // [3]
console.log(Array.of(3, 4)) // [3, 4]
```

**总结：**

- `Array`使不使用`new`效果都是一样的
- `Array`方法，如果参数是一位的话，这个参数表示的是数组的长度，并创建此长度的空数组
- `Array`方法，如果参数是多位的话则每一个参数都是数组的一项，会按顺序返回数组
- `Array.of()`接收任意个参数，将按顺序成为返回数组中的元素，并返回这个新数组。

[https://github.com/LinDaiDai/niubility-coding-js/issues/1](https://github.com/LinDaiDai/niubility-coding-js/issues/1)



### 二、请创建一个长度为100，值为对应下标的数组

```javascript
// cool点的写法：
[...Array(100).keys()]

// 其他方法：
Array(100).join(",").split(",").map((v, i) => i)
Array(100).fill().map((v, i) => i)
```

后面两种方法相信大家都能看到懂，也没啥好说的了😄，让我们仔细看一下这个比较`cool`的写法：

- 使用`Array(100)`创建一个内容全为`empty`的数组：`[empty x 100]`

- 使用`keys()`方法从数组创建一个包含数组键的可迭代对象：

  可迭代对象是不是让你想到了`generator`，没错的，这里的`keys()`是`Array.prototype`上的方法，大家可能会把它和我们之前用的比较多的`Object.keys()`搞混。

  说一下它的作用吧，它其实就像刚刚介绍的一样，会创建一个可迭代对象，那么小伙伴们应该知道，一个可迭代对象返回的数据会是这样的：

  ```
  { value: 0, done: false }
  ```

  `value`为这次的返回值，`done`为当前可迭代对象的逻辑块是否执行完成。

  所以你会看到以下这段代码是会这样执行的：

  ```javascript
  let it = Array(100).keys()
  console.log(it.next) // {value: 0, done: false}
  console.log(it.next) // {value: 1, done: false}
  console.log(it.next) // {value: 2, done: false}
  console.log(it.next) // {value: 3, done: false}
  ```

- 至于`[...arr]`这个就是`ES6`的写法了，转化为数组，当然你也可以直接用`Array.from()`。这两种方式都支持将**可迭代对象**转换为数组。

[https://github.com/LinDaiDai/niubility-coding-js/issues/2](https://github.com/LinDaiDai/niubility-coding-js/issues/2)



### 三、实现 arr[-1] = arr[arr.length - 1]

这道题的意思是：提供一个`createArr()`方法，用此方法创建的数组满足`arr[-1] = arr[arr.length - 1]`：

```javascript
function createArr (...elements) {
  // ...代码
  return arr
}
var arr1 = createArr(1, 2, 3)
console.log(arr1[-1]) // 3
console.log(arr1[-2]) // 2
```

**解题思路：**

其实对于这类题目，我首先想到的会是`Object.defineProperty()`或者`Proxy`。因为这里涉及到了对数组值的获取，显然用`Proxy`是比较合适的。什么？你问我为什么不用`Object.defineProperty()`？因为这个方法是针对于对象的某一个属性的呀，对数组来说不合适。

所以对于这道题，我们也许可以使用`Proxy`代理每次传入进来的下标，也就是重写一下数组的`get`方法，在这个方法中我们去处理这方面的逻辑，一起来看看代码吧😊：

```javascript
function createArr (...elements) {
  let handler = {
    get (target, key, receiver) { // 第三个参数传不传都可以
      let index = Number(key) // 或者 let index = ~~key
      if (index < 0) {
        index = String(target.length + index)
      }
      return Reflect.get(target, index, receiver)
    }
  }
  let target = [...elements] // 创建一个新数组
  return new Proxy(target, handler)
}
var arr1 = createArr(1, 2, 3)
console.log(arr1[-1]) // 3
console.log(arr1[-2]) // 2
```

**注意点：**

- `get`接收到的第二个参数`key`表示的是数组下标，它是字符串形式，所以需要转为`Number`，当然方法有很多种了，使用`Number()`也可以，使用`~~`双非按位取反运算符也可以。对比于`Number()`的好处就是`Number(undefined)`会转换为`NaN`；但是使用`~~`能保证一直是数字，`~~undefined === 0`。(什么？你还不知道区别？那你得看霖呆呆的这篇文章了：[JS中按位取反运算符~及其它运算符](https://www.jianshu.com/p/3c0f56f3190a))

- 接下来只需要判断一下传入进来的下标是不是小于0的，小于0的话加上数组的长度就可以了

- 然后返回`index`这一项使用的是`Reflect.get(target, index)`。什么？为什么不直接用`target[index]`？当然这样也可以，对比`target[index]`的区别就是`Reflect.get(target, index)`如果传入的`target`不是一个`Object`的话(数组也属于对象)，就会报一个类型错误`TypeError`，而`target[index]`返回的会是一个`undefined`。比如这样：

  ```javascript
  var obj = 5
  console.log(obj['b']) // undefined
  console.log(Reflect.get(obj, 'b')) // Uncaught TypeError: Reflect.get called on non-object
  ```

**扩展点：**

呆呆这边主要是想扩展一下`get`的第三个参数`receiver`(接受者)，在`MDN`上的解释是：

如果`target`对象中指定了`getter`，`receiver`则为`getter`调用时的`this`值。

来看个例子理解一下😊。

*案例一*

例如我们开始有这么一个对象：

```javascript
var obj = {
  fn: function () {
    console.log('lindaidai')
  }
}
```

现在使用`Proxy`来赋值到`obj1`中：

```javascript
var obj = {
  fn: function () {
    console.log('lindaidai')
  }
}
var obj1 = new Proxy(obj, {
  get (target, key, receiver) {
    console.log(receiver === obj1) // true
    console.log(receiver === target) // false
    return target[key]
  }
})
obj1.fn()
```

可以看到，`receiver`表示的是`obj1`这个新的代理对象，`target`表示的是被代理的对象`obj`。

所以，`receiver`可以表示**使用代理对象本身**。

*案例二*

另一种情况，`receiver`也可以表示是**从其继承的对象**。

```javascript
var proxy = new Proxy({}, {
  get (target, key, receiver) {
    return receiver;
  }
})
console.log(proxy.getReceiver === proxy) // true
var inherits = Object.create(proxy)
console.log(inherits.getReceiver === inherits) // true
```

这个案例中，我新建了一个空对象的代理对象`proxy`，使用`proxy.getReceiver`获取它的`receiver`，发现它就是代理对象本身。

而如果我将这个代理对象作为一个原型对象，创建出一个新的对象`inherits`，也就是实现了原型式继承，那么这时候`receiver`的值就是这个被继承的对象`inherits`。

**总结**：

- 可以使用`Proxy`代理，来改变每次获取数组的值。
- `Proxy`的`get`中，第二个参数是字符串，即使传入的是数组下标。
- 对比于`Number()`的好处就是`Number(undefined)`会转换为`NaN`；但是使用`~~`能保证一直是数字，`~~undefined === 0`。
- 对比`target[index]`的区别就是`Reflect.get(target, index)`如果传入的`target`不是一个`Object`的话(数组也属于对象)，就会报一个类型错误`TypeError`，而`target[index]`返回的会是一个`undefined`。
- `Proxy`的`get`中，第三个参数`receiver`通常为使用代理对象本身或从其继承的对象。

[https://github.com/LinDaiDai/niubility-coding-js/issues/3](https://github.com/LinDaiDai/niubility-coding-js/issues/3)



### 四、addEventListener和attachEvent的区别？

- 前者是标准浏览器中的用法，后者`IE8`以下
- `addEventListener`可有冒泡，可有捕获；`attachEvent`只有冒泡，没有捕获。
- 前者事件名不带`on`，后者带`on`
- 前者回调函数中的`this`指向当前元素，后者指向`window`

[https://github.com/LinDaiDai/niubility-coding-js/issues/4](https://github.com/LinDaiDai/niubility-coding-js/issues/4)



### 五、addEventListener函数的第三个参数

第三个参数涉及到冒泡和捕获，是`true`时为捕获，是`false`则为冒泡。

或者是一个对象`{passive: true}`，针对的是`Safari`浏览器，禁止/开启使用滚动的时候要用到。

[https://github.com/LinDaiDai/niubility-coding-js/issues/5](https://github.com/LinDaiDai/niubility-coding-js/issues/5)



### 六、文字单超出显示省略号

```css
div {
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

[https://github.com/LinDaiDai/niubility-coding-js/issues/6](https://github.com/LinDaiDai/niubility-coding-js/issues/6)



### 七、文字多行超出显示省略号

```css
div {
  width: 200px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
```

该方法适用于WebKit浏览器及移动端。

**跨浏览器兼容方案：**

```css
p {
  position:relative;
  line-height:1.4em;
  /* 3 times the line-height to show 3 lines */
  height:4.2em;
  overflow:hidden;
}
p::after {
  content:"...";
  font-weight:bold;
  position:absolute;
  bottom:0;
  right:0;
  padding:0 20px 1px 45px;
}
```

[https://github.com/LinDaiDai/niubility-coding-js/issues/7](https://github.com/LinDaiDai/niubility-coding-js/issues/7)



## 后语

你盼世界，我盼望你无`bug`。这篇文章就介绍到这里。

您每周也许会花`48`小时的时间在工作💻上，会花`49`小时的时间在睡觉😴上，也许还可以再花`20`分钟的时间在呆呆的7道题上，日积月累，我相信我们都能见证彼此的成长😊。

什么？你问我为什么系列的名字叫`DD`？因为`呆呆`呀，哈哈😄。

喜欢**霖呆呆**的小伙还希望可以关注霖呆呆的公众号 `LinDaiDai` 或者扫一扫下面的二维码👇👇👇。

![](https://user-gold-cdn.xitu.io/2020/5/27/17254d5d0a277620?w=900&h=500&f=gif&s=1632550)

我会不定时的更新一些前端方面的知识内容以及自己的原创文章🎉

你的鼓励就是我持续创作的主要动力 😊。

