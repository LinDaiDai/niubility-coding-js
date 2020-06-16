# 每日一题-JS篇

## JS基础

### var、let题，在以下会输出什么？

```javascript
var a = 1;
console.log(a);
console.log(b);
console.log(c);

var b = 2;
c = 3;

// 1
// undefined
// 报错: c is not defined
```

```javascript
console.log(d);
let d = 4

// 报错: Cannot access 'd' before initialization
```



### null和undefined的区别

- `null`表示一个`"无"`的对象，也就是该处不应该有值；而`undefined`表示**未定义**。
- 在转换为数字时结果不同，`Number(null)`为`0`，而`undefined`为`NaN`。

使用场景上：

`null`：

- 作为函数的参数，表示该函数的参数不是对象
- 作为对象原型链的终点

`undefined`:

- 变量被声明了，但没有赋值时，就等于undefined
- 调用函数时，应该提供的参数没有提供，该参数等于undefined
- 对象没有赋值属性，该属性的值为undefined
- 函数没有返回值时，默认返回undefined

### typeof和instanceof的区别

`typeof`表示是对某个变量类型的检测，基本数据类型除了`null`都能正常的显示为对应的类型，引用类型除了函数会显示为`'function'`，其它都显示为`object`。

而`instanceof`它主要是**用于检测某个构造函数的原型对象在不在某个对象的原型链上**。



### typeof为什么对null错误的显示

这只是 JS 存在的一个悠久 Bug。在 JS 的最初版本中使用的是 32 位系统，为了性能考虑使用低位存储变量的类型信息，000 开头代表是对象然而 null 表示为全零，所以将它错误的判断为 object 。



### 详细说下instanceof

`instanceof`它主要是**用于检测某个构造函数的原型对象在不在某个对象的原型链上**。

算了，直接手写实现吧：

```javascript
function myInstanceof (left, right) {
  let proto = Object.getPrototypeOf(left);
  while (true) {
    if (proto === null) return false;
    if (proto === right.prototype) return true;
    proto = Object.getPrototypeOf(proto)
  }
}
```





## 数组相关

### Array(3)和Array(3, 4)的区别？

```javascript
console.log(Array(3)) // [empty x 3]
console.log(Array(3, 4)) // [3, 4]
```



### 请创建一个长度为100，值都为1的数组

```javascript
new Array(100).fill(1)
```



### 请创建一个长度为100，值为对应下标的数组

```javascript
// cool的写法：
[...Array(100).keys()]

// 其他方法：
Array(100).join(",").split(",").map((v, i) => i)
Array(100).fill().map((v, i) => i)
```



### 实现 arr[-1] = arr[arr.length - 1]

```javascript
function createArr (...elements) {
  let handler = {
    get (target, key, receiver) { // 第三个参数传不传都可以
      let index = Number(key)
      if (index < 0) {
        index = String(target.length + index)
      }
      return Reflect.get(target, index, receiver)
    }
  }
  let target = []
  target.push(...elements)
  return new Proxy(target, handler)
}
var arr1 = createArr(1, 2, 3)
console.log(arr1[-1]) // 3
console.log(arr1[-2]) // 2
```



##  正则相关

### 用正则写一个根据name获取cookie中的值的方法

```javascript
function getCookie(name) {
  var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)'));
  if (match) return unescape(match[2]);
}
```

1. 获取页面上的cookie可以使用 document.cookie
这里获取到的是类似于这样的字符串：
```
'username=lindaidai; user-id=12345; user-roles=home, me, setting'
```
可以看到这么几个信息：
- 每一个cookie都是由 `name=value` 这样的形式存储的
- 每一项的开头可能是一个空串`''`(比如`username`的开头其实就是), 也可能是一个空字符串`' '`（比如`user-id`的开头就是）
- 每一项用`";"`来区分
- 如果某项中有多个值的时候，是用`","`来连接的(比如`user-roles`的值)
- 每一项的结尾可能是有`";"`的(比如`username`的结尾)，也可能是没有的(比如`user-roles`的结尾)
2. 所以我们将这里的正则拆分一下：
- `'(^| )'`表示的就是获取每一项的开头，因为我们知道如果`^`不是放在`[]`里的话就是表示开头匹配。所以这里`(^| )`的意思其实就被拆分为`(^)`表示的匹配`username`这种情况，它前面什么都没有是一个空串(你可以把`(^)`理解为`^`它后面还有一个隐藏的`''`)；而`| `表示的就是或者是一个`" "`(为了匹配`user-id`开头的这种情况)
- `+name+`这没什么好说的
- `=([^;]*)`这里匹配的就是`=`后面的值了，比如`lindaidai`；刚刚说了`^`要是放在`[]`里的话就表示`"除了^后面的内容都能匹配"`，也就是非的意思。所以这里`([^;]*)`表示的是除了`";"`这个字符串别的都匹配(`*`应该都知道什么意思吧，匹配0次或多次)
- 有的大佬等号后面是这样写的`'=([^;]*)(;|$)'`，而最后为什么可以把`'(;|$)'`给省略呢？因为其实最后一个`cookie`项是没有`';'`的，所以它可以合并到`=([^;]*)`这一步。
3. 最后获取到的`match`其实是一个长度为4的数组。比如：
```javascript
[
  "username=lindaidai;",
  "",
  "lindaidai",
  ";"
]
```
- 第0项：全量
- 第1项：开头
- 第2项：中间的值
- 第3项：结尾

所以我们是要拿第2项`match[2]`的值。

4. 为了防止获取到的值是`%xxx`这样的字符序列，需要用`unescape()`方法解码。



### 用一个正则提取字符串中所有`""`里内容

```javascript
 // 如果只是简单的没有循环遍历的话，就只能拿到一个：
 function collectGroup (str) {
  let regExp = /"([^"]*)"/g;
  let match = regExp.exec(str); // [""foo"", "foo"]
  return match[1]; // "foo"
}
var str = `"foo" and "bar" and "baz"`
console.log(collectGroup(str)) // "foo"
```

```javascript
// 第一种方案：使用while循环遍历
 function collectGroup (str) {
  let regExp = /"([^"]*)"/g;
  const matches = [];
  while (true) {
    let match = regExp.exec(str)
    if (match === null) break;
    matches.push(match[1])
  }
  return matches
}
var str = `"foo" and "bar" and "baz"`
console.log(collectGroup(str))
```

```javascript
// 第二种方案：使用ES10的matchAll()
function collectGroup (str) {
  let regExp = /"([^"]*)"/g;
  const matches = []
  for (const match of str.matchAll(regExp)) {
    matches.push(match[1])
  }
  return matches
}
var str = `"foo" and "bar" and "baz"`
console.log(collectGroup(str))
```



### 去除字符串首位空格

第一种：正则匹配首位空格并去除：

```javascript
function trim (str) {
  return str.replace(/(^\s+)|(\s+$)/g, '')
}
console.log(trim('  11  ')) // '11'
console.log(trim('  1 1  ')) // '1 1'
```

第二种：使用`ES10`中的`trimStart`和`trimEnd`：

```javascript
function trim (str) {
  str = str.trimStart()
  return str.trimEnd()
}
console.log(trim('  11  ')) // '11'
console.log(trim('  1 1  ')) // '1 1'
```

第三种：使用`Vue`中的修饰符`.trim`:

```html
<input v-model.trim="msg" />
```

**考察知识点**：

- 正则的相关知识
- 是否知道`ES10`新出的两个去除空白字符的方法
- 是否知道实际运用中有什么简便的方法(呆呆`react`用的不是很多，搜索了一下好像也没有看到类似`Vue`的修饰符，给出的解决方案是封装一个高阶组件)

**注意点**：

- 正则`^`如果不是放在`[]`里的话就是表示从头开始匹配；
- `\s`用于匹配一个空白字符，而`\S`用于匹配一个非空字符
- `+`表示匹配前面的模式 *x* 1 或多次。等价于 `{1,}`。
- `$`匹配结尾



## 编程题

### 实现一个padStart()或padEnd()的polyfill

`String.prototype.padStart` 和 `String.prototype.padEnd`是`ES8`中新增的方法，允许将空字符串或其他字符串添加到原始字符串的开头或结尾。我们先看下使用语法：

```javascript
String.padStart(targetLength,[padString])
```

用法：

```javascript
'x'.padStart(4, 'ab') // 'abax'
'x'.padEnd(5, 'ab') // 'xabab'

// 1. 若是输入的目标长度小于字符串原本的长度则返回字符串本身
'xxx'.padStart(2, 's') // 'xxx'

// 2. 第二个参数的默认值为 " "，长度是为1的
// 3. 而此参数可能是个不确定长度的字符串，若是要填充的内容达到了目标长度，则将不要的部分截取
'xxx'.padStart(5, 'sss') // ssxxx

// 4. 可用来处理日期、金额格式化问题
'12'.padStart(10, 'YYYY-MM-DD') // "YYYY-MM-12"
'09-12'.padStart(10, 'YYYY-MM-DD') // "YYYY-09-12"
```

polyfill实现：

```javascript
String.prototype.myPadStart = function (targetLen, padString = " ") {
  if (!targetLen) {
    throw new Error('请输入需要填充到的长度');
  }
  let originStr = String(this); // 获取到调用的字符串, 因为this原本是String{}，所以需要用String转为字符串
  let originLen = originStr.length; // 调用的字符串原本的长度
  if (originLen >= targetLen) return originStr; // 若是 原本 > 目标 则返回原本字符串
  let diffNum = targetLen - originLen; // 10 - 6 // 差值
  for (let i = 0; i < diffNum; i++) { // 要添加几个成员
    for (let j = 0; j < padString.length; j++) { // 输入的padString的长度可能不为1
      if (originStr.length === targetLen) break; // 判断每一次添加之后是否到了目标长度
      originStr = `${padString[j]}${originStr}`;
    }
    if (originStr.length === targetLen) break;
  }
  return originStr;
}
console.log('xxx'.myPadStart(16))
console.log('xxx'.padStart(16))
```

还是比较简单的，而`padEnd`的实现和它一样，只需要把第二层`for`循环里的`${padString[j]}${orignStr}`换下位置就可以了。



### 设计一个方法提取对象中所有value大于2的键值对并返回最新的对象

实现：

```javascript
var obj = { a: 1, b: 3, c: 4 }
foo(obj) // { b: 3, c: 4 }
```

方法有很多种，这里提供一种比较简洁的写法，用到了`ES10`的`Object.fromEntries()`：

```javascript
var obj = { a: 1, b: 3, c: 4 }
function foo (obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => value > 2)
  )
}
var obj2 = foo(obj) // { b: 3, c: 4 }
console.log(obj2)
```

```javascript
// ES8中 Object.entries()的作用：
var obj = { a: 1, b: 2 }
var entries = Object.entries(obj); // [['a', 1], ['b', 2]]
// ES10中 Object.fromEntries()的作用：
Object.fromEntries(entries); // { a: 1, b: 2 }
```



## this

### 一句话描述一下this

指向最后调用函数的那个对象，是函数运行时内部自动生成的一个内部对象，只能在函数内部使用



### apply/call/bind的相同和不同



## 异步相关

### 描述一下EventLoop的执行过程

- 一开始整个脚本作为一个宏任务执行

- 执行过程中同步代码直接执行，宏任务进入宏任务队列，微任务进入微任务队列

- 当前宏任务执行完出队，检查微任务列表，有则依次执行，直到全部执行完

- 执行浏览器UI线程的渲染工作

- 检查是否有`Web Worker`任务，有则执行

- 执行完本轮的宏任务，回到2，依此循环，直到宏任务和微任务队列都为空

（看这里：https://juejin.im/post/5e58c618e51d4526ed66b5cf#heading-1）



### setInterval存在哪些问题？

答案参考来源：[木子星兮-setTimeout和requestAnimationFrame](https://juejin.im/post/5e621f5fe51d452700567c32#heading-17) （真的良心好文啊😂）

JavaScript中使用 setInterval 开启轮询。定时器代码可能在代码再次被添加到队列之前还没有完成执行，结果导致定时器代码连续运行好几次，而之间没有任何停顿。而javascript引擎对这个问题的解决是：当使用setInterval()时，仅当没有该定时器的任何其他代码实例时，才将定时器代码添加到队列中。这确保了定时器代码加入到队列中的最小时间间隔为指定间隔。

但是，这样会导致两个问题：

1. 某些间隔被跳过；

2. 多个定时器的代码执行之间的间隔可能比预期的小



### 链式调用setTimeout对比setInterval

在上一题中也说到了`setInterval`本身是会存在一些问题的。而使用链式调用`setTimeout`这种方式会比它好一些：

```javascript
setTimeout(function fn(){
    console.log('我是setTimeout');
    setTimeout(fn, 1000);
},1000);
```

这个模式链式调用了`setTimeout()`，每次函数执行的时候都会创建一个新的定时器。第二个`setTimeout()`调用当前执行的函数，并为其设置另外一个定时器。这样做的好处是：

- 在前一个定时器代码执行完之前，不会向队列插入新的定时器代码，确保不会有任何缺失的间隔。
- 而且，它可以保证在下一次定时器代码执行之前，至少要等待指定的间隔，避免了连续的运行。



### 说一下requestAnimationFrame

**简介：**

显示器都有自己固有的刷新频率(60HZ或者75HZ)，也就是说每秒最多重绘60次或者75次。而`requestAnimationFrame`的基本思想就是与这个刷新频率保持同步，利用这个刷新频率进行重绘。

**特点：**

- 使用这个API时，一旦页面不处于浏览器的当前标签，就会自动停止刷新，这样就节省了CPU、GPU、电力。
- 由于它时在主线程上完成的，所以若是主线程非常忙时它的动画也会收到影响
- 它使用一个回调函数作为参数，这个回调函数会在浏览器重绘之前调用。

**使用：**

正常使用：

```javascript
const requestID = window.requestAnimationFrame(callback);
```

兼容版本：

```javascript
// 给 window 下挂载一个兼容版本的 requestAniFrame
window.requestAniFrame = (function () {
  return  window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame    || 
    window.oRequestAnimationFrame      || 
    window.msRequestAnimationFrame     || 
    function( callback ){
      window.setTimeout(callback, 1000 / 60);
    };
})();
```



### requestAnimationFrame对比setTimeout

(参考来源：[requestAnimationFrame](https://www.jianshu.com/p/f6d933670617))

**屏幕刷新频率：**屏幕每秒出现图像的次数。普通笔记本为60Hz

**动画原理：**计算机每16.7ms刷新一次，由于人眼的视觉停留，所以看起来是流畅的移动。

**setTimeout：**通过设定间隔时间来不断改变图像位置，达到动画效果。但是容易出现卡顿抖动的现象；原因是：

1. settimeout任务被放入异步队列，只有当主线程任务执行完后才会执行队列中的任务，因此实际执行时间总是比设定时间要晚；

2. settimeout的固定时间间隔不一定与屏幕刷新时间相同，会引起丢帧。

**requestAnimationFrame：**优势：由系统决定回调函数的执行时机。60Hz的刷新频率，那么每次刷新的间隔中会执行一次回调函数，不会引起丢帧，不会卡顿。且由于一旦页面不处于浏览器的当前标签，就会自动停止刷新，这样就节省了CPU、GPU、电力。



作者：糕糕AA
链接：https://www.jianshu.com/p/f6d933670617
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。



### 介绍一下Promise以及它的一些方法

这道题我会先大概介绍一下`Promise`：

[`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 是一个对象，它代表了一个异步操作的最终完成或者失败。由于它的`then`方法和`catch、finally`方法会返回一个新的`Promise`所以可以允许我们链式调用，解决了传统的回调地狱问题。

再说一下`then`以及`catch`方法：

(此处我是直接拿我之前的一篇文章[《45道Promise题》](https://juejin.im/post/5e58c618e51d4526ed66b5cf#heading-16)那里的总结)

1. `Promise`的状态一经改变就不能再改变。(见3.1)
2. `.then`和`.catch`都会返回一个新的`Promise`。(上面的👆1.4证明了)
3. `catch`不管被连接到哪里，都能捕获上层未捕捉过的错误。(见3.2)
4. 在`Promise`中，返回任意一个非 `promise` 的值都会被包裹成 `promise` 对象，例如`return 2`会被包装为`return Promise.resolve(2)`。
5. `Promise` 的 `.then` 或者 `.catch` 可以被调用多次, 但如果`Promise`内部的状态一经改变，并且有了一个值，那么后续每次调用`.then`或者`.catch`的时候都会直接拿到该值。(见3.5)
6. `.then` 或者 `.catch` 中 `return` 一个 `error` 对象并不会抛出错误，所以不会被后续的 `.catch` 捕获。(见3.6)
7. `.then` 或 `.catch` 返回的值不能是 promise 本身，否则会造成死循环。(见3.7)
8. `.then` 或者 `.catch` 的参数期望是函数，传入非函数则会发生值透传。(见3.8)
9. `.then`方法是能接收两个参数的，第一个是处理成功的函数，第二个是处理失败的函数，再某些时候你可以认为`catch`是`.then`第二个参数的简便写法。(见3.9)
10. `.finally`方法也是返回一个`Promise`，他在`Promise`结束的时候，无论结果为`resolved`还是`rejected`，都会执行里面的回调函数。

另外也可以说一下`finally`方法：

1. `.finally()`方法不管`Promise`对象最后的状态如何都会执行

2. `.finally()`方法的回调函数不接受任何的参数，也就是说你在`.finally()`函数中是没法知道`Promise`最终的状态是`resolved`还是`rejected`的

3. 它最终返回的默认会是一个**上一次的Promise对象值**，不过如果抛出的是一个异常则返回异常的`Promise`对象。

最后可以说一下`all`以及`race`方法：

- `Promise.all()`的作用是接收一组异步任务，然后并行执行异步任务，并且在所有异步操作执行完后才执行回调。
- `.race()`的作用也是接收一组异步任务，然后并行执行异步任务，只保留取第一个执行完成的异步操作的结果，其他的方法仍在执行，不过执行结果会被抛弃。
- `Promise.all().then()`结果中数组的顺序和`Promise.all()`接收到的数组顺序一致。
- `all和race`传入的数组中如果有会抛出异常的异步任务，那么只有最先抛出的错误会被捕获，并且是被`then`的第二个参数或者后面的`catch`捕获；但并不会影响数组中其它的异步任务的执行。



### Promise.all中如果有一个抛出异常了会如何处理

这个，在上一题已经说到了：

`all和race`传入的数组中如果有会抛出异常的异步任务，那么只有最先抛出的错误会被捕获，并且是被`then`的第二个参数或者后面的`catch`捕获；但并不会影响数组中其它的异步任务的执行。



### Promise为什么能链式调用

由于它的`then`方法和`catch、finally`方法会返回一个**新的`Promise`**所以可以允许我们链式调用。



### 手写一个简易的Promise

简易版的Promise：

```javascript
const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';
function MyPromise (fn) {
  let that = this;
  that.status = PENDING;
  that.value = null;
  that.resolvedCallbacks = [];
  that.rejectedCallbacks = [];
  function resolve (value) {
    if (that.status === PENDING) {
      that.status = RESOLVED;
      that.value = value;
      that.resolvedCallbacks.forEach(cb => cb(value))
    }
  }
  function reject (value) {
    if (that.status === PENDING) {
      that.status = REJECTED;
      that.value = value;
      that.rejectedCallbacks.forEach(cb => cb(value))
    }
  }
  try {
    fn(resolve, reject);
  } catch (e) {
    reject(e);
  }
}
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  let that = this;
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
  onRejected = typeof onRejected === 'function' ? onRejected : r => { throw r };
  if (that.status === PENDING) {
    that.resolvedCallbacks.push(onFulfilled);
    that.rejectedCallbacks.push(onRejected);
  }
  if (that.status === RESOLVED) {
    onFulfilled(that.value)
  }
  if (that.status === REJECTED) {
    onRejected(that.value)
  }
}
new MyPromise((resolve, reject) => {
  console.log('我立即执行')
  setTimeout(() => {
    resolve(1)
  }, 1000)
}).then(res => {
  console.log(res)
})
```



### 手写一个符合Promise/A+规范

这个我是参考的[刘小夕-Promise的源码实现（完美符合Promise/A+规范）](https://juejin.im/post/5c88e427f265da2d8d6a1c84)

具体的实现，文章中讲解的很详细了。

测试脚本: `promises-aplus-tests`

```javascript
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
function Promise (executor) {
  let self = this;
  self.status = PENDING;
  self.onFulfilled = [];
  self.onRejected = [];
  function resolve (value) {
    if (self.status === PENDING) {
      self.status = FULFILLED;
      self.value = value;
      self.onFulfilled.forEach(fn => fn());
    }
  }
  function reject (value) {
    if (self.status === PENDING) {
      self.status = REJECTED;
      self.reason = value;
      self.onRejected.forEach(fn => fn());
    }
  }
  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}
Promise.prototype.then = function (onFulfilled, onRejected) {
  var self = this;
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
  onRejected = typeof onRejected === 'function' ? onRejected : (reason) => {
    throw reason;
  };
  let promise2 = new Promise((resolve, reject) => {
    if (self.status === FULFILLED) {
      setTimeout(() => {
        try {
          let x = onFulfilled(self.value);
          resolvePromise(promise2, x, resolve, reject);    
        } catch (e) {
          reject(e);
        }
      })
    } else if (self.status === REJECTED) {
      setTimeout(() => {
        try {
          let x = onRejected(self.reason);
          resolvePromise(promise2, x, resolve, reject);    
        } catch (e) {
          reject(e);
        }
      })
    } else if (self.status === PENDING) {
      self.onFulfilled.push(() => {
        setTimeout(() => {
          try {
            let x = onFulfilled(self.value);
            resolvePromise(promise2, x, resolve, reject);    
          } catch (e) {
            reject(e);
          }
        })
      })
      self.onRejected.push(() => {
        setTimeout(() => {
          try {
            let x = onRejected(self.reason);
            resolvePromise(promise2, x, resolve, reject);    
          } catch (e) {
            reject(e);
          }
        })
      })
    }
  })
  return promise2;
}
function resolvePromise (promise2, x, resolve, reject) {
  var self = this;
  if (promise2 === x) {
    reject(new TypeError('Chaining Cycle'));
  }
  if (x && typeof x === 'object' || typeof x === 'function') {
    let used;
    try {
      let then = x.then;
      if (typeof then === 'function') {
        then.call(x, (y) => {
          if (used) return;
          used = true;
          resolvePromise(promise2, y, resolve, reject);
        }, (r) => {
          if (used) return;
          used = true;
          reject(r);
        })
      } else {
        if (used) return;
        used = true;
        resolve(x);
      }
    } catch (e) {
      if (used) return;
      used = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}

module.exports = Promise;

Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
      dfd.resolve = resolve;
      dfd.reject = reject;
  });
  return dfd;
}
```



### 关于async/await以下代码分别是怎么执行的？

```javascript
function wait (delay) {
  return new Promise(r => {
    setTimeout(() => {
      r('execute', console.log('execute'))
    }, delay)
  })
}
// async function series () { // 1
//   await wait(500);
//   await wait(500);
//   console.log('done')
// }
async function series () { // 2
  const wait1 = wait(500)
  const wait2 = wait(500)
  await wait1;
  await wait2;
  console.log('done')
}
series()
```

- 第一个`series()`:

```javascript
// 1. 500ms后
'execute'
// 2. 500ms后
'execute' 和 'done' 一起打印
```

- 第二个`series`:

```javascript
// 500ms后同时打印出
'execute'
'execute'
'done'
```

参考：https://developers.google.com/web/fundamentals/primers/async-functions



### 关于http,XMLHttpRequest,Ajax的关系

- `http`是浏览器和web服务器交换数据的协议,规范
- `XMLHttpRequest`是一个`JS`对象，是浏览器实现的一组`api`函数，使用这些函数，浏览器再通过`http`协议请求和发送数据。
- `Ajax`是一种技术方案，但并不是一种新技术，它最核心的就是依赖浏览器提供的`XMLHttpRequest`对象。用一句话来概括就是`我们使用XMLHttpRequest对象来发送一个Ajax请求`。



### XMLHttpRequest的发展历程是怎样的？

它最开始只是微软浏览器提供的一个接口，后来各大浏览器纷纷效仿也提供了这个接口，再后来W3C对它进行了标准化，提出了`XMLHttpRequest`标准。标准又分为`Level 1`和`Level 2`。

`Level 2`相对于`Level 1`做了很大的改进，具体来说是：

- 可以设置HTTP请求的超时时间。
- 可以使用FormData对象管理表单数据。
- 可以上传文件。
- 可以请求不同域名下的数据（跨域请求）。
- 可以获取服务器端的二进制数据。
- 可以获得数据传输的进度信息。

（参考：https://juejin.im/post/58e4a174ac502e006c1e18f4）



### 使用XMLHttpRequest封装一个get和post请求

**get请求**：

核心就四步：

1. `var xhr = new XMLHttpRequest()`
2. `xhr.open('GET', 'http://www.example.com/api/getname', true)`
3. `xhr.onreadystatechange = function () {}`
4. `xhr.send()`

让我们来封装一个简易版的：

```javascript
/*
* xhr的get请求
* @param url: 请求地址
* @param params: 请求参数
* @param onSuccess: 成功回调函数
* @param onError: 失败回调函数
*/
function xhrGet (url, params = {}, onSuccess, onError) {
  // 兼容IE6
  var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
  let paramString = formatParams(params);
  // xhr.open的第三个参数isAsync：是否异步 
  xhr.open('GET', `${url}${paramString}`, true);
  xhr.onreadystatechange = function () {
    // console.log(e);
    console.log(this);
    if (this.readyState === 4) {
      if (this.status >= 200 && this.status < 300) {
        onSuccess(this.response);
      } else {
        onError(this.response)
      }
    }
  }
  xhr.send();
}
// 处理参数：如将{name: 'lindaidai'}转为'?name=lindaidai'
function formatParams (params) {
  var paramString = Object.keys(params).map(key => {
    return `${key}=${encodeURIComponent(params[key])}`
  }).join('&');
  return paramString ? `?${paramString}` : ''
}
```

（当然上面的兼容`IE6`估计现在考的不多了，而且我这种写法其实也没啥用，因为如果真是在`IE6`下的话，后面的`Object.keys()`等方法也用不了了）

需要注意的是两种状态，一个是`readyState`，一个是`status`。

`readyState`请求状态：

- 0（未初始化）：还没有调用 open() 方法。

- 1（载入）：已调用 send() 方法，正在发送请求。

- 2（载入完成）：send() 方法完成，已收到全部响应内容。

- 3（解析）：正在解析响应内容。

- 4（完成）：响应内容解析完成，可以在客户端调用。

`status`结果状态码：

- 0 ：如果状态是 UNSENT 或 OPENED；或者如果错误标签被设置(例如跨域时)

- 200 成功
- 其它HTTP状态码



**post请求：**

```javascript
function xhrPost (url, params, onSuccess, onError) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  // ajax的默认请求ContentType:text/plain(纯文本)
  xhr.setRequestHeader("Content-Type", "application-x-www-form-urlencode");
  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status >= 200 && this.status < 300) {
        onSuccess(this.response);
      } else {
        onError(this.response);
      }
    }
  }
  xhr.send(params);
}
```





## 模块化

### CommonJS和ES6模块的区别

- CommonJS模块是运行时加载，ES6 Modules是编译时输出接口
- CommonJS输出是值的拷贝；ES6 Modules输出的是值的引用，被输出模块的内部的改变会影响引用的改变
- CommonJs导入的模块路径可以是一个表达式，因为它使用的是`require()`方法；而ES6 Modules只能是字符串
- CommonJS `this`指向当前模块，ES6 Modules `this`指向`undefined`
- 且ES6 Modules中没有这些顶层变量：`arguments`、`require`、`module`、`exports`、`__filename`、`__dirname`

关于第一个差异，是因为CommonJS 加载的是一个对象（即`module.exports`属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

（具体可以看我的这篇文章：https://juejin.im/post/5eaacd175188256d4345ea3a）



## 设计模式

### 实现一个发布订阅者模式(4步骤)

以下回答参考：[发布订阅模式，在工作中它的能量超乎你的想象](https://juejin.im/post/5b125ad3e51d450688133f22)

**简介：**

发布订阅者模式，一种对象间一对多的依赖关系，但一个对象的状态发生改变时，所依赖它的对象都将得到状态改变的通知。

**主要的作用(优点)：**

1. 广泛应用于异步编程中(替代了传递回调函数)
2. 对象之间松散耦合的编写代码

**缺点：**

- 创建订阅者本身要消耗一定的时间和内存
- 多个发布者和订阅者嵌套一起的时候，程序难以跟踪维护

**实现的思路：**

- 创建一个对象(缓存列表)
- on方法用来把回调函数fn都加到缓存列表中
- emit方法取到arguments里第一个当做key，根据key值去执行对应缓存列表中的函数
- remove方法可以根据key值取消订阅

**coding：**

```javascript
let event = {
  list: {},
  on (key, fn) {
    if (!this.list[key]) {
      this.list[key] = [];
    }
    this.list[key].push(fn);
  },
  emit () {
    let key = [].shift.call(arguments),
      fns = this.list[key];
    if (!fns || fns.length <= 0) {
      return false;
    }
    fns.forEach(fn => {
      fn.apply(this, arguments);
    })
  },
  remove (key, fn) {
    let fns = this.list[key];
    if (!fns || fns.length <= 0) {
      return false;
    }
    if (!fn) {
      fns && (fns.length = 0);
    } else {
      fns.forEach((cb, i) => {
        if (cb === fn) {
          fns.splice(i, 1);
        }
      })
    }
  }
}
function cat () {
  console.log('喵喵喵～');
}
function dog () {
  console.log('汪汪汪～');
}
function hasArgs (args) {
  console.log(args);
}
event.on('pet', hasArgs);
event.on('pet', cat);
event.on('pet', dog);

event.remove('pet', dog)

event.emit('pet', '我是传递的参数');

// 结果：
// '我是传递的参数'
// '喵喵喵～'
```

**工作中的应用：**

- 插广告
- 打点



### 发布订阅者模式和观察者模式的区别？

发布/订阅模式是观察者模式的一种变形，两者区别在于，**发布/订阅模式在观察者模式的基础上，在目标和观察者之间增加一个调度中心。**

**观察者模式**是由具体目标调度，比如当事件触发，Subject 就会去调用观察者的方法，所以观察者模式的订阅者与发布者之间是存在依赖的。

**发布/订阅模式**由统一调度中心调用，因此发布者和订阅者不需要知道对方的存在。



## webpack

### webpack的打包原理

(回答参考：[「吐血整理」再来一打Webpack面试题(持续更新)](https://juejin.im/post/5e6f4b4e6fb9a07cd443d4a5#heading-3))

`初始化参数`：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数

`开始编译`：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译

`确定入口`：根据配置中的 entry 找出所有的入口文件

`编译模块`：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理

`完成模块编译`：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系

`输出资源`：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会

`输出完成`：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统



### webpack打包优化

参考文章： https://juejin.im/post/5ea528496fb9a03c576cceac#heading-2

- 先使用`webpack-bundle-analyzer`分析打包后整个项目中的体积结构，既可以看到项目中用到的所有第三方包，又能看到各个模块在整个项目中的占比。

- `Vue`路由懒加载，使用`() => import(xxx.vue)`形式，打包会根据路由自动拆分打包。

- 第三方库按需加载，例如`lodash`库、`UI`组件库

- 使用`purgecss-webpack-plugin`和`glob`插件去除无用样式(`glob`插件可以可以同步查找目录下的任意文件夹下的任意文件)：

  ```javascript
  new PurgecssWebpackPlugin({
      // paths表示指定要去解析的文件名数组路径
      // Purgecss会去解析这些文件然后把无用的样式移除
      paths: glob.sync('./src/**/*', {nodir: true})
      // glob.sync同步查找src目录下的任意文件夹下的任意文件
      // 返回一个数组，如['真实路径/src/css/style.css','真实路径/src/index.js',...]
  })
  ```

- 文件解析优化：

  - `babel-loader`编译慢，可以通过配置`exclude`来去除一些不需要编译的文件夹，还可以通过设置`cacheDirectory`开启缓存，转译的结果会被缓存到文件系统中
  - 文件解析优化：通过配置`resolve`选项中的`alias`。`alias`创建`import`或者`require`的别名，加快`webpack`查找速度。

- 使用`webpack`自带插件`IgnorePlugin`忽略`moment`目录下的`locale`文件夹使打包后体积减少`278k`

  - 问题原因：使用`moment`时发现会把整个`locale`语言包都打包进去导致打包体积过大，但是我们只需要用到中文包

  - 在`webpack`配置中使用`webpack`自带的插件`IgnorePlugin`忽略`moment`目录下的`locale`文件夹

  - 之后在项目中引入：

    ```javascript
    // index.js
    // 利用IgnorePlugin把只需要的语言包导入使用就可以了，省去了一下子打包整个语言包
    import moment from 'moment';
    // 单独导入中文语言包
    import 'moment/locale/zh-cn';
    ```

- 使用`splitChunks`进行拆包，抽离公共模块，一些常用配置项：
- `chunks`:表示选择哪些 `chunks` 进行分割，可选值有：`async，initial和all`
  - `minSize`: 表示新分离出的`chunk`必须大于等于`minSize`，默认为30000，约30kb
  - `minChunks`: 表示一个模块至少应被minChunks个chunk所包含才能分割，默认为1
  - `name`: 设置`chunk`的文件名
  - `cacheGroups`: 可以配置多个组，每个组根据test设置条件，符合test条件的模块，就分配到该组。模块可以被多个组引用，但最终会根据priority来决定打包到哪个组中。默认将所有来自 node_modules目录的模块打包至vendors组，将两个以上的chunk所共享的模块打包至default组。
- `DllPlugin`动态链接库，将第三方库的代码和业务代码抽离：

  - 根目录下创建一个`webpack.dll.js`文件用来打包出`dll`文件。并在`package.json`中配置`dll`指令生成`dll`文件夹，里面就会有`manifest.json`以及生成的`xxx.dll.js`文件
  - 将打包的dll通过`add-asset-html-webpack-plugin`添加到html中，再通过DllReferencePlugin把dll引用到需要编译的依赖。



### webpack中的loader和plugin有什么区别

loader它是一个转换器，只专注于转换文件这一个领域，完成压缩、打包、语言编译，**它仅仅是为了打包**。并且运行在打包之前。

而plugin是一个扩展器，它丰富了webpack本身，为其进行一些其它功能的扩展。**它不局限于打包，资源的加载，还有其它的功能**。所以它是在整个编译周期都起作用。



### 使用babel-loader会有哪些问题？可以怎样优化？

1. 会使得编译很慢。解决办法是可以在`webpack`的`babel-loader`配置中使用`exclude`这个可选项来去除一些不需要编译的文件夹(例如`node_modules`和`bower_components`)，另一种可以设置`cacheDirectory`选项为`true`, 开启缓存, 转译的结果将会缓存到文件系统中, 这样使`babel-loader`至少提速两倍(代码量越多效果应该越明显)。
2. `babel-loader`使得打包文件体积过大。Babel 对一些公共方法使用了非常小的辅助代码, 比如 `_extend`.默认情况下会被添加到每一个需要它的文件中, 所以会导致打包文件体积过大.解决办法: 引入`babel runtime`作为一个单独的模块, 来避免重复。也就是可以使用`@babel/plugin-transform-runtime`和`babel-runtime`。



### webpack有哪几种文件指纹？

- `hash`是跟整个项目的构建相关，只要项目里有文件更改，整个项目构建的`hash`值都会更改，并且全部文件都共用相同的`hash`值。(粒度整个项目)
- `chunkhash`是根据不同的入口进行依赖文件解析，构建对应的`chunk`(模块)，生成对应的`hash`值。只有被修改的`chunk`(模块)在重新构建之后才会生成新的`hash`值，不会影响其它的`chunk`。(粒度`entry`的每个入口文件)
- `contenthash`是跟每个生成的文件有关，每个文件都有一个唯一的`hash`值。当要构建的文件内容发生改变时，就会生成新的`hash`值，且该文件的改变并不会影响和它同一个模块下的其它文件。(粒度每个文件的内容)

（具体可以看我简书上的这篇文章：https://www.jianshu.com/p/486453d81088）



### webpack如果使用了hash命名，那是每次都会重写生成hash吗

这个问题在上一个问题中已经说明了，要看`webpack`的配置。

有三种情况：

- 如果是`hash`的话，是和整个项目有关的，有一处文件发生更改则所有文件的`hash`值都会发生改变且它们共用一个`hash`值；
- 如果是`chunkhash`的话，只和`entry`的每个入口文件有关，也就是同一个`chunk`下的文件有所改动该`chunk`下的文件的`hash`值就会发生改变
- 如果是`contenthash`的话，和每个生成的文件有关，只有当要构建的文件内容发生改变时才会给该文件生成新的`hash`值，并不会影响其它文件。



### webpack中如何处理图片的？

在`webpack`中有两种处理图片的`loader`：

- `file-loader`：解决`CSS`等中引入图片的路径问题；(解决通过`url`,`import/require()`等引入图片的问题)
- `url-loader`：当图片小于设置的`limit`参数值时，`url-loader`将图片进行`base64`编码(当项目中有很多图片，通过`url-loader`进行`base64`编码后会减少`http`请求数量，提高性能)，大于limit参数值，则使用`file-loader`拷贝图片并输出到编译目录中；

（详细使用可以查看这里：[霖呆呆的webpack之路-loader篇](https://github.com/LinDaiDai/niubility-coding-js/blob/master/前端工程化/webpack/霖呆呆的webpack之路-loader篇.md#file-loader)）



### Babel是如何编译Class的？

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



### webpack和rollup中对tree-shaking的程度

- 函数的参数若是引用类型，对于它属性的操作，都是有可能会产生副作用的。因为首先它是引用类型，对它属性的任何修改其实都是改变了函数外部的数据。其次获取或修改它的属性，会触发`getter`或者`setter`，而`getter`、`setter`是不透明的，有可能会产生副作用。

- uglify没有完善的程序流分析。它可以简单的判断变量后续是否被引用、修改，但是不能判断一个变量完整的修改过程，不知道它是否已经指向了外部变量，所以很多有可能会产生副作用的代码，都只能保守的不删除。
- uglify可以配置`pure_getters: true`来强制认为获取对象属性，是没有副作用的。

- rollup有程序流分析的功能，可以更好的判断代码是否真正会产生副作用。

(参考来源：[相学长-你的Tree-Shaking并没什么卵用](https://juejin.im/post/5a5652d8f265da3e497ff3de))



### 对tree-shaking的了解

**作用：**

它表示在打包的时候会去除一些无用的代码

**原理**：

- `ES6`的模块引入是静态分析的，所以在编译时能正确判断到底加载了哪些模块
- 分析程序流，判断哪些变量未被使用、引用，进而删除此代码

**特点：**

- 在生产模式下它是默认开启的，但是由于经过`babel`编译全部模块被封装成`IIFE`，它存在副作用无法被`tree-shaking`掉
- 可以在`package.json`中配置`sideEffects`来指定哪些文件是有副作用的。它有两种值，一个是布尔类型，如果是`false`则表示所有文件都没有副作用；如果是一个数组的话，数组里的文件路径表示改文件有副作用
- `rollup`和`webpack`中对`tree-shaking`的层度不同，例如对`babel`转译后的`class`，如果`babel`的转译是宽松模式下的话(也就是`loose`为`true`)，`webpack`依旧会认为它有副作用不会`tree-shaking`掉，而`rollup`会。这是因为`rollup`有程序流分析的功能，可以更好的判断代码是否真正会产生副作用。



### webpack中如何实现动态导入？

1. 使用`import(/** webpackChunkName: "lodash" **/ 'lodash').then(_ => {})`，同时可以在`webpack.config.js`中配置一下`output的chunkFilename`为`[name].bunld.js`将要导入的模块单独抽离到一个`bundle`中，以此实现代码分离。
2. 使用`async`，由于`import()`返回的是一个`promise`, 因此我们可以使用`async`函数来简化它，不过需要`babel`这样的预处理器及处理转换`async`的插件。`const _ = await import(/* webpackChunkName: "lodash" */ 'lodash');`



### webpack4为什么弃用CommonsChunkPlugin？

(回答参考：https://www.jianshu.com/p/ece902324ff7)

`CommonsChunkPlugin`是`webpack3`中用于提取公共代码，但是在`webpack4`中已经被弃用了，主要是有这么几个原因：

- **CommonsChunkPlugin的思路（基于父子关系）：**即将满足minchunks配置项所设置的条件的模块移到一个新的chunk文件中去，也就是这个新生成的chunk是所有chunk的父亲，在加载孩子chunk时,父亲chunk是必须提前加载的：

  ```javascript
  // example:
  entryA:  vue vuex  someComponents.....
  entryB:  vue axios someComponents.....
  entryC: vue vuex axios  someComponents.....
  minchunks: 2 即某个module被引用2次就提取到公共即父亲chunk中
  
  // 产出的chunk
  vendor-chunk: vue vuex axios
  chunkA 到 chunkC: only the corresponding components
  ```

  带来的问题就是： 对entryA 和 entryB 都有多余的module

- 对异步模块不友好，如果asyncB在entryA中动态引入，则会引入多余module。也就是说：无法优化异步chunk，引入重复代码：

  ```javascript
  // example:
  entryA:  vue vuex  someComponents.....
  asyncB:  vue axios someComponents.....
  entryC: vue vuex axios  someComponents.....
  minchunks: 2 
  // 产出的chunk
  vendor-chunk: vue vuex
  chunkA: only the corresponding components
  chunkB: vue axios someComponents
  chunkC: axios someComponents
  ```

总结来说：

只能统一抽取到父chunk，造成父chunk过大，不可避免的存在重复引入，引入多余代码。

而在`SplitChunksPlugin`中引入`chunkGroup`的概念,在入口chunk和异步chunk中发现被重复使用的模块，将重复模块以vendor-chunk的形式分离出来，也就是vendor-chunk可能有多个，不再受限于所有chunk中都共同存在的模块。

```javascript
entryA:  vue vuex  someComponents.....
entryB:  vue axios someComponents.....
entryC: vue vuex axios  someComponents.....
minchunks: 2 
产出的chunk:
vendor-chunkA-B-C: vue
vendor-chunkA-C: vuex
vendor-chunkB-C: axios
chunkA: only the corresponding components
chunkB: only the corresponding components
chunkC: only the corresponding components
```



## Vue

### Vue3.0相对于Vue2.x有哪些不同？

**performance**

首先在性能(performance)上有了更多的优化，一方面表现在`virtual dom`的生成上更快了，另外在底层还做了一些监听的缓存，也就是事件在被创建的时候会被推进一个缓存中，后续没有改变会直接取缓存。

**tree-shaking**

tree-shaking它表示的是在打包的时候会去除一些无用的代码。而在Vue3中对它的支持更加友好了，例如像transition、v-model、computed等功能没有用到的话，那么最后打包产生的代码就会将它们去除。也就是说，如果你的Vue项目只写了一个Hello Word的话，那么最后打包的代码中就只有一些核心的代码，如更新算法、响应式等，打包生成的文件可能就只有13.5kb。

**Fragments**

碎片(Fragments)，原本在Vue2.x中每个template下只能允许有一个根节点，但是在Vue3中它可以允许你有多个，用尤大大的话来说就是会将这些内容自动变为一个碎片。

**TS**

再者就是对TS的支持度很好。虽然Vue3本来就是用TS写的，但是不一定要用TS。另外它也支持Class Component，不过不是第一推荐。

**Component API**

语法上，对模版语法是零改变的。只不过更加推荐用Component API来写JS部分。Component API它并不是语法，而是新增的API。它带来的好处一个是逻辑重用，方便我们把一些功能的部分抽离出来。另一个它相对于options来说更加集中，用options来写代码想要追寻一个变量的变化比较麻烦。

**关于兼容性**

目前的Vue3.beta版本是不支持IE11的，因为核心的响应式原理用到了ES6的Proxy，但是以后会去兼容IE11。后面我们在创建一个Vue项目的时候，可以选择不同的版本，支持IE11和不支持IE11的。

**什么时候能使用**

现在的beta版本其实已经可以用了，对于一些新的小的项目可以试试水，这个可以自己评估。正式能够投入到生产使用中可能要等到年中 (终？)。



### 为什么不建议v-for和v-if一起用？

当它们处于同一节点，`v-for` 的优先级比 `v-if` 更高，这意味着 `v-if` 将分别重复运行于每个 `v-for` 循环中。



### 前端路由和后端路由的优缺点

**前端路由：**

在不刷新页面的情况下显现出不同的页面内容。

*优点：*

- 用户体验好，和后台网速没有关系，不需要每次都从服务器全部获取，快速展现给用户
- 可以在浏览器中输入指定想要访问的`url`路径地址
- 实现了前后端的分离，方便开发。有很多框架都带有路由功能模块。

*缺点：*

- 使用浏览器的前进，后退键的时候会重新发送请求，没有合理地利用缓存
- 单页面无法记住之前滚动的位置，无法在前进，后退的时候记住滚动的位置
- 同样不利于`SEO`

**后端路由：**

浏览器在地址栏中切换不同的`url`时，每次都向后台服务器发请求，服务器响应请求，在后台拼接html文件传给前端显示, 返回不同的页面, 意味着浏览器会刷新页面。

*优点：*

- 分担了前端的压力，html和数据的拼接都是由服务器完成。
- 利于`SEO`

*缺点：*

- 当项目十分庞大时，加大了服务器端的压力
- 同时在浏览器端不能输入指定的`url`路径进行指定模块的访问
- 如果当前网速过慢，那将会延迟页面的加载，对用户体验不是很友好



### Vue中hash模式和history模式的区别

- 最明显的是在显示上，`hash`模式的`URL`中会夹杂着`#`号，而`history`没有。
- `Vue`底层对它们的实现方式不同。`hash`模式是依靠`onhashchange`事件(监听`location.hash`的改变)，而`history`模式是主要是依靠的`HTML5 history`中新增的两个方法，`pushState()`可以改变`url`地址且不会发送请求，`replaceState()`可以读取历史记录栈,还可以对浏览器记录进行修改。
- 当真正需要通过`URL`向后端发送`HTTP`请求的时候，比如常见的用户手动输入`URL`后回车，或者是刷新(重启)浏览器，这时候`history`模式需要后端的支持。因为`history`模式下，前端的`URL`必须和实际向后端发送请求的`URL`一致，例如有一个`URL`是带有路径`path`的(例如`www.lindaidai.wang/blogs/id`)，如果后端没有对这个路径做处理的话，就会返回`404`错误。所以需要后端增加一个覆盖所有情况的候选资源，一般会配合前端给出的一个`404`页面。

`hash:`

```javascript
window.onhashchange = function(event){
  // location.hash获取到的是包括#号的，如"#heading-3"
  // 所以可以截取一下
	let hash = location.hash.slice(1);
}
```



### 能用代码实现一下hash路由吗？

基础的html代码：

```html
<html>
  <style>
    html, body {
      margin: 0;
      height: 100%;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
    }
    .box {
      width: 100%;
      height: 100%;
      background-color: red;
    }
  </style>
  <body>
  <ul>
    <li>
      <a href="#red">红色</a>
    </li>
    <li>
      <a href="#green">绿色</a>
    </li>
    <li>
      <a href="#purple">紫色</a>
    </li>
  </ul>
  </body>
</html>
```

简单实现：

```html
<script>
  const box = document.getElementsByClassName('box')[0];
  const hash = location.hash
  window.onhashchange = function (e) {
    const color = hash.slice(1)
    box.style.background = color
  }
</script>
```

封装成一个class:

```html
<script>
  const box = document.getElementsByClassName('box')[0];
  const hash = location.hash
  class HashRouter {
    constructor (hashStr, cb) {
      this.hashStr = hashStr
      this.cb = cb
      this.watchHash()
      this.watch = this.watchHash.bind(this)
      window.addEventListener('hashchange', this.watch)
    }
    watchHash () {
      let hash = window.location.hash.slice(1)
      this.hashStr = hash
      this.cb(hash)
    }
  }
  new HashRouter('red', (color) => {
    box.style.background = color
  })
</script>
```



### 了解history有哪些方法吗？说下它们的区别

(参考来源：[阿里P7：你了解路由吗？](https://juejin.im/post/5e85cb8151882573c66cf63f#heading-11))

history 这个对象在html5的时候新加入两个api **history.pushState() 和 history.repalceState()** 这两个 API可以在不进行刷新的情况下，操作浏览器的历史纪录。唯一不同的是，前者是新增一个历史记录，后者是直接替换当前的历史记录。

从参数上来说：

```javascript
window.history.pushState(state,title,url)
//state：需要保存的数据，这个数据在触发popstate事件时，可以在event.state里获取
//title：标题，基本没用，一般传null
//url：设定新的历史纪录的url。新的url与当前url的origin必须是一样的，否则会抛出错误。url可以时绝对路径，也可以是相对路径。
//如 当前url是 https://www.baidu.com/a/,执行history.pushState(null, null, './qq/')，则变成 https://www.baidu.com/a/qq/，
//执行history.pushState(null, null, '/qq/')，则变成 https://www.baidu.com/qq/

window.history.replaceState(state,title,url)
//与pushState 基本相同，但她是修改当前历史纪录，而 pushState 是创建新的历史纪录
```

另外还有：

- `window.history.back()` 后退
- `window.history.forward()`前进
- `window.history.go(1)` 前进或者后退几步

从触发事件的监听上来说：

- `pushState()`和`replaceState()`不能被`popstate`事件所监听
- 而后面三者可以，且用户点击浏览器前进后退键时也可以



### 如何监听 pushState 和 replaceState 的变化呢？

利用自定义事件`new Event()`创建这两个事件，并全局监听：

```html
<body>
  <button onclick="goPage2()">去page2</button>
  <div>Page1</div>
  <script>
    let count = 0;
    function goPage2 () {
      history.pushState({ count: count++ }, `bb${count}`,'page1.html')
      console.log(history)
    }
    // 这个不能监听到 pushState
    // window.addEventListener('popstate', function (event) {
    //   console.log(event)
    // })
    function createHistoryEvent (type) {
      var fn = history[type]
      return function () {
        // 这里的 arguments 就是调用 pushState 时的三个参数集合
        var res = fn.apply(this, arguments)
        let e = new Event(type)
        e.arguments = arguments
        window.dispatchEvent(e)
        return res
      }
    }
    history.pushState = createHistoryEvent('pushState')
    history.replaceState = createHistoryEvent('replaceState')
    window.addEventListener('pushState', function (event) {
      // { type: 'pushState', arguments: [...], target: Window, ... }
      console.log(event)
    })
    window.addEventListener('replaceState', function (event) {
      console.log(event)
    })
  </script>
</body>
```



### Vue组件内的导航守卫有哪几个？

- `beforeRouteEnter`
- `beforeRouteUpdate`
- `beforeLeave`



### beforeRouteEnter和另外两个有什么不同吗？

`beforeRouteEnter`是支持给`next`传递参数的唯一守卫，因为在这个路由守卫中还**不能访问this**，而为了能让我们访问组件实例，可以通过传一个回调给`next`：

```javascript
beforeRouteEnter(to, from, next) {
	next(vm => {
		// vm 就是组件实例
	})	
}
```

而对于另外两个，`this`已经可用，所以**不支持传递回调**：

```javascript
beforeRouteUpdate (to, from, next) {
  // just use `this`
  this.name = to.params.name
  next()
}
```

离开守卫`beforeRouteLeave`通常用来禁止用户还未保存修改之前离开，可以通过`next(false)`来取消：

```javascript
beforeRouteLeave (to, from, next) {
  const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  if (answer) {
    next()
  } else {
    next(false)
  }
}
```



### 完整的导航解析流程

1. 导航被触发。
2. 在失活的组件里调用离开守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫 (2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 用创建好的实例调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数。



### 你是怎么看Vue和React的？

首先它们都是当今比较流行的前端框架。

**相同点：**

1. `Virtual DOM`。其中最大的一个相似之处就是都使用了`Virtual DOM`。(当然`Vue`是在`Vue2.x`才引用的)也就是能让我们通过操作数据的方式来改变真实的`DOM`状态。因为其实`Virtual DOM`的本质就是一个`JS`对象，它保存了对真实`DOM`的所有描述，是真实`DOM`的一个映射，所以当我们在进行频繁更新元素的时候，改变这个`JS`对象的开销远比直接改变真实`DOM`要小得多。
2. 组件化的开发思想。第二点来说就是它们都提倡这种组件化的开发思想，也就是建议将应用分拆成一个个功能明确的模块，再将这些模块整合在一起以满足我们的业务需求。
3. `Props`。`Vue`和`React`中都有`props`的概念，允许父组件向子组件传递数据。
4. 构建工具、Chrome插件、配套框架。还有就是它们的构建工具以及Chrome插件、配套框架都很完善。比如构建工具，`React`中可以使用`CRA`，`Vue`中可以使用对应的脚手架`vue-cli`。对于配套框架`Vue`中有`vuex、vue-router`，`React`中有`react-router、redux`。

**不同点**

1. 模版的编写。最大的不同就是模版的编写，`Vue`鼓励你去写近似常规`HTML`的模板，`React`推荐你使用`JSX`去书写。
2. 状态管理与对象属性。在`React`中，应用的状态是比较关键的概念，也就是`state`对象，它允许你使用`setState`去更新状态。但是在`Vue`中，`state`对象并不是必须的，数据是由`data`属性在`Vue`对象中进行管理。
3. 虚拟`DOM`的处理方式不同。`Vue`中的虚拟`DOM`控制了颗粒度，组件层面走`watcher`通知，而组件内部走`vdom`做`diff`，这样，既不会有太多`watcher`，也不会让`vdom`的规模过大。而`React`走了类似于`CPU`调度的逻辑，把`vdom`这棵树，微观上变成了链表，然后利用浏览器的空闲时间来做`diff`。



### 如何实现一个简易的MVVM？

(参考文章：[50行代码的MVVM，感受闭包的艺术](https://juejin.im/post/5b1fa77451882513ea5cc2ca))

实现一个简易的MVVM我会分为这么几步来：

1. 首先我会定义一个类Vue，这个类接收的是一个options，那么其中可能有需要挂载的根元素的id，也就是el属性；然后应该还有一个data属性，表示需要双向绑定的数据
2. 其次我会定义一个Dep类，这个类产生的实例对象中会定义一个subs数组用来存放所依赖这个属性的依赖，已经添加依赖的方法addSub，删除方法removeSub，还有一个notify方法用来遍历更新它subs中的所有依赖，同时Dep类有一个静态属性target它用来表示当前的观察者，当后续进行依赖收集的时候可以将它添加到dep.subs中。
3. 然后设计一个observe方法，这个方法接收的是传进来的data，也就是options.data，里面会遍历data中的每一个属性，并使用Object.defineProperty()来重写它的get和set，那么这里面呢可以使用new Dep()实例化一个dep对象，在get的时候调用其addSub方法添加当前的观察者Dep.target完成依赖收集，并且在set的时候调用dep.notify方法来通知每一个依赖它的观察者进行更新
4. 完成这些之后，我们还需要一个compile方法来将HTML模版和数据结合起来。在这个方法中首先传入的是一个node节点，然后遍历它的所有子级，判断是否有firstElmentChild，有的话则进行递归调用compile方法，没有firstElementChild的话且该child.innderHTML用正则匹配满足有`/\{\{(.*)\}\}/`项的话则表示有需要双向绑定的数据，那么就将用正则`new Reg('\\{\\{\\s*' + key + '\\s*\\}\\}', 'gm')`替换掉`{{ msg }}`是其为`msg`变量。
5. 完成变量替换的同时，还需要将Dep.target指向当前的这个child，且调用一下this.opt.data[key]，也就是为了触发这个数据的get来对当前的child进行依赖收集，这样下次数据变化的时候就能通知child进行视图更新了，不过在最后要记得将Dep.target指为null哦(其实在Vue中是有一个targetStack栈用来存放target的指向的)
6. 那么最后我们只需要监听`document`的`DOMContentLoaded`然后在回调函数中实例化这个`Vue`对象就可以了

**coding**:

需要注意的点：

- `childNodes`会获取到所有的子节点以及文本节点(包括元素标签中的空白节点)
- `firstElementChild`表示获取元素的第一个字元素节点，以此来区分是不是元素节点，如果是的话则调用`compile`进行递归调用，否则用正则匹配
- 这里面的正则真的不难，大家可以看一下s

完整代码如下：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>MVVM</title>
  </head>
  <body>
    <div id="app">
      <h3>姓名</h3>
      <p>{{name}}</p>
      <h3>年龄</h3>
      <p>{{age}}</p>
    </div>
  </body>
</html>
<script>
  document.addEventListener(
    "DOMContentLoaded",
    function () {
      let opt = { el: "#app", data: { name: "等待修改...", age: 20 } };
      let vm = new Vue(opt);
      setTimeout(() => {
        opt.data.name = "霖呆呆";
      }, 2000);
    },
    false
  );
  class Vue {
    constructor(opt) {
      this.opt = opt;
      this.observer(opt.data);
      let root = document.querySelector(opt.el);
      this.compile(root);
    }
    observer(data) {
      Object.keys(data).forEach((key) => {
        let obv = new Dep();
        data["_" + key] = data[key];

        Object.defineProperty(data, key, {
          get() {
            Dep.target && obv.addSubNode(Dep.target);
            return data["_" + key];
          },
          set(newVal) {
            obv.update(newVal);
            data["_" + key] = newVal;
          },
        });
      });
    }
    compile(node) {
      [].forEach.call(node.childNodes, (child) => {
        if (!child.firstElementChild && /\{\{(.*)\}\}/.test(child.innerHTML)) {
          let key = RegExp.$1.trim();
          child.innerHTML = child.innerHTML.replace(
            new RegExp("\\{\\{\\s*" + key + "\\s*\\}\\}", "gm"),
            this.opt.data[key]
          );
          Dep.target = child;
          this.opt.data[key];
          Dep.target = null;
        } else if (child.firstElementChild) this.compile(child);
      });
    }
  }

  class Dep {
    constructor() {
      this.subNode = [];
    }
    addSubNode(node) {
      this.subNode.push(node);
    }
    update(newVal) {
      this.subNode.forEach((node) => {
        node.innerHTML = newVal;
      });
    }
  }
</script>
```



### 对TypeScript的简单理解

**变量**：

1. `void`：与`any`类型相反，它表示没有任何类型，通常用于函数的返回值类型为`void`，声明一个`void`类型的变量没有什么大用，因为你只能为它赋予`undefined`和`null`。
2. 默认情况下`null`和`undefined`是所有类型的子类型。 就是说你可以把 `null`和`undefined`赋值给`number`类型的变量。然而，当你指定了`--strictNullChecks`标记，`null`和`undefined`只能赋值给`void`和它们各自。
3. `never`类型：表示的是那些永不存在的值的类型。 例如， `never`类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型； 变量也可能是 `never`类型，当它们被永不为真的类型保护所约束时。

**接口**：

1. 作用：对值所具有的结构进行类型检查
2. 可选属性可以用`?`，如：`interface Point { x?: number }`
3. 只读属性用`readonly`，如：`interface Point { readonly: x: number }`

**范型**：

1. 作用：使用范型来创建可重用的组件，一个组件可以支持多种类型的数据，这样用户就可以用自己的数据类型来使用组件了
2. 使用的两种方式：
   - 传入所有的参数，包括类型参数：`let output = fn<string>("LinDaiDai")`
   - 类型推导，即编译器会根据传入的参数自动地帮助我们确定T的类型：`let output = fn("LinDaiDai")`
3. 与`any`来定义参数类型的区别：在函数中使用`any`接收任意类型的数据且返回`any`类型的数据是不能保持准确性的，例如我传入进来的是`number`返回的可能是`string`；而范型通过添加类型变量`T`，它可以捕获用户传入的类型，之后我们就可以用这个类型了，保证了数据类型的准确性。

**枚举**：

1. 作用：使用枚举我们可以定义一些带名字的常量，可以清晰的表达意图或者创建一组有区别的用例。
2. `TypeScript`支持数字和基于字符串的枚举：
   - 数字：`enum Colors: { Red, Green, Blue }`，默认第一位是从数字`0`开始自增的，也就是说我们获取`Colors.Red`的值是`0`，`Colors.Green`的值是`1`；如果我们改变`Red`，例如设置为`enum Colors: { Red = 1, Green, Blue }`，那么此时`Colors.Red`就是`1`，`Colors.Green`就是`2`了
   - 字符串：每个成员都必须用字符串字面量，或另外一个字符串枚举成员进行初始化。在该枚举中没有自增，例如：`enum Colors: { Red = 'RED', Green = 'GREEN', Blue = 'BLUE' }`
   - 异构枚举：也就是在枚举中混合字符串和数字成员，不过不建议这样做。例如：`enum Colors: { No: 0, Yes = 'YES' }`

