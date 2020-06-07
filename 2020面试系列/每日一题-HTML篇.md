## 每日一题-HTML篇

### H5新增的特性

标签：新增语义化标签（`aside / figure / section / header / footer / nav`等），增加多媒体标签`video`和`audio`，使得样式和结构更加分离

属性：增强表单，主要是增强了`input`的type属性(`number/color/range`)；`meta`增加charset以设置字符集；`script`增加async以异步加载脚本

存储：增加`localStorage`、`sessionStorage`和`indexedDB`，引入了`application cache`对web和应用进行缓存

API：增加`拖放API`、`地理定位`、`SVG绘图`、`canvas绘图`、`Web Worker`、`WebSocket`



### DIV+CSS布局的好处

1. 代码精简，且结构与样式分离，易于维护
2. 代码量减少了，减少了大量的带宽，页面加载的也更快，提升了用户的体验
3. 对SEO搜索引擎更加友好，且H5又新增了许多语义化标签更是如此
4. 允许更多炫酷的页面效果，丰富了页面
5. **符合W3C标准**，保证网站不会因为网络应用的升级而被淘汰(也算是重点)

缺点:
不同浏览器对web标准默认值不同，所以更容易出现对浏览器的兼容性问题。



### DOM和BOM的区别

DOM：文档对象模型，描述了处理网页内容的方法和接口。最根本对象是document（window.document）。

由于DOM的操作对象是文档，所以DOM和浏览器没有直接关系。

它表示部署在服务器上的文件夹、右键查看源代码等。

BOM：浏览器对象模型，描述了与浏览器进行交互的方法和接口。由navigator、history、screen、location、window五个对象组成的，最根本对象是 window (前面四个都是window下的属性,也就是说`window.history===history`)。用来获取或设置浏览器的属性、行为，例如：新建窗口、获取屏幕分辨率、浏览器版本号等；另一方面作为一个全局对象，有权访问`isNaN()、parseInt()`等方法。

DOM是W3C的标准，BOM没有相关标准。



### docoment,window,html,body的层级关系

**层级关系**：

```javascript
window > document > html > body
```

- `window`是`BOM`的核心对象，它一方面用来获取或设置浏览器的属性和行为，另一方面作为一个全局对象。
- `document`对象是一个跟文档相关的对象，拥有一些操作文档内容的功能。但是地位没有`window`高。
- `html`元素对象和`document`元素对象是属于`html`文档的`DOM`对象，可以认为就是`html`源代码中那些标签所化成的对象。他们跟`div、select`什么对象没有根本区别。

（我是这样记的，整个浏览器中最大的肯定就是窗口`window`了，那么进来的我不管你是啥，就算你是`document`也得给我盘着）



### 如何解决a标点击后hover事件失效的问题?

改变a标签css属性的排列顺序

只需要记住`LoVe HAte`原则就可以了(爱恨原则)：

```
link→visited→hover→active
```

比如下面错误的代码顺序：

```css
a:hover{
  color: green;
  text-decoration: none;
}
a:visited{ /* visited在hover后面，这样的话hover事件就失效了 */
  color: red;
  text-decoration: none;
}
```

正确的做法是将两个事件的位置调整一下。

注意⚠️各个阶段的含义：

`a:link`：未访问时的样式，一般省略成a
`a:visited`：已经访问后的样式
`a:hover`：鼠标移上去时的样式
`a:active`：鼠标按下时的样式



### 点击一个input依次触发的事件

```javascript
const text = document.getElementById('text');
text.onclick = function (e) {
  console.log('onclick')
}
text.onfocus = function (e) {
  console.log('onfocus')
}
text.onmousedown = function (e) {
  console.log('onmousedown')
}
text.onmouseenter = function (e) {
  console.log('onmouseenter')
}
```

答案：

```javascript
'onmouseenter'
'onmousedown'
'onfocus'
'onclick'
```



### 有写过原生的自定义事件吗

**创建自定义事件**

原生自定义事件有三种写法：

1. 使用`Event`

```javascript
let myEvent = new Event('event_name');
```

2. 使用`customEvent` （可以传参数）

```javascript
let myEvent = new CustomEvent('event_name', {
	detail: {
		// 将需要传递的参数放到这里
		// 可以在监听的回调函数中获取到：event.detail
	}
})
```

3. 使用`document.createEvent('CustomEvent')和initCustomEvent()`

```javascript
let myEvent = document.createEvent('CustomEvent');// 注意这里是为'CustomEvent'
myEvent.initEvent(
	// 1. event_name: 事件名称
	// 2. canBubble: 是否冒泡
	// 3. cancelable: 是否可以取消默认行为
)
```

- `createEvent`：创建一个事件
- `initEvent`：初始化一个事件

可以看到，`initEvent`可以指定3个参数。

（有些文章中会说还有第四个参数`detail`，但是我查看了`W3C`上并没有这个参数，而且实践了一下也没有效果）

**事件的监听**

自定义事件的监听其实和普通事件的一样，使用`addEventListener`来监听：

```javascript
button.addEventListener('event_name', function (e) {})
```

**事件的触发**

触发自定义事件使用`dispatchEvent(myEvent)`。

注意⚠️，这里的参数是要自定义事件的对象(也就是`myEvent`)，而不是自定义事件的名称(`'myEvent'`)

**案例**

来看个案例吧：

```javascript
// 1.
// let myEvent = new Event('myEvent');
// 2.
// let myEvent = new CustomEvent('myEvent', {
//   detail: {
//     name: 'lindaidai'
//   }
// })
// 3.
let myEvent = document.createEvent('CustomEvent');
myEvent.initEvent('myEvent', true, true)

let btn = document.getElementsByTagName('button')[0]
btn.addEventListener('myEvent', function (e) {
  console.log(e)
  console.log(e.detail)
})
setTimeout(() => {
  btn.dispatchEvent(myEvent)
}, 2000)
```



### addEventListener和attachEvent的区别？

- 前者是标准浏览器中的用法，后者`IE8`以下
- `addEventListener`可有冒泡，可有捕获；`attachEvent`只有冒泡，没有捕获。
- 前者事件名不带`on`，后者带`on`
- 前者回调函数中的`this`指向当前元素，后者指向`window`



### addEventListener函数的第三个参数

第三个参数涉及到冒泡和捕获，是`true`时为捕获，是`false`则为冒泡。

或者是一个对象`{passive: true}`，针对的是`Safari`浏览器，禁止/开启使用滚动的时候要用到。



### DOM事件流是什么？

事件发生时会在元素节点之间按照**特定的顺序**传播，这个传播过程就叫做DOM事件流。

DOM事件流分为三个阶段：

1. 捕获阶段：事件从`window`发出，自上而下向目标节点传播的阶段

2. 目标阶段：真正的目标阶段正在处理事件的阶段
3. 冒泡阶段：事件从目标节点自下而上向`window`传播的阶段

(注意⚠️：`JS`代码只能执行捕获或者冒泡其中一个阶段，要么是捕获要么是冒泡)



### 冒泡和捕获的具体过程

冒泡指的是：当给某个目标元素绑定了事件之后，这个事件会依次在它的父级元素中被触发(当然前提是这个父级元素也有这个同名称的事件，比如子元素和父元素都绑定了`click`事件就触发父元素的`click`)。

捕获则是从上层向下层传递，与冒泡相反。

（非常好记，你就想想水底有一个泡泡从下面往上传的，所以是冒泡）

来看看这个例子：

```html
<!-- 会依次执行 button li ul -->
<ul onclick="alert('ul')">
  <li onclick="alert('li')">
    <button onclick="alert('button')">点击</button>
  </li>
</ul>
<script>
  window.addEventListener('click', function (e) {
    alert('window')
  })
  document.addEventListener('click', function (e) {
    alert('document')
  })
</script>
```

冒泡结果：`button > li > ul > document > window`

捕获结果：`window > document > ul > li > button`



### 所有的事件都有冒泡吗？

并不是所有的事件都有冒泡的，例如以下事件就没有：

- `onblur`
- `onfocus`
- `onmouseenter`
- `onmouseleave`



### 关于一些兼容性

1. `event`的兼容性

- 其它浏览器`window.event`
- 火狐下没有`window.event`，所以用传入的参数`ev`代替
- 最终写法：`var oEvent = ev || window.event`

2. 事件源的兼容性

- 其它浏览器`event.target`
- `IE`下为`event.srcElement`
- 最终写法：`var target = event.target || event.srcElement`

3. 阻止事件冒泡

- 其它浏览器`event.stopPropagation()`
- `IE`下为`window.event.cancelBubble = true`

4. 阻止默认事件

- 其它浏览器`e.preventDefault()`
- `IE`下为`window.event.returnValue = false`

(参考：[JS事件对象兼容性](https://www.cnblogs.com/diwangkaige/p/10078683.html))



### 如何阻止冒泡和默认事件(兼容写法)

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



### 事件委托知道吗？



### 拖拽有哪些知识点

1. 可以通过给标签设置`draggable`属性来实现元素的拖拽，`img和a标签`默认是可以拖拽的
2. 拖拽者身上的三个事件：`ondragstart`、`ondrag`、`ondragend`
3. 拖拽要放到的元素：`ondragenter`、`ondragover`、`ondragleave`、`ondrap`



### 实现一个拖拽(兼容写法)

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
    box.onmouseup = function () {
      document.onmousemove = null;
      box.onmouseup = null;
    }
  }
}
```



### offset、scroll、client的区别

**client**:

oEvent.clientX是指鼠标到可视区左边框的距离。

oEvent.clientY是指鼠标到可视区上边框的距离。

clientWidth是指可视区的宽度。

clientHeight是指可视区的高度。

clientLeft获取左边框的宽度。

clientTop获取上边框的宽度。

**offset**:

offsetWidth是指div的宽度（包括div的边框）

offsetHeight是指div的高度（包括div的边框）

offsetLeft是指div到整个页面左边框的距离（不包括div的边框）

offsetTop是指div到整个页面上边框的距离（不包括div的边框）

**scroll**:

scrollTop是指可视区顶部边框与整个页面上部边框的看不到的区域。

scrollLeft是指可视区左边边框与整个页面左边边框的看不到的区域。

scrollWidth是指左边看不到的区域加可视区加右边看不到的区域即整个页面的宽度（包括边框）

scrollHeight是指上边看不到的区域加可视区加右边看不到的区域即整个页面的高度（包括边框）



### target="_blank"有哪些问题？

**存在问题：**

1. 安全隐患：新打开的窗口可以通过`window.opener`获取到来源页面的`window`对象即使跨域也可以。某些属性的访问被拦截，是因为跨域安全策略的限制。 但是，比如修改`window.opener.location`的值，指向另外一个地址，这样新窗口有可能会把原来的网页地址改了并进行页面伪装来欺骗用户。
2. 新打开的窗口与原页面窗口共用一个进程，若是新页面有性能不好的代码也会影响原页面

**解决方案：**

1. 尽量不用`target="_blank"`

2. 如果一定要用，需要加上`rel="noopener"`或者`rel="noreferrer"`。这样新窗口的window.openner就是null了，而且会让新窗口运行在独立的进程里，不会拖累原来页面的进程。(不过，有些浏览器对性能做了优化，即使不加这个属性，新窗口也会在独立进程打开。不过为了安全考虑，还是加上吧。)

（参考来源：[慎用target="_blank"](https://juejin.im/post/5eb8ed20e51d454db55fb353)）



### children以及childNodes的区别

- `children`和只获取该节点下的所有`element`节点
- `childNodes`不仅仅获取`element`节点还会获取元素标签中的空白节点
- `firstElementChild`只获取该节点下的第一个`element`节点
- `firstChild`会获取空白节点



### JS三种加载方式的区别

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



### 加载CSS会阻塞DOM的解析吗？

css是由单独的下载线程异步下载的，由于DOM树的解析和构建这一步与css并没有关系，所以它并不会影响DOM的解析。不过最终的布局树是需要DOM树和DOM样式的，因此它会阻塞布局树的建立。



###  CSS资源一直没响应，那页面会怎样呢？



### 了解loading="lazy"吗？

(答案参考：[一、Lazy loading Chrome 76支持啦](https://www.zhangxinxu.com/wordpress/2019/09/native-img-loading-lazy/))

1. Lazy loading加载数量与屏幕高度有关，高度越小加载数量越少，但并不是线性关系。
2. Lazy loading加载数量与网速有关，网速越慢，加载数量越多，但并不是线性关系。
3. Lazy loading加载没有缓冲，滚动即会触发新的图片资源加载。
4. Lazy loading加载在窗口resize尺寸变化时候也会触发，例如屏幕高度从小变大的时候。
5. Lazy loading加载也有可能会先加载后面的图片资源，例如页面加载时滚动高度很高的时候。

判断浏览器是否支持`loading="lazy"`:

下面三种方法都可以：

```javascript
var isSupportLoading = 'loading' in document.createElement('img');
```

或者：

```javascript
var isSupportLoading = 'loading' in new Image();
```

或者：

```javascript
var isSupportLoading = 'loading' in HTMLImageElement.prototype;
```