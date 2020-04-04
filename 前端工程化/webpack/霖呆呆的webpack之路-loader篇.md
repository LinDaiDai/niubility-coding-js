# 霖呆呆的webpack之路-loader篇

webpack 可以使用 [loader](https://www.webpackjs.com/concepts/loaders) 来预处理文件。这允许你打包除 JavaScript 之外的任何静态资源。你可以使用 Node.js 来很简单地编写自己的 loader。



loader的配置有三种方式:

1. 通过在webpack配置中的module.rules配置(最推荐的方式)

```javascript
// webpack.config.js
module.exports = {
	module: {
		rules: [
			{
				test: /.txt$/,
				use: 'raw-loader' // 获取到内容
			}
		]
	}
}
```

2. 内联的方式(使用`!`将资源中的loader分开)

```javascript
// 单个loader
import Styles from 'style-loader!./styles.css';

// 多个loader且带参数
import Styles from 'style-loader!css-loader?modules!./styles.css';
```

3. 命令行CLI

```
webpack --module-bind jade-loader --module-bind 'css=style-loader!css-loader'
```

会对 `.jade` 文件使用 `jade-loader`，对 `.css` 文件使用 [`style-loader`](https://www.webpackjs.com/loaders/style-loader) 和 [`css-loader`](https://www.webpackjs.com/loaders/css-loader)。



**以下所有教材案例GitHub地址: [LinDaiDai/webpack-loader]()**



## 文件

### raw-loader

加载文件原始内容.

例如加载text文件:

```javascript
import txt from './assets/file.txt'
```

```javascript
// webpack.config.js
module.exports = {
	module: {
		rules: [
			{
				test: /.txt$/,
				use: 'raw-loader' // 获取到内容
			}
		]
	}
}
```



### file-loader

将文件发送到输出文件夹，并返回（相对）URL

也就是使用了file-loader的资源文件在打包后会输出到dist文件夹中, 同时如果用import或者require引入的话获取到的是相对路径.

#### 1. js代码加载图片

例如加载img文件:

```javascript
import img from './assets/file.png'
```

```javascript
// webpack.config.js
module.exports = {
	module: {
		rules: [
			{
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        	 'file-loader' // 得到的是bundle中的相对路径 4sj89003nknkdsdf.png
        	}
        ]
      }
		]
	}
}
```

**这里又一点需要注意的⚠️**:

如果你是使用`import`引用的话得到的是图片的相对路径

如果是使用`require`引用的话得到的是一个模块对象, 这时候需要需要配置`loader`的一个参数`options.esModule`为`false` 才会得到相对路径.

```javascript
// require引入
const img = require('./assets/file.png')

// 得到模块对象
Module{ defalut: '4sj89003nknkdsdf.png' }

// webpack.config.js 中配置参数
rules: [{
	loader: 'file-loader',
	options: {
		esModule: false
	}
}]
```

配置了`esModule`之后, 就能和`import`引入得到的一样了.

#### 2. html加载图片

在`html`中加载一张图片:

```html
<img src="./assets/file.png" />
```

这里默认应该是以`CommonJS`的加载方式加载的, 所以需要配置`options.esModule`为`false`, 如上面👆.



### url-loader

像 file loader 一样工作，但如果文件小于限制，可以返回 [data URL](https://tools.ietf.org/html/rfc2397)



#### 1. 基本用法

```
rules: [{
	test: /\.(png|svg|jpg|gif)$/,
	use: [{
		loader: 'url-loader'
	}]
}]
```

```javascript
import img from './assets/file.png' // base64格式
const img from './assets/file.png' // Module: { default: data:image/png;base64... }

<img src="./assets/file.png" > // <img src="[object Module]" />
```



#### 2. 参数limit

默认情况下它有一个参数`limit`是为`undefined`的, 此时获取文件返回的是base64格式(也就是dataURL).

但如果设置了`limit`(单位为K)同时文件的大小超过了这个`limit`的话, 就和`file-loader`一样返回bundle中的相对路径.

- 不设置`limit`, 返回`base64格式`
- 设置了`limit`, 小于该值, 返回`base64格式`
- 设置了`limit`, 大于该值, 交给`file-loader`处理, 如果没有安装配置`file-loader`的话就会报错



例如加载下面👇两个img文件:

```javascript
import img from './assets/file.png' // < 40KB data:image/png;base64
import wpl from './assets/wpl.png' // > 40KB 0565680d883d2c278e70d23f5ee97975.png

var imgEle = new Image()
var wplEle = new Image()
imgEle.src = img
wplEle.src = wpl
document.body.appendChild(imgEle)
document.body.appendChild(wplEle)
```

```javascript
// webpack.config.js
module.exports = {
	module: {
		rules: [
			{
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        	// 'file-loader' // 得到的是bundle中的相对路径 4sj89003nknkdsdf.png
          {
            loader: 'url-loader', // 得到的是base64格式: data:image/png;base64
            options: {
              limit: 40000 // 超过40KB则返回 4sj89003nknkdsdf.png
            }
        	}
        ]
      }
		]
	}
}
```

旦如果你是想直接在标签中使用一张图片的话, 例如这样:

```html
<img src="./assets/LinDaiDai.png" />
```

它并不能像预期那样, 它得到的是一个对象:

这个对象长成这样:

```javascript
Module{
	default: "data:image/png;base64,..."
}
```

所以对应页面上是不能正常显示的:

```html
<img src="[object Module]" />
```

此时可以配置`options`中的`esModule`选项为`false`, 默认这个选项是为`true`的.

```javascript
{
	loader: 'url-loader',
	options: {
		esModule: false
	}
}
```

在其他的`loader`, 例如`raw-loader`也有这样选项.



### svg-inline-loader

使用`url-loader`来处理`svg`文件, 是能将该文件转化为base64格式.

而`svg-inline-loader`的作用是将SVG内联为模块.

它会将引入的SVG转化为字符串.

安装:

```
$ cnpm i --save-dev svg-inline-loader
```

配置:

```javascript
{
  test: /\.svg$/,
  loader: 'svg-inline-loader?classPrefix'
}
```

使用:

```javascript
// src/print.js
const svg = require('./assets/add-icon.svg')
// import svg from './assets/add-icon.svg'

console.log(svg)
```

得到的是:

```xml
<svg version="1.1" id="图层_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 16 16" style="enable-background:new 0 0 16 16;" xml:space="preserve"><style type="text/css"> .fnCkiuXst0{fill-rule:evenodd;clip-rule:evenodd;fill:#888888;} </style><g><g><polygon class="fnCkiuXst0 " points="13,7 9,7 9,3 7,3 7,7 3,7 3,9 7,9 7,13 9,13 9,9 13,9 "></polygon></g></g></svg>
```





## 转换编译

### ts-loader

像 JavaScript 一样加载 [TypeScript](https://www.typescriptlang.org/) 2.0+

也就是能让你的代码中能写`ts`类型的文件.

`ts-loader`必须配合`typescript`一起使用.

所以在安装时:

```
$ cnpm i --save-dev ts-loader typescript
```

同时要在根目录下创建一个`tsconfig.json`文件:

```json
{
  "compilerOptions": {
    "sourceMap": true
  }
}
```



完成上述步骤就可以在项目中使用ts了.

让我们写个案例看看:

**test.ts**:

```tsx
export function numToWord(num: number): string {
  return config[num]
}

const config = {
  1: 'one',
  2: 'two'
}
```

然后使用它:

**print.js**:

```javascript
import { numToWord } from './assets/test.ts'
console.log(numToWord(2)) // two
```



### babel-loader

下面介绍一个比较重要的loader: `babel-loader`.

我们都知道Babel就是一个JS编译器, 主要用于在旧的浏览器或环境中将ECMAScript 2015+代码转换为向后兼容版本的JavaScript代码.

例如我们在刚刚的案例`src/index.js`中加上一个ES6+才有的箭头函数, 以及一个 ES7才有的幂运算符:

```diff
import { print } from './print'
import './styles/style.css';
import './styles/style.less';
var fileHtml = require("html-loader?attrs=img:src!./assets/file.html")

function component() {
    var element = document.createElement('div');
    element.innerHTML = 'webpack loader';

    element.classList.add('box');

    var btn = document.createElement('button');
    btn.innerHTML = '点击获取环境变量';
    btn.onclick = print;
    element.appendChild(btn);

+    const fn = () => 1; // ES6箭头函数
+    console.log(fn())
+		 let num = 3 ** 2; // ES7求幂运算符
+    console.log(num)
    return element;
}

document.body.appendChild(component());
console.log(fileHtml)
    // document.body.appendChild(fileHtml)
```

我们知道在没做任何处理的的时候, bundle之后, 这个函数还是箭头函数, 幂运算符还是幂运算符.

为了方便查看我将`webpack.config.js`中的`mode`属性配置为`development`, 这样我们就能查看bundle之后的代码了:

![](/Users/lindaidai/Documents/webpack-document/resource/loader1.png)



#### @babel/preset-env

现在让我们来安装一下`babel-loader`, 为了能看到效果, 同时还要安装一下`@babel/core`和` @babel/preset-env`

(`@babel/core`是Babel的核心, `@babel/preset-env`它是能将ES6+的语法转成ES5的一组插件集合)

```
$ cnpm i --save-dev babel-loader @babel/core @babel/preset-env
```

然后我在`webpack.config.js`中配置使用一下`babel-loader`:

```javascript
// webpack.config.js
module.exports = {
	module: {
		rules: [
			{
				test: /.js$/,
				exclude: /(node_moudules|bower_components)/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ["@babel/preset-env"]
						}
					}
				]
      }
		]
	}
}
```

这里的意思是对除了`node_modules`和`bower_components`文件夹以外的所有`js`文件使用`babel-loader`. 同时Babel配置使用的是`@babel/preset-env`这个preset.

保存成功之后重新执行`npm run serve`来看看效果:

![](/Users/lindaidai/Documents/webpack-document/resource/loader2.png)

可以发现, 现在我们的箭头函数以及幂运算符都被转换成了ES5的语法.



在如果你的`vue`项目不是使用`vue-cli`, 而是自己通过`webpack`配置的话, 那么其中的`exclude`可以这样配置:

```javascript
rules: [{
	test: /\.js$/,
	exclude: file => ( // 排除依赖 && 但是保证依赖文件夹中的vue单文件
		/node_modules/.test(file) &&
		!/\.vue\.js/.test(file)
	),
	use: [{
    loader: 'babel-loader',
    options: {
    	presets: ["@babel/preset-env"]
    }
  }]
}]
```



#### plugins

在上面我们使用的`@babel/preset-env`, 它是一组插件(plugin)的集合.

所以使用了它能将ES6+的语法都转换为ES5的语法.

除了这种做法, 我们还能指定只转换哪些语法.

例如我现在只想要将箭头函数转换为普通函数, 而幂运算符不转换.

那么我们就可以使用`options`里的另一个参数`plugins`, 只传入转换箭头函数的插件: `@babel/plugin-transform-arrow-functions`

```diff
// webpack.config.js
module.exports = {
	module: {
		rules: [
			{
				test: /.js$/,
				exclude: /(node_moudules|bower_components)/,
				use: [
					{
						loader: 'babel-loader',
						options: {
-							presets: ["@babel/preset-env"],
+							plugins: [require('@babel/plugin-transform-arrow-functions')]
						}
					}
				]
      }
		]
	}
}
```

(注⚠️: 由于我们前面下载安装了`@babel/preset-env`, 它里面包含了所有ES6+的转换插件, 当然也包括箭头函数转换的插件, 所以我们可以直接引用`babel/plugin-transform-arrow-functions`, 如果你没有装`@babel/preset-env`的话, 则需要单独下载箭头函数转换的插件)

现在重新编译之后就会发现, 编译的结果中**只将箭头函数转换了, 而幂运算符没有**.

另外, `plugins: ['@babel/plugin-transform-arrow-functions']`这样的写法也是可以的.



#### 使用优化

在使用`babel-loader`是会有以下几个问题, 我们可以针对问题点做不同的优化:

1. `babel-loader`使得编译很慢

解决办法: 一种是确保转译尽可能少的文件, 所以可以用`exclude`选项来去除`node_modules` 和`bower_components`中文件. 另一种你可以设置`cacheDirectory`选项为`true`, 开启缓存, 转译的结果将会缓存到文件系统中, 这样使`babel-loader`至少提速两倍(代码量越多效果应该越明显).

2. `babel-loaderd`使得打包文件体积过大

Babel 对一些公共方法使用了非常小的辅助代码, 比如 `_extend`.默认情况下会被添加到每一个需要它的文件中, 

所以会导致打包文件体积过大.

解决办法: 引入`babel runtime`作为一个单独的模块, 来避免重复.

使用方式: 执行`npm install @babel/plugin-transform-runtime --save-dev` 来把它包含到你的项目中

并且使用 `npm install babel-runtime --save` 把 `babel-runtime` 安装为一个依赖:

```javascript
rules: [
  // 'transform-runtime' 插件告诉 babel 要引用 runtime 来代替注入。
  {
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-transform-runtime']
      }
    }
  }
]
```

官网给出的是安装`babel-plugin-transform-runtime`, 但如果你使用的Babel是7以上的话, 你就得和我一样安装使用`@babel/plugin-transform-runtime`.

关于更多Babel的使用, 可以查看这篇文章: [《建议改成: 读完这篇你还不懂Babel我给你寄口罩》](https://juejin.im/post/5e477139f265da574c566dda)

## 模版

### html-loader

先让我们想一个场景, 写一个`file.html`页面, 然后直接用`require`引入会怎么样 🤔️?

**src/assets/file.html**:

```html
<img src="file.png" data-src="fileJpg.jpg" />
```

**src/index.js**:

```javascript
var fileHtml = require("./assets/file.html")
console.log(fileHtml)
```

答案是编译的时候就会报错了:

```
ERROR in ./src/assets/file.html 1:0
Module parse failed: Unexpected token (1:0)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> <img src="file.png" data-src="fileJpg.jpg" />
 @ ./src/index.js 2:15-44
```

**而`html-loader`的作用就是将html里面的内容转换为字符串**

1. 安装它:

```
$ cnpm i html-loader --save-dev
```

2. 使用它:

```javascript
// src/index.js
var fileHtml = require('html-loader!./assets/file.html')
console.log(fileHtml) // '<img src="[object Module]" data-src="fileJpg.jpg" />'
```

此时虽然能够成功的转换成字符串, 但是`src`属性好像是有点问题的.



## 样式

### style-loader和css-loader

- style-loader: 将模块的导出作为样式添加到 DOM 中
- css-loader: 解析 CSS 文件后，使用 import 加载，并且返回 CSS 代码

具体可以查看[《霖呆呆的webpack之路-基础篇》]()



### less-loader

#### 基本使用

加载和转译 LESS 文件

前提条件需要安装style-loader、css-loader和less

```
$cnpm i --save-dev style-loader less-loader less
```

配置:

```javascript
// webpack.config.js
module.exports = {
    ...
    module: {
        rules: [{
            test: /\.less$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "less-loader" // compiles Less to CSS
            }]
        }]
    }
};
```

使用:

**index.js**:

```javascript
import './styles/style.less'
```

**style.css**:

```css
@import './style.less';
.box {
    background-color: coral;
}
```

(不过记得配置一下`.css`类型的loader)



#### 提取less文件

用上面👆的方法能将less文件转换成css并最终和其它的css代码一并添加到页面head的style标签里.

也就是说并不会在最终的bundle中生成对应的css文件.

但是在实际使用来说, 我们更希望能将less或者css文件提取出来作为一个单独的文件加载到页面上.

其实关于提取出来在[《霖呆呆的webpack之路-优化篇》](https://github.com/LinDaiDai/webpack-document/blob/master/霖呆呆的webpack之路-优化篇.md) 的css代码分离中已经阐述过了, 主要就是依靠一个插件:

**extract-text-webpack-plugin**.



#### extract-text-webpack-plugin

1. 安装插件

```
$ cnpm i --save-dev extract-text-webpack-plugin@next
```

(如果你用的是webpack4的话, 就要安装`@next`版本的, 不然打包的时候会报错了)

2. 在webpack.config.js中配置:

```diff
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
+ const ExtractTextPlugin = require('extract-text-webpack-plugin');
+ const extractLess = new ExtractTextPlugin({
+    filename: "[name].[hash].css",
+    disable: process.env.NODE_ENV === "development"
+ });
module.exports = {
	entry: {
        index: './src/index.js'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin(),
+       extractLess
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
+    module: {
+    	rules: [
+    		{
+    			test: /.less$/,
+    			use: extractLess.extract({
+            use: [{
+              	loader: "css-loader"
+             }, {
+              	loader: "less-loader"
+             }],
+            fallback: "style-loader"
+          })
+    		}
+    	]
+    }
}
```

此时执行生产环境的打包命令, 可以看到在最终的bundle中看到生成的css文件.

css或者sass代码分离的方式和它一样,具体案例可以查看GitHub案例地址: [LinDaiDai/webpack-loader]()



## 清理和测试

### eslint-loader

PreLoader，使用 [ESLint](https://eslint.org/) 清理代码

安装使用:

```
$ cnpm i --save-dev eslint eslint-loader
```

