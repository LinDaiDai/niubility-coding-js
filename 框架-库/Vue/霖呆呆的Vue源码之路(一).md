## 霖呆呆的Vue源码之路(一)

### Vue源码从哪里开始看？

去`GitHub`上把`Vue`源码这个项目下载到本地：[https://github.com/vuejs/vue](https://github.com/vuejs/vue)

以下教材案例中讲解的版本是为`2.6.11`。

`Vue`源码是基于`Rollup`构建的，它构建相关的配置都在`scripts`目录下。

通常，我们查看一个基于`NPM`托管的项目都会有一个`package.json`文件，它记录的是对这个项目的描述。

所以首先让我们找到项目的根目录中的`package.json`，然后查询到它的`scripts`属性，找到`build`指令，看看它指向的是哪个文件：

```json
{
  scripts: {
    "build": "node scripts/build.js",
    "build:ssr": "npm run build -- web-runtime-cjs,web-server-renderer",
    "build:weex": "npm run build -- weex",
  }
}
```
然后通过以下过程的查找，找到`Vue`这个构造函数：

```
scripts/build.js => scripts/config.js => src/platforms/web/runtime/index.js => 
src/core/index.js => src/core/instance/index.js
```
可以看到，`src/core/instance/index.js`中导出的就是一个`Vue`构造函数。只不过在最终导出`Vue`的时候会经过一系列的处理。

![image.png](https://upload-images.jianshu.io/upload_images/7190596-6ea5100d82c071c5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

小提示⏰：如果你是使用`vscode`查看`Vue`源码的话，`js`文件中有`ts`语法时，`vscode`会提示错误，此时可以在`vscode`的`setting.json`中添加这么一个配置:

```javascript
{
  "javascript.validate.enable": false, // 禁用默认的 js 验证
}
```

当然还有说可以：设置中搜索tsconfig ->Check JS Experimental Decorators 去掉勾选。

![image.png](https://upload-images.jianshu.io/upload_images/7190596-7db71db8c8e09897.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

(但是我试了这样没有效果...)

记住，当我们在看源码的时候，看任何一个复杂的函数时，我们找到自己想要看的东西才是关键，其它的非关键的内容你大可不必太过关注它，如果你是一行一行的看并且又试图一次性全部搞懂的话那会非常的吃力，所以我们应该是要抱有目的性的去看源码，例如我今天是想要了解`Vue`的响应式原理，那我大部分的精力肯定就都是在解决`数据是什么时候被劫持的？`，`依赖收集又是怎样实现的呢？`这类的问题上。



### 初始化Vue构造函数时会做哪些事？

初始化Vue构造函数，也就是还未使用`new Vue()`的时候，会做这么几件事：

- 调用一些以`Mixin`命名的函数，为`Vue.prototype`上添加实例方法
- 调用`initGlobalAPI`函数，为`Vue`构造函数添加静态方法
- 当然还有初始化`createPatchFunction、strats类、createCompilerCreator编译器`等



#### 为Vue.prototype上添加实例方法

`Vue`这个构造函数在创建的时候，会调用一些以`Mixin`命名的函数，为`Vue.prototype` 上添加方法，例如：

1. `initMixin`: 给原型上添加`_init`方法，用于`Vue`构造函数实例化对象的时候用。
2. `stateMixin`: 给原型上添加`$set、$delete、$watch`方法
3. `eventsMixin`: 给原型上添加`$on、$off、$once、$emit`方法
4. `lifecycleMixin`: 给原型上添加`_update,$forceUpdate,$destroy`方法
5. `renderMixin`: 给原型上添加`_o,_n,_s,_l,_t,_q,_i,_m,_f,_k,_b,_v,_e,_u,_g,$nextTick,_render`方法

对应着源码的位置就是：

![image.png](https://upload-images.jianshu.io/upload_images/7190596-ac98e707152dec4a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```
src/core/instance/index.js
```

记不住没有关系，你脑子里就想一下大概是做了这么一个事就可以了，比如`eventsMixin`这个方法，往总体看，它内部其实很简单：

```javascript
export function eventsMixin (Vue) {
  Vue.prototype.$on = function () {}
  Vue.prototype.$off = function () {}
  Vue.prototype.$once = function () {}
  Vue.prototype.$emit = function () {}
}
```
所以你会发现这些都是我们很容易就看得懂的东西，不就是给`Vue`这个构造函数的原型对象上添加一些属性和方法吗，那么如果我们`new Vue()`一个实例的时候，这个实例就可以继承到这些属性和方法了。




#### 为Vue构造函数添加静态方法

同时，也会调用`initGlobalAPI`函数，为`Vue`构造函数上添加静态方法，例如：

1. 添加`Vue.set`静态方法，用于更新视图
2. 添加`Vue.delete`静态方法，用于删除数据
3. 添加`Vue.nextTick`静态方法，用于更新视图后回调递归
4. 添加`Vue.options`静态属性，并且在该对象中添加`components,directives,filters`静态对象 记录静态组件
5. 添加 `Vue.use、 Vue.mixin、Vue.extend`静态方法等等...

对应这源码调用的位置就是：

![image.png](https://upload-images.jianshu.io/upload_images/7190596-04daa48dc2ca3308.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```
src/core/index.js
```

看懂了之前的给`Vue.prototype`上添加实例方法，那么这里添加静态方法也很好理解了，我们知道，实例方法和静态方法的区别就是：

- 实例方法是定义在实例对象或者实例对象的原型链上的方法，实例对象可以调用它
- 静态方法是定义在构造函数上的方法，并不能被实例对象所调用

(什么？你还不懂其中的区别？那你可得好好看看霖呆呆的这篇文章了：[【何不三连】比继承家业还要简单的JS继承题-封装篇(牛刀小试)](https://juejin.im/post/5e707417e51d45272054d5d3))

那么这里的`initGlobalAPI`从整体看，也非常的简单：

```
export function initGlobalAPI (Vue) {
  // ...
  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick
  // ...
}
```



### new Vue实例化对象时会做哪些事？

当`new Vue`实例化对象的时候，最主要的就是执行`this._init()`方法，这个方法是在上面👆「初始化Vue构造函数」时调用`initMixin()`函数时给`Vue.prototype`上添加的，对应这伪代码就是：

*src/core/instance/index.js*
```javascript
import { initMixin } from './init'

function Vue (options) {
  this._init(options)
}
initMixin(Vue)

export default Vue
```
*src/core/instance/init.js*
```javascript
export function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    // 初始化实例对象的代码...
  }
}
```
所以当我们在执行`new Vue()`的时候，最关键的就是执行`_init()`函数。

而在此`_init()`函数中主要会做这么几件事：

1. 给`vm`上添加`$options`，如果是非`Component`的话调用`mergeOptions`合并参数
2. 初始化生命周期`initLifecycle`
3. 初始化事件`initEvents`
4. 初始化渲染`initRender`
5. 调用`callHook`函数触发`beforeCreate`钩子函数
6. 调用`initInjections`获取到父组件的`provide`值并加入观察者中
7. 调用`initState`，初始化`data、props、methods、computed、watch`，并为`Vue`实例化对象`vm`添加`watchers`观察者队列
8. 以及调用`initProvide`方法
9. 调用`callHook`函数触发`create`钩子函数


对应着源码的位置就是：

![image.png](https://upload-images.jianshu.io/upload_images/7190596-8054ed841e9fcf12.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



#### initState()方法做了哪些事？

这一章节主要是研究`Vue`的响应式原理，所以让我们着重看一下`initState()`方法，毕竟它里面初始化了`data、props、methods、computed、watch`这些东西，它所处的源码位置：

![image.png](https://upload-images.jianshu.io/upload_images/7190596-904059b109126200.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

OK👌，各个函数的作用其实不用我写备注你们也能看出来是什么意思了。

例如`initProps`就是初始化`props`，`initData`就是初始化`data`，这些函数命名都很友好 😊。

每种初始化函数中都有各自复杂的逻辑，让我们来看看这个`initData`方法吧，它应该就是初始化数据的关键了：

![image.png](https://upload-images.jianshu.io/upload_images/7190596-9ac2c84d530bc004.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

乍一看这个`initData`好像非常的复杂，但是其实我们只要把它拆成三部分来看就觉得它没什么了：

- 判断`data`是不是一个方法，如果是方法的话就调用`getData`方法，`getData`中会有一段关键的代码：`return data.call(vm, vm)`，也就是执行`data()`这个方法，这里其实很好理解，还记得我们在创建一个`vue`组件的时候，里面的`data`要求返回的是一个函数吗？那么这一步的作用相当于是拿到这个返回函数中的数据。
- 判断`data`中每个属性有没有什么特殊的情况，例如是否和`methods、props`中的属性重名了，以及不是以`$、_`开头的属性则调用`proxy`方法。
- 最重要的一步就是把数据添加到观察者中了，也就是执行`observer(data, true)`方法。

（`proxy()`方法是一个代理，它有什么作用呢？唔...比如一种场景：使得原本需要 `app._data.msg` 操作才会触发`set`, 简化为 `app.msg` 就可以触发`set`）




#### observe()方法做了哪些事？

既然已经说了响应式核心的一个方法就是这个`observe()`，那么先让我们来看看它会做哪些事呢？

首先让我们从输入，输出的角度来分析：

```javascript
// 输入：data 数据对象，也就是我们平常定义的:
data () {
  return {
    'msg': 'lindaidai'
  }
}
// 我们把这个对象简化为 { 'msg': 'lindaidai' }

// 输出：一个Observer类的对象，它大概长成这样：
{
  value: {
    msg: 'lindaidai',
    __ob__: {...}
  },
  dep: '<Dep>类型的对象',
  vmCount: 0
}
```

其次让我们对应着源码来看：

![image.png](https://upload-images.jianshu.io/upload_images/7190596-b9abdef3f001d871.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

可以很直观的看到，这个`observe()`方法也是可以拆成这三部分来看的：

- 判断该对象中是否有`__ob__`这个属性且已经是一个`Observer`实例对象了
- 经过一系列的判断，创建一个`Observer`实例对象
- `asRootData`为`true`则`vmCount++`

并最终将这个`ob`返回。

所以这里的`observe()`方法我把它认为是一个转化的中间人，它把原本的`data`变为了一个可观察的`Observer`实例对象，真正实现`依赖收集`的逻辑都在`Observer`这个类中。



#### Observer类是做什么的？

OK👌，其实不用我多说，你们也应该知道，`Observer`会对对象的每个属性进行劫持。



![9.png](https://upload-images.jianshu.io/upload_images/7190596-7435e598d93f3549.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> /src/core/instance/observer/index.js

- 判断`value`是不是数组，是的话则进行：
  - 有`__proto__`属性则进行原型链重写以此来检测数组变化
  - 若是没`___proto__`属性则复制属性
  - 调用`observeArray`进行循环遍历
- 否则执行`walk()`方法对`data`中的每个属性进行依赖收集



未完待续....