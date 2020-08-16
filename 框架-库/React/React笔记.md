## React笔记



### 为什么引入JSX？

React 认为**组件**才是王道，而组件是和模板紧密关联的，组件模板和组件逻辑分离让问题复杂化了。

所以就有了 JSX 这种语法，就是为了把 HTML 模板直接嵌入到 JS 代码里面，这样就做到了模板和组件关联，但是 JS 不支持这种包含 HTML 的语法，所以需要通过工具将 JSX 编译输出成 JS 代码才能使用。



例如页面已有的HTML代码为：

```html
<body>
	<div id="app"></div>
</body>
```

我们想要在其中添加上一个简单的a标签：

```html
<a href="http://lindaidai.wang">LinDaiDai</a>
```

如果想要将它用JS代码表示出来，你可能想到的会是用下面这种方式：

```javascript
const app = document.getElementById('app');
const a = document.createElement('a');
a.setAttribute('href', 'https://lindaidai.wang');
a.innerHTML = 'LinDaiDai';
app.appendChild(a);
```



映射到React中，可能会是这样写：

```js
React.createElement('a', {href: 'https://lindaidai.wang'}, 'LinDaiDai')
```

- `type`：可以是一个`string`类型，也可以是一个组件



`JSX`到`js`的映射：

输入`JSX`：

```jsx
var a = <a href="http://lindaidai.wang">LinDaiDai</a>;
```

输出`JS`：

```js
var a = React.createElement('a', {href: 'https://lindaidai.wang'}, 'LinDaiDai')
```



`JSX`返回的是一个`ReactElement`对象，不是组件实例

而在`JS`，也就是`React.createElement`它返回的是对组件的引用也就是组件实例

```js
// A ReactElement
const myComponent = <MyComponent />

// render
const myComponentInstance = React.createElement(MyComponent, mountNode);
myComponentInstance.doSomething();
```





- `React`元素：创建开销极小的普通对象
- 能够直接使用HTML标签这样的写法：`const element = <div className="foo" />`是因为`JSX`
- 将一个元素渲染为`DOM`：`ReactDOM.render(element, container)`
- 

