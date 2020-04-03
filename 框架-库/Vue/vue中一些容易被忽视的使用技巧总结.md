## vue中一些容易被忽视的使用技巧总结

### 前言

借着假期, 霖呆呆我静下心来好好的把`vue`文档又看了一遍, 发现相比于之前的版本(原谅我使用的还是"盘古开天"时的版本), 又新增了一些功能, 还有一些是我之前没太注意的内容, 所以借此整理了一下, 希望也能够帮助到你 😊.



### 一、指令

#### 动态参数

这个是`2.6.0`版本新增的功能. 作用主要是能让我们用方括号将一个`js`表达式扩起来, 然后将它作为一个指令的参数, 可以看下面👇这个案例🌰:

```vue
<a v-bind:[dynamicParam]="url"></a>
```

`dynamicParam` 是一个`js`变量, 比如你把它赋值为`dynamicParam="href"` 的话, 则最终这个绑定就等于:

```vue
<a v-bind:href="url"></a>
```

不仅如此, 你还可以将它用在**动态的事件绑定**上:

```vue
<a v-on:[eventName]="doSomething"></a>

<!--若 eventName 的值是 "click", 则等价于-->

<a v-on:click="doSomething"></a>
```

**注**⚠️

你应该尽量少的用以下这种写法:

```vue
<a v-on:['c' + eventName]="doSomething"></a>
```

实际上, 如果你用了`ESLint`的话, 它也会给出错误警告不让你这样写.

如果你的表达式确实很复杂的话, 可以采用**计算属性**的方式来代替它:

```vue
// 计算属性
computed: {
  eventName() {
  	return 'clic' + 'k'
  }
}
```



#### v-bind真/假值变更

在2.0中使用 `v-bind` 时，只有 `null`, `undefined`，和 `false` 被看作是假。这意味着，`0` 和空字符串将被作为真值渲染。比如 `v-bind:draggable="''"` 将被渲染为 `draggable="true"`。

对于枚举属性，除了以上假值之外，字符串 `"false"` 也会被渲染为 `attr="false"`。

但是值得注意的一点是, 对于其它钩子函数 (如 `v-if` 和 `v-show`)，他们依然遵循 js 对真假值判断的一般规则。



#### v-pre

**作用**: 跳过这个元素和它的子元素的编译过程

有时我们可能需要编译模版中不需要表达式计算:

```vue
<span v-pre>{{ msg }}</span>
```

上面👆这个`msg`并不会当成一个变量来渲染, 在页面中我们仍然可以看到:

```
{{ msg }}
```



### 二、计算属性

之前一直只会计算属性最基本的用法:

```javascript
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Lin',
    lastName: 'DaiDai'
  },
  computed: {
    fullName: function () {
      return this.firstName + ' ' + this.lastName
    }
  }
})
```

而忽略了它的`setter`用法, 它允许我们在计算属性发生改变的时候, 处理一系列事情.

比如我将上面👆的例子重写一下:

```javascript
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Lin',
    lastName: 'DaiDai'
  },
  methods: {
    doSomething() {
      this.fullName = 'Wang Peilin'
    }
  },
  computed: {
    fullName:{
      get: function() {
        return this.firstName + ' ' + this.lastName
      },
      set: function(newValue) {
        var names = newValue.split(' ')
        this.firstName = names[0]
        this.lastName = names[names.length - 1]
      }
    }
  }
})
```

我在页面上促发一下`doSomething()`这个方法, 改变`fullName`这个计算属性, 此时`setter`就会被调用, 从而改变`firstName和lastName`.

这个功能其实在实际开发中也是可能被用到的.



### 三、修饰符

#### .lazy 修饰符

假设我们有以下一段代码:

```vue
<input type="text" v-model="msg" @input="onInput" @change="onChange" />
{{ msg }}
```

当修改输入框值的时候, 是会同步修改数据`msg`, 然后使得下面`{{msg}}`的UI同步更新, 并且触发`@input`事件;

而如果加上`v-model.lazy`修饰符的话, `msg`这个变量就不会时时的更新, 而是当焦点离开输入框的时候才促发, 换句话说, 就是在触发`@change`事件的时候, 才同步更新`msg`变量.

#### .trim修饰符

这个修饰符用的就比较多了, 它的作用是**自动过滤用户输入的首尾空白字符**, 只要加上这个修饰符就可以避免你在`js`代码中写一串正则过滤了:

```vue
<input v-model.trim="msg">
```

#### .sync修饰符

此修饰符是针对于父组件与子组件数据传输时用的.

我们知道父组件与子组件进行数据传输的时候, `props`是单项的, 但是有时候我们想要达到一种“双向绑定”的效果, 我们可能要做此处理:

1.给子组件一个自定义事件, 将要改变的值传递出去:

```javascript
// text-document组件
this.$emit('update:title', newTitle)
```

2.父组件那边接收这个自定义事件和要改变的值:

```vue
// 父组件
<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>
```

而使用`.sync`修饰符就可以给你提供一个这样的缩写:

```vue
<text-document v-bind:title.sync="doc.title"></text-document>
```

它相当于给你省了一个自定义事件.



### 四、实例属性/方法

#### 以$和_开头的变量

我们知道, 在实例创建之后, 我们可以通过`vm.$data`访问原始数据对象. 而`Vue`实例也代理了`data`对象上的所有属性, 因此访问`vm.a`等价于访问`vm.$data.a`.

但是以`_`或者`$`开头的属性不会被`Vue`实例代理,因为它们可能和 Vue 内置的属性、API 方法冲突。

所以对于这种属性你必须用`vm.$data._a`这样的方式来访问:

```javascript
data () {
	return {
		$msg: "I'm msg"
	}
},
created () {
	console.log(this.$data.$msg);
}
```

当然在`template`中也得加上`$data`:

```vue
{{ $data.$msg }}
```

实际上, `ESLint`有一个配置就是限制用户定义以`$和_`开头的变量, 因此在开发中我们要避免使用这样的命名方式.

#### vm.$watch方法

每个`Vue`实例都提供了一个`watch`对象用来监听使用者需要监听的属性.

其实`Vue`也提供了一个`$watch`方法以便使用者在某一时刻来设置监听.

**语法**:

```
vm.$watch(expOrFn, callback, [options])

expOrFn: String | Function
callback: Object | Function
options: 可选, 提供 深度监听{boolean} deep 和 是否立即触发{boolean}immediate 两个选项
```



比如下面👇这个案例, 当用户点击按钮时才设置监听:

```vue
<template>
	<div>
    <button @click="setWatch">点击我进行监听</button>
		<button @click="handleUnWatch">点我取消监听</button>
  </div>
</template>
<script>
export default {
	data () {
    return {
      msg: '',
      unWatch: null
    }
	},
  methods: {
    setWatch () {
      var unWatch = this.$watch('msg', function (newValue, oldValue) {
				console.log('newValue', newValue)
      })
      this.unWatch = unWatch;
    },
    handleUnWatch () {
      this.unWatch()
    }
  }
}
</script>
```

同时`vm.$watch` 返回一个取消观察函数，用来停止触发回调.





### 五、组件

#### Prop验证

我们知道, 在给组件定义`props`的时候, 可以定义一些验证方式, 比如定义**类型检查、必填、默认值**等:

```javascript
Vue.component('my-component', {
	props: {
		// 类型验证、必填项、默认值
		propA: {
			type: Number,
			required: true,
			default: 100
		}
	}
})
```

其实你也可以**自定义验证函数**:

```javascript
Vue.component('my-component', {
	props: {
		// 自定义验证函数
		propB: {
			validator: function (value) {
				// 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
			}
		}
	}
})
```

**注**⚠️: 那些 prop 会在一个组件实例创建**之前**进行验证，所以实例的属性 (如 `data`、`computed` 等) 在 `default` 或 `validator` 函数中是不可用的。



### 六、配置

#### 如何配置webpack的`alias`

在开发中, 组件、方法之间相互引用, 如果都是用相对路径来引用的话过于麻烦了, 我们总是得关注文件位置之间的关系, 比如你常常会看到下面这种引入方式:

```javascript
import { setProperty } from './../utils/tools'
```

我们可以在webpack中配置一些属性, 让我们省去这种麻烦的引用, 而是采用更加简便的方式, 比如将`src`这个目录简写为`@`:

```javascript
import { setProperty } from '@/utils/tools'
```

配置方式:

1. 在项目根目录下创建一个`vue.config.js`文件
2. 在此文件中添加以下代码:

```javascript
const path = require('path')

const resolve = dir => path.join(__dirname, dir)

module.exports = {
	chainWebpack: config => {
		config.resolve.alias
			.set('@', resolve('src')),
			.set('@comp', resolve('src/components'))	
	}
}
```

也就是你可以通过`config.resolve.alias`来配置想要简化的文件路径.