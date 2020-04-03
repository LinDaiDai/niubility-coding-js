### 一、问题原因

我们知道在使用vue官方给出的脚手架vue-cli搭建的项目, 默认是有两个脚本功能的.

- npm run serve 允许你本地启动这个项目
- npm run build 将整个项目进行压缩构建到dist这个目录下(俗称打包)

我们会发现在`npm run build`之后生成的`dist`文件夹中有一个`index.html` , 如果你本地打开它的话并不能正常的显示出项目的内容, 而是会出现一个空白页, 打开控制台也是爆了一堆找不到`js` 、`css`等资源文件的错误.

![本地打开dist/index.html](https://upload-images.jianshu.io/upload_images/7190596-d04f90448d4fecf8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


这其实和webpack打包后的资源路径有关.

因为我们知道vue-cli是使用了webpack来实现打包功能的. 而了解过webpack的小伙伴应该都听过`output`这个东西, 也就是打包之后的代码输出到哪里.

`output`这个属性是一个对象, 里面有很多属性, 一个常见的webpack配置可能长成这样:

**webpack.config.js**:

```javascript
const path = require('path')

module.exports = {
  entry: './src/main.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}
```

而在`output`中还有一个属性是`publicPath`, 这个属性在webpack中默认是`''`.

它的功能就是指定输出目录对应的公开URL, 影响的主要是**外部资源的引用**, 也就是说它会在资源文件的引用加上一个前缀.

比如你原先一张图片的引用地址是:

```css
.box {
	background: url('icon.png') 
}
```
而如果你的`publicPath`配置成了`/assets/`, 此时就会变成:

```css
.box {
	background: url('/assets/icon.png') 
}
```

但是使用了`vue-cli`, 它这个脚手架里是帮你做了很多关于webpack的配置的, 运用了处理css文件的`style-loader`、`css-loader`, 处理文件的`file-loader`, 等等等等等功能.

而`vue-cli`中对于`publicPath`这个属性的配置是默认为`'/'`(也就是整个项目的根目录)

(之前其实这个属性是`baseUrl`, 只不过从Vue CLI 3.3 起已弃用, 现在使用`publicPath`)

在我们打包完之后, 让我们看看本地的项目结构哈:

![image.png](https://upload-images.jianshu.io/upload_images/7190596-82aa271968726261.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

它是长成上面👆这样子的.

所以这个项目的根目录下都有哪些文件 🤔️?

有`dist`、`public`、`src`、`package.json`等等等等.

但是你打包之后资源路径默认是以谁为基准的 🤔️? 

是以这个项目根目录为基准的, 但是这个项目根目录并没有我们要的`css、js、image`等文件夹呀, 这些文件夹是在`dist`文件夹里面!!!

可是为什么说放到服务器上就可以正常显示了呢?

我们说的扔到服务器上是指把前端打包完成的**`dist`文件夹里的内容**全部上传到服务器静态文件夹中, 通过配置服务器地址, 它会去读取`index.html`这个页面. 而此时页面中的资源的路径就是正确的了, 因为它的根目录中放的就是以下文件:

![上传到服务器中的文件目录](https://upload-images.jianshu.io/upload_images/7190596-c590692c77ea58b6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 二、解决方案

`vue-cli`提供了一个入口让你能配置修改`webpack`.

在根目录下新建一个`vue.config.js`文件, 然后在其中修改`publicPath`这个选项:

**vue.config.js**:

```javascript
module.exports = {
    publicPath: './'
}
```
将这个选项设置为`'/'`(当前文件夹).

现在你就可以本地打开`dist`文件夹中的`index.html`了.

但是会有一个小问题, 就是如果你使用了`vue-router`(路由)的话, 会发现路由跳转有问题了.

![路由跳转错误](https://upload-images.jianshu.io/upload_images/7190596-9ed18e4ba54eccc5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这个路径明显不对呀...

原来是因为我的`vue-router`的模式设置成了`history`模式:

**src/router/index.js**:

```javascript
...
const routes = [
  ...
]
...
export default new Router({
    mode: 'history',
    routes
})
```

只要把`mode`改为`hash`就可以正常跳转了(其实默认是这个模式的, 但如果你的项目中mode被改了你得知道是这个问题).

更多关于路由的问题可以查看 [《HTML5 History 模式》](https://router.vuejs.org/zh/guide/essentials/history-mode.html#html5-history-%E6%A8%A1%E5%BC%8F) , 这里不做展开.

### 后语

说了这么多, 有用的功能点就这么一小点.

 其实主要是最近有小伙伴问起我这个事, 为什么build之后的dist里的页面不能直接打开呢?

但是你说这个东西吧三言两语的又说的不太清, 所以还是专门写篇文章来描述一下. 至少你看完应该是了解了为什么会这样, 以及如何解决.

**不过话说回来, 正常来说我们是不必要去在意打包之后的dist能否在本地打开的, 因为如果你想本地调试的话, 使用本地开发就可以了, 所以对于大多数人也不需要去修改`publicPath`, 这个选项主要是针对你服务器配置二级目录的人使用的**.

🐎耶, 本来说20分钟码完的... 又码了快一个小时, 不行啊, 我果然不是个快男... 溜了溜了...