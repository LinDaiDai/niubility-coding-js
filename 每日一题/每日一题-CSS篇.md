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



### 设置了绝对定位的元素相对于谁进行定位？

绝对定位元素相对的元素是它**最近的一个祖先，该祖先满足：position的值必须是：relative、absolute、fixed，若没有这样的祖先则相对于body进行定位**。偏移值由其top、bottom、left、right值确定。

(绝对定位常见误区：我们之前总是听到的答案是绝对定位的盒子是相对于离它最近的一个设置为`relative`的盒子进行定位的，其实这是不对的，应该说是**相对于离它最近的一个已定位的盒子进行定位**；只不过我们实际开发中总是用`relative`配合`absolute`来用，所以就让我们潜意识的认为是前一种答案)



### 绝对定位的元素决定其定位的父级如果设置了padding或者border它是怎样定位的？

如果是块级元素：

- `border`会影响子级的定位
- `padding`不会影响

如下图：

![](https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/css1.png)

这里的代码是：

```html
<style>
  body, html {
    margin: 0;
    height: 100%;
  }
  .super {
    text-align: right;
    position: relative;
    width: 200px;
    height: 200px;
    background-color: red;
    padding: 50px;
    border: 50px solid yellowgreen;
  }
  .sub {
    position: absolute;
    background-color: royalblue;
    width: 100px;
    height: 100px;
    top: 10px;
    left: 10px;
  }
</style>
<body>
  <div class="super">
    我是父级
    <div class="sub">
      我是子级
    </div>
  </div>
</body>
```



### 绝对定位和非绝对定位时元素的宽高百分比是如何计算的？

- 绝对定位的元素其宽高的百分比是相对于父级的`padding-box`计算的
- 非绝对定位的元素则是相对于父级的`content-box`计算

如下两个案例：

*案例一：子级为绝对定位元素：*

```html
<style>
  body, html {
    margin: 0;
    height: 100%;
  }
  .super {
    text-align: right;
    position: relative;
    width: 200px;
    height: 200px;
    background-color: red;
    padding: 50px;
    border: 50px solid yellowgreen;
  }
  .sub {
    position: absolute;
    background-color: royalblue;
    width: 50%;
    height: 50%;
  }
</style>
<body>
  <div class="super">
    我是父级
    <div class="sub">
      我是子级
    </div>
  </div>
</body>
```

效果：子级宽高为：`(父级的width(200) + 父级的左右padding(100)) / 2 = 150px`

<img src="https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/css2.png" style="zoom:50%;" />



*案例二：子级为绝对定位元素*

效果：子级宽高为：`父级的width(200) / 2 = 100px`

<img src="https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/css3.png" style="zoom:50%;" />



### margin: auto为什么能实现垂直居中?

普通的流体元素它的`margin: auto`的填充规则：

- 若一侧是定值，一侧是`auto`，则`auto`为剩余空间的大小
- 若两侧都为`auto`，则会平分剩余空间

若是我们给普通的块状水平元素设置了`position: absolute`之后，且其对立方向属性同时有具体的数值时，例如设置了`top: 0; bottom: 0;`，流体特性就发生了，此时它就会按普通流体元素的`margin: auto`填充规则来进行填充。所以`margin: auto`可以实现垂直居中。



### line-height为什么可以垂直居中？

可以实现垂直居中的原因是CSS的行距上下等分机制，实际上line-height等于height也只是近似垂直居中，文字会向下偏移1px-2px的距离，但并不容易察觉。

![](./resource/css4.png)



### position: fixed什么时候会失效？

我们知道，设置了`position: fixed`固定定位属性的元素会脱离文档流，达到“超然脱俗”的境界。
也就是说此时给这种元素设置`top, left, right, bottom`等属性是根据**浏览器窗口**定位的，与其上级元素的位置无关。

但是有一种情况例外：

若是设置了`position: fixed`属性的元素，它的祖先元素设置了`transform`属性则会导致固定定位属性失效。
只要你的`transform`设置的不是`none`，都会影响到`position: fixed`，因为此时就会相对于祖先元素指定坐标，而不是浏览器窗口。

注意，这个特性表现，目前只在Chrome浏览器/FireFox浏览器下有。IE浏览器，包括IE11, `fixed`还是`fixed`的表现。

(具体可以看我这里的案例：[【问】position: fixed什么时候会失效？](https://github.com/LinDaiDai/niubility-coding-js/blob/master/CSS/position-fixed什么时候会失效.md))



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



### 说说will-change

`will-change`是`CSS3`新增的标准属性，它的作用很单纯，就是`"增强页面渲染性能"`，当我们在通过某些行为触发页面进行大面积绘制的时候，浏览器往往是没有准备，只能被动的使用CUP去计算和重绘，由于事先没有准备，对于一些复杂的渲染可能会出现掉帧、卡顿等情况。而`will-change`则是在真正的行为触发之前告诉浏览器可能要进行重绘了，相当于浏览器把CUP拉上了，能从容的面对接下来的变形。

常用的语法主要有：

- `whil-change: scroll-position;` 即将开始滚动
- `will-change: contents;` 内容要动画或者变化了
- `will-transform;` transform相关的属性要变化了(常用)

注意：

- `will-change`虽然可以开启加速，但是一定要适度使用
- 开启加速的代价为手机的耗电量会增加
- 使用时遵循最小化影响原则，可以对伪元素开启加速，独立渲染
- 可以写在伪类中，例如`hover`中，这样移出元素的时候就会自动`remove`掉`will-change`了
- 如果使用`JS`添加了`will-change`，注意要及时`remove`掉，方式就是`style.willChange = 'auto'`



### z-index和background的覆盖关系

![](https://user-gold-cdn.xitu.io/2019/8/30/16ce245b90085292?imageView2/0/w/1280/h/960/format/)



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

