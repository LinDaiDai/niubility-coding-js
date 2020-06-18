## React入门

### 组件

组件允许你将UI拆分为独立可复用的代码片段，每个片段进行独立构思。

> 组件，从概念上类似于 JavaScript 函数。它接受任意的入参（即 “props”），并返回用于描述页面展示内容的 React 元素。

- 函数组件

  ```javascript
  function Welcome (props) {
  	return <h2>Hello, {props.name}</h2>;
  }
  ```

- class组件

  ```javascript
  class Welcome extends React.Component {
  	render () {
  		return <h2>Hello, {this.props.name}</h2>;
  	}
  }
  ```

以上两个组件是等效的。

**注意：** 组件名称必须以大写字母开头。

React 会将以小写字母开头的组件视为原生 DOM 标签。例如，`` 代表 HTML 的 div 标签，而 `` 则代表一个组件，并且需在作用域内使用 `Welcome`。



### State

正确的使用`setState()`：

- 不要直接修改`State`：

   ```javascript
  // 错误
  this.state.msg = 'LinDaiDai'
  
  // 正确
  this.setState({ msg: 'LinDaiDai' })
   ```

- `State`的更新可能是异步的，如果更新的`state`中有依赖到`state`或者`props`则可以用函数：

  ```javascript
  // 错误
  this.setState({
  	counter: this.state.counter + this.props.increment
  });
  
  // 正确
  this.setState((state, props) => ({
  	counter: state.counter + props.increment
  }));
  
  // 使用普通函数也可以
  this.setState(function(state, props) {
    return {
      counter: state.counter + props.increment
    };
  });
  ```

- `State`的更新可能会被合并

  当你调用 `setState()` 的时候，React 会把你提供的对象合并到当前的 state。

  例如，你的 state 包含几个独立的变量：

  ```react
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
  }
  ```

  然后你可以分别调用 `setState()` 来单独地更新它们：

  ```javascript
    componentDidMount() {
      fetchPosts().then(response => {
        this.setState({
          posts: response.posts
        });
      });
  
      fetchComments().then(response => {
        this.setState({
          comments: response.comments
        });
      });
    }
  ```

  这里的合并是浅合并，所以 `this.setState({comments})` 完整保留了 `this.state.posts`， 但是完全替换了 `this.state.comments`。

  https://react.docschina.org/docs/state-and-lifecycle.html#state-updates-are-merged



### 事件

解决事件中`this`绑定的问题，如果不想用`bind`显式绑定的话，可以使用下面两种方式：

- `class fields`语法：

  ```react
  class LoggingButton extends React.Component {
    // 此语法确保 `handleClick` 内的 `this` 已被绑定。
    // 注意: 这是 *实验性* 语法。
    handleClick = () => {
      console.log('this is:', this);
    }
  
    render() {
      return (
        <button onClick={this.handleClick}>
          Click me
        </button>
      );
    }
  }
  ```

- 在回调中使用箭头函数

  ```react
  class LoggingButton extends React.Component {
    handleClick() {
      console.log('this is:', this);
    }
  
    render() {
      // 此语法确保 `handleClick` 内的 `this` 已被绑定。
      return (
        <button onClick={() => this.handleClick()}>
          Click me
        </button>
      );
    }
  }
  ```

  > 此语法问题在于每次渲染 `LoggingButton` 时都会创建不同的回调函数。在大多数情况下，这没什么问题，但如果该回调函数作为 prop 传入子组件时，这些组件可能会进行额外的重新渲染。我们通常建议在构造器中绑定或使用 class fields 语法来避免这类性能问题。

