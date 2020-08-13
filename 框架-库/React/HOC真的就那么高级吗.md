## HOC真的就那么高级吗？(React实际案例详解)

## 前言

你盼世界，我盼望你无`bug`。Hello 大家好！我是霖呆呆。

在正式开始之前，呆呆冒死回答一下标题的问题吧...是的！它很高级😅。

表情包去你妈的

所以这篇文章我会从它是什么、怎么用它、用它需要注意什么等方面详细的去讲解，尽量让大家都能理解。

**适宜人群**：能看得懂一些`React`的靓仔、靓妹。

来看看通过阅读本篇文章我们可以学习到：

- HOC的概念
- HOC最基本的使用



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
test2()('学习不爱我'); // 理解打印
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

表情包不要着急



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

表情包开心

好的👌，呆呆既然已经告诉了你们这种全新的使用方式了，那你能想到通过这种名为`"属性代理"`的东西能让我们做哪些好玩有趣的事吗？

首先第一点呆呆来给你起个头：在我们定义的高级组件的那个函数中，是可以对要返回的组件的属性进行二次加工的，那我们是不是就可以给`this.props`添加上一些新的属性，并传递给`WrappedComponent`？OK👌，让我们来看看`"属性代理"`它的第一种用法。



#### 2.1.1 操作props

就像上面👆说的，我们可以给`this.props`添加上一些新的属性并向下传递，但是这个添加不是让你去直接修改`this.props`哈，比如下面👇这种用法肯定就是不行的了：

```javascript
render () {
 this.props.remark = '别自闭'
 return <WrappedComponent {...this.props} />
}
```

因为`React`是单向数据流，它不允许你去修改`props`，因此你会发现控制台直接就报错了：

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

表情包休息时间



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

表情包嘿嘿



#### 2.1.3 条件渲染

其实有了**组合渲染**，条件渲染这种用法我们也很好理解了，甚至我在听到这个词的时候，脑子里已然能想到可以怎么去做了。

最简单的一种，我们可以通过三元运算符判断组件是否渲染(咳咳，这个三元不是神三元哈😅)：

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

通过判断传递进来的`flag`的值来决定渲染出什么内容。

其实大家可以发现，这些用法并没有想象的那么难。可能也有小伙伴会问了，如果只是想要实现一个这样的条件渲染，我不用高级组件，写在每个组件里也可以实现呀。

没错，是有很多的办法可以实现，呆呆也没说非得使用高阶组件，只不过这确实是我们实现功能的一种方式。



#### 2.1.4 状态管理(抽象state)

还有一种用法被称之为`状态管理`，有的教材里也叫做`抽象state`。刚开始听到这个词可能不太好理解，不过如果大家知道它是怎样用的话读懂这个命名就很简单了。

在继续讲解之前，呆呆得先向大家介绍一下`受控组件`和`非受控组件`。有的小伙伴可能听过这两词，有的可能没有。不过没关系，呆呆在这里统一讲解。



### 多参数HOC



### 包装显示名





### 注意事项

