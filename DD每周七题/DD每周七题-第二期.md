## DD每周七题-第一期

## 系列介绍

你盼世界，我盼望你无`bug`。Hello 大家好！我是霖呆呆！

呆呆每周都会分享七道前端题给大家，系列名称就是「DD每周七题」。

系列的形式主要是：`3道JavaScript` + `2道HTML` + `2道CSS`，帮助我们大家一起巩固前端基础。

所有题目也都会整合至 [LinDaiDai/niubility-coding-js](https://github.com/LinDaiDai/niubility-coding-js/issues) 的`issues`中，欢迎大家提供更好的解题思路，谢谢大家😁。



## 正题

### 一、实现sum(1,2,3)==sum(1)(2)(3)

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

还是比较简单的，而`padEnd`的实现和它一样，只需要把第二层`for`循环里的`${padString}${orignStr}`换下位置就可以了。



### 三、设计一个方法提取对象中所有value大于2的键值对并返回最新的对象

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

