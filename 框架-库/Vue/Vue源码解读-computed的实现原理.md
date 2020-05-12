## Vue源码解读-computed的实现原理

### 一、computed是什么？

先让我们快速的回忆一下computed是做什么的。

计算属性允许我们对指定的视图，复杂的值计算。这些值将绑定到依赖项值，只在需要时更新。

例如下面这个案例：

```vue
<div id="app">
  <span @click="change">{{sum}}</span>
</div>
<script src="./vue2.6.js"></script>
<script>
  new Vue({
    el: "#app",
    data() {
      return {
        count: 1,
      }
    },
    methods: {
      change() {
        this.count = 2
      },
    },
    computed: {
      sum() {
        return this.count + 1
      },
    },
  })
</script>
```



### 二、什么时候进行的初始化？

computed的初始化是在initState()方法中调用initComputed()来进行的。

发生在initProps() 、initMethods() 和 initData() 之后。

对应的源码位置为：

![]()



### 三、初始化时做了哪些事？

初始化computed主要是调用initComputed()方法，对于这个方法我们可以来写一些伪代码：

```

```

