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

### typeof为什么对null错误的显示

这只是 JS 存在的一个悠久 Bug。在 JS 的最初版本中使用的是 32 位系统，为了性能考虑使用低位存储变量的类型信息，000 开头代表是对象然而 null 表示为全零，所以将它错误的判断为 object 。

### 详细说下instanceof



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



## 编程题



### 实现sum(1,2,3)==sum(1)(2)(3)

```javascript
function sum(...args){
  function currySum(...rest){
    args.push(...rest)
    return currySum
  }
  currySum.toString= function(){ 
    return args.reduce((result,cur)=>{
      return result + cur
    })
  }
  currySum.toNumber= function(){ 
    return args.reduce((result,cur)=>{
      return result + cur
    })
  }
  return currySum
}
```



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

polypill实现：

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

还是比较简单的，而`padEnd`的实现和它一样，只需要把第二层`for`循环里的`${padString}${orignStr}`换下位置就可以了。



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

1. 识别入口文件
2. 通过逐层识别模块依赖(Commonjs、amd或者es6的import，webpack都会对其进行分析，来获取代码的依赖)
3. webpack做的就是分析代码，转换代码，编译代码，输出代码
4. 最终形成打包后的代码



### webpack打包优化

https://juejin.im/post/5ea528496fb9a03c576cceac#heading-2

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



