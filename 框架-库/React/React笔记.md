## React笔记

### React的理念

**快速响应**：

- 速度快
- 响应自然

**速度快：**

由于`React`语法的灵活性，在编译时无法区分可能变化的部分，所以它为了速度快需要在运行时做更多的努力，例如：

- 使用`PureComponent`或`React.memo`构建组件
- 使用`shouldComponentUpdate`生命周期钩子
- 渲染列表时使用`key`
- 使用`useCallback`和`useMemo`缓存函数和变量

**响应自然：**

将同步更新变为可中断的异步更新，在浏览器每一帧的时间中，预留一些时间给JS线程，`React`利用这部分时间更新组件，源码中预留的时间是`5ms`。当预留的时间不够用时，`React`将线程控制权交还给浏览器使其有时间渲染UI，`React`则等待下一帧时间到来继续被中断的工作。



### React15架构及缺点

#### 架构

- `Reconciler`(协调器)：负责找出变化的组件
- `Renderer`(渲染器)：负责将变化的组件渲染到页面上

#### 更新流程

当有发生更新时，`Reconciler`会做：

- 调用函数组件、或class组件的`render`方法，将返回的JSX转化为虚拟DOM
- 将虚拟DOM和上次更新时的虚拟DOM对比
- 通过对比找出本次更新中变化的虚拟DOM
- 通知**Renderer**将变化的虚拟DOM渲染到页面上

#### React15架构的缺点：

在**Reconciler**中，更新的方式是递归更新子组件，而对于递归更新，更新一旦开始，中途就无法中断，所以当层级很深时，递归更新时间就可能会超过`16.6ms`(主流浏览器刷新频率为60Hz，即每1000ms/60Hz，16.6ms刷新一次)，这样用户交互就会卡顿。

而解决以上问题的关键就是用**可中断的异步更新**代替**同步的更新**，但是React15的架构却是不支持异步更新的。

因为在React15，`Reconciler`和`Renderer`是交替着工作，当前一轮更新的任务结束之后，第二轮再进行`Renconciler`，由于整个过程都是同步的，所以如果此时中途中断更新，就会使得后面的任务不执行，渲染也就停止了。



### React16架构

#### 架构：

- `Scheduler`(调度器)：调度任务的优先级，高优先级的任务先进入`Reconciler`
- `Reconciler`(协调器)：负责找出变化的组件
- `Renderer`(渲染器)：负责将变化的组件渲染到页面上

相比于React15，新增了`Scheduler`。

#### Scheduler:

一个独立于React的库，实际上是一个功能完备的`requestIdleCallback`polyfill。

它产生的原因是：

- 浏览器需要用是否有剩余时间作为任务中断的标准，所以我们需要一种机制，当浏览器有剩余时间的时候通知我们。
- 部分浏览器已经实现了这个API，也就是`requestIdleCallback`，不过由于它有以下缺点而被`React`放弃使用了：
  - 浏览器兼容性问题
  - 触发频率不稳定，受很多因素影响。比如当我们的浏览器切换tab后，之前tab注册的`requestIdleCallback`触发的频率会变得很低

所以React实现了一个功能更完备的`requestIdleCallback`polyfill：Scheduler。

作用：

- 在空闲时间触发回调，以通知我们浏览器是否有剩余时间做任务中断
- 提供了多种调度优先级供任务设置

#### 更新流程

- **Reconciler**与**Renderer**不再是交替工作
- 当产生一个更新，先将更新内容交给**Scheduler**，**Scheduler**会判断有没有其它高优先级更新需要执行，若是没有的话则将更新的内容交给**Reconcoler**
- 当**Scheduler**将任务交给**Reconciler**后，**Reconciler**会为变化的虚拟DOM打上代表增/删/更新的标记
- 整个**Scheduler**与**Reconciler**的工作都在内存中进行。只有当所有组件都完成**Reconciler**的工作，才会统一交给**Renderer**
- **Renderer**接收到通知，将变化的虚拟DOM渲染到页面上



### Fiber架构

#### 代数效应

`代数效应`是`函数式编程`中的一个概念，用于将`副作用`从`函数`调用中分离。

**代数效应在React中的应用：**

- `useState`
- `useRef`
- `useReducer`

**代数效应与Generator：**

`异步可中断更新`可以理解为：`更新`在执行过程中可能会被打断（浏览器时间分片用尽或有更高优任务插队），当可以继续执行时恢复之前执行的中间状态。

代数效应中`try...handle`的作用就是为了满足以上需求。

而此功能与浏览器原生的`Generator`很像，但它存在一些缺陷，因此不被使用：

- 类似`async`，`Generator`也是`传染性`的，使用了`Generator`则上下文的其他函数也需要作出改变。这样心智负担比较重。
- `Generator`执行的`中间状态`是上下文关联的。如果后面的计算需要依赖与前面的计算结果，就需要重新计算。

**代数效应与Fiber：**

Fiber：中文翻译为`纤程`，与进程（Process）、线程（Thread）、协程（Coroutine）同为程序执行过程。

可以理解为`纤程`是协程的一种实现，而在JS中协程的实现就是`Generator`。

所以，我们可以将`纤程`(Fiber)、`协程`(Generator)理解为`代数效应`思想在`JS`中的体现。

`React Fiber`可以理解为：

`React`内部实现的一套状态更新机制。支持任务不同`优先级`，可中断与恢复，并且恢复后可以复用之前的`中间状态`。

其中每个任务更新单元为`React Element`对应的`Fiber节点`。





### Fiber架构的工作原理

`Fiber`树是什么？它的构建和替换过程又是怎样的？

#### 双缓存：

在内存中构建并直接替换的技术叫做**双缓存**。

#### 双缓存Fiber树：

在React中最多同时存在两颗`Fiber树`：

- 屏幕上显示内容对应着：`current Fiber树`
- 正在内存中构建对应着：`workInProgress Fiber树`

**`Fiber树`的节点：**

- `current Fiber树`中的节点：`currentFiber`
- `workInProgress Fiber树`：`workInProgressFiber`

两种节点之间的关系，靠`alternate`属性连接：

```javascript
currentFiber.alternate === workInProgressFiber;
workInProgressFiber.alternate === currentFiber;
```

而在React应用的根节点就是通过`current`指针在不同的`Fiber树`的`rootFiber`间切换来实现`Fiber树`的切换，这个过程伴随着`DOM`的更新。

**FiberRootNode和rootFiber**

在讲解切换更新流程时，需要明确几个概念：

如下的代码：

```javascript
function App() {
  const [num, add] = useState(0);
  return (
    <p onClick={() => add(num + 1)}>{num}</p>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'));
```

首次执行`ReactDOM.render`时会创建：

- `fiberRootNode`(源码中为`fiberRoot`)，它是整个应用的根节点；
- `rootFiber`，它是`<App />`组件树的根节点。

在应用中我们可能会多次调用`ReactDOM.render`渲染不同的组件树，所以它们可能会有不同的`rootFiber`，但是`fiberRootNode`在整个应用中就只有一个。

它俩之间的关系，是靠`fiberRootNode`的一个名为`current`的属性来联系的：

```javascript
fiberRootNode.current = rootFiber
```

**mount和update阶段**

而对应着生命周期来说，会分为`mount`和`update`阶段。

在`mount`时，会有三个阶段：

1. 首屏渲染时，页面没有挂载任何的`DOM`，此时`fiberRootNode.current = rootFiber`，但是`rootFiber`并没有任何的子`Fiber节点`，所以此时`currentFiber`为空。

<img src="https://react.iamkasong.com/img/rootfiber.png" style="zoom:50%;" />

2. 到了`render阶段`，根据组件的`JSX`在内存中依次构建了`Fiber节点`并连接成了`Fiber树`，这棵树也就是`workInProgress Fiber树`:

<img src="https://react.iamkasong.com/img/workInProgressFiber.png" style="zoom:50%;" />

3. 已构建完的`workInProgress Fiber树`在`commit阶段`渲染到页面，此时`fiberRootNode`的`current`指针指向`workInProgress Fiber树`使其变为`current Fiber 树`：

<img src="https://react.iamkasong.com/img/wipTreeFinish.png" style="zoom:50%;" />

`update`阶段其实就像是我们前面说的了，当有节点触发状态改变：

1. 会开启一次新的`render`阶段，构建一个新的`workInProgress Fiber树`：

<img src="https://react.iamkasong.com/img/wipTreeUpdate.png" style="zoom:50%;" />

2. `workInProgress Fiber 树`在`render阶段`完成构建后进入`commit阶段`渲染到页面上。渲染完毕后，`workInProgress Fiber 树`变为`current Fiber 树`：

<img src="https://react.iamkasong.com/img/currentTreeUpdate.png" style="zoom:50%;" />







### React源码文件结果

```
根目录
├── fixtures        # 包含一些给贡献者准备的小型 React 测试项目
├── packages        # 包含元数据（比如 package.json）和 React 仓库中所有 package 的源码（子目录 src）
├── scripts         # 各种工具链的脚本，比如git、jest、eslint等
```

#### packages

具体来看看`packages`文件夹：

- `react`文件夹：React的核心，包含所有全局 React API，例如`React.createElement、React.Component`等
- `scheduler`文件夹：Scheduler（调度器）的实现
- `share`文件夹：源码中其他模块公用的**方法**和**全局变量**

**Renderer相关文件夹**：

```
- react-art
- react-dom                 # 注意这同时是DOM和SSR（服务端渲染）的入口
- react-native-renderer
- react-noop-renderer       # 用于debug fiber（后面会介绍fiber）
- react-test-renderer
```

**试验性包的文件夹**：

```
- react-server        # 创建自定义SSR流
- react-client        # 创建自定义的流
- react-fetch         # 用于数据请求
- react-interactions  # 用于测试交互相关的内部特性，比如React的事件模型
- react-reconciler    # Reconciler的实现，你可以用他构建自己的Renderer
```

**辅助包的文件夹**：

```
- react-is       # 用于测试组件是否是某类型
- react-client   # 创建自定义的流
- react-fetch    # 用于数据请求
- react-refresh  # “热重载”的React官方实现
```

比较重要的：

- `react-reconciler`，他一边对接**Scheduler**，一边对接不同平台的**Renderer**，构成了整个 React16 的架构体系。



### 调试源码

说明：

- 现在我们通过`create-react-app`创建的`React`项目中使用到的`react`源码不一定和 [facebook/react](https://github.com/facebook/react) 仓库中`master`分支的一样，因为给用户使用的必须是趋于稳定的一个版本。
- 当我们在调试源码的时候可以选择仓库中的最新代码。

其实想要调试源码，大体来说只需要这么几个步骤：

- 从  [facebook/react](https://github.com/facebook/react) 仓库中`clone`下`master`分支的最新源码

- 在本地用最新的源码`build`出`react`、`scheduler`、`react-dom`三个包为`dev`环境可以使用的`cjs`包，可以使用指令：

  - ```
    yarn build react/index,react-dom/index,scheduler --type=NODE
    ```

  - 此时源码目录`build/node_modules`下会生成最新代码的包，为接下来的`link`做准备。

- 使用`create-react-app`创建一个项目用于调试源码，然后将上述源码中的`build`包与此项目进行`yarn link`关联。



### JSX

#### 为什么引入JSX？

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

通过`Babel`编译输出`JS`：

```js
var a = React.createElement('a', {href: 'https://lindaidai.wang'}, 'LinDaiDai')
```

所以我们在每个`JSX`文件都必须显式的声明引入`React`：

```jsx
import React from 'react';
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

另外，需要注意的是，`JSX`并不只会被编译为`React.createEelement`这种形式。

当使用[@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx)插件的时候，可以显式的告诉`Babel`编译时需要把`JSX`编译成一种函数调用的方式。

比如在[preact](https://github.com/preactjs/preact)这个类`React`库中，`JSX`会被编译为一个名为`h`的函数调用。

```javascript
// 编译前
<span>LinDaiDai</span>
// 编译后
h("span", null, "LinDaiDai");
```



#### 源码中的Reac.createElement

源码中的位置为：https://github.com/facebook/react/blob/master/packages/react/src/ReactElement.js

最终是会返回一个带有`$$typeof: REACT_ELEMENT_TYPE`标记的对象，这个对象就表示这其为`React Element`。

全局有一个函数用于检测是不是`React Element`：

```js
export function isValidElement(object) {
  return (
    typeof object === 'object' &&
    object !== null &&
    object.$$typeof === REACT_ELEMENT_TYPE
  );
}
```

在`React`中，所有`JSX`在运行时的返回结果（即`React.createElement()`的返回值）都是`React Element`。



#### JSX和React Component的关系

在`React`中，我们常使用`ClassComponent`与`FunctionComponent`构建组件。

对于两种组件来说，我们如果将其在控制台中打印出来，会发现打印对象的`type`都是它们自身。

而如果想要区分是哪种组件的话，可以通过`ClassComponent`实例原型上的`isReactComponent`变量判断是否是`ClassComponent`：

```jsx
ClassComponent.prototype.isReactComponent = {};
```

但是不能通过引用类型来区分，因为：

```javascript
AppClass instanceof Function === true;
AppFunc instanceof Function === true;
```



#### JSX和Fiber节点

从上面的内容我们可以发现，`JSX`是一种描述当前组件内容的数据结构，他不包含组件**schedule**、**reconcile**、**render**所需的相关信息。

比如如下信息就不包括在`JSX`中：

- 组件在更新中的`优先级`
- 组件的`state`
- 组件被打上的用于**Renderer**的`标记`

这些内容都包含在`Fiber节点`中。

所以，在组件`mount`时，`Reconciler`根据`JSX`描述的组件内容生成组件对应的`Fiber节点`。



- `React`元素：创建开销极小的普通对象
- 能够直接使用HTML标签这样的写法：`const element = <div className="foo" />`是因为`JSX`
- 将一个元素渲染为`DOM`：`ReactDOM.render(element, container)`
- `JSX`是一种描述当前组件内容的数据结构
- `Fiber`节点包含组件在更新中的优先级，组件的`state`，组件被打上用于`Renderer`的标记



### render阶段

`Fiber`节点是如何被创建并构建`Fiber树`的？





