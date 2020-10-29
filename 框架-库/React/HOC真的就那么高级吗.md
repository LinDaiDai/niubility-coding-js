> 希沃ENOW大前端
>
> 公司官网：[CVTE(广州视源股份)](http://www.cvte.com/)
>
> 团队：CVTE旗下未来教育希沃软件平台中心enow团队

**本文作者：**

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52894355d9bb445fadb78f0a8ef09169~tplv-k3u1fbpfcp-zoom-1.image)



## 前言

你盼世界，我盼望你无`bug`。Hello 大家好！我是霖呆呆。

这篇文章首发于我们团队的掘金账号【希沃ENOW大前端】，很荣幸成为第一篇文章的编写人。在接下来日子，我们每周都会为大家输出**好玩、有趣、符合前端发展**的技术型文章，这个过程我们一起学习进步💪。如果觉得某位小哥哥/小姐姐写的不错的话，还请不要吝啬你的赞👍哦，每个赞和评论都是对我们最好的支持😊，感谢。

在正式开始之前，呆呆冒死回答一下标题的问题吧...是的！它很高级😅。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21a1c13e8da34c0083e8304612cf910a~tplv-k3u1fbpfcp-zoom-1.image)

我也调研了很多关于HOC的资料，其中确实也有很多写的比较好的文章。但如果你想问本篇文章的优势在哪里？唔...我可以斗胆的说，会更加详细，案例也会更加齐全。所以这篇文章我会从HOC是什么、怎么用它、用它需要注意什么等方面详细的去讲解，尽量让大家都能理解。

**适宜人群**：能看得懂一些`React`的靓仔、靓妹😊。

来看看通过阅读本篇文章我们可以学习到：

- HOC的概念
- 如何实现高阶组件
- HOC的几种使用方式
- HOC的实际用法
- 使用HOC需要注意的点



## 1. HOC的概念

其实如果有过`React`开发经验的小伙伴对`HOC`的概念应该就不陌生了，不过既然是介绍它的话，那呆呆也稍微正式一点：

`HOC`，全称`Higher-Order Components`，即高阶组件。

它的概念应该是来源于`JavaScript`的高阶函数，我们知道高阶函数就是接受函数作为输入或者输出的函数。

通俗来说就是一个函数，它的参数可以是一个函数，它的返回值也可以是一个函数😄，这样的函数就被称为高阶函数。

例如🌰下面的这两个函数：

```javascript
// 1. 参数为函数
const test1 = fn => {
  setTimeout(() => fn(), 1000)
};
const log1 = () => console.log('我爱学习');
test1(log1); // 1s后打印

// 2. 返回值为函数
const test2 = () => {
  const log2 = name => console.log(name);
  return log2;
}
test2()('学习不爱我'); // 立即打印
```

那么其实，**高阶组件它也仅仅只是一个接受组件作为输入并返回组件的函数**。呆呆认为它并不是一个新的API或者一个新的什么玩意，仅仅是一种模式吧，或者说是一种技巧，这种技巧能够帮助我们**复用组件逻辑**。

就像下面👇这样的用法：

让我们来创建一个*FinalComponent.js*

```javascript
import React from 'react';

function MyHOC (WrappedComponent) {
  return class extends React.Component {
    render () {
      return <WrappedComponent />;
    }
  }
}
class TestComponent extends React.Component {
  render () {
    return (
      <div>我就是个普通的组件</div>
    )
  }
}
const FinalComponent = MyHOC(TestComponent);
export default FinalComponent;
```

在这个案例中，我做了这么几件事：

- 创建了一个名为`MyHOC`的函数，它接收一个名为`WrappedComponent`的参数，并返回一个新的匿名组件
- 这个匿名组件的`render`返回的是传递进来的`WrappedComponent`组件
- 之后创建了一个名为`TestComponent`的组件
- 再调用`MyHOC`函数并把`TestComponent`传递进去赋值给`FinalComponent`变量
- 此时的`FinalComponent`其实就是那个匿名组件，我们将它导出。

 在其它地方使用`FinalComponent`这个组件的话，就能正常渲染出`"我就是个普通的组件"`了。

可以看到，上面👆的这种用法其实就叫高阶组件，它首先需要定义一个函数，然后这个函数接收一个组件并返回一个新的组件。

大家要注意这里的命名哟，`MyHOC`函数的参数必须大写开头的，因为后面需要把它当成组件来返回，而我们知道，在`React`中如果是组件的话，它的命名开头必须是要大写，`React`会将小写开头的组件当成普通的`HTML`标签处理，这样就会报错。

(另外还有一点，`HOC`并不是`React`里独有的，其它框架也可以使用，比如晨曦老哥的这篇文章就介绍了它在`Vue`中的用法：[Vue 进阶必学之高阶组件 HOC](https://juejin.im/post/5e8b5fa6f265da47ff7cc139))



好的，既然在上面谈到了**高阶组件**主要是可以帮助我们**复用组件逻辑**，那大家会不会想到另一个叫`Mixin`的东西呢？但是因为`ES6`本身是不包含任何`Mixin`支持的，所以当你在`React`中使用`ES6 class`时，将不支持`Mixin `，而且使用它本身会有很多问题，现在也是不推荐使用了。

呆呆，既然你把高阶组件吹的这么牛，那它具体怎么用呢？

咦～这么着急干嘛？哈哈哈哈，咱接着往下看。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d50e27e180ab433ab50f572369b600cb~tplv-k3u1fbpfcp-zoom-1.image)



## 2. 如何实现高阶组件

### 2.1 属性代理

其实在上面👆呆呆已经向大家展示了高阶组件的基本用法，让我们来简单回顾一下前面是怎么做的：

```javascript
import React from 'react';

function MyHOC (WrappedComponent) {
  return class extends React.Component {
    render () {
      return <WrappedComponent />;
    }
  }
}
class TestComponent extends React.Component {
  render () {
    return (
      <div>我就是个普通的组件</div>
    )
  }
}
const FinalComponent = MyHOC(TestComponent);
export default FinalComponent;
```

定义一个函数(`MyHOC`)且接收一个组件，之后返回一个新的组件。

那大家试想一下，如果此时我在页面中引用了`FinalComponent`组件，并且需要向`TestComponent`传递一些属性，也就是`props`，该怎么做呢？

```js
<FinalComponent id={1} />
```

通过这样传递的`id`虽然不能直接被`TestComponent`组件给拿到，但是却可以在`MyHOC`中拿到，因为此时`FinalComponent`确实就是`MyHOC`函数中导出的那个匿名组件，这样的话，我们就可以通过`this`来访问到这个匿名组件的一些属性，包括使用这个组件时传递的一些`props`：

```js
function MyHOC (WrappedComponent) {
  return class extends React.Component {
    render () {
      console.log(this.props); // { id: 1 }
      return <WrappedComponent />;
    }
  }
}
```

好的👌！我们已经成功拿到调用`FinalComponent`时传递的`props`，接下里需要把它传递给`WrappedComponent`，这就很简单了，只需要使用`ES6`的对象展开操作符即可实现，也就是这样：

```js
function MyHOC (WrappedComponent) {
  return class extends React.Component {
    render () {
      console.log(this.props); // 一、{ id: 1 }
      return <WrappedComponent {...this.props} />;
    }
  }
}
class TestComponent extends React.Component {
  render () {
    return (
      console.log(this.props); // 二、在这里能拿到
      <div>我就是个普通的组件</div>
    )
  }
}
```

这个过程其实就是一个浅拷贝的过程，如果`this.props`有多个属性的话，都会将其展开传递给`WrappedComponent`：

```js
console.log(this.props); // { id: 1, uid: 123 }

<WrappedComponent {...this.props} />
// 等价于 =>
<WrappedComponent id={1} uid={123} />
```

可以看到，在每次调用`WrappedComponent`组件的时候，都必然要经过`MyHOC`函数，也就是说`MyHOC`成了`WrappedComponent`的`"代理"`，那么我们是不是就可以对在这一层做一些额外的操作，例如操作前面提到的`this.props`，或者是`WrappedComponent`的静态属性方法。

像这种**函数返回一个我们自己定义的组件，然后在`render`中返回要包裹的组件，同时在函数中做一些额外处理的方式**，我们就称之为**属性代理**，根据它的功能来看这个名字是不是很好理解呢？😊。

一起来看个简写：

```javascript
function proxyHOC(WrappedComponent) {
  return class extends Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b48745b7b22e4e73918fd46b2731f16d~tplv-k3u1fbpfcp-zoom-1.image)

好的👌，呆呆既然已经告诉了你们这种全新的使用方式了，那你能想到通过这种名为`"属性代理"`的东西能让我们做哪些好玩有趣的事吗？

首先第一点呆呆来给你起个头：在我们定义的高级组件的那个函数中，是可以对要返回的组件的属性进行二次加工的，那我们是不是就可以给`this.props`添加上一些新的属性，并传递给`WrappedComponent`？OK👌，让我们来看看`"属性代理"`它的第一种用法。



#### 2.1.1 操作props添加公共属性

就像上面👆说的，我们可以给`this.props`添加上一些新的属性并向下传递，但是这个添加不是让你去直接修改`this.props`哈，比如下面👇这种用法肯定就是不行的了：

```javascript
render () {
 this.props.remark = '别自闭'
 return <WrappedComponent {...this.props} />
}
```

因为`React`是单向数据流，它不允许你去修改`props`，此时你会发现控制台直接就报错了：

```
HOC21.jsx:10 Uncaught TypeError: Cannot add property remark, object is not extensible
```

那好的，我新建一个对象再添加额外属性就不行了😄？比如我们可以把前面的案例改造一下，这样做：

```javascript
import React from 'react';

function MyHOC (WrappedComponent) {
  return class extends React.Component {
    render () {
      const newProps = { // 重点看这里
        ...this.props,
        remark: '别自闭'
      }
      return <WrappedComponent {...newProps} />
    }
  }
}

class TestComponent extends React.Component {
  render () {
    console.log(this.props) // { id: 1, remark: '别自闭' }
    return <div>我就是个普通div</div>
  }
}
const FinalComponent = MyHOC(TestComponent);
export default FinalComponent;
```

使用：

```html
<FinalComponent id={1} />
```

大家可以看到，虽然`FinalComponent`我们在调用的时候只传递了一个属性，也就是`id`，但是最终`TestComponent`组件接收到的`props`却经过`MyHOC`添加上了额外的属性`"自闭"`，呸，是`"别自闭"`。

这样就达到了在调用`TestComponent`的时候，可以额外新加一些属性的功能。例如现在如果我们有好几个组件，都需要添加一些相同的属性，那么我们是不是只需要定义好一个`MyHOC`，然后让这些组件都经过`MyHOC`过一遍就可以了。

`Good boy!`现在我们已经会`"属性代理"`的其中一种用法了，不说了，学累了，喝口水去，顺便想想还可以怎样用。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91de52d1198c4b70b58ba776fd1eee61~tplv-k3u1fbpfcp-zoom-1.image)

#### 2.1.2 组合渲染

唔，欢迎回来呀。就在刚刚看表情包的时间，大家有想到什么其它的用法不？

没有？好吧。咳咳，呆呆可是想到了😅。其实大家可以这样去想，一个`React`组件里，无非就是这几种东西，像基础点的有什么`props、state、生命周期、render函数`啦，再高级点的可能就是`refs`。既然这样的话，咱把这几个都套上去试试，看是不是能产生很多新鲜的用法呢。

就比如`render函数`吧，既然前面的`props`是在数据传递的层面做一些事情，那么我们也可以从渲染层去看看。

比如给最终输出的`UI`再添加一些额外的元素，这个元素可以是`HTML`元素，也可以是`React`组件，我们先来看看给上面的案例增加一个`HTML`元素：

```diff
import React from 'react';
function MyHOC (WrappedComponent) {
  return class extends React.Component {
    render () {
+      return (<>
+        <div>我是额外添加的HTML元素</div>
+        <WrappedComponent {...this.props} />
+      </>)
    }
  }
}
class TestComponent extends React.Component {
  render () {
    console.log(this.props)
    return <div>我就是个普通div</div>
  }
}
const FinalComponent = MyHOC(TestComponent);
export default FinalComponent;
```

增加`React`组件也可以：

```diff
import React from 'react';
+ function ExtraComponent () {
+  return (
+    <div>我是额外添加的React组件</div>
+  )
+ }
function MyHOC (WrappedComponent) {
  return class extends React.Component {
    render () {
      return (<>
        <div>我是额外添加的HTML元素</div>
+       { ExtraComponent() }
        <WrappedComponent {...this.props} />
      </>)
    }
  }
}
class TestComponent extends React.Component {
  render () {
    console.log(this.props)
    return <div>我就是个普通div</div>
  }
}
const FinalComponent = MyHOC(TestComponent);
export default FinalComponent;
```

(额，关于`<></>`大家应该知道是什么意思吧，其实就是`React.Fragment`的简写，你可以把它想象成就是一个透明的`div`，但是并不会在页面上渲染出这个`div`，用过`Vue`的小伙伴可能好理解一些，就是类似`Vue`中的`template`标签)

像上面👆的这种实现方式我们也来给它取个名字吧——`组合渲染`。

和它的名字一样，它可以对我们最终要渲染的`UI`做一些组合，不管这种组合是包裹的，还是兄弟之间的组合，都可以。怎么样？小伙伴们有没有感觉有内味了？😁

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c86de3f3b7b04297ad4f33c4e8695304~tplv-k3u1fbpfcp-zoom-1.image)



#### 2.1.3 条件渲染

其实有了**组合渲染**，条件渲染这种用法我们也很好理解了，甚至我在听到这个词的时候，脑子里已然能想到可以怎么去做了。

最简单的一种，我们可以通过三元运算符判断组件是否渲染：

```diff
import React from 'react';
+ function ReboundGuy () {
+  return (
+    <div>我只是个备胎...</div>
+  )
+ }
function MyHOC (WrappedComponent) {
  return class extends React.Component {
    render () {
      return (<>
+        {
+          this.props.flag ? <WrappedComponent {...this.props} /> :
+          ReboundGuy()
+        }
      </>)
    }
  }
}
class TestComponent extends React.Component {
  render () {
    console.log(this.props)
    return <div>我就是个普通div</div>
  }
}
const FinalComponent = MyHOC(TestComponent);
export default FinalComponent;
```

通过判断传递进来的`flag`的值来决定渲染出什么内容，结合实际应用来说，是不是可以把上面👆的`"备胎"`组件换成一个`Loading`组件呢？

其实大家可以发现，这些用法并没有想象的那么难。可能也有小伙伴会问了，如果只是想要实现一个这样的条件渲染，我不用高级组件，写在每个组件里也可以实现呀。

没错，是有很多的办法可以实现，呆呆也没说非得使用高阶组件，只不过这确实是我们实现功能的一种方式。



#### 2.1.4 状态管理(抽象state)

还有一种用法被称之为`状态管理`，有的教材里也叫做`抽象state`。刚开始听到这个词可能不太好理解，不过如果大家知道它是怎样用的话读懂这个命名就很简单了。

在`React`中是会有一个叫做受控组件和非受控组件的概念的(如果还不清楚的小伙伴可得看看这篇文章了[《受控和非受控组件真的那么难理解吗？(React实际案例详解)》](https://juejin.im/post/6858276396968951822))。

总结来说，其实也就是我们**对某个组件状态的掌控，它的值是否只能由用户设置，而不能通过代码控制**。

我们知道，在`React`中定义了一个`input`输入框的话，它并没有类似于`Vue`里`v-model`的这种双向绑定功能。也就是说，我们并没有一个指令能够将数据和输入框结合起来，用户在输入框中输入内容，然后数据同步更新。

就像下面这个案例：

```jsx
class TestComponent extends React.Component {
  render () {
    return <input name="username" />
  }
}
```

用户在界面上的输入框输入内容时，它是自己维护了一个`"state"`，这样的话就能根据用户的输入自己进行`UI`上的更新。(这个`state`并不是我们平常看见的`this.state`，而是每个表单元素上抽象的`state`)

想想此时如果我们想要控制输入框的内容可以怎样做呢？唔...输入框的内容取决的是`input`中的`value`属性，那么我们可以在`this.state`中定义一个名为`username`的属性，并将`input`上的`value`指定为这个属性：

```jsx
class TestComponent extends React.Component {
  constructor (props) {
    super(props);
    this.state = { username: 'lindaidai' };
  }
  render () {
    return <input name="username" value={this.state.username} />
  }
}
```

但是这时候你会发现`input`的内容是只读的，因为`value`会被我们的`this.state.username`所控制，当用户输入新的内容时，`this.state.username`并不会自动更新，这样的话`input`内的内容也就不会变了。

哈哈，你可能已经想到了，我们可以用一个`onChange`事件来监听输入内容的改变并使用`setState`更新`this.state.username`：

```jsx
class TestComponent extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      username: "lindaidai"
    }
  }
  onChange (e) {
    console.log(e.target.value);
    this.setState({
      username: e.target.value
    })
  }
  render () {
    return <input name="username" value={this.state.username} onChange={(e) => this.onChange(e)} />
  }
}
```

现在不论用户输入什么内容`state`与`UI`都会跟着更新了，并且我们可以在组件中的其它地方使用`this.state.username`来获取到`input`里的内容，也可以通过`this.setState()`来修改`input`里的内容。

那么对于上面这种情况，我们也可以使用一个`HOC`将`state`给抽象出来，就像下面👇这样来写：

```jsx
import React from 'react';

function MyHOC (WrappedComponent) { // 将state抽象到MyHOC中
  return class extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        username: "lindaidai"
      }
      this.onChange= this.onChange.bind(this);
    }
    onChange (e) {
      console.log(e.target.value);
      this.setState({
        username: e.target.value
      })
    }
    render () {
      const newProps = {
        username: {
          value: this.state.username,
          onChange: this.onChange
        }
      }
      return <WrappedComponent {...this.props} {...newProps} />
    }
  }
}
class TestComponent extends React.Component {
  getUserName = () => { // 可以在这里拿到值
    console.log(this.props.username.value)
  }
  render () {
    return <div>
      <input name="username" {...this.props.username} />
      <button onClick={() => this.getUserName()}>获取username</button>
    </div>
    // return <input name="username" value={this.state.username} onChange={(e) => this.onChange(e)} />
  }
}
const FinalComponent = MyHOC(TestComponent);
export default FinalComponent;
```

可以看到我们将原本在`TestComponent`中实现受控组件的功能提取出了到`MyHOC`中。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/046db3e0783942f9ab60e680dc7760ed~tplv-k3u1fbpfcp-zoom-1.image)


### 2.2 反向继承

OK👌，相信大家对**属性代理**这种方式的使用已经掌握的差不多了。那么对于高阶组件，还有另一种用法，也很屌的样子。唔...也就是**反向继承**。

何为反向继承呢🤔️？同样的，还是一个函数接收了一个组件作为参数，接着返回了一个继承至该组件的类组件，并且在返回组件的`render`中使用`super.render()`方法渲染出传入的组件。

就像是下面👇这种用法，就是一种最简单的反向继承：

```jsx
import React from 'react';

class TestComponent extends React.Component { // 1. 定义了一个组件
  render () {
    return <div>TestComponent</div>
  }
}
function MyHOC (WrappedComponent) { // 2. 定义了一个接收组件的函数
  return class extends WrappedComponent { // 3. 返回了一个继承至传入组件的匿名类组件
    render () {
      return (
        {super.render()} // 4. 此时的 super 实际就是传入的组件的原型对象, 可以调用它的 render()方法进行渲染
      )
    }
  }
}
const FinalComponent = MyHOC(TestComponent);
export default FinalComponent;
```

反向继承，拆开来看：反向、继承。

如果把刚刚直接使用`WrappedComponent`的方式，也就是`<WrappedCompnent />`说成是正向的，那么此时`super.render()`确实可以当成是反向；而继承就很好理解了，返回的匿名类组件继承至`WrappedComponent`。

所以相比较于**属性代理**的方式，**反向继承**又有它自己的特点，因为新返回的匿名组件是继承至`WrappedComponent`的，那么我们是不是就可以在匿名组件中使用`this`访问到`WrappedComponent`的`state`了，或者其中的`ref`。另外，一个组件中还有啥？对，生命周期，我们甚至可以通过在`WrappedComponent.prototype`中拿到它的生命周期。

唔，关于上面`super`的用法是否有小伙伴觉得比较迷糊的呢？问题不大，可以看看这篇文章，里面有对`class`继承的具体描述：[《【何不三连】做完这48道题彻底弄懂JS继承(1.7w字含辛整理-返璞归真)》](https://juejin.im/post/6844904098941108232#heading-41)。

呆呆这里可以稍微的做下总结：

- 在实现继承时，如果子类中有`constructor`函数，必须得在`constructor`中调用一下`super`函数，因为它就是用来产生实例`this`的。

- `super`有两种调用方式：当成函数调用和当成对象来调用。

- `super`当成函数调用时，代表父类的构造函数，且返回的是子类的实例，也就是此时`super`内部的`this`指向子类。在子类的`constructor`中`super()`就相当于是`Parent.constructor.call(this)`。

- `super`当成对象调用时，普通函数中`super`对象指向父类的原型对象，静态函数中指向父类。且通过`super`调用父类的方法时，`super`会绑定子类的`this`，就相当于是`Parent.prototype.fn.call(this)`。

所以说，我们能够成功在匿名类函数中使用`super.render()`渲染出`WrappedComponent`组件。



#### 2.2.1 操作state

按照上面👆所说的，由于返回的匿名组件继承至`WrappedComponent`的，那么我就可以通过`this`获取到它的`state`，让我们先来看看这种使用方式哈。

首先我定义了一个带有`state`属性的`TestComponent`组件：

```jsx
class TestComponent extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      name: 'LinDaiDai'
    }
  }
  render () {
    return <div>TestComponent</div>
  }
}
```

接着使用反向继承来实现一个`HOC`函数：

```jsx
function MyHOC (WrapComponent) {
  return class extends WrapComponent { // 重点在这里
    constructor (props) {
      super(props);
      this.state = {
        sex: 'boy',
        ...this.state // 使用 this.state 读取到 TestComponent 中的 state
      }
    }
    changeState = () => {
      this.setState({
        sex: 'girl',
        name: 'daimei'
      })
    }
    getState = () => {
      console.log(this.state)
    }
    componentDidMount() {
      console.log(this.state.name)
    }
    render () {
      return (
        <div>
          <button onClick={() => this.changeState()}>改变state</button>
          <button onClick={() => this.getState()}>获取state</button>
        </div>
      )
    }
  }
}
```

可以看到，在匿名类组件中，我们是可以访问到`TestComonent`中的`state`的，但是这同样也是一件危险的事情。因为这会直接影响到`TestComponent`里的`state`，就像刚初始化在`constructor`函数中，`TestComponent`里的`state`就已经被修改了：

从`{ name: 'LinDaiDai' }`变为了`{ name: 'LinDaiDai', sex: 'boy' }`。

也就是说这个匿名类组件它会和`TestComponent`共用一个`state`。

所以你要是点击`"改变state"`这个按钮的话，`state`都会变成`{ name: 'daimei', sex: 'girl' }`。

这在实际开发上来说，应该是不好的一点，因为它有可能与`TestComponent`组件内部原本的一些操作构成冲突，并且对于`state`的改变也不能很直观的看到。



那么对于这种方式，在我们实际开发中可以做什么呢？

呆呆想到了一种用法，也许我们可以设计一个用于`debug`调试的`HOC`函数：

```jsx
function debug(WrappedComponent) {
  return class extends WrappedComponent {
    render() {
      console.log(`${WrappedComponent.displayName}的props`, this.props);
      console.log(`${WrappedComponent.displayName}的state`, this.state);
      return (
        <div className="debug">
          {super.render()}
        </div>
      )
    }
  }
}
```

此时只需要在想要调试的组件上，加上`@debug`装饰器就可以了，这样对于一些有相同调试代码的组件来说，还是挺方便的。



#### 2.2.2 渲染劫持

还有一种用法：**渲染劫持**。先让我们把上面👆说的`super.render()`打印出来看看是什么？是否可以对这个玩意做一些操作呢？

如下我有一个很简单的`Test`组件：

```jsx
class TestComponent extends React.Component {
  render () {
    return <input value="LinDaiDai"></input>
  }
}
```

然后用反向继承的方式把它打印出来：

```jsx
function MyHOC (WrapComponent) {
  return class extends WrapComponent {
    componentDidMount () {
      setTimeout(() => {
        console.log(this.props)
      }, 2000)
    }
    render () {
      let testRender = super.render();
      console.log(testRender);
      return testRender
    }
  }
}
```

执行结果如下：

图片hoc1

了解过`React`原理的小伙伴应该都知道，对于`render`函数，实际上是调用`React.createElement()`，然后产生的`React元素`。这点可以从打印的结果中，`$$typeof` 属性字段是不是 `Symbol('react.element')`来判断。

所以对于`super.render()`的结果，是一个`React元素`，这里面包含了对`Test`组件的一些描述，包括`ref、key、props`等，那么对于这些属性我们可以进行操作吗？OK👌，咱不妨使用`getOwnPropertyDescriptors`来将这些属性的描述打印出来看看：

```diff
function MyHOC (WrapComponent) {
  return class extends WrapComponent {
    componentDidMount () {
      setTimeout(() => {
        console.log(this.props)
      }, 2000)
    }
    render () {
      let testRender = super.render();
      console.log(testRender);
+     console.log(Object.getOwnPropertyDescriptors(testRender));
      return testRender
    }
  }
}
```

执行结果如下：

图片hoc2

可以注意到，这些属性的`writable`全都是`false`，也就是说它们并不支持修改。

就像是我想要修改一些输入框中的`value`值：

```jsx
testRender.props.value = 'daimei';
```

发现它并不能如我所愿，控制台出现了红色：

```
Uncaught TypeError: Cannot assign to read only property 'value' of object '#<Object>'
```

啊，这可就是断了我想要玩它们的想法了...

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5abec6cb3c4444c19da739a9b62d1dc3~tplv-k3u1fbpfcp-zoom-1.image)

聪明的我灵机一动💡，那是否可以用什么克隆的方式来克隆这个组件，然后再这个基础上去修改我们想要的属性，亦或者添加上一些属性呢？[奸笑～]

唔，当初读`React`文档的时候，记得有一个叫作`React.cloneElement`的东西，看这名字好像就是做克隆用的啊，三下五除二打开文档瞅瞅它的用法：

```jsx
React.cloneElement(
  element,
  [props],
  [...children]
)
```

套用一下官方的话哈：

> 以 `element` 元素为样板克隆并返回新的 React 元素。返回元素的 props 是将新的 props 与原始元素的 props 浅层合并后的结果。新的子元素将取代现有的子元素，而来自原始元素的 `key` 和 `ref` 将被保留。

这好像就是我想要的，我可以获取到`testRender.props`，然后组合成一个新的`props`再使用`React.cloneElement`去渲染出一个新的`React元素`，话不多说，试试看：

```jsx
function MyHOC (WrapComponent) {
  return class extends WrapComponent {
    componentDidMount () {
      setTimeout(() => {
        console.log(this.props)
      }, 2000)
    }
    render () {
      let testRender = super.render();
      let newProps = { value: 'daimei' }
      let finalProps = Object.assign({}, testRender.props, newProps);
      let finalRender = React.cloneElement(
        testRender,
        finalProps,
        testRender.props.children
      );
      return finalRender
    }
  }
}
```

啊，重新打开页面，发现输入框内的`"LinDaiDai"`已经被成功劫持成`"daimei"`了，`What a f..k`💥。



#### 2.2.3 劫持组件生命周期

唔，先来考大家一个问题：你认为在其他组件中可以怎样获取到另一个组件的生命周期呢？

好吧，给你们思考一下😄。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f6eded7b466485da9f9b830875273f0~tplv-k3u1fbpfcp-zoom-1.image)

要回答这个问题，让我们先来看一下组件的生命周期是任何定义的：

```jsx
class TestComponent extends React.Component {
  componentDidMount () {
    console.log('componentDidMount')
  }
  render () {
    return(
      <div>TestComponent</div>
    )
  }
}
```

可以发现，不论是`componentDidMount`还是`render`都是定义在`TestComponent`中的方法，我们知道，**在类的所有方法都定义在类的`prototype`上**，也就是说，如果我们想要在其它地方获取到`TestComponent`的生命周期，就得到它的`prototype`上去拿，就像这样：

```jsx
function MyHOC (WrappedComponent) {
  console.log(WrappedComponent.prototype.componentDidMount)
  console.log(WrappedComponent.prototype.render)
  return class extends WrappedComponent {
    render () {
      return super.render() // 这个 super 就是 WrappedComponent 的原型对象
    }
  }
}
```

而如果我们在`MyHOC`中返回的匿名组件中也有`componentDidMount`的话，就会把`WrappedComponent`上的生命周期给覆盖：

```diff
function MyHOC (WrappedComponent) {
  console.log(WrappedComponent.prototype.componentDidMount)
  console.log(WrappedComponent.prototype.render)
  return class extends WrappedComponent {
+   componentDidMount () {
+     console.log('MyHoc componentDidMount')
+   }
    render () {
      return super.render()
    }
  }
}
```

控制台最终打印出来的会是`"MyHoc componentDidMount"`。

这个👆应该很好理解吧，唔，那现在我也想要保留`WrappedComponent`上的生命周期该怎么做呢？咦～可以使用`apply`再调用一次呀，😄：

```diff
function MyHOC (WrappedComponent) {
  console.log(WrappedComponent.prototype.componentDidMount)
  console.log(WrappedComponent.prototype.render)
+ const wrappedDidMount = WrappedComponent.prototype.componentDidMount;
  return class extends WrappedComponent {
	  componentDidMount () {
	    console.log('MyHoc componentDidMount')
+     if (wrappedDidMount) {
+       wrappedDidMount.apply(this)
+     }
	  }
    render () {
      return super.render()
    }
  }
}
```

现在，完美的劫持了传入组件的生命周期，可以来做更多有趣的事情了。



#### 2.2.4 调用组件的静态方法

在实现**劫持组件生命周期**的这个用法时，引发了我的另一个思考，不论是**属性代理**的方式还是现在的**反向继承**，都可以拿到传入进来的组件，那么对于原组件`生命周期、静态方法`的获取应该都是适用的。

我们知道，静态方法的定义是在申明函数时，前面加上`static`标识符表示这是一个直接定义在`Class`上的方法，并不能被`Class`的实例对象调用：

```jsx
class TestComponent extends React.Component {
	static staticFn () {
		console.log('我是Test中的静态方法')
	}
  render () {
    return(
      <div>TestComponent</div>
    )
  }
}
```

所以其实我们就可以直接使用下面的方式来进行调用：

```jsx
function MyHOC (WrappedComponent) {
  WrappedComponent.staticFn()
}
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cdb32ba2664f434fb59d0f27ddd57890~tplv-k3u1fbpfcp-zoom-1.image)


## 3. HOC的几种使用方式

### 3.1 函数实现

这种实现方式就像上面所有案例中写的一样，直接定义一个接收组件作为参数的函数，然后调用：

```jsx
function MyHOC (WrappedComponent) {
 // ...
}
class TestComponent extends React.Component {}

const FinalComponent = MyHOC(TestComponent);
export default FinalComponent;
```

使用时就当普通的组件来使用就行了：

*App.js*:

```jsx
import FinalComponent from './FinalComponent';
class App extends React.Component {
	render () {
    return (
      <div className="App">
      	<FinalComponent />
			</div>
		)
	}
}
```



### 3.2 compose组合

上面定义的是一个`HOC`的使用情况，如果一个组件需要使用到多个`HOC`呢？

```jsx
function MyHOC1 (WrappedComponent) {
 // ...
}
function MyHOC2 (WrappedComponent) {
 // ...
}
function MyHOC3 (WrappedComponent) {
 // ...
}
class TestComponent extends React.Component {}

const FinalComponent = MyHOC3(MyHOC2(MyHOC1(TestComponent)));
export default FinalComponent;
```

额，这...好丑啊，作为一名有追求的前端，不能忍啊。

那咱来写个`compose`函数调整一下吧：

```jsx
 const compose = (...fns) => fns.reduce((pre, cur) => (...args) => cur(pre(...args)));

 const FinalComponent = compose(MyHOC3, MyHOC2, MyHoc1)(TestComponent);
 export default FinalComponent;
```

或者，偷个懒，我们还可以使用现在市面上已经有的一些工具库，就像是`lodash`中有提供`flowRight`可以实现以上效果。



### 3.3 Decorators

还有一种比较骚的操作就是利用`ES7`的装饰器`Decorators`：

```jsx
@MyHOC3
@MyHOC2
@MyHOC1
class TestComponent extends React.Component {}
```

不过这种方式需要我们安装一下`Babel`的插件：`@babel/plugin-proposal-decorators`。

安装：

```
npm install --save-dev @babel/plugin-proposal-decorators
```

使用(在配置`Babel`的地方添加一下该插件的配置)：

```json
{
  "plugins": ["@babel/plugin-proposal-decorators"]
}
```

这尼🐎好酷的样子。



### 3.4 compose结合Decorators

还有没有更酷一点的用法呢？

咱也许还可以将`compose`和`Decorators`组合起来，就像是这样：

```jsx
const MyHOC = compose(MyHOC3, MyHOC2, MyHoc1);

@MyHOC
class TestComponent extends React.Component {}
```

`GOOD！BOY！`



## 4. HOC的实际用法

其实上面说明了很多种`HOC`的用法，如果你是有认真看的话我相信是能引发你的一些思考的，可能你在看的过程中就会想到这种方式能给我在实际开发中带来什么好处吗🤔️？

唔，呆呆相信你们都比我聪明，肯定能将它的作用发挥的很好。

那么我这里就抛砖引玉，例举出一些在工作中可以用到的地方。




#### 4.1 提取公共部分

唔...其实怎么说呢，刚刚说到的这些用法，例如属性代理操作`props`添加公共属性，或者反向继承如获取到`WrappedComponent`的`state、ref`等操作并不是说是使用`HOC`才能实现的功能，而是要让我们回归到`HOC`的一大特点中来：它能够帮助我们**复用组件逻辑**。而前面提到的这些只是它的一些具体用法。

就像我们想要实现`操作props添加属性`这个功能一样：

```jsx
class A extends React.Component {
  render () {
    return <div>我是组件A, 我需要公共的属性{this.props.commonProps}</div>
  }
}
class B extends React.Component {
  render () {
    const newProps = { // 重点看这里
      ...this.props,
      commonProps: '我是公共的属性'
    }
    return (
      <div>
        组件B
        <A {...newProps}></A>
      </div>
    )
  }
}
export default B;
```

在使用的时候：

```jsx
<B id={1}></B>
```

此时组件`A`中的`props`也是能接收到`id`和`commonProps`的，这就是一个很常见的透传`props`的情景。

但如果此时另一个组件`C`想要和组件`A`有一样的`commonProps`的话，或者组件`D`，组件`E`也想要有，而这时候你可能会想到把这些公共的属性提取出来放到一个地方统一管理，然后利用上面这种透传`props`的方式来做。

唔，不久之后，你的代码可能就会变成这样了：

(额，下面的组件A和组件B和上面那个案例就没有关系了)

```jsx
// 一套很复杂的逻辑得到的 commonProps
const commonProps = {
	looks: 'handsome',
	character: 'lively'
}

function TestComponent () {
  return (
    <>
    	/* 一些公共的外壳 */
      <div className='commonWrapped'>
      	<A {...commonProps}></A>
    	</div>
    	<div className='commonWrapped'>
      	<B {...commonProps}></A>
    	</div>
    	<div className='commonWrapped'>
      	<C {...commonProps}></A>
    	</div>
    	<div className='commonWrapped'>
      	<D {...commonProps}></A>
    	</div>
    </>
  )
}
```

此时，让我们来看看用`HOC`可以怎样做：

```jsx
function MyHOC (WrappedComponent) {
  // 一套很复杂的逻辑
  const commonProps = {
    looks: 'handsome',
    character: 'lively'
  }
  render () {
    return (
      <div className='commonWrapped'>
      	<WrappedComponent />
      </div>
    )
  }
}
function TestComponent () {
  return (
    <>
    	{MyHOC(A)}
      {MyHOC(B)}
      {MyHOC(C)}
      {MyHOC(D)}
    </>
  )
}
```

高端、霸气、上档次！

而且对于一些复杂逻辑和公共的部分我们都可以在`MyHOC`中统一的管理，老大说：这就是我想要看到的代码。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce721d3907954265a7db5671794ac991~tplv-k3u1fbpfcp-zoom-1.image)



#### 4.2 组件日志打点

这个用法的灵感其实来自于上面`2.2.1 操作state`，对于一些页面或者组件，我们可能需要记录用户行为，来进行一些日志打点的操作。这时候我们可以定义一个`logHOC`来帮助我们复用这个逻辑，就像下面的这段代码，可以帮我们查看组件的渲染时间和调用到销毁的记录：

```jsx
import React from 'react';

function logHOC (WrappedComponent) {
  return class extends React.Component {
    start;
    end;
    componentWillMount() {
      this.start = Date.now();
    }
    componentDidMount() {
      this.end = Date.now();
      console.log(`${WrappedComponent.dispalyName} 渲染的时间：${this.end - this.start} ms`);
      console.log(`调用了${WrappedComponent.dispalyName}`);
    }
    componentWillUnmount() {
      console.log(`销毁了${WrappedComponent.dispalyName}`);
    }
    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}
class TestComponent extends React.Component {
  render () {
    return(
      <div>TestComponent1</div>
    )
  }
}
const FinalComponent = logHOC(TestComponent);
export default FinalComponent;
```





## 5. 使用HOC需要注意的点

虽说`HOC`的好处非常多，但其实也还是有一些需要注意的点，就像是下面👇这些情况：

一、不要在`render`函数内内创建高阶组件

对于高阶组件，我们每次调用它生成的都是一个全新的组件，这样组件的唯一标识也就变了，所以如果在`render`中调用了高阶组件，将会导致组件每次都卸载后重新挂载。



二、不要去改变原始的组件

因为官方对于高阶组件的定义是：`高阶组件就是一个没有副作用的纯函数。`

并且对于纯函数：

> 如果函数的调用参数相同，则永远返回相同的结果。它不依赖于程序执行期间函数外部任何状态或数据的变化，必须只依赖于其输入参数。 该函数不会产生任何可观察的副作用，例如网络请求，输入和输出设备或数据突变。

所以如果对原组件修改了就违背了我们高阶组件的定义，但是你可以去**加强**它，这和**改变**原组件不一样。



三、透传不相关的`props`

这点我认为也是需要遵守的，因为当我们在使用高阶组件的时候，可能有些`props`你在`HOC`并不用到，但是你还是得将它透传给原组件去。



## 参考文章

- [【React深入】从Mixin到HOC再到Hook](https://juejin.im/post/6844903815762673671)
- [React高阶组件(HOC)的入门及实践](https://juejin.im/post/6844904050236850184)
- [React文档cloneElement](https://zh-hans.reactjs.org/docs/react-api.html#cloneelement)



## 后语

你盼世界，我盼望你无`bug`。这篇文章就介绍到了这里。

总算是写完了😂，能看到最后的你也很厉害。因为呆呆也是最近才转的`React`，可以看到它真的很灵活，也很有意思，但想要真正的学好它可能还有很长的路要走，包括我自己也是，所以：**路漫漫其修远兮，一起入坑乎？**，哈哈哈。

最后，我们是**希沃ENOW大前端**，如果觉得本文对你有帮助的话，唔，你懂得[奸笑～]，下周再见了👋拜拜。

