## DD每周七题-第二期

## 系列介绍

你盼世界，我盼望你无`bug`。Hello 大家好！我是霖呆呆！

呆呆每周都会分享七道前端题给大家，系列名称就是「DD每周七题」。

系列的形式主要是：`3道JavaScript` + `2道HTML` + `2道CSS`，帮助我们大家一起巩固前端基础。

所有题目也都会整合至 [LinDaiDai/niubility-coding-js](https://github.com/LinDaiDai/niubility-coding-js/issues) 的`issues`中，欢迎大家提供更好的解题思路，谢谢大家😁。

一起来看看本周的七道题吧。



## 正题

### 一、设计一个方法提取对象中所有value大于2的键值对并返回最新的对象

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
[https://github.com/LinDaiDai/niubility-coding-js/issues/8](https://github.com/LinDaiDai/niubility-coding-js/issues/8)


### 二、实现一个padStart()或padEnd()的polyfill

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

`polyfill`实现：

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

[https://github.com/LinDaiDai/niubility-coding-js/issues/9](https://github.com/LinDaiDai/niubility-coding-js/issues/9)

### 三、用正则写一个根据name获取cookie中的值的方法

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

[https://github.com/LinDaiDai/niubility-coding-js/issues/10](https://github.com/LinDaiDai/niubility-coding-js/issues/10)

### 四、实现一个拖拽(兼容写法)

**考察知识点**

1. `event`的兼容性

- 其它浏览器`window.event`
- 火狐下没有`window.event`，所以用传入的参数`ev`代替
- 最终写法：`var oEvent = ev || window.event`

2. 实现拖拽的事件有哪些(`box`为需要拖拽的元素)

- `box.onmousedown`
- `document.onmousemove`
- `document.onmouseup`

3. 实现的事件顺序

- 首先监听`box.onmousedown`，即鼠标按下`box`时触发的事件，记录下鼠标按下时距离屏幕上边和左边的距离，以及`box`距离屏幕上边和左边的距离，再用前者减去后者得到差值`distanceX`和`distanceY`
- 然后在此事件中监听`document.onmousemove`事件，记录下每次鼠标移动时距离屏幕上边和左边的距离，然后用它们减去`distanceX`和`distanceY`，再将其赋值给`box`的`left`和`top`，使其能跟着鼠标移动
- 不过需要考虑`box`距离屏幕最上面/下面/左边/右边的边界情况
- 当`document.onmouseup`的时候需要将`document.onmousemove`事件设置为`null`

如图所示：

![](https://user-gold-cdn.xitu.io/2020/6/3/17278a0e0b72ea99?w=1350&h=834&f=jpeg&s=38186)

**Coding**

*css*

```html
<style>
  html, body {
    margin: 0;
    height: 100%;
  }
  #box {
    width: 100px;
    height: 100px;
    background-color: red;
    position: absolute;
    top: 100px;
    left: 100px;
  }
</style>
```

*html*

```html
<div id="box"></div>
```

*javascript*

```javascript
window.onload = function () {
  var box = document.getElementById('box');
  box.onmousedown = function (ev) {
    var oEvent = ev || window.event; // 兼容火狐,火狐下没有window.event
    var distanceX = oEvent.clientX - box.offsetLeft; // 鼠标到可视区左边的距离 - box到页面左边的距离
    var distanceY = oEvent.clientY - box.offsetTop;
    document.onmousemove = function (ev) {
      var oEvent = ev || window.event;
      var left = oEvent.clientX - distanceX;
      var top = oEvent.clientY - distanceY;
      if (left <= 0) {
        left = 0;
      } else if (left >= document.documentElement.clientWidth - box.offsetWidth) {
        left = document.documentElement.clientWidth - box.offsetWidth;
      }
      if (top <= 0) {
        top = 0;
      } else if (top >= document.documentElement.clientHeight - box.offsetHeight) {
        top = document.documentElement.clientHeight - box.offsetHeight;
      }
      box.style.left = left + 'px';
      box.style.top = top + 'px';
    }
    document.onmouseup = function () {
      document.onmousemove = null;
      box.onmouseup = null;
    }
  }
}
```

(感谢[Turbo328](https://github.com/Turbo328)指出使用`document.onmouseup`效果会比`box.onmouseup`好一些)

[https://github.com/LinDaiDai/niubility-coding-js/issues/11](https://github.com/LinDaiDai/niubility-coding-js/issues/11)

### 五、如何阻止冒泡和默认事件(兼容写法)

阻止冒泡：

```javascript
function stopBubble (e) { // 阻止冒泡
  if (e && e.stopPropagation) {
    e.stopPropagation();
  } else {
    // 兼容 IE
    window.event.cancelBubble = true;
  }
}
function stopDefault (e) { // 阻止默认事件
  if (e && e.preventDefault) {
    e.preventDefault();
  } else {
    // 兼容 IE
    window.event.returnValue = false;
    return false;
  }
}
```

[https://github.com/LinDaiDai/niubility-coding-js/issues/12](https://github.com/LinDaiDai/niubility-coding-js/issues/12)

### 六、如何画扇形？三角形？

```css
/*扇形*/
.sector {
  width: 0;
  height: 0;
  border: 100px solid red;
  border-color: red transparent transparent transparent;
  border-radius: 50%;
}
/*或者*/
.sector {
  width: 100px;
  height: 100px;
  border: 100px solid transparent;
  border-top-color: red;
  box-sizing: border-box; /* 这步很重要 */
  border-radius: 50%;
}
```

```css
/*三角形*/
.triangle {
  width: 0;
  height: 0;
  border: 100px solid red;
  border-color: red transparent transparent transparent;
}
/*或者*/
.triangle {
  width: 100px;
  height: 100px;
  border: 100px solid transparent;
  border-top-color: red;
  box-sizing: border-box;
}
```

[https://github.com/LinDaiDai/niubility-coding-js/issues/13](https://github.com/LinDaiDai/niubility-coding-js/issues/13)

### 七、圆？半圆？椭圆？

```css
div {
  width: 100px;
  height: 100px;
  background-color: red;
  margin-top: 20px;
}
.box1 { /* 圆 */
  /* border-radius: 50%; */
  border-radius: 50px;
}
.box2 { /* 半圆 */
  height: 50px;
  border-radius: 50px 50px 0 0;
}
.box3 { /* 椭圆 */
  height: 50px;
  border-radius: 50px/25px; /* x轴/y轴 */
}
```

[https://github.com/LinDaiDai/niubility-coding-js/issues/14](https://github.com/LinDaiDai/niubility-coding-js/issues/14)

## 后语

你盼世界，我盼望你无`bug`。这篇文章就介绍到这里。

您每周也许会花`48`小时的时间在工作💻上，会花`49`小时的时间在睡觉😴上，也许还可以再花`20`分钟的时间在呆呆的7道题上，日积月累，我相信我们都能见证彼此的成长😊。

什么？你问我为什么系列的名字叫`DD`？因为`呆呆`呀，哈哈😄。

喜欢**霖呆呆**的小伙还希望可以关注霖呆呆的公众号 `LinDaiDai` 或者扫一扫下面的二维码👇👇👇。

![](https://user-gold-cdn.xitu.io/2020/5/27/17254d5d0a277620?w=900&h=500&f=gif&s=1632550)

我会不定时的更新一些前端方面的知识内容以及自己的原创文章🎉

你的鼓励就是我持续创作的主要动力 😊。