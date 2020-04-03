### 前言
[Angular](https://www.angular.cn/) 是由谷歌开发与维护一个开发跨平台应用程序的框架，同时适用于手机与桌面。
**管道**的作用是把数据作为输入，然后转换它，给出期望的输出。

#### 7.1 使用管道

如：

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-birthday',
  template: `<p>{{ birthday }}</p>`
})
export class HeroBirthdayComponent {
  birthday = new Date(1988, 3, 15); 
}

// 不使用管道时，显示：
// Fri Apr 15 1988 00:00:00 GMT+0800 (中国标准时间)
```

使用管道后：

```html
<p>{{ birthday | date }}</p>
// Apr 15, 1988
```



#### 7.2 参数化管道

上面的案例中，使用的是data管道，来进行时间转换，有其默认的转换格式，我们也可以自定义转换格式，只需要像data管道中传递参数就可以了。

比如我们想要上面的信息转换为`1998/03/15`的格式

```html
<p>{{ birthday | date:"yyyy/MM/dd" }}</p>
```
Angular 内置了一些管道，比如 `DatePipe`，`UpperCasePipe`，`LowerCasePipe
`等待。 它们全都可以直接用在任何模板中。

要学习更多内置管道的知识，参见[API 参考手册](https://angular.cn/api?type=pipe)，并用“pipe”为关键词对结果进行过滤



#### 7.3 自定义管道

angular4还支持自定义管道，你可以自己定义想要的管道。

近期接到这样一个需求：

要求在多个页面中显示用户的头像图片，但有的用户没有上传头像的话，就需要系统根据用户性别显示默认的男/女头像。

当然这样一个简单的需求无论你是在HTML进行判断还是在js中判断都可以实现。

当若是有多个页面都需要用到的话，似乎也是一项比较繁重的任务。

所以你可以选择封装一个共用的方法在每个页面进行调用或者可以尝试**自定义一个管道**。	

博主工作中使用的是前端框架`Angularjs4`，项目整体是使用`angular-cli`进行搭建的，下面介绍的是如何在`angularjs`中自定义一个管道。

> 1.确定需求

```
多个页面显示用户头像
若是头像图片地址不存在则判断用户性别
根据用户性别显示默认的男女头像
若是性别和头像图片地址都不存在则显示默认的人形头像
```

> 2.设计管道

1.前期准备

在项目目录`src/app/common`文件夹下创建一个新文件夹`pipe`，并在`pipe`中创建一个`comm.pipe.ts`文件。

(common文件夹是我存放一些公共组件/方法/管道的文件夹,它是一个功能的模块，其中的所有组件/方法/管道我都会在common文件夹下的shared.module.ts中进行导出)

2.编写`comm.pipe.ts`

自定义管道需要先引入`@angular/core`中的`Pipe`和`PipeTransform`

```typescript
//comm.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

const sexList = ['', '男', '女'];
const uHeadImg = ['./assets/images/default_male.png', './assets/images/boy.png', './assets/images/girl.png'];

@Pipe({ name: 'portrait' })
export class Portrait implements PipeTransform {
    transform(value): string {
        let url = "";
        if (value === '男' || value === '女') {
            let idx = sexList.indexOf(value);
            url = uHeadImg[idx];
        } else {
            url = value ? value : uHeadImg[0];
        }
        return url;
    }
}
```

- 定义俩个数组一个为性别，一个为三种图片的存放路径
- 需要使用@Pipe来装饰类
- 实现PipeTransform的transform方法，该方法接受一个输入值和一些可选参数
- 在@Pipe装饰器中指定管道的名字，这个名字就可以在模板中使用。
- transform为PipeTransform中继承而来的方法，它接收0个或多个参数

> 3.导出自定义管道

在`shared.module.ts`中导出：

```typescript
//shared.module.ts

import { NgModule } from '@angular/core';
import { Portrait } from './pipe/comm.pipe';
...

@NgModule({
  imports: [
    ...
  ],
  declarations: [
  	...
    Portrait
  ],
  exports: [
    ...
    Portrait
  ]
})
export class SharedModule {

}

```

> 4.使用管道

由于管道是在`shared.module.ts`中导出的，因此要使用它就必须在要使用的模块中导入

如在`student`这个模块中使用

1.首先在`student.module.ts`中引用

```typescript
//student.module.ts

import { NgModule } from '@angular/core';
import { SharedModule } from "./../common/shared.module";
...
import { Students } from "./students"; //students为该模块下的一个页面

@NgModule({
  imports: [
    SharedModule,
    ...
  ],
  declarations: [
    Students
  ],
  providers: [
  ]
})
export class StudentModule { }
```

2.在页面中使用：

```html
//students.component.html

<div class="uHead">
	<span>学员头像：</span>
	<img src="{{studentInfo['uHeadUrl']||studentInfo.sex | portrait}}" title="头像" alt="头像">
</div>
```

- 图片的src是需要用`{{}}`的方式
- `studentInfo['uHeadUrl']||studentInfo.sex`就是传递给管道的参数，表示为如果有头像路径则传递头像路径，没有则传递性别。
- `| potrait`表示使用名为`potrait`的管道，就是你在` comm.pipe.ts`中定义的`name`

> 5.总结

在`angularjs4`中使用管道总结为这么几步：

1.定义一个自定义管道的`ts`并引入`@angular/core`中的`Pipe`来编写管道

2.将自定义管道的`ts`在模块中导出

3.要使用管道的模块中引入管道模块

4.html中使用的话采用以下方式：

```html
{{ info | PipeName }}  // PipeName为你自定义的管道名称
```