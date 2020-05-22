## Vue源码解读-watch的实现原理

我们正常在使用`watch`的时候是这样使用的：

```javascript
watch: {
  watch1 (val) {
    console.log('简单的监听')
  },
  watch2: {
    handler (val) {
      console.log('深度监听')
    },
    deep: true
  }
}
```

在初始化的阶段，也就是`initState()`函数中，会调用`initWatch()`方法初始化`watch`。

这个方法中会遍历`Vue`组件中的`watch`项，为每一项执行`$watch`方法并返回执行结果。

`$watch`是在初始化`Vue`构造函数的时候调用`stateMixin()`方法时添加到`Vue.prototype`上的。

而在这个方法中呢，会创建一个`new Watcher()`，也就是`Watcher`实例对象，并且把`user`属性设置为`true`，最后返回一个卸载`watcher`的方法(也就是会调用`watcher.teardown()`方法)

所以核心就是在于创建`Watcher`实例对象，创建这个实例对象的时候会将`Dep.target`设置为此实例对象，并对它所依赖的一些属性(`data`或者`props`)执行依赖收集，将这个`Watcher`实例对象放到它们的`dep.subs`列表中，这样当这些属性发送改变的时候就能通知`Watcher`实例对象调用它的`update()`方法来进行批量异步更新了。

批量异步更新的过程中是会调用`watcher.run()`方法，也就是执行了`watcher`中的回调函数`cb`。

而对于取消观察的方法实现起来就很简单了，只需要遍历`watcher`的`deps`列表，也就是`watcher`的所有依赖属性。将此`watcher`从这些依赖属性的`subs`列表中移除就可以了。

