## DD每周前端七题详解-第六期

## 系列介绍

你盼世界，我盼望你无`bug`。Hello 大家好！我是霖呆呆！

呆呆每周都会分享七道前端题给大家，系列名称就是「DD每周七题」。

系列的形式主要是：`3道JavaScript` + `2道HTML` + `2道CSS`，帮助我们大家一起巩固前端基础。

所有题目也都会整合至 [LinDaiDai/niubility-coding-js](https://github.com/LinDaiDai/niubility-coding-js/issues) 的`issues`中，欢迎大家提供更好的解题思路，谢谢大家😁。

一起来看看本周的七道题吧。



## 正题

### 一、[,,,]的长度

(题目来源：https://github.com/CavsZhouyou/Front-End-Interview-Notebook)

咋了小伙伴们，感觉这道题目很简单是吗？哈哈，数一数逗号的间隙好像就能得出答案了，比如这样：


![](https://user-gold-cdn.xitu.io/2020/7/1/1730798e63d1c4a0?w=418&h=190&f=jpeg&s=13565)

但是这道题的答案并不是`4`哟，而是`3`。

```javascript
console.log([,,,].length) // 3
```

所以最终我们是需要把它想象成这样的：


![](https://user-gold-cdn.xitu.io/2020/7/1/1730798fd6d98341?w=354&h=176&f=jpeg&s=11732)

也就是最后一个逗号的后面是不算一项的。

这里其实涉及到了一个名为：`尾后逗号`的概念，或者说是叫做`终止逗号`。上面👆这道题好像看不出它有什么作用，让我来看看实际上为什么会有这个用法。

比如现在你的项目中这么一个文件：

*config.js*:

```javascript
const types = [
  {
    name: '帅'
  },
  {
    name: '阳光'
  },
]
export { types };
```

大家可以看到，我在`阳光`这一项的的后面是多加了一个`","`的，此时我将这个代码提交到`git`上并标记为`版本1`。

如果这时候`types`中又要添加一项名为`"可爱"`的配置项，我只需要在它下面再加上就行了，不需要去改动到原来代码，此时你提交的代码的`diff`是长这样的：

```diff
const types = [
  {
    name: '帅'
  },
  {
    name: '阳光'
  },
+ {
+   name: '可爱'
+ },
]
export { types };
```

大家可以看到，只有简单的三行增量代码，如果你没有使用`尾后逗号`的话，你提交的代码的`diff`会是这样：

```diff
const types = [
  {
    name: '帅'
  },
  {
    name: '阳光'
- }
+ },
+ {
+   name: '可爱'
+ }
]
export { types };
```

因此我们可以得出`尾后逗号`它的作用：

**使得版本控制更加清晰，以及代码维护麻烦更少。**

(当然，这种用法在`.json`后缀的文件中是不能用的哈，因为`JSON`它严格遵循它自己的语法要求)

所以回归到这道题中来，像这种使用了多于一个尾后逗号的数组，我们就称之为`稀疏数组`，稀疏数组它的长度是等于逗号的数量的。

因此：

```javascript
console.log([,,,].length) // 3
```

[https://github.com/LinDaiDai/niubility-coding-js/issues/37](https://github.com/LinDaiDai/niubility-coding-js/issues/37)



### 二、如何判断当前脚本运行在浏览器还是 node 环境中？

这道题呆呆其实在很多地方都看到了，但是有的回答好像并不那么靠谱。

回答这道题首先我们需要知道一个概念：

浏览器环境：全局对象为`window`；而在`node`环境下，是有一个名为`global`的对象，它的`内部Class属性`是为`"global"`。

`内部Class属性`也就是我们通过`Object.prototype.call(obj)`这种方式来获取到的内容，比如：

```javascript
console.log(Object.prototype.toString.call([1, 2, 3])); // "[object Array]"
```

(关于它的用法呆呆在[《【精】从206个console.log()完全弄懂数据类型转换的前世今生(上)》](https://juejin.im/post/5e7f8314e51d4546fa4511c9#heading-37)中的`toString`用法时说的也很详细咯)

因此我们可以得出这种判断方式：

```javascript
var isBrowser = typeof window !== 'undefined'
    && ({}).toString.call(window) === '[object Window]';

var isNode = typeof global !== "undefined"
    && ({}).toString.call(global) == '[object global]';
```

`({}).toString.call()`和`Object.prototype.toString.call()`用法一致，只不过在`{}`的外面最好加上一个`()`，也是为了预防`JS`将大括号`{}`认为是一个空的代码块(额，呆呆试了一下貌似也没有这方面的问题)。

[https://github.com/LinDaiDai/niubility-coding-js/issues/38](https://github.com/LinDaiDai/niubility-coding-js/issues/38)



### 三、reduce方法有初始值和没有初始值的区别？

`reduce`函数的第一个参数是一个回调函数，第二个参数为可选的初始值。

如果有初始值的话，回调函数就会从数组的第0项开始执行，也就是会执行`arr.length`次；

但是如果没有初始值的话，会默认取数组的第0项为初始值，回调函数会从数组的第1项开始执行，也就是会执行`arr.length - 1`次。

这点从我们手写一个`reduce`的实现就可以看出来，代码如下：

```javascript
Array.prototype.MyReduce = function (fn, initialValue) {
  var arr = Array.prototype.slice.call(this);
  var pre, startIndex;
  pre = initialValue ? initialValue : arr[0];
  startIndex = initialValue ? 0 : 1;
  for (var i = startIndex; i < arr.length; i++) {
    pre = fn.call(null, pre, arr[i], i, this)
  }
  return pre
}
```

过程分析：

- 首先，`map、reduce`这种方法都是数组原型对象上的方法，所以我将`MyReduce`定义在`Array.prototype` 上，这样你就可以直接使用`ary.MyReduce()`这样的方式调用它了(`ary是一个类似于这样的数组[1, 2, 3]`)。
- 对于参数，我们参考原生`reduce`，它接收的第一个参数是一个回调函数，第二个是初始值
- 而`var arr = ...`的作用是获取调用`MyReduce`函数的那个变量，也就是说`this`会指向那个变量，例如`ary.MyReduce()`，那么此时`this`就为`ary`。
- 至于为什么不使用`var arr = this;`的方式而是使用`Array.prototype.slice.call(this)`，算是实现一个浅拷贝吧，因为`reduce`是不会改变原数组的。
- 然后就是定义传入`reduce`中的回调函数的第一个参数`pre`，也就是上一次运行结果的返回值，可以看到这里就用到了初始值`initialValue`，如果存在初始值就取初始值，不存在则默认取数组第`0`项。(当然这里直接用`initialValue ?`来判断存不存在并不准确，因为我们知道`0`也会被判断为`false`)
- 接着是定义循环开始的下标`startIndex`，若是不存在初始值，则初始值是会取数组中的第`0`项的，相当于第`0`项并不需要运行，所以`startIndex`会是`1`，而如果有初始值的话则需要将数组的每一项都经过`fn`运行一下。
- 最后，`for`循环中使用`fn.call()`来调用`fn`函数，并且最后一个参数是要把原来的数组传递到回调函数中，也就是这里的`this`。

[https://github.com/LinDaiDai/niubility-coding-js/issues/39](https://github.com/LinDaiDai/niubility-coding-js/issues/39)



### 四、form表单中的label标签的作用？

`label`标签不会向用户呈现任何特殊效果，它的作用是为鼠标用户改进了可用性。

也就是说当你使用了一个`label`标签和一个`input`绑定起来之后，点击`label`标签上的文字就会自动聚焦到`input`上。

如下：

![](https://user-gold-cdn.xitu.io/2020/7/1/1730799af19ae00f?w=640&h=400&f=gif&s=144903)

绑定的方式：

- `label`标签上设置`for`属性
- `input`标签上设置和`for`属性一样的`id`

例如：

```html
<label for="username">username:</label>
<input type="text" name="username" id="username"/>
```

这里有两点需要注意的：

- 这两个标签不一定非要在`form`标签内才会生效
- `for`是和`id`对应的，并不是和`name`

[https://github.com/LinDaiDai/niubility-coding-js/issues/40](https://github.com/LinDaiDai/niubility-coding-js/issues/40)



### 五、HTML5中的自动完成功能autocomplete是做什么的？

大家在听到自动完成这个词，会有一点迷糊，自动完成什么？

其实这个功能的作用是这样的：

首先，`autocomplete`是一个属性，这个属性可以设置在`form`标签上，也可以设置在其它的`input`标签上。

被设置了自动完成的标签，会允许浏览器预测对字段的输入。也就是说浏览器会根据你在这个输入框中已经输入过的值，留有一个`"历史记录"`，方便我们下次还想要输入同样的值。

例如下面这段代码：

```html
<form autocomplete="on">
  testaccount: <input type="text" name="testaccount" /><br />
  testpassword: <input type="text" name="testpassword" autocomplete="off" /><br />
  <input type="submit" />
</form>
```

- 我把`form`标签的`autocomplete`打开，那么这个表单下的所有元素都开启了`autocomplete`
- 接着我把`testpassword`这一项的`autocomplete`关闭。

此时`testaccout`是有自动完成功能的，而`testpassword`没有。那么当我们第一次在这两个输入框中输入了内容并提交后。再次点击`testaccout`输入框，就会出现我们上一次输入并提交的那个值，而点击`testpassword`时却没有。

效果如下：


![](https://user-gold-cdn.xitu.io/2020/7/1/1730799e8fce0ba9?w=640&h=400&f=gif&s=256554)

所以我们来做下总结吧😊：

- `autocomplete`属性规定输入字段是否应该启用自动完成功能；
- 它的默认值是启用，也就是`"on"`，另一个值是`"off"`关闭；
- 作用是：允许浏览器预测对字段的输入。当用户在字段开始键入时，浏览器基于之前键入过的值，应该显示出在字段中填写的选项。
- `autocomplete` 属性适用于` <form>`，以及下面的 `<input>` 类型：`text, search, url, telephone, email, password, datepickers, range , color`。

[https://github.com/LinDaiDai/niubility-coding-js/issues/41](https://github.com/LinDaiDai/niubility-coding-js/issues/41)





### 六、CSS中的visibility有个collapse属性值是干嘛用的？

`visibility`会有这么几个个属性值：

- `visible`
- `hidden`
- `collapse`
- `inherit`

比较常用的可能是前面两个，用于控制元素的显示隐藏。且我们知道，设置为`hidden`是会隐藏元素，但是其他元素的布局不改变，相当于此元素变成透明。

`inherit`则是从父元素继承`visibility`属性的值。

而对于`collapse`，可能用的不是特别多，我们先来看下它的介绍：

- 对于一般的元素，它的表现跟`hidden`是一样的；
- 如果这个元素是`table`相关的元素，例如`table行，table group，table列，table column group`，它的表现却跟`display: none`一样，也就是说，它们占用的空间也会释放。

下面一起来看看这个案例😊：

*html代码*：

```html
<table>
  <tr class="tr1">
    <td>
      tr1
    </td>
    <td>
      tr1
    </td>
  </tr>
  <tr>
    <td>
      tr2
    </td>
    <td>
      tr2
    </td>
  </tr>
</table>
```

*css代码*：

```css
table {
  border: 1px solid red;
}
td {
  border: 1px solid blue;
}
.tr1 {

}
```

我在没给`.tr1`设置任何属性的时候，页面呈现的效果是这样的，很正常：


![](https://user-gold-cdn.xitu.io/2020/7/1/173079a18d110c4f?w=170&h=168&f=jpeg&s=12142)

如果设置了`visibility: hidden`：

```css
.tr1 {
  visibility: hidden;
}
```

效果如下：


![](https://user-gold-cdn.xitu.io/2020/7/1/173079a378ca7757?w=182&h=170&f=jpeg&s=10504)

虽然第一行被隐藏了，但是它的空间还是在的，就像是`"隐身"`了一样。

而如果设置了`visibility: collapse`：

```css
.tr1 {
  visibility: collapse;
}
```

效果如下：


![](https://user-gold-cdn.xitu.io/2020/7/1/173079a5146677dd?w=184&h=130&f=jpeg&s=10436)

最终的效果会和`display: none;`一样。

如果你问呆呆这属性有什么实际的用处没有...咳咳，抱歉，好像还真没有😅。也可能是呆呆不知道，知道的小伙伴还请提出哟，一起学习一哈。

[https://github.com/LinDaiDai/niubility-coding-js/issues/42](https://github.com/LinDaiDai/niubility-coding-js/issues/42)



### 七、块状元素width:100%与width:auto的区别?

这两个属性值相信大家都不陌生了，先让我们来看个案例理解一下：

*html代码*：

```html
<div class="super">
  <div class="sub1">
    我是呆呆的第一个崽
  </div>
  <div class="sub2">
    我是呆呆的第二个崽
  </div>
  <div class="sub3">
    我是呆呆的第三个崽
  </div>
</div>
```

*css代码*:

```css
.super {
  width: 200px;
  height: 100px;
  background: skyblue;
}
.sub1 {
  background: #d0e4a9;
}
.sub2 {
  width: 100%;
  background: #c077af;
}
.sub3 {
  width: auto;
  background: #f8d29d;
}
```

最开始时，三个崽表现的效果是一样的，并无很大差别：


![](https://user-gold-cdn.xitu.io/2020/7/1/173079a6c53ddb11?w=436&h=226&f=jpeg&s=31976)

此时如果我们对后面两个崽做一下改动：

```css
.sub2 {
  width: 100%;
  padding-left: 10px;
  margin-left: 10px;
  background: #c077af;
}
.sub3 {
  width: auto;
  padding-left: 10px;
  margin-left: 10px;
  background: #f8d29d;
}
```

给他们都加上左内边距和左外边距，此时的效果就变成了这样：


![](https://user-gold-cdn.xitu.io/2020/7/1/173079a8aec90afc?w=486&h=264&f=jpeg&s=33008)

大家会发现，设置了`width: 100%`的崽，它的宽度会和父级的一样，此时如果再给他设置了额外的`padding`，那它就会比父级还要宽了，也就是会超出父级容器。而因为还设置了`margin-left`，所以左边也会有一段距离。

但是设置了`width: auto`的崽就比较乖了，无论怎样它都不会超出父级，而是选择压缩自己的宽度。

因此我们可以得出结论：

- 两者的计算方式不同(这里的计算规则都是基于`box-sizing: content-box;`的情况)：
  - 对于`width: auto;`它的总宽度是等于父宽度的(这里的父宽度是指父级内容的宽度不包括`padding、border、margin`)，即使给元素设置了`padding、border、margin`等属性，它也会自动分配水平空间。
  - 对于`width: 100%;`它表示的是元素内容的宽度等于父宽度，所以它的总宽度是有可能超过父级的，因为如果设置了额外的`padding、border`，就可能比父级宽了。
- 无论是`width:100%`还是`auto`，其计算的参照都是父级内容区`width`值，而非总宽度值，也就是不包括`padding、border、margin`。
- 一般`width:auto`使用的多一些，因为这样灵活；而`width:100%`使用比较少，因为在增加`padding`或者`margin`的时候，容易使其突破父级框，破坏布局。

[https://github.com/LinDaiDai/niubility-coding-js/issues/43](https://github.com/LinDaiDai/niubility-coding-js/issues/43)



## 参考文章

知识无价，支持原创。

参考文章：

- [《CSS里的visibility属性有个鲜为人知的属性值：collapse》](https://www.webhek.com/post/visibility-collapse.html)
- [《width:auto和width:100%的区别》](https://blog.csdn.net/whaxrl/article/details/47166365)



## 后语

你盼世界，我盼望你无`bug`。这篇文章就介绍到这里。

您每周也许会花`48`小时的时间在工作💻上，会花`49`小时的时间在睡觉😴上，也许还可以再花`20`分钟的时间在呆呆的7道题上，日积月累，我相信我们都能见证彼此的成长😊。

什么？你问我为什么系列的名字叫`DD`？因为`呆呆`呀，哈哈😄。

喜欢**霖呆呆**的小伙还希望可以关注霖呆呆的公众号 `LinDaiDai` 或者扫一扫下面的二维码👇👇👇。

![img](https://user-gold-cdn.xitu.io/2020/6/24/172e396f92646b65?w=900&h=500&f=gif&s=411532)

我会不定时的更新一些前端方面的知识内容以及自己的原创文章🎉

你的鼓励就是我持续创作的主要动力 😊。

往期题目可以戳下面👇：

- [DD每周前端七题详解-第一期](https://juejin.im/post/5ece0955e51d45784960ae58)
- [DD每周前端七题详解-第二期](https://juejin.im/post/5ed732dfe51d457879333878)
- [DD每周前端七题详解-第三期](https://juejin.im/post/5edd051051882543306824a3)
- [DD每周前端七题详解-第四期](https://juejin.im/post/5ee9c2ddf265da02ce217831)
- [DD每周前端七题详解-第五期](https://juejin.im/post/5ef29383e51d4573ff271f48)

或者你也可以查看`github上的issues`：[「我是issues」](https://github.com/LinDaiDai/niubility-coding-js/issues)


