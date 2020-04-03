## 前言
忙活完动态表单,动态附件,动态表格等等事情后,最近公司又在进军报表可视化问题了,对于我们前端而言如何将一份份数据美美的展示在页面上实为一项艰巨的任务.

对比了现有的几个比较有名的可视化工具之后,最终还是决定使用`G2`来进行项目开发.

`G2`的使用方式及作用我这里就不展开了,想了解的小伙伴可以撮这里: [vue中使用G2(一)](https://www.jianshu.com/p/377a52a2aabb)

该篇文章主要是记录一下近期在使用`G2`所遇到的一些比较坑的问题,如果正好你也在使用`G2`,且不巧的遇到了和我一样的问题,那么应该能帮助到你一些.

### 一、`forceFit`属性宽度自适应问题
在创建`chart`图表的时候,要是你图表的宽度设置为自适应模式,切页面为栏栅布局的时候,如下:
```javascript
const chart = new G2.Chart({
          container: 'g1',
          forceFit: true,
          height: 270
      })
```
将`forceFit`属性设置为`true`.
此时打开这个有图表的页面,会发现图表产生样式错乱的情况,比如这样:
![image.png](https://user-gold-cdn.xitu.io/2019/8/31/16ce34b261aab4c5?w=1240&h=430&f=png&s=60076)
canvas超出了父元素的宽度。如果改变浏览器的大小，window.resize的时候才会触发forceFit: true这个属性，才会自适应屏幕的宽度，这时图表的大小是正常的。

解决方式为:在vue生命周期mounted初始化图表之后,加入以下代码即可:
```javascript
const e = document.createEvent('Event')
e.initEvent('resize', true, true)
window.dispatchEvent(e)
```
比如我的项目中:
```javascript
mounted () {
  this.initComponent()
},
methods: {
  initComponent () {
    const chart = new G2.Chart({
          container: 'g1',
          forceFit: true,
          height: 270
    })
    const e = document.createEvent('Event')
    e.initEvent('resize', true, true)
    window.dispatchEvent(e)
    ...
}
```
此时页面正常了:
![image.png](https://user-gold-cdn.xitu.io/2019/8/31/16ce34b26d4c7e6d?w=1240&h=439&f=png&s=61133)

### 二、自定义图表的高度问题
如上所述, `G2`中提供了`forceFit` 属性使得图表宽度能自适应,但是在实际开发中我们可能希望图表的高度随父级容器的高度变化而变化.

文档中规定高度`height`属性必需传递一个数字.这样就打破了我想直接设置高度为`100%`的幻想.

既然高度必需规定为一个数字的话,那么我们就可以获取包裹图表的父元素的高度,然后再赋值给图表就可以了.
例如下面这个栗子🌰:
```vue
<template>
  <div ref="element" class="element">
    <div id="chart"></div>
  </div>
</template>
<script>
export default {
  mounted () {
    const offsetHeight = this.$refs.element.offsetHeight // 获取父级高度 200
    const chart = new G2.Chart({
      container: 'chart',
      forceFit: true,
      height: offsetHeight,
    })
    ....
  }
}
</script>
<style scoped>
.element {
  width: 300px;
  height: 200px;
}
</style>
```
**`vue`中获取元素高度的几种方式:**
例如下面的`DOM`:
```html
<div ref="element" class="element"></div>
<style>
 .element {
  width: 200px;
  height: 200px;
  background-color: red;
  padding: 10px;
}
</style>
```
1. 获取高度值 （内容高+padding+边框）
```
let height = this.$refs.element.offsetHeight // 220
```
2. 获取元素样式值 （存在单位）
```
let height = window.getComputedStyle(this.$refs.element).height // 200px
```
3. 获取元素内联样式值（存在单位, 非内联样式无法获取）
```html
<div ref="element" class="element" style="height: 300px;"></div>
<script>
  let height = this.$refs.element.style.height // 300px
</script>
```
不过我在项目中是将图表封装到了一个组件中,所以可以使用`$el`直接获取这个组件的属性.
```vue
<template>
  <div class='width_full height_full'>
    <div id="chart"></div>
  </div>
<script>
export default {
  mounted () {
    const offsetHeight = this.$el.offsetHeight // 获取组件高度
    const chart = new G2.Chart({
      container: 'chart',
      forceFit: true,
      height: offsetHeight,
    })
    ....
  }
}
</script>
</template>
```
该组件的高度由调用它的父级组件控制.

### 三、图表内容太小变形问题
在使用图表时,有时候可能需要一些特别小的图作为仪表盘看板的一部分.比如构建一个宽`200px`,高`150px`的图表,此时图表会出现挤压变形的情况.

我在最开始遇到这个问题的时候也是各种找解决方案.最终还是在`G2`的`Issues`上找到了解决方案.只需要在创建图表的时候,将`padding`设置为`auto`就可以了,如下:
```javascript
  const chart = new G2.Chart({
      container: 'chart',
      widht: 200,
      height: 150,
      padding: 'auto' // 为了防止小图时图表变形
    })
```

### 四、字段格式为时间戳报错
若是x轴字段的格式为时间戳:
```javascript
2019-09-17
2019.09.17
```
比如后台给我的数据结构为:
```javascript
[
  {
    time: '2019-09-17',
    amount: 100
  },
  {
    time: '2019-09-18',
    amount: 200
  }
]
```
`G2`中需要生成一张柱状图
此时,控制台会报错:
![image.png](https://user-gold-cdn.xitu.io/2019/8/31/16ce34b292d1c3e5?w=1102&h=130&f=png&s=28844)
解决方案:
x 轴默认为解析为 time linear 类型了，这个类型不能堆叠。

将 x 轴scale 配置为 catTime 就可以。

在创建的图表的时候,添加上:
```javascript
chart.scale('time', { // time为你的x轴时间的字段
    type:'timeCat'
 })

// 若是使用options配置, 则添加:
options: {
  scales: {
    time: {
      type: 'timeCat'
    }
  }
}
```
## 后语
项目还在开发中,对于我来说`G2`还有很多需要掌握的,后期使用上要是还遇到比较坑的点还会在此篇文章上进行更新.

很多时候解决问题的方案可能是你在深夜中辗转难眠时的灵光乍现,也可能是在地铁上刷博客时的惊鸿一瞥,希望这篇文章也能成为你的惊鸿一瞥.