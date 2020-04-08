### 1. reduce方法有初始值和没有初始值的区别？

`reduce`函数的第一个参数是一个回调函数，第二个参数为可选的初始值。

如果有初始值的话，回调函数就会从数组的第0项开始执行，也就是会执行`arr.length`次；

但是如果没有初始值的话，会默认取数组的第0项为初始值，回调函数会从数组的第1项开始执行，也就是会执行`arr.length - 1`次。

这点从我们手写一个`reduce`的实现就可以看出来，代码如下：

```javascript
Array.prototype.MyReduce = function (fn, initialValue) {
  var arr = Array.prototype.slice.call(this);
  var pre, startIndex;
  pre = initialValue ? initialValue : arr[0];
  startIndex = initialValue ? 0 : 1;
  for (var i = startIndex; i < arr.length; i++) {
    pre = fn.call(null, pre, arr[i], i, this)
  }
  return pre
}
```

过程分析：

- 首先，`map、reduce`这种方法都是数组原型对象上的方法，所以我将`MyReduce`定义在`Array.prototype` 上，这样你就可以直接使用`ary.MyReduce()`这样的方式调用它了(`ary是一个类似于这样的数组[1, 2, 3]`)。
- 对于参数，我们参考原生`reduce`，它接收的第一个参数是一个回调函数，第二个是初始值
- 而`var arr = ...`的作用是获取调用`MyReduce`函数的那个变量，也就是说`this`会指向那个变量，例如`ary.MyReduce()`，那么此时`this`就为`ary`。
- 至于为什么不使用`var arr = this;`的方式而是使用`Array.prototype.slice.call(this)`，算是实现一个浅拷贝吧，因为`reduce`是不会改变原数组的。
- 然后就是定义传入`reduce`中的回调函数的第一个参数`pre`，也就是上一次运行结果的返回值，可以看到这里就用到了初始值`initialValue`，如果存在初始值就取初始值，不存在则默认取数组第`0`项。(当然这里直接用`initialValue ?`来判断存不存在并不准确，因为我们知道`0`也会被判断为`false`)
- 接着是定义循环开始的下标`startIndex`，若是不存在初始值，则初始值是会取数组中的第`0`项的，相当于第`0`项并不需要运行，所以`startIndex`会是`1`，而如果有初始值的话则需要将数组的每一项都经过`fn`运行一下。
- 最后，`for`循环中使用`fn.call()`来调用`fn`函数，并且最后一个参数是要把原来的数组传递到回调函数中，也就是这里的`this`。

