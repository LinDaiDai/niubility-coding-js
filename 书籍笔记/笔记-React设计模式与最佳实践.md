# 笔记-React设计模式与最佳实践

## 一、React基础

#### 命令式编程与声明式编程的区别？

一句话概括：**命令式编程描述代码如何工作，而声明式编程则表明想要实现什么目的。**

##### 从实际案例的角度

两者之间一个简单的案例：去酒吧喝啤酒。

若是命令式编程，你需要对服务员做出指令：

`"从抽屉里拿出一个空酒杯"`

`"从酒架上取下一瓶威士忌"`

`"打开威士忌并把酒倒满"`

`"把酒递给我"`

但对于声明式编程，我只需要对服务员说：`"请给我一杯威士忌"`。

##### 从代码的角度

- 遍历函数的案例

命令式：

```javascript
const toLowerCase = input => {
  const output = []
  for (let i = 0l i < input.length; i++) {
    output.push(input[i].toLowerCase())
  }
  return output;
}
```

声明式：

```javascript
const toLowerCase = input => input.map(
  value => value.toLowerCase()
)
```

- 生成地图的案例

命令式：

```javascript
const map = new google.maps.Map(document.getElementById('map'), {
  zoom: 4,
  center: myLatLng,
})

const marker = new google.maps.Marker({
  position: myLatLng,
  title: 'LinDaiDai',
})

marker.setMap(map)
```

声明式：

```jsx
<Gmaps zoom={4} center={myLatLng}>
  <Marker position={myLatLng} title="LinDaiDai" />
</Gmaps>
```



通过这两个案例，我们可以看到两者的区别：

- 命令式有时候需要更多的精力才能够理解，而后者则更加的简洁、易读，从可维护性上来说很重要；
- 声明式在大多数时候无须使用变量，也不需要在执行过程中持续更新变量的值，它也让我们在实际编程中避免了创建和修改状态；
- `React`组件就是一种声明式编程，开发人员只需要描述他们想要实现什么目的，而无须列出实际效果的所有步骤，最终的代码也很简单，可维护性也更强。



