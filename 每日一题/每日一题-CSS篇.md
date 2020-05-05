## 每日一题-CSS篇

### CSS选择器优先级

- !import
- 内联 1000
- ID 100
- 类选择器/伪类选择器/属性选择器 10
- 元素选择器/关系选择器/伪元素选择器 1
- 通配符 *
- 继承
- 原始



### 盒模型及如何转换

`box-sizing: content-box`（W3C盒模型，又名标准盒模型）：元素的宽高大小表现为内容的大小。

`box-sizing: border-box`（IE盒模型，又名怪异盒模型）：元素的宽高表现为内容 + 内边距 + 边框的大小。背景会延伸到边框的外沿。




### CSS3新特性

- transition：过渡
- transform: 旋转、缩放、移动或倾斜
- animation: 动画
- gradient: 渐变
- box-shadow: 阴影
- border-radius: 圆角
- word-break: normal|break-all|keep-all; 文字换行(默认规则|单词也可以换行|只在半角空格或连字符换行)
- text-overflow: 文字超出部分处理
- text-shadow: 水平阴影，垂直阴影，模糊的距离，以及阴影的颜色。
- box-sizing: content-box|border-box 盒模型
- 媒体查询 `@media screen and (max-width: 960px) {}`还有打印`print`



### 文字单超出显示省略号

```css
div {
	width: 200px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
```



### 文字多行超出显示省略号

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



### 页面变灰

```css
body {
	filter: grayscale(100%); /* 百分比或者 0~1 */
}
```



### CSS中可继承的属性

可继承的只有：颜色、文字、字体间距、行高对齐方式，列表样式。

所有元素可继承：visibility和cursor。

内联元素可继承：letter-spacing、word-spacing、white-space、line-height、color、font、font-family、font-size、font-style、font-variant、font-weight、text-decoration、text-transform、direction。 

块状：text-indent和text-align。

列表元素可继承：list-style、list-style-type、list-style-position、list-style-image。



### 如何画扇形？

```css
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



### 如何画三角形？

```css
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



### 圆？半圆？椭圆？

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



### 用纯 CSS 判断鼠标进入的方向

题目来源：[《陈大鱼头-面试官：你可以用纯 CSS 判断鼠标进入的方向吗？》](https://juejin.im/post/5ea8f15ee51d454dc55c8e5b)

效果：[codepen](https://codepen.io/krischan77/pen/RzomRX)



### 什么是BFC

BFC全称 Block Formatting Context 即`块级格式上下文`，简单的说，BFC是页面上的一个隔离的独立容器，不受外界干扰或干扰外界

### 如何触发BFC

- `float`不为 none
- `overflow`的值不为 visible
- `position` 为 absolute 或 fixed
- `display`的值为 inline-block 或 table-cell 或 table-caption 或 grid

### BFC的渲染规则是什么

- BFC是页面上的一个隔离的独立容器，不受外界干扰或干扰外界
- 计算BFC的高度时，浮动子元素也参与计算（即内部有浮动元素时也不会发生高度塌陷）
- BFC的区域不会与float的元素区域重叠
- BFC内部的元素会在垂直方向上放置
- BFC内部两个相邻元素的margin会发生重叠

### BFC的应用场景

- **清除浮动**：BFC内部的浮动元素会参与高度计算，因此可用于清除浮动，防止高度塌陷
- **避免某元素被浮动元素覆盖**：BFC的区域不会与浮动元素的区域重叠
- **阻止外边距重叠**：属于同一个BFC的两个相邻Box的margin会发生折叠，不同BFC不会发生折叠

可以参考这里：

作者：写代码像蔡徐抻
链接：https://juejin.im/post/5e8b261ae51d4546c0382ab4



### 说一下回流和重绘

**回流**：

触发条件：

当我们对 DOM 结构的修改引发 DOM 几何尺寸变化的时候，会发生`回流`的过程。

例如以下操作会触发回流：

1. 一个 DOM 元素的几何属性变化，常见的几何属性有`width`、`height`、`padding`、`margin`、`left`、`top`、`border` 等等, 这个很好理解。

2. 使 DOM 节点发生`增减`或者`移动`。

3. 读写 `offset`族、`scroll`族和`client`族属性的时候，浏览器为了获取这些值，需要进行回流操作。

4. 调用 `window.getComputedStyle` 方法。

回流过程：由于DOM的结构发生了改变，所以需要从生成DOM这一步开始，重新经过`样式计算`、`生成布局树`、`建立图层树`、再到`生成绘制列表`以及之后的显示器显示这整一个渲染过程走一遍，开销是非常大的。

**重绘**：

触发条件：

当 DOM 的修改导致了样式的变化，并且没有影响几何属性的时候，会导致`重绘`(`repaint`)。

重绘过程：由于没有导致 DOM 几何属性的变化，因此元素的位置信息不需要更新，所以当发生重绘的时候，会跳过`生存布局树`和`建立图层树`的阶段，直接到`生成绘制列表`，然后继续进行分块、生成位图等后面一系列操作。

**如何避免触发回流和重绘**：

1. 避免频繁使用 style，而是采用修改`class`的方式。
2. 将动画效果应用到`position`属性为`absolute`或`fixed`的元素上。
3. 也可以先为元素设置`display: none`，操作结束后再把它显示出来。因为在`display`属性为`none`的元素上进行的DOM操作不会引发回流和重绘
4. 使用`createDocumentFragment`进行批量的 DOM 操作。
5. 对于 resize、scroll 等进行防抖/节流处理。
6. 避免频繁读取会引发回流/重绘的属性，如果确实需要多次使用，就用一个变量缓存起来。
7. 利用 CSS3 的`transform`、`opacity`、`filter`这些属性可以实现合成的效果，也就是`CPU`加速。

参考来源：https://juejin.im/post/5df5bcea6fb9a016091def69#heading-57



### GPU加速的原因

在合成的情况下，会直接跳过布局和绘制流程，直接进入`非主线程`处理的部分，即直接交给`合成线程`处理。交给它处理有两大好处:

1. 能够充分发挥`GPU`的优势。合成线程生成位图的过程中会调用线程池，并在其中使用`GPU`进行加速生成，而GPU 是擅长处理位图数据的。
2. 没有占用主线程的资源，即使主线程卡住了，效果依然能够流畅地展示。

参考来源：https://juejin.im/post/5df5bcea6fb9a016091def69#heading-57



### 移动端中css你是使用什么单位

**比较常用的**：

- `em`：定义字体大小时以父级的字体大小为基准；定义长度单位时以当前字体大小为基准。例父级`font-size: 14px`，则子级`font-size: 1em;`为`font-size: 14px;`；若定义长度时，子级的字体大小如果为`14px`，则子级`width: 2em;`为`width: 24px`。
- `rem`：以根元素的字体大小为基准。例如`html`的`font-size: 14px`，则子级`1rem = 14px`。
- `%`：以父级的宽度为基准。例父级`width: 200px`，则子级`width: 50%;height:50%;`为`width: 100px;height: 100px;`
- `vw和vh`：基于视口的宽度和高度(视口不包括浏览器的地址栏工具栏和状态栏)。例如视口宽度为`1000px`，则`60vw = 600px;`
- `vmin和vmax`：`vmin`为当前`vw` 和`vh`中较小的一个值；`vmax`为较大的一个值。例如视口宽度`375px`，视口高度`812px`，则`100vmin = 375px;`，`100vmax = 812px;`

**不常用的：**

- `ex和ch`：`ex`以字符`"x"`的高度为基准；例如`1ex`表示和字符`"x"`一样长。`ch`以数字`"0"`的宽度为基准；例如`2ch`表示和2个数字`"0"`一样长。

**移动端布局总结**：

1. 移动端布局的方式主要使用rem和flex，可以结合各自的优点，比如flex布局很灵活，但是字体的大小不好控制，我们可以使用rem和媒体查询控制字体的大小，媒体查询视口的大小，然后不同的上视口大小下设置设置html的font-size。
2. 可单独制作移动端页面也可响应式pc端移动端共用一个页面。没有好坏，视情况而定，因势利导

（总结来源：玲珑）

### rem和em的区别

**em:**

定义字体大小时以父级的字体大小为基准；定义长度单位时以当前字体大小为基准。例父级`font-size: 14px`，则子级`font-size: 1em;`为`font-size: 14px;`；若定义长度时，子级的字体大小如果为`14px`，则子级`width: 2em;`为`width: 24px`。

**rem:**

以根元素的字体大小为基准。例如`html`的`font-size: 14px`，则子级`1rem = 14px`。



### 在移动端中怎样初始化根元素的字体大小

一个简易版的初始化根元素字体大小。

页面开头处引入下面这段代码，用于动态计算`font-size`：

(假设你需要的`1rem = 20px`)

```javascript
(function () {
  var html = document.documentElement;
  function onWindowResize() {
    html.style.fontSize = html.getBoundingClientRect().width / 20 + 'px';
  }
  window.addEventListener('resize', onWindowResize);
  onWindowResize();
})();
```

- `document.documentElement`：获取`document`的根元素
- `html.getBoundingClientRect().width`：获取`html`的宽度(窗口的宽度)
- 监听`window`的`resize`事件

一般还需要配合一个`meta`头：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-sacle=1.0, maximum-scale=1.0, user-scalable=no" />
```



### 移动端中不同手机html默认的字体大小都是一样的吗

如果没有人为取改变根元素字体大小的话，默认是`1rem = 16px`；根元素默认的字体大小是`16px`。