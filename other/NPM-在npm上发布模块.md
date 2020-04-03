### 前言
入行前端也不少时间了，之前一直都在使用`npm install`别人的模块/组件，那么作为一名有追求的前端肯定不会满足一直在用别人的轮子。
今天给大家分享一下如何在npm上发布自己的模块或者组件。

### 第一章 登录npm

```
npm adduser //创建用户
or
npm login //登录用户
```

可以使用

```
npm whoami
```

检测用户是否登录上了npm



### 第二章 发布模块

#### 1.首先安装npm publish

```
npm i -g publish
```



#### 2.创建自己的npm模块

创建空文件夹 `fm_lindaidai_first`

并且在命令行输入

```
npm init
一路回车
```

此时会出现`package.json`

```json
{
  "name": "fm_lindaidai_first",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "lindaidai",
  "license": "ISC"
}

```

在package.json同级目录下编写`date.js`

```javascript
// date.js
(function(global) {
  "use strict";
  var datachange = (function() {
    return function(date) {
      var date = date || new Date();
      if (!date instanceof Date) {
        data = new Date(date);
      }

      if (isNaN(data)) {
        throw TypeError("Invalid date");
      }
      let enDate =
        date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate();
      return enDate;
    };
  })();

  if (typeof define === "function" && define.amd) {
    define(function() {
      return datechange;
    });
  } else if (typeof exports === "object") {
    module.exports = datechange;
  } else {
    global.datechange = datechange;
  }
})(this);
```

**上面的date.js是添加简单的日期转换格式插件**

由于命名的是date.js，因此记得将package.json中的“main”修改为date.js

否则别人使用的时候就会报错



#### 3.在npm上发布自己的模块

**注**

> 1.确保自己是登录了npm的
>
> 2.确保自己的npm的邮箱被激活了
>
> 3.命名不能太简单,最后要有自己的标志,太简单可能是别人已经用过的名字你就不能发布成功,也不要有数字
>
> 4.如果是要再次推送同一个项目记得修改该项目版本号。

在`fm_lindaidai_first`的命令行中输入指令

```
npm publish
```

成功之后会提示

```
+ fm_lindaidai_first@1.0.0
```

若是你编写的模块是第一次发布的，则直接使用指令`npm publish`就可以了
若是第二次，则需要在`package.json`中修改一下`version`，如修改为`1.0.1`，然后再次执行`npm publish`就OK。


#### 4.使用自己的模块

可以直接就在项目中使用指令

```
npm i --save-dev fm_lindaidai_first
```


接下来可以在项目中使用

```
var datechange = require('fm_lindaidai_first');
var now = new Date();
var timeStamp = datechange(now);
```



### 第三章 创建vue组件并发布

上面介绍发布的模块是一个比较简单的时间格式转换插件，当然你也可以针对某个框架来发布特定的组件。

说一下我要实现的效果：
1.构建一个基于elementUI的表单生成器组件
2.在npm上发布它并使用

#### 3.1 表单构造器组件
想要实现一个表单生成器，我们希望通过prop传入其中，就能构造想要的表单组件
如下：
```vue
<template>
  <div>
    <form-generator :schema="schema" v-model="formData"></form-generator>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        firstName: "Lin",
        lastName: "DaiDai"
      },
      schema: [
        {
          fieldType: "SelectList",
          name: "food",
          multi: false,
          label: "food",
          options: [
            {
              value: "黄金糕",
              label: "黄金糕"
            },
            {
              value: "双皮奶",
              label: "双皮奶"
            },
            {
              value: "蚵仔煎",
              label: "蚵仔煎"
            },
            {
              value: "龙须面",
              label: "龙须面"
            },
            {
              value: "北京烤鸭",
              label: "北京烤鸭"
            }
          ]
        },
        {
          fieldType: "TextInput",
          placeholder: "First Name",
          label: "First Name",
          name: "firstName"
        },
        {
          fieldType: "TextInput",
          placeholder: "Last Name",
          label: "Last Name",
          name: "lastName"
        },
        {
          fieldType: "NumberInput",
          placeholder: "Age",
          name: "age",
          label: "Age",
          minValue: 0
        }
      ]
    };
  }
};
</script>
```
向名为from-generator的组件中传递一个数组，就能构建出以下表单列表：
![image.png](https://upload-images.jianshu.io/upload_images/7190596-8a5b57c6b02d0d04.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### 3.1.1 vue-cli创建vue简单项目
```
vue init webpack-simple form-lin
```
我创建的项目名为form-lin

##### 3.1.2 安装elementUI
```
npm i element-ui -S
```
可以看到我上面的表单类型是有select、input、numberInput、button这几种，所以我没有引入ele的全部组件，只是按需引入了，按需引入还需要借助 [babel-plugin-component](https://github.com/QingWei-Li/babel-plugin-component)
```
npm install babel-plugin-component -D
```
然后，将 .babelrc 修改为：
```json
{
  "presets": [["es2015", { "modules": false }]],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
```
在main.js中引入部分组件
```javascript
import { Button, Select, Input, Option, InputNumber } from 'element-ui';
Vue.component(Button.name, Button);
Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.component(Input.name, Input);
Vue.component(InputNumber.name, InputNumber);
```
通过以上步骤你已经可以在你的这个项目中使用elementUI的部分组件了。

##### 3.1.3 逐个创建表单组件
结合上面的效果图，可以发现此项目创建的表单类型只有下拉框、输入框、数字输入框这三种，所以可以分别创建3种不同的组件

在components文件夹下创建文件夹v5，并在其中分别创建以下三个组件
* TextInput.vue
* SelectList.vue
* NumberInput.vue

> TextInput.vue
```vue
<template>
  <div class="v5-template">
    <label>{{label}}</label>

    <!-- <input type="text"
           :name="name"
           :value="value"
           @input="$emit('input',$event.target.value)"
           :placeholder="placeholder
           "> -->
    <el-input style="width: 135px;" :name="name"
           :value="value"
           @input="TextInput"
           :placeholder="placeholder" clearable></el-input>
  </div>
           <!-- @input="$emit('input',$event.target.value)" -->
</template>
<script>
import { Input } from 'element-ui';
export default {
  name: 'TextInput',
  props: ['placeholder', 'label', 'name', 'value'],
  methods: {
    TextInput(value) {
      this.$emit('input', value);
    }
  }
}
</script>
```
注释部分为原生的input标签

> SelectList.vue
```vue
<template>
  <div class="v5-template">
    <label>{{label}}</label>
    <el-select  :multiple="multi"
                :value="value"
                @change="SelectVal"
                placeholder="请选择">
      <el-option v-for="option in options"
                :key="option.value"
                :label="option.label"
                :value="option.value">
      </el-option>
    </el-select>
  </div>
</template>
<script>
import { Select } from 'element-ui';
import { Option } from 'element-ui';

export default {
  name: 'SelectList',
  props: ['multi', 'options', 'name', 'label', 'value'],
  methods: {
    SelectVal(value) {
      this.$emit('input', value);
    }
  }
}
</script>
```
> NumberInput.vue
```vue
<template>
  <div class="v5-template">
    <label>{{label}}</label>
    <!-- <input type="number"
           :name="name"
           :value="value"
           @input="$emit('input',
           $event.target.value)"
    :placeholder="placeholder">-->
    <el-input-number
      :name="name"
      :value="value"
      @change="InputNumber"
      :placeholder="placeholder"
      controls-position="right"
      :min="1"
      :max="10"
    ></el-input-number>
  </div>
</template>
<script>
import { InputNumber } from "element-ui";

export default {
  name: "NumberInput",
  props: ["placeholder", "label", "name", "value"],
  methods: {
    InputNumber(value) {
      this.$emit("input", value);
    }
  }
};
</script>
```

完成以上步骤，我们创建了三种不同的表单组件
接下来我们需要用一个生成器来将这三种表单组件联系起来

##### 3.1.4 表单生成器
上面所创建的三种不同的组件，其实都可以用`component`标签来进行引入，只需要改变`component`标签的`:is`属性就可以了。
如
```
<!--输入框组件-->
<component :is="TextInput"></component>

<!--下拉框组件-->
<component :is="SelectList"></component>
```
那么我们就可以通过`v-for`来循环创建不同的表单组件，仅仅只需要改变`:is`的值就行了

接下来 还是在v5文件夹下，创建文件`FormGenerator.vue`
> FormGenerator.vue
```vue
<template>
  <div>
    <component
      v-for="(field, index) in schema"
      :key="index"
      :is="field.fieldType"
      :value="formData[field.name]"
      @input="updateForm(field.name, $event)"
      v-bind="field"
    ></component>
  </div>
</template>

<script>
import NumberInput from "./NumberInput";
import SelectList from "./SelectList";
import TextInput from "./TextInput";
export default {
  name: "FormGenerator",
  components: { NumberInput, SelectList, TextInput },
  props: ["schema", "value"],
  data() {
    return {
      formData: this.value || {}
    };
  },
  methods: {
    updateForm(fieldName, value) {
      this.$set(this.formData, fieldName, value);
      this.$emit("input", this.formData);
    }
  }
};
</script>
```
`v-for`不用多说，`schema`就是我们在引用这个组件时外部传递进来表单数组
`:is`就是表单组件的类型
`@input`在使用`component`标签时，默认的事件名就是为input，值为value

#####3.1.5 调用表单构造器
完成以上步骤，我们可以在这个项目中本地调用以下这个组件
在`APP.vue`中引用
```vue
<template>
  <div>
    <form-generator :schema="schema" v-model="formData"></form-generator>
    <p>Hello {{formData.title}} {{formData.firstName}} {{formData.lastName}}, I hear you are {{formData.age}} years old.</p>
  </div>
</template>
<script>
import FormGenerator from "./components/v5/FormGenerator";
export default {
  name: "formlin",
  components: {
    FormGenerator
  },
  methods: {},
  data() {
    return {
      formData: {
        firstName: "Lin",
        lastName: "DaiDai"
      },
      schema: [
        {
          fieldType: "SelectList",
          name: "food",
          multi: false,
          label: "food",
          options: [
            {
              value: "黄金糕",
              label: "黄金糕"
            },
            {
              value: "双皮奶",
              label: "双皮奶"
            },
            {
              value: "蚵仔煎",
              label: "蚵仔煎"
            },
            {
              value: "龙须面",
              label: "龙须面"
            },
            {
              value: "北京烤鸭",
              label: "北京烤鸭"
            }
          ]
        },
        {
          fieldType: "TextInput",
          placeholder: "First Name",
          label: "First Name",
          name: "firstName"
        },
        {
          fieldType: "TextInput",
          placeholder: "Last Name",
          label: "Last Name",
          name: "lastName"
        },
        {
          fieldType: "NumberInput",
          placeholder: "Age",
          name: "age",
          label: "Age",
          minValue: 0
        }
      ]
    };
  }
};
</script>
<style>
</style>
```
使用`npm run dev`打开项目，是可以在页面中看到效果的，此时整个项目目录如下：
![](https://upload-images.jianshu.io/upload_images/7190596-5f3741a9fca4cd78.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
style文件夹是我个人创建的公用样式
DemoFive.vue和HellowWorld.vue可以忽略
src/index.js在后面会讲到。

#### 3.2 将整个vue项目发布至npm

要想将vue项目发布至npm上，需要做一些配置
* 修改package.json
  1. 修改"private": false
npm默认创建的项目是私有的，如果要发布至npm必须将其公开

   2.  添加"main": "dist/build.js"
通过import formlin from 'form-lin'引用该组件时，项目会自动找到node_modules/load-ling-zi/dist/build.js

* 在src加入组件代码App.vue， 并创建我们的导出文件index.js。 在index.js中添加：
```javascript
import formlin from './App.vue'

export default formlin;

//global 情况下 自动安装
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.component('formlin', formlin);
}
```
* 在`APP.vue`中做一些修改
```vue
<template>
  <div>
    <h1>Form Generator</h1>
    <form-generator :schema="schema" v-model="formData"></form-generator>
    <el-button @click="outPut">提交</el-button>
    <p>Hello {{formData.title}} {{formData.firstName}} {{formData.lastName}}, I hear you are {{formData.age}} years old.</p>
    <demo-five></demo-five>
  </div>
</template>

<script>
import DemoFive from './components/DemoFive.vue';
import FormGenerator from "./components/v5/FormGenerator";

import { Button } from 'element-ui';
export default {
    name: 'formlin',
    components: {
        DemoFive,
        FormGenerator 
    },
    methods: {
        outPut() {
            this.$emit('submit', this.formData);
        }
    },
    data() {
        return {
            formData: {
                firstName: "Lin",
                lastName: "DaiDai"
            },
            schema: [{...}]
        }
    }
}
</script>

<style>
@import "./style/common.css";
</style>
```
在`el-button`标签中添加一个click事件，用于输出`formData`
再将name修改为你要模块的名字，如我这里修改为`formlin`

* 因为最后我们是打包成一个js文件，所以需要修改一下配置文件webpack.config.js

因为不是所有使用你组件的人都是通过`npm`下载和`import`导入的，很多人是通过`<script>`直接引入的,我们要将libraryTarget改为umd,以及修改入口文件与设置导出文件目录以及名称。
```javascript
// webpack.config.js
module.export = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    publicPath: "/dist/",
    filename: "build.js",
    library: "formlin",
    libraryTarget: "umd",
    umdNamedDefine: true
  }
}
```
* 最后需要把.gitignore文件里面的/dist删除掉要不然上传时会忽略掉dist打包的文件。

完成上述步骤之后，我们就可以开始正式发布了，首先要将整个项目进行打包
使用指令
```
npm run build
```
如果报错，请检查你是否安装了相关的依赖
执行完毕之后，目录下会出现dist文件夹，里面存放的就是压缩的js文件
继续执行指令
```
npm publish
```
提示
```
+ form-lin@1.0.0
```
则表示发布成功。

#### 3.3 使用vue组件
我们将自己的vue模块已经发布到了npm上面，那么怎样使用它呢。

首先我还是先创建一个vue-cli项目，然后等会再用
```
npm i formlin -D
```
看是否能够使用它。

* 创建use-form-lin项目
```
vue init webpack use-form-lin
```
再使用指令
```
npm install element-ui -S
npm install form-lin babel-plugin-component -D
```
需要配置以下
```javascript
// main.js
import { Button, Select, Input, Option, InputNumber } from 'element-ui';
Vue.config.productionTip = false;
Vue.component(Button.name, Button);
Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.component(Input.name, Input);
Vue.component(InputNumber.name, InputNumber);

// .babelrc
{
  "presets": [["es2015", { "modules": false }]],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
```
> 组件依赖于elementUI  以上步骤是配置elementUI 当然也可以参考elementUI官网全局引用ele组件
> 传送门[elementUI](http://element.eleme.io/#/zh-CN/component/quickstart)

* 在APP.vue中使用
```vue
<template>
  <div id="app">
    <h3>use form-lin</h3>
    <formlin @submit="submitForm"></formlin>
  </div>
</template>

<script>
import formlin from 'form-lin'
export default {
  name: 'App',
  components: {
    formlin: formlin
  },
  methods: {
    submitForm($event) {
      console.log($event);
    }
  }
}
</script>
```
使用`npm run dev`打开页面可以看到效果：
![image.png](https://upload-images.jianshu.io/upload_images/7190596-333e3228f3a124a4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 后语

> 实现的功能很简单而且也很low ，甚至还要依赖于其他的UI组件，比较创建的这个vue组件里面的表单内容是写死的，你也可以多加一个prop值将内容传进去
> 最后想说的是 每个人在学习一样新东西的时候肯定都会碰到各种意想不到的情况，有时候你甚至和参考来的代码一模一样都不能实现相同的效果
> 但希望你能够坚持 在一个胡同了转太久了总是弄不出来一个东西时 你可以选择休息以下或者第二天再弄 总之不要放弃就OK

上面vue组件的源码已经上传只git 有兴趣的小伙可以给个小心心
https://github.com/LinDaiDai/vue/tree/master/form-lin

