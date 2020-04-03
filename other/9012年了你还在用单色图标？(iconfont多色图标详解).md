## 前言
记录`iconfont`的三种使用方式
多色图标出来已经很久了，现在才拿出来说貌似有点过时...
但为了方便自己以后知道怎么使用，也为了让更多刚入门的新手熟悉`iconfont`，还是决定写一篇比较详细的文章来记录它的使用方式。
本文主要是参考花叔的文章：[手摸手，带你优雅的使用 icon](https://juejin.im/post/59bb864b5188257e7a427c09)

## 前期准备
在[iconfont]([https://www.iconfont.cn/](https://www.iconfont.cn/)
)官网上创建一个自己的账号，并创建一个项目。在官网上挑选响应的图标添加进项目中。比如我这里有一个名为`vuepress-bolg`的项目，添加了一个`github`的图标。
![image.png](https://upload-images.jianshu.io/upload_images/7190596-3af9eb6b121c043f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## unicode
最基础的一种使用方式，就是使用`unicode`。
它的主要**优点**是：
- 兼容性最好，支持ie6+
- 支持按字体的方式去动态调整图标大小，颜色等等
但是**缺点**也很明显：
- 不支持多色图标
- 在不同的设备浏览器字体的渲染会略有差别，在不同的浏览器或系统中对文字的渲染不同，其显示的位置和大小可能会受到font-size、line-height、word-spacing等CSS属性的影响，而且这种影响调整起来较为困难
**第一步**
在你项目的css中引入字体
如果你的项目是使用像`vue`这样的前端框架开发的话，你可以在公共的`css`中引入它：
比如我的`vue`项目下有一个`common.css`:
```css
/* common.css */

@font-face {
  font-family: 'iconfont';  /* project id 872514 */
  src: url('//at.alicdn.com/t/font_872514_urq1z9ughp.eot');
  src: url('//at.alicdn.com/t/font_872514_urq1z9ughp.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_872514_urq1z9ughp.woff') format('woff'),
  url('//at.alicdn.com/t/font_872514_urq1z9ughp.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_872514_urq1z9ughp.svg#iconfont') format('svg');
}
```
**注**：上面的内容不是复制我的，而是复制你在`iconfont`项目上`Unicode`下的内容。这段代码的作用是远程的引入`iconfont`  字体。你可以不需要下载到本地。
**第二步**
定义字体
将字体引入到了项目中的话，你需要定一个类，让它的字体类型为`iconfont`：
```css
/* common.css */

@font-face {
  font-family: 'iconfont';  /* project id 872514 */
  src: url('//at.alicdn.com/t/font_872514_urq1z9ughp.eot');
  src: url('//at.alicdn.com/t/font_872514_urq1z9ughp.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_872514_urq1z9ughp.woff') format('woff'),
  url('//at.alicdn.com/t/font_872514_urq1z9ughp.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_872514_urq1z9ughp.svg#iconfont') format('svg');
}
.icon-online { /* 定义一个类 */
  font-family:"iconfont" !important;
  font-size:16px;
  font-style:normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
```
由于我的字体是远程引入的，所以这里我就取名为`icon-online`，当然你也可以使用其它的命名。
**第三步**
页面上使用`unicode`
```
<i class="icon-online">&#xe68c;</i>
```
创建一个`i`标签，然后给它设置`class`，之后在标签中写上你要使用的字体的代码。这样在页面上显示的就是你在对应的图标啦。
可以看到上面的这种`unicode`有一个很大的弊端，就是你看到代码里的这串`&#xe68c;`，根本不知道它是个什么图标，需要打开`iconfont`在你的项目上找对应的代码才知道。所以有了另一种`font-class`的方式。

## font-class
第二种方式就是使用`font-class`
它的**优点**是：
- 兼容性良好，支持ie8+
- 相比于unicode语意明确，书写更直观。可以很容易分辨这个icon是什么。
**第一步**
找到`iconfont`项目下的`Font class `,并复制它：
![fontClass](https://upload-images.jianshu.io/upload_images/7190596-c5a4f828bb5dddcb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
然后在`css`中引用：
```css
/* common.css */

@import "//at.alicdn.com/t/font_872514_urq1z9ughp.css";
@font-face {
  font-family: 'iconfont';  /* project id 872514 */
  src: url('//at.alicdn.com/t/font_872514_urq1z9ughp.eot');
  src: url('//at.alicdn.com/t/font_872514_urq1z9ughp.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_872514_urq1z9ughp.woff') format('woff'),
  url('//at.alicdn.com/t/font_872514_urq1z9ughp.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_872514_urq1z9ughp.svg#iconfont') format('svg');
}
.icon-online { /* 定义一个类 */
  font-family:"iconfont" !important;
  font-size:16px;
  font-style:normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
```
**第二步**
然后你在使用的时候就可以将`unicode`的方式改为`font-class`啦：
```
<i class="icon-online icon-github"></i>
```
**注意⚠️**：
不过你的前端项目要是用到了多组`iconfont`，一定要主要命名空间的问题。

不管是`unicode`还是`font-class`都只支持单色的图标，设置了`iconfont`的`i`标签其实就相当于一个字了，也就是可以根据`color`来控制它的字体颜色。但是你并不能使用多色。
## symbol
随着`IE`慢慢的退出历史舞台，`svg-icon`使用形式慢慢成为主流和推荐的方法。
它主要有一下几个**优点**：
- 支持多色图标了，不再受单色限制。
- 支持像字体那样通过font-size,color来调整样式。
- 支持 ie9+
- 可利用CSS实现动画。
- 减少HTTP请求。
- 矢量，缩放不失真
- 可以很精细的控制SVG图标的每一部分
使用方式：
**第一步**
引入`js`
引入的方式有两种：
1. 在`iconfont`的项目里，点击下载至本地，它会把这个项目相关的字体文件都下载下来。找到下载下来里面的`iconfont.js`文件，把它拷贝到你的前端项目里(只需要拷贝这一个文件就可以了)，然后在前端代码里引用这个`js`:
```
<script src="./iconfont.js"></script>
```
2. 远程引入，不需要下载这个`iconfont.js`，而是直接用`iconfont`项目里生成的那个地址：
```
<script src="//at.alicdn.com/t/font_872514_urq1z9ughp.js"></script>
```
**第二步**
设置通用的类名
```css
/* common.css */
.icon {
       width: 1em; height: 1em;
       vertical-align: -0.15em;
       fill: currentColor;
       overflow: hidden;
    }
```
**第三步**
挑选相应图标并获取类名，应用于页面：
```html
<div>
  <svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-github"></use>
  </svg>
</div>
```
**注意⚠️**
在`xlink:href="#"`后面接的就是你图标的`font-class`，比如我这里`github`的图标就是`icon-github`。前缀`icon-`并不是所有图标都会有，要根据自己图标的`font-class`来填写它。
另外，使用`symbol`这种方式是不需要引用`woff|eot|ttf|`这些字体库的，也就是上面的`unicon`和`font-class`两步都可以省去。

现在你可以去`iconfont`彩色图标库挑选你想要的彩色图标应用在页面中啦。
## 创建公共的多色图标组件
完成上面的第三步，你已经可以在项目中使用多色的图标了。
但是作为一个有"追求"的前端，怎么能允许在每次要用到图标的时候就写那么一长串的`html`标签呢。我相信，你首先想到的就是把它封装成一个组件。(如果你真的想到了，恭喜你，和我心有灵犀🧡)
下面以在`vue`中创建多色图标组件为例：
**第一步**
> 创建`IconSvg`组件

首先在你的组件文件夹中创建一个`IconSvg.vue`文件：
```vue
<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
export default {
  name: 'icon-svg',
  props: {
    iconClass: {
      type: String,
      required: true
    }
  },
  computed: {
    iconName() {
      return `#${this.iconClass}`
    }
  }
}
</script>

<style>
.svg-icon {
  width: 1em;
  height: 1em;
  font-size: 18px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
```
**第二步**
> 注册为全局组件

由于多色图标可能会在多处使用，所以我建议你将这个组件注册为全局的组件。
比如我会在`components`文件夹下创建一个`GlobalComponent`文件夹，文件夹目录为：
```
|-src
  |-components
    |-GlobalComponent
      |-index.js
      |-IconSvg.vue
```
然后在`index.js`中，将其注册为全局组件：
```javascript
// 存放一些全局的组件
import Vue from 'vue'
import IconSvg from './components/IconSvg'
//全局注册icon-svg
Vue.component('icon-svg', IconSvg)
```
最后记得在`main.js`中引入：
```javascript
// main.js
...
import '@components/GlobalComponent' // 全局组件
...
```
**第三步**
> 使用多色图标组件

使用的时候只需要指定对应的`font-class`就可以了：
```html
<icon-svg icon-class="icon-github" />
```
是不是感觉方便多了呢？
由于`icon-svg`也是一个组件，所以你还可以给它加上额外的属性，比如：
```html
<icon-svg
   class="cur_pointer"
   style="font-size: 20px;"
   icon-class="icon-github"
   title="我是github图标"
/>
```
但是在使用过程中，我碰到了一个问题。
就是在你想给图标添加一个事件的时候，却是无效的。
比如我先给图标添加一个点击事件：
```html
<icon-svg icon-class="icon-github"  @click="onClick"/>
```
`click`事件并没有触发。
暂时的解决方案：使用事件修饰符`native`：
```html
<icon-svg icon-class="icon-github"  @click.native="onClick"/>
```
有更好解决方案的大佬请评论区留言，谢谢...

**注⚠️**
我喜欢使用`iconfont`的还一个好处是它可以在一个项目中添加多个项目成员，这样在团队进行项目开发的时候是十分方便的。

## 后语
参考文章：[手摸手，带你优雅的使用 icon](https://juejin.im/post/59bb864b5188257e7a427c09)
知识无价，支持原创