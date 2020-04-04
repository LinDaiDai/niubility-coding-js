# 霖呆呆的webpack之路-library篇

在之前我们都介绍了很多关于使用`webpack`打包应用程序代码的知识, 其实, `webpack`还可以用于打包`JavsScript library`.

`JavsScript library`就是我们平常经常用到的一些开发工具库, 例如我们熟悉的`lodash`库.

这一章节就是让你了解如何创建一个你属于你自己的library并最终发布到NPM上能供人安装使用.

创建library并发布是一项很酷的技能, 你想想如果你的团队在同时开发几个项目, 但是这几个项目可能有一些功能的方法或者组件, 你就可以提取出来作为一个library发布到NPM上, 然后不同的项目只需要将你编写的library引入进来就可以了.



## 一、webpack-numbers案例

这里我也不折腾了, 就以官网提供的案例进行讲解吧.

首先让我们明确要做什么事情.

1. 本地编写创建一个名为`lindaidai-webpack-numbers`的项目(也就是library)
2. 这个library的功能是导出两个方法, 能实现数字与字符串的互相转换
3. library中用到了lodash这个工具库
4. 将library打包发布到NPM上, 其它用户能够通过`npm install`的方式下载使用
5. 外部化lodash, 也就是我们library虽然使用了lodash, 但是并不要将它打包到我们的bundle中
6. 用户能通过ES2015模块, CommonJS模块, script脚本引入我们的library并使用它

该 library 的使用方式如下：

```javascript
// ES2015模块引入
import * as webpackNumbers from 'lindaidai-webpack-numbers'
// CommonJS模块引入
var webpackNumbers = require('lindaidai-webpack-numbers')

// ES2015模块和CommonJS模块都是这样调用的:
webpackNumbers.numToWord(2)

// AMD模块引入
require(['lindaidai-webpack-numbers'], function (webpackNumbers) {
  // AMD 模块调用
  webpackNumbers.wordToNum('Two');
})
```

用户还可以通过 script 标签来加载和使用此 library：

```html
<!doctype html>
<html>
  ...
  <script src="https://unpkg.com/lindaidai-webpack-numbers"></script>
  <script>
    // ...
    // 全局变量
    webpackNumbers.wordToNum('Five')
    // window 对象中的属性
    window.webpackNumbers.wordToNum('Five')
    // ...
  </script>
</html>
```



### 创建library的项目结构

让我们使用webpack快速的构建一个本地的library.

由于有了之前webpack的基础, 我相信你构建起来应该也会很快.

```
mkdir lindaidai-webpack-numbers && cd lindaidai-webpack-numbers
npm init -y
cnpm i --save-dev webpack webpack-cli lodash
touch webpack.config.js
mkdir src && cd src
touch index.js
touch ref.json
```

一顿操作之后, 项目结构变成了这样:

```
lindaidai-webpack-numbers
	|- /node_modules
	|- /src
		|- index.js
		|- ref.json
	|- package.json
	|- webpack.config.js
```

之后来简单的编写一下文件中的代码:

**src/ref.json**:

```json
[{
        "num": 1,
        "word": "One"
    },
    {
        "num": 2,
        "word": "Two"
    },
    {
        "num": 3,
        "word": "Three"
    },
    {
        "num": 4,
        "word": "Four"
    },
    {
        "num": 5,
        "word": "Five"
    },
    {
        "num": 0,
        "word": "Zero"
    }
]
```

**src/index.js**:

```javascript
import _ from 'lodash';
import numRef from './ref.json';

export function numToWord(num) {
    return _.reduce(numRef, (accum, ref) => {
        return num === ref.num ? ref.word : accum
    })
}

export function wordToNum(word) {
    return _.reduce(numRef, (accum, ref) => {
        return ref.word === word && word.toLowerCase() ? ref.num : accum;
    }, -1);
};
```

**webpack.config.js**:

```javascript
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'webpack-numbers.js'
  }
};
```



### 配置webpack.config.js

编写完成上面👆几个文件之后, 打包之后生成的`dist`目录就只有一个`webpack-numbers.js`文件:

```
/dist
	|- webpack.numbers.js
```

但是我们注意到生成的js中包含了lodash:

```diff
lindaidai@LinDaiDaideMacBook-Pro lindaidai-webpack-numbers % npm run build

> lindaidai-webpack-numbers@1.0.0 build /Users/lindaidai/codes/webpack/lindaidai-webpack-numbers
> webpack

Hash: e49f78747376a068a282
Version: webpack 4.41.5
Time: 1544ms
Built at: 2020-02-10 6:57:59 PM
             Asset      Size  Chunks             Chunk Names
+ webpack-numbers.js  72.4 KiB       0  [emitted]  main
```

所以导致`webpack-number.js`非常大.

#### 外部化lodash(配置externals)

因此对于这种我们额外引入的module, 我们更倾向于把 `lodash` 当作 `peerDependency`。也就是说，用户应该已经将 `lodash` 安装好.

所以，你可以放弃对外部 library 的控制，而是将控制权让给使用 library 的用户。

这个功能需要靠`externals`配置:

**webpack.config.js**:

```diff
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'webpack-numbers.js'
-  }
+  },
+  externals: {
+  	lodash: {
+  		commonjs: 'lodash',
+  		commonjs2: 'lodash',
+  		amd: 'lodash',
+  		root: '_'
+  	}
  }
};
```

> 这意味着你的 library 需要一个名为 `lodash` 的依赖，这个依赖在用户的环境中必须存在且可用。



#### 暴露library

因为我们编写的library可能会在不同的执行环境中用到，例如 CommonJS，AMD，Node.js 或者作为一个全局变量.

所以为了实现这个功能, 我们首先需要在`oupout`中添加`library`属性:

**webpack.config.js**:

```diff
  var path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'webpack-numbers.js',
+     library: 'webpackNumbers'
    },
    externals: {
      lodash: {
        commonjs: 'lodash',
        commonjs2: 'lodash',
        amd: 'lodash',
        root: '_'
      }
    }
  };
```

添加了`library`属性是为了将`library`在打包之后的`bundle`文件中暴露一个名为`webpackNumbers`的全局变量.

但是还需要指定我们的`library`在怎样的环境中使用.

这依靠于`libraryTarget`属性, 它可以控制`library`如何以不同方式暴露的选项.

主要有以下几个值:

- 变量：作为一个全局变量，通过 `script` 标签来访问（`libraryTarget:'var'`）。
- this：通过 `this` 对象访问（`libraryTarget:'this'`）。
- window：通过 `window` 对象访问，在浏览器中（`libraryTarget:'window'`）。
- UMD：在 AMD 或 CommonJS 的 `require` 之后可访问, 也就是以上几种环境都可以访问（`libraryTarget:'umd'`）

**如果设置了 `library` 但没设置 `libraryTarget`，则 `libraryTarget` 默认为 `var`**

所以在此处我希望在所有的环境中都能使用, 则只要设置`libraryTarget: 'umd'`:

```diff
  var path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'webpack-numbers.js',
      library: 'webpackNumbers',
+     libraryTarget: 'umd'
    },
    externals: {
      lodash: {
        commonjs: 'lodash',
        commonjs2: 'lodash',
        amd: 'lodash',
        root: '_'
      }
    }
  };
```



### 发布至NPM

现在我们希望的是将打包之后的`dist`文件与这整个项目一起发布到NPM上.

所以我们需要执行打包命令让`library`项目目录结构变为:

```
lindaidai-webpack-numbers
	|- /dist
		|- webpack.numbers.js
	|- /src
		|- index.js
		|- ref.json
	|- package.json
	|- webpack.config.js
```

(如果你的项目没有配置打包命令的话需要在package.json中配置一个脚本命令"build": "webpack", 这样你就可以执行`npm run build`指令进行打包了)



#### 登录npm

```
npm adduser //创建用户(如果你没有npm账号的话)
or
npm login //登录用户
```

可以使用:

```
npm whoami
```

检测用户是否登录上了npm



#### 安装publish

首先需要安装publish

```
npm i -g publish
```



#### 发布library

由于我们之前提到了你需要将整个library通过bundle中的`webpack.numbers.js`暴露出去, 所以你还需要修改package.json中的`"main"`属性:

```javascript
{
  ...
  "main": "dist/webpack-numbers.js",
  ...
}
```

这样整体的package.json需要修改成如下:

```diff
{
    "name": "lindaidai-webpack-numbers",
    "version": "1.0.0",
+   "description": "This is a LinDaiDai's packages",
+   "main": "dist/webpack-numbers.js",
+   "private": false,
    "scripts": {
+        "build": "webpack"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
        "lodash": "^4.17.15",
        "webpack": "^4.41.5",
        "webpack-cli": "^3.3.10"
    }
}
```

现在你就可以在项目根目录下执行指令来发布library了:

```
npm publish
```

成功之后应该会提示:

```
+lindaidai-webpack-numbers@1.0.0
```

并且此时你是可以在 [unpkg.com](https://unpkg.com/#/) 中找到你发布的library的.

若是你编写的模块是第一次发布的，则直接使用指令`npm publish`就可以了
若是第二次，则需要在`package.json`中修改一下`version`，如修改为`1.0.1`，然后再次执行`npm publish`就OK了。

**如果你在发布的时候报了如下的错误, 这是由于包名重复了, 也就是你发布的包在NPM上已经有人用了, 你换个名字就可以了**:

```
npm ERR! code E403
npm ERR! 403 403 Forbidden - PUT https://registry.npmjs.org/mini-vm - You do not have permission to publish "webpack-numbers". Are you logged in as the correct user?
npm ERR! 403 In most cases, you or one of your dependencies are requestingnpm ERR! 403 a package version that is forbidden by your security policy.

npm ERR! A complete log of this run can be found in:
npm ERR!     F:\node\rely\node_cache\_logs\2020-02-07T08_30_57_238Z-debug.log
```



**还有以下几点需要你注意的:**

1. 确保自己是登录了npm的

2. 确保自己的npm的邮箱被激活了

3. 命名不能太简单,最后要有自己的标志,太简单可能是别人已经用过的名字你就不能发布成功,也不要有数字

4. 如果是要再次推送同一个项目记得修改该项目版本号。

具体关于NPM包的发布可以看我之前的一篇文章: [《NPM-在npm上发布模块》](https://www.jianshu.com/p/e668c14ff88f)



### 使用发布的library

成功将自己的library发布到NPM上了之后, 让我们来用个案例测试下吧.

我就以之前[《霖呆呆的webpack之路-基础篇》](https://github.com/LinDaiDai/webpack-document/blob/master/霖呆呆的webpack之路-基础篇.md))的案例来测试吧.

**(案例GitHub地址: [LinDaiDai/webpack-basic]())**

在项目的根目录下执行命令来安装library:

```
npm i --save-dev lindaidai-webpack-numbers
```

接下里在项目中使用它:

```javascript
// ES6
import * as lindaiWebpackNumbers from 'lindaidai-webpack-numbers'
// CommonJS
// var lindaiWebpackNumbers = require('lindaidai-webpack-numbers')

console.log(lindaiWebpackNumbers.numToWord(2)) // Two
```

引入时命名可以随意, 不一定要是`lindaidiWebpackNumbers`.



### 案例GitHub地址

[LinDaiDai/lindaidai-webpack-numbers]()