## 前言
前端框架多吗？
多！
前端UI组件库多吗？
更多！
我们都知道，前端生态圈里提供了各色各样的组件库供我们选择使用，大多数都能满足开发者的需求，相信大家也都用过很多。

但是实际上，据我了解到的，稍微大一些有自己产品的公司都会有一套自定义的UI组件库，满足自身复杂的需求与绚丽的效果。

博主目前所在的公司也有一套自己的产品，PC端所用的前端框架是[Angular4](https://angular.cn/).

Angular4其实也有它专门定制的前端组件库[PrimeNg](https://www.primefaces.org/primeng/#/).就像[Vue.js](https://cn.vuejs.org/)有[Element](http://element.eleme.io/#/zh-CN)一样.

那么按理在开发中我们已经有了前端组件库可以使用，为什么还要花那么多的精力和时间来重新设计UI组件呢？话不多说，先上几张官方提供的UI组件图：

![offSwitch](https://user-gold-cdn.xitu.io/2018/10/21/16695d7a3951589a?w=80&h=37&f=png&s=577)

![onSwitch](https://user-gold-cdn.xitu.io/2018/10/21/16695d7a39606323?w=99&h=37&f=png&s=491)

确实不是我吐槽,官方提供的一些组件样式真的有点奇怪😭...

虽然Angular官网[组件样式](https://angular.cn/guide/component-styles)这一文档中已经说明了可以用` ::ng-deep`来进行对组件样式的修改,但修改起来还是比较麻烦。有那时间，自己都已经撸了一个了...


（项目中用的`primeng`是`v4.2.2`版本的,目前已经迭代到了`v6.1.5`,所以现在官网上看到的`inputSwitch`组件会比这个好看点）


emmm....为了追求用户体验(呸,熟悉`angular4`的使用)所以博主决定利用闲暇之余自定义一些UI组件,以满足我们产品"一些无礼的要求"。

### 一、确定组件存放的位置
一个项目中会有各种文件、文件夹，如何存放管理好这些文件真的很重要。不仅为自己提供了方便，也为后来的开发者提供方便。

所以我们在设计公用组件的时候也应该把它们都归结在一起。

我习惯在项目中新建一个`common`文件夹，里面存放一些共用的`compoent`，`service`等等。
![app/common/component](https://user-gold-cdn.xitu.io/2018/10/21/16695d7a39c94b2d?w=279&h=854&f=png&s=8645)
如上图，可以看到`common`文件夹下导出的是一个名为`shared`的模块。
`shared`模块的创建过程：
（1）打开命令行(使用vscode编辑器的小伙可以直接使用Ctrl+` 快捷键打开终端,然后一路跳转到common文件夹:
```
cd src\app\common
```
(2) 使用创建模块的指令：
```
ng g m shared
```
其实很好理解:`ng`为`angular`一贯的指令,`g`为`generate`创建的缩写,`m`为`module`模块的缩写,后面接着你的模块名。(后面创建组件也是这个原理)

创建的模块实际上导出的是一个带有`@NgModule`装饰器的类而已，其中提供了我们自定义的公有组件`component`，公有服务`service`，以及管道`pipe`等等。

### 二、创建组件
由于我们要创建的是一个`switch`公用组件，所以在`component`文件夹下在创建一个文件夹`general-control`，之前都是直接堆积在`component`文件夹下的，近期发现堆得有点多了，所以又单独创建了一个`general-control`文件夹来存放一些基础的公用组件。

此时你需要打开命令行(使用vscode编辑器的小伙可以直接使用Ctrl+` 快捷键打开终端,然后一路跳转到general-control文件夹：
```
cd src\app\common\component\general-control
```
在此目录下执行指令：
```
ng g c switch
```
上面指令的意思是创建一个名为`switch`的组件，原理和创建模块时一样。

可以看到现在的`general-control`文件夹下多出了一些东西：

![switch文件夹](https://user-gold-cdn.xitu.io/2018/10/21/16695d7a3a3752d3)
没错,就是我们使用指令创建的`switch`组件。

指令会自动帮你生成一个文件夹和4个文件。(基于`TypeScript`的语法，所以生成的`js`文件也就是`ts`)

很好理解，对应的`html`文件编写`HTML代码`，`css`文件编写`CSS代码`，`ts`文件编写`js`代码，至于`spec.ts`文件我们可以不用管它。

由于我在项目中使用的是[sass](https://www.sass.hk/)，所以将`switch.component.css`这个文件的后缀名修改为`scss`（使用了less等其它扩展语言的小伙同理）,并在`ts`中对`css`的引用进行修改：

![scss](https://user-gold-cdn.xitu.io/2018/10/21/16695d7a3c67cca0?w=248&h=135&f=png&s=8230)
![修改ts](https://user-gold-cdn.xitu.io/2018/10/21/16695d7a3a456d11?w=891&h=264&f=png&s=24234)

使用上面的指令创建的组件是会被自动引用到`shared`这个模块中的。
`shared.module.ts`:
```ts
import { SwitchComponent } from './component/general-control/switch/switch.component';//模块中import引入组件

@NgModule({
declarations: [
  SwitchComponent  //模块中声明组件
  ...
  ]
})
```

上面俩步是你在使用`ng g c switch`指令时自动帮你完成的，但若是你想在其它的模块中使用这个`switch`组件，还得将其导出，导出的方式是将这个组件添加至`shared.module.ts`文件的`exports`中：
```ts
import { SwitchComponent } from './component/general-control/switch/switch.component';//模块中import引入组件

@NgModule({
  declarations: [
    SwitchComponent  //模块中声明组件
    ...
    ],
  exports: [
    SwitchComponent  //模块中导出组件
    ...
  ]
})
```
完成上面的步骤你就可以安心的来开发自己的组件了。

### 三、编写switch组件
一番查找，发现网上也有很多自定义`switch`组件的文章和源码，可能是大家都觉得原生的样式不好看吧...
有使用`input`然后来进行修改样式的，也有用其它标签来自定义的。
博主这里找了一个最简单方案，一个`span`标签搞定：
```html
// switch.component.html
<span class="weui-switch" [ngClass]="currentClass" [ngStyle]="style" (click)="toggle()">
    
</span>
```
基础css
```scss
// switch.comonent.scss
.weui-switch {
    display: inline-block;
    position: relative;
    width: 38px;
    height: 23px;
    border: 1px solid #DFDFDF;
    outline: 0;
    border-radius: 16px;
    box-sizing: border-box;
    background-color: #DFDFDF;
    transition: background-color 0.1s, border 0.1s;
    cursor: pointer;
    &.disabled{
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
  .weui-switch:before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 15px;
    background-color: #FDFDFD;
    transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
  }
  .weui-switch:after {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 56%;
    height: 97%;
    border-radius: 15px;
    background-color: #FFFFFF;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
  }
  .weui-switch-on {
    border-color: #1AAD19;
    background-color: #1AAD19;
  }
  .weui-switch-on:before {
    border-color: #1AAD19;
    background-color: #1AAD19;
  }
  .weui-switch-on:after {
    transform: translateX(77%);
  }
```
效果大概就是这个样子:
![自定义switch组件](https://user-gold-cdn.xitu.io/2018/10/21/16695d7a7efda08b?w=283&h=147&f=gif&s=13391)

（录频并转换GIF推荐使用[GifGam](https://gifcam.en.softonic.com/)）
可以看到，组件的样式设计大多都是使用伪类`:after`和`:before`来实现的，而开关的效果是通过点击的时候添

加/移除`class`名`weui-switch-on`来实现的。（讲js的时候会讲到）

由于我们创建的`switch`组件是需要在多处使用，并且要向外输出一些值，所以在`ts`中我们首先要引入一下`@Input`、`@Output`装饰器和`EventEmitter`。

```ts
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
```
并且定义一些基础的变量

```ts
  @Input() style;//{ 'width': '40px' }//外部组件输入的样式对象
  @Input() isChecked: boolean = false;//开关是否打开
  @Input() disabled: boolean = false;//开关是否被禁用
  @Output() change: EventEmitter<any> = new EventEmitter();
  _isSwitch: boolean = false;
  currentClass = {}
```
此时我们的`ts`变成了这样：

```ts
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnInit, OnChanges {
  constructor() { }
  @Input() style;//{ 'width': '40px' }//外部组件输入的样式对象
  @Input() isChecked: boolean = false;//外部组件输入进来的：开关是否打开
  @Input() disabled: boolean = false;//开关是否被禁用
  @Output() change: EventEmitter<any> = new EventEmitter();
  _isSwitch: boolean = false;//switch组件本身的：开关是否打开
  currentClass = {} //class集合
  
  ngOnInit() {//初始化组件的生命周期
    
  }
  ngOnChanges() {//当被绑定的输入属性的值发生变化时调用
    
  }
}
```

#### 3.1 setIsSwitch()方法
组件中定义了俩个“开关是否打开”的变量`isChecked`和`_isSwitch`

一个是外部组件传递进来的默认值，一个是 `switch`组件自身的值。

所以在组件进行初始化和发生改变的时候我们应该让其统一：

```ts
  ngOnInit() {//初始化组件的生命周期
    this.setIsSwitch();
  }
  ngOnChanges() {//当被绑定的输入属性的值发生变化时调用
    this.setIsSwitch();
  }
  setIsSwitch() {//设置_isSwitch
    this._isSwitch = this.isChecked;
  }
```
#### 3.2 setStyle()方法
由于是自定义的组件，我们当然是希望大小也可以自定义，所以我想要的效果是：

在调用组件的时候，输入一个宽度`width`属性，组件能够自动调节尺寸。

因此我在设计的时候就定义了一个`style`变量

它是一个对象，可以允许开发者输入任意的样式，格式为`{ 'width': '40px' }`

同时为了减少输入样式的复杂度，我们还可以来编写一个方法，让组件能够根据宽度来调节高度：

```
setStyle() {//设置样式
    if (this.style) {
      if (this.style['width'] && !this.style['height']) {//若是输入了宽度没有输入高度则自动计算
        let width = this.getWidth(this.style['width']);
        this.style['height'] = (width * 0.55) + 'px';
      }
    }
  }
getWidth(widthStr) {//判断用户输入的width带不带px单位
    let reg = /px/;
    let width = reg.test(widthStr) ? widthStr.match(/(\d*)px/)[1] : widthStr //正则获取不带单位的值
    if (!width) width = 0;
    return width;
  }
```
可以看到，上面我编写的`setStyle()`方法是判断有没有宽度和高度，并将高度设置为`0.55 * width`(0.55为我找到的最合适的比例)
#### 3.3 setClass()方法
完成了上面的步骤我们基本就完成了对组件样式的初始化，但是，最重要的一步当然是通过添加/移除一些类来进行组件的交互：

```ts
 setClass() {//转换switch时切换class
    this.currentClass = {
      'disabled': this.disabled,
      'bg_main bor_main weui-switch-on': this._isSwitch
    }
  }
```

对象`currentClass`存储的是组件变动的类名，对象的键名为类名，值为一个布尔类型的变量(true / false)

通过布尔类型的变量来判断添加还是移除这些类名。

第一个类`disabled`表示的是开关是否被禁用，也就是用户只能查看开关，并不能对其进行操作，它受`disabled`变量控制。

第二个类为三个类名的合写`bg_main`、`bor_main`、和`weui-switch-on`，他们受`_isSwitch`变量控制，
也就是开关打开的时候则添加这三个类。

前俩个类名是我在项目中使用的“皮肤类名”，因为客户的需要，我们产品有几套不同的主题色，用户可以进行换肤功能来切换主题色，因此就有一些类名需要用来控制主题色。

如橘色主题：
```scss
.bg_main {
            background-color: #ff7920!important;
}
.bor_main {
            border-color: #ff7920!important;
}
```
当然，你若是没有主题色的话请忽略这俩个类。

上面的几个方法我们都需要在组件初始化和变量发生改变的时候调用，所以可以整合到一个函数中：
```ts
  ngOnInit() {
    this.initComponent();
  }
  ngOnChanges() {
    this.initComponent();
  }
  initComponent() {
    this.setIsSwitch();
    this.setStyle();
    this.setClass();
  }
```
#### 3.4 toggle()方法

光有样式可没用，我们还需要将组件和用户的行为给结合在一起，因此给组件一个`click`事件来进行交互，并编写`toggle()`方法：

```typescript
toggle() {//切换switch
    if (this.disabled) return;//若是禁用时则直接返回
    this._isSwitch = !this._isSwitch;
    this.isChecked = this._isSwitch;
    this.change.emit(this._isSwitch); //向外部传递最新的值
  }
```
整合后的`ts`文件为这样：

```typescript
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnInit, OnChanges {

  constructor() { }
  @Input() onLabel: string = '';//暂无
  @Input() offLabel: string = '';
  @Input() style;//{ 'width': '40px' }//外部组件输入的样式对象
  @Input() isChecked: boolean = false;//开关是否打开
  @Input() disabled: boolean = false;//开关是否被禁用
  @Output() change: EventEmitter<any> = new EventEmitter();
  _isSwitch: boolean = false;
  currentClass = {}

  ngOnInit() {
    this.initComponent();
  }
  ngOnChanges() {
    this.initComponent();
  }
  initComponent() {//初始化并刷新组件
    this.setIsSwitch();
    this.setStyle();
    this.setClass();
  }
  setIsSwitch() {
    this._isSwitch = this.isChecked;
  }
  setStyle() {//设置样式
    if (this.style) {
      if (this.style['width'] && !this.style['height']) {//若是输入了宽度没有输入高度则自动计算
        let width = this.getWidth(this.style['width']);
        this.style['height'] = (width * 0.55) + 'px';
      }
    }
  }
  setClass() {//转换switch时切换class
    this.currentClass = {
      'disabled': this.disabled,
      'bg_main bor_main weui-switch-on': this._isSwitch
    }
  }
  getWidth(widthStr) {//判断用户输入的width带不带px单位
    let reg = /px/;
    let width = reg.test(widthStr) ? widthStr.match(/(\d*)px/)[1] : widthStr //正则获取不带单位的值
    if (!width) width = 0;
    return width;
  }
  toggle() {//切换switch
    if (this.disabled) return;//若是禁用时则直接返回
    this._isSwitch = !this._isSwitch;
    this.isChecked = this._isSwitch;
    this.change.emit(this._isSwitch);
  }
}
```
### 四、引用switch组件

完成了上面的部分，到了我们最激动的时候了，看看我们亲手制作的组件有没有用吧，哈哈。

首先，在使用其它组件的时候，我们要将其引入进来，由于我们最开始是将`switch`组件引入到`shared`这个模块中，并从这个模块中导出的，所以想要在其它模块中使用 `switch`组件就得先引入`shared`模块。

#### 4.1 引入shared模块
本项目中有另一个模块名为`coursemanage`，现在我将其作为父组件来引用一下`switch`组件
首先在模块里引用：

```
//coursemanage.module.ts
import { NgModule } from '@angular/core';
import { SharedModule } from "./../common/shared.module";
@NgModule({
  imports: [
      SharedModule
  ]
})
export class CourseManageModule { }
```
引入了`shared`模块就相当于是引入那个那个模块中的所有组件和方法。

#### 4.2 使用switch组件

在`coursemanage`模块中，有其子组件`course`这个组件，在`course`中使用`switch`

```html
<!--course.component.html-->
<app-switch [isChecked]="dataStatus" (change)="changeSwitch($event)"></app-switch>
```
```ts
//course.component.ts

dataStatus: boolean = false;
changeSwitch($event) {
  this.dataStatus = $event;
}
```
此时就完成了`switch`组件的编写和使用。
你也可以给组件设置另一个属性`disabled`:
```html
<!--course.component.html-->
<app-switch [isChecked]="dataStatus" [disable]="true" (change)="changeSwitch($event)"></app-switch>
```

### 后语
上述设计的switch组件应该是UI组件中比较简单的一种UI组件了，还有更多复杂的组件有待我们的开发，通过自己设计UI组件，emmm....可以让我们更有创造力吧应该说，也促使自己多去看别人的博客与源码，最后再写上一篇总结，我认为这应该是一个正向的激励💪，哈哈，全篇废话很多，不过还是要感谢小伙的阅读🙂。