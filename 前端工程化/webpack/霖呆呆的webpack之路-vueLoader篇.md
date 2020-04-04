# 霖呆呆的webpack之路-vueLoader篇

### 新建一个空的webpack项目

```
mkdir webpack-vue-cli && cd webpack-vue-cli
npm init -y
touch webpack.config.js
```

### 创建一些基础的目录结构:

```
mkdir src && cd src
touch main.js && touch App.vue
mkdir assets && mkdir components && mkdir styles
cd ../
mkdir public && cd public
touch index.html
```

### 安装一些基本的依赖

#### 1. 保证webpack的基本功能

```
cnpm i --save-dev webpack webpack-cli
```

配置入口和出口

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



#### 2. 配置html模版和清理dist的插件

```
cnpm i --save-dev html-webpack-plugin clean-webpack-plugin
```

```diff
const path = require('path')
+ const HtmlWebpackPlugin = require('html-webpack-plugin')
+ const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
	entry: './src/main.js',
	output: {
  	filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
-  } 
+  },
+  plugins: [
+  	new CleanWebpackPlugin(), // 清理dist
+    new HtmlWebpackPlugin({ // html模版
+    	title: 'webpack-vue',
+    	template: './public/index.html'
+    })
+  ]
}
```



#### 3. 保证能本地启动web服务器

模拟`vue-cli`的开发环境

```
cnpm i --save-dev webpack-dev-server
```

```diff
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
	entry: './src/main.js',
	output: {
  	filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
+  devServer: {
+			contentBase: './dist',
+     open: true
+  },
  plugins: [
  	new CleanWebpackPlugin(), // 清理dist
    new HtmlWebpackPlugin({ // html模版
    	title: 'webpack-vue',
    	template: './public/index.html'
    })
  ]
}
```

并在`package.json`中添加两条脚本命令, 一个是本地的开发命令, 一个是发布到生产环境的打包命令:

```javascript
{
	"scripts": {
		"serve": "webpack-dev-server",
		"build": "webpack"
	}
}
```



#### 4. 保证能使用vue单文件

```
cnpm i -D vue-loader vue-template-compiler
```

```diff
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
+ const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
	entry: './src/main.js',
	output: {
  	filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
		 contentBase: './dist',
     open: true
  },
+  module: {
+  	rules: [{
+  		test: /.vue$/,
+  		loader: 'vue-loader'
+  	}]
+  },
  plugins: [
  	new CleanWebpackPlugin(), // 清理dist
    new HtmlWebpackPlugin({ // html模版
    	title: 'webpack-vue',
    	template: './public/index.html'
-    })
+    }),
+   new VueLoaderPlugin()
  ]
}
```



#### 5. 处理css

```
cnpm i --save-dev style-loader css-loader vue-style-loader
```

在`webpack.config.s`中配置规则:

```javascript
module.exports = {
	rules: [
		{
			test: /\.css$/,
      use: [
      	'style-loader',
      	'css-loader'
      ]
		}
	]
}
```

(由于之前安装了`vue-loader`, 它能够处理每个`vue`文件中`scoped`的样式, 所以不要额外处理)

(安装`vue-style-loader`, 使得我们编辑`vue`文件中的`<style>`能够热重载)

#### 6. 编写基本代码并跑一个试试

完成上述操作, 让我们写一些简单的代码看看能不能将项目跑起来.

这里我是模拟`vue-cli`的项目结构进行配置的:

**src/main.js**:

```javascript
import Vue from 'vue';
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
    render: h => h(App)
}).$mount('#app')
```

**src/App.vue**:

```vue
<template>
  <div id="app">
    <div class="content">
      {{ msg }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'app',
  components: {},
  data() {
    return {
      msg: 'Hello LinDaiDai222'
    }
  }
}
</script>
<style>
body {
  margin: 0;
}
</style>
```

**public/index.html**:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%= htmlWebpackPlugin.options.title %></title>
</head>

<body>
    <noscript>
      <strong>We're sorry but bpmn-vue-basic doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
</body>
</html>
```

这个文件是为了提供一个生成`html`的模版.

**Now let's try!!!**

允许之前配置好的指令:

```
npm run serve
```

发现是可以正常打开显示页面的, 而且更新了本地代码, 页面也会自动重载.



### 处理资源路径

为了处理项目中的资源路径, 例如`img`标签的`src`, 我们需要用到`file-loader`或者`url-loader`.

如果不做这些处理的话, 在项目使用图片就会报错了.

两种`loader`都可以.

#### 1. 使用file-loader

```
cnpm i --save-dev file-loader
```

```javascript
module.exports = {
	rules: [
		{
			test: /.(png|jpg|svg|gif)$/,
      use: [
      	{
          loader: 'file-loader',
          options: {
            esModule: false // 配置此选项保证能在html中加载图片路径
          }
        }
      ]
		}
	]
}
```



#### 2. 使用url-loader

```
cnpm i --save-dev url-loader file-loader
```

```javascript
module.exports = {
	rules: [
		{
			test: /.(png|jpg|svg|gif)$/,
      use: [
      	{
          loader: 'url-loader',
          options: {
          	limit: 40000, // 大于该值则交给 file-loader 处理
            esModule: false // 配置此选项保证能在html中加载图片路径
          }
        }
      ]
		}
	]
}
```



#### 3. 添加一张png图片

在`App.vue`中添加一张图片:

```html
<img src="./assets/LinDaiDai.png" />
```

用上面两种配置方式, 都可以正常显示.



### 使用预处理器sass

安装:

```
cnpm i -D sass-loader node-sass
```

配置:

```javascript
rules: [{
	test: /\.scss$/,
	use: [
		'vue-style-loader',
		'css-style-loader',
		'sass-loader'
	]
}]
```

在`styles`文件夹下新建`common.scss`:

```
.color_blue {
	color: blue;
}
```

在`main.js`中引用:

```javascript
import './styles/common.scss'
```



### 使用预处理器Babel

```
cnpm i --save-dev babel-loader @babel/core @babel/preset-env
```

```javascript
rules: [{
	test: /\.js$/,
	loader: 'babel-loader',
	exclude: file => ( // 排除依赖 && 但是保证依赖文件夹中的vue单文件
		/node_modules/.test(file) &&
		!/\.vue\.js/.test(file)
	),
  use: [{
    loader: 'babel-loader',
    options: {
    	presets: ["@babel/preset-env"] // 将ES6+ 转换为 ES5
    }
  }]
}]
```



### 使用Eslint

```
cnpm i -D eslint eslint-loader eslint-plugin-vue
```

**webapack.config.js**:

```javascript
rules: [{
	enforce: 'pre',
	test: /\.(vue|js)$/,
	loader: 'eslint-loader',
	options: {
		"failOnError": true // 有错误时页面加载失败
	},
	exclude: /node_modules/
}]
```

**.eslintrc**

```json
{
	"parserOptions": {
		"ecmaVersion": 2015,
		"sourceType": "module"
	},
	"extends": ["plugin:vue/essential"],
	"rules": {
		"no-console": "error" // 不能使用console.log(), 如果要能使用则设置成 off
	}
}
```

