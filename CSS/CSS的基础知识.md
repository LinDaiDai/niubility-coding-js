# CSS的基本知识
目录: 1.CSS的作用 2.CSS的引入方式: 3.CSS的引入方式的优先级问题 4.CSS的选择器 5.CSS选择器的优先级 6.overflow 7.float 8.clear 9.zoom 10.! important

## 1.CSS的作用:
> 作用：将标签的样式进行修改

## 2. CSS的引入方式

### 2.1内联样式

```html
<div style="width:100px;height:100px;"> </div>
```

​ 优点：优先级最高；

​ 缺点： 代码冗余、代码混乱、维护困难；

​ 使用场景：已经确定了的不会再有更改特定情况下才会使用。



### 2.2.内部样式

```css
<head>
<style>
    div{
        width:100px;
        height:100px;
    }
</style>
</head>
```

​ 优点：初步实现了结构与样式之间的分离、逻辑关系相对清楚、不会造成额外的服务器请求压力。

​ 缺点：造成单个文件体积过大、造成前后端交互困难。

​ 使用场景：大型网站的首页。



### 3.外部样式

> link: 用于引入其他文件；

```html
<link rel="stylesheet" type="text/css" href="css/html.css" >
```

属性： 

* rel  引入文件和当前文件的关系stylesheet
* href   引入文件的路径（地址）
* type  引入文件的类型

优点：结构与样式之间的分离、易于维护、一个样式库可以应用于多个页面
缺点：会造成额外的服务器请求压力、可能会造成代码冲突、造成垃圾代码
使用场景：大型网站的二三级页面。



## 3. CSS的引入方式的优先级问题

> 优先级问题 ：

内联样式 > 外部样式

内联样式 > 内部样式

如果选择器优先级相同，则后加载的生效

如果选择器优先级不同，则按选择器优先级



## 4. CSS的选择器

### 4.1 常用选择器

> 1.继承
> 权重：0.00001 (最低)

```html
//如
</style>
	.father {
    	font-size: 14px;
	}
</style>
<body>
	<div class="fahter">
		<p>我是p标签</p>
	</div>
</body>
```

上面的案例我给`class`为`father`的元素设置了字体大小为`14px`,则其子元素的字体大小也为`14px`,这就是继承。（并不是所有的css属性都可以继承给子元素,具体的能继承的属性请移步)



> 2.通配符选择器
> 权重：0.1
>
> *{ } 直接匹配所有的标签

```css
//页面上所有的元素都有这个属性
*{
    font-size: 14px;
}
```

**注意：通配符在执行的时候，会直接匹配所有的标签，这样也就导致了 通配符选择器的性能极其低下 平时开发时禁止使用该内容 如果需要清除对应的标签的样式，需要引用 reset.css**



> 3.标签名选择器
> 权数重： 1

```css
div {
	width: 100px;
}
```



> 4.类选择器
> 也称class选择器
>
> 权重：10

​ **用法 ：**

1.在标签内部设置一个 class 名称

2.在css样式中使用`. + class名称 + { }`设置样式

```html
. +class 名称 + { }

//如
</style>
	.father {
    	width: 100px;
    	height: 100px;
    	background: red;
	}
</style>
<body>
	<div class="fahter"></div>
</body>
```

​ 生效范围： 针对所有class 名称相同的标签生效。



> 5.ID选择器
> 权重:100

**用法：**

1.设置 ID名称

2.在css样式中使用`# + id名称 +{ }`设置样式

```html
# + id名称 +{ }

//如
</style>
	#father {
    	width: 100px;
    	height: 100px;
    	background: red;
	}
</style>
<body>
	<div id="fahter"></div>
</body>
```

生效范围：同一个ID名称在一个页面中只能使用一次



> 6.内联选择器
> 权重：1000；

**用法：**

```html
<div style="width: 100px"></div>
```



::: tip

上面介绍的选择器都有它们各自的权重,选择器直接也是可以叠加的

:::



> 7.后代选择器（也称包含选择器）

​ **注意事项:**

1. 后代选择器可以嵌套多次
2. 放在后面的内容一定要属于前面内容的'子级'(选择内部的孩子)
3. 后代选择器时直接选择所有辈分 条件符合的孩子 不区分是 儿子 还是孙子

**用法：**

```html
<style>
	.father p {
       color: red; 
	}
</style>

<body>
    <div class="father">
        <div>
        	<p>我是p标签</p>
        </div>
        <p>我是p标签</p>
    </div>
</body>
```

上述案例中的`class`为`father`下的所有`p`标签的字都会变为红色



> 8.子代选择器 ： 只选择直系的后代 .class_1 > p { }

**用法：**

```html
<style>
	.father>p {
       color: red; 
	}
</style>

<body>
    <div class="father">
        <div>
        	<p>我是p1</p>
        </div>
        <p>我是p2</p>
    </div>
</body>
```

上述案例中,只有`class`为`father`的直系后代的`p`标签的字才会变为红色,也就是`p2`



> 9.相邻兄弟选择器
> 用法： 选择器1+选择器2{ }

**注意：**

* 俩个选择器必须是兄弟关系(也就是要有同一个父级)
* 俩个选择器必须是紧挨着的
* 选择的是相连接的后面的兄弟

```html
<style>
	.item2 + li {
        font-weight:bold;
        color: red;
    }
</style>
<body>
    <div>
        <ul>
          <li>List item 1</li>
          <li class="item2">List item 2</li>
          <li>List item 3</li><!--红色-->
          <li>List item 4</li>
        </ul>
        <ol>
          <li>List item 1</li>
          <li class="item2">List item 2</li>
          <li>List item 3</li><!--红色-->
          <li>List item 4</li>
        </ol>
      </div>
</body>
```

**上面这个选择器只会把列表中的`class`为`item2`的后面的`item3`变为红色。第一个列表项和`item2`本身不受影响。**



> 10.同级元素通用选择器
> 用法：选择器1~选择器2{ }

**注意：**

* 俩个选择器之间需要有相同的父级
* 选择器2必须处于选择器1的后面
* 选择具有相同的父级，并且加载顺序处于后面的内容

```html
<style>
	.item2 ~ li {
        font-weight:bold;
        color: red;
    }
</style>
<body>
    <div>
        <ul>
          <li>List item 1</li>
          <li class="item2">List item 2</li>
          <li>List item 3</li><!--红色-->
          <li>List item 4</li><!--红色-->
        </ul>
        <ol>
          <li>List item 1</li>
          <li class="item2">List item 2</li>
          <li>List item 3</li><!--红色-->
          <li>List item 4</li><!--红色-->
        </ol>
      </div>
</body>
```

**上面这个选择器会把列表中的`class`为`item2`的后面的列表项变为红色。第一个列表项和`item2`本身不受影响。**

**可以看到选择器 `+`和`~`的区别就是`+`只针对一项元素,而`~`可能是多项的。**



> 11.属性选择器

**用法：**

* [属性名称] + { }

* [属性名称 = 属性值] + { }

```html
<style>
    [blue] {
        color: blue;
    }
    input[type="text"] {
        width:150px;
        display:block;
        margin-bottom:10px;
        background-color:yellow;
        font-family: Verdana, Arial;
     }
 </style>
 <body>
 	<input type="text" />
 	<ul>
        <li blue>List item 1</li><!--蓝色-->
        <li>List item 2</li>
        <li>List item 3</li>
        <li>List item 4</li>
    </ul>
 	
 </body>
```

**只有在规定了 !DOCTYPE 时，IE7 和 IE8 才支持属性选择器。在 IE6 及更低的版本中，不支持属性选择**



> 12.群组选择器
> 权重：不涉及

**目的： 省略代码(通过将不同选择器中相同部分抽离，统一设置)**

**使用方式:**

```css
选择器1,选择器2, 选择器3... 选择器n{
	某些相同的样式
}

.div1, .div2, .div3{
	width:300px;
	height:300px;
}
```



### 4.2 权重的计算

权重的计算规则：相加

> 目的: 为了选择属于某一个"内容之中"的某些元素

​ **使用方式:**

```css
选择器1 + 空格 + 选择器2 + 选择器n {
 	需要设置的内容
}
```



## 5. CSS选择器的优先级

ID > class >标签名

描述越精确，优先级越⾼高

权位相加 权位越大 优先级越高

## 6. overflow属性

> 作用：规定超出范围的内容如何进行显示,不可继承



> 代码⌨️

```css
div{
  	width:150px;
  	height:150px;
  	overflow:scroll;
}
```



> 属性值✍️

### 6.1 visible

超出部分不做处理,内容不会被修剪,会呈现在元素框之外（默认样式）

### 6.2 scroll

让超出部分以滚动条的方式来显示；

### 6.3 hidden

让超出部分隐藏

### 6.4 auto

如果内容被修剪，则浏览器会显示滚动条以便查看其余的内容

### 6.5 inherit

规定应该从父元素继承 overflow 属性的值



> overflow-x和overflow-y

`overflow`实际上包含的是`x` 轴和`y`轴俩个方向,也可以将俩个方向分别设置

```css
div {
    width: 200px;
    height: 200px;
    overflow-x: scroll;
}
```

**overflow 在不同浏览器中呈现方式不一样，有兼容性问题**



## 7. float属性

> 作用：设置元素浮动

### 7.1 属性值

* left 左浮动

* right 右浮动

* none 不浮动

### 7.2 浮动的特性

1. 浮动会使元素脱离“文档流”；（和绝对定位一样）

文档流：我们页面布局排列的时候所在一个层级，所有基础内容的布局全部都是处于这一层级当中

2. 浮动会使元素脱离文档流“半级”（压住属性压不住内容   和绝对定位的区别）
3. 浮动会使没有设置宽度的元素，由内容来撑开宽度，宽度为父级元素的宽度；（和绝对定位一样）
4. 浮动会使内联元素重新支持宽高；（和绝对定位一样）
5. 浮动会使内联元素正常显示padding和margin；（和绝对定位一样）

6. 浮动是针对它的下一个元素生效，对前一个对象无影响；

7. 浮动的停止：1.浮动元素遇到父级的边界会停止；2.浮动元素碰到相同浮动方向的元素

8. 可以设置clear属性来清除浮动

### 7.3 清除浮动

1.在浮动元素的下一个元素设置clear属性

> clear: 属性

left 清除左浮动

right 清除右浮动

both 清除左右俩边的浮动

none 不清除浮动



2.清除浮动第二个方法：

在要清除浮动的标签加上:after{ } 原因是clear针对浮动元素的下一个元素 在父级后面加一个空的元素并清除他的浮动就可以解决父级塌陷的问题；

```css
.father:after{
	content:"";
	display:block;
	clear:both;
}
```

例：

```html
<style>
	.father{
        width:1000px;
        border:5px solid black;
	}
    .son_1{
        width:200px;
        height:200px;
        float:left;
    }
    .son_2{
        width:200px;
        height:200px;
        float:left;
    }

    .father:after{
        content"";
        display:block;
        clear:both;
    }
</style>
<body>
    <div class="father">
        <div class="son_1"></div>
        <div class="son_1"></div>
    </div>
</body>
```



3.其他清除浮动方法：

* 给父级float:left;  弊端： 会影响后面的元素
  如：给父级height:500px; 子级高度改变父级也要改变

* 给父级overflow:hidden; 弊端：不同浏览器会有兼容性问题

* 给父级display:inline-block; 弊端：改变了父级原本的盒子类型



## 8. Zoom

修改页面加载时的倍率；

为了触发 IE 浏览器的 haslayout 特性；

## 9. ! important

!important是CSS1就定义的语法，作用是提高指定样式规则的应用优先权。

> 语法格式 { cssRule !important }，

即写在定义的最后面，例如：

```html
.box{
	color:red;!important;
}
<body>
	<div class="box" style="color: blue;">I'm a box</div><!--最终显示的还是红色-->
</body>
```

**在CSS中，通过对某一样式声明! important ，可以更改默认的CSS样式优先级规则，使该条样式属性声明具有最高优先级，也就是相当于写在最下面。**



## 10. z-index

> 作用：设置内容在z轴上的数值,也就是设置元素的层级,这个数值不限制正负，但是负数会导致用户事件无法被传递（所有不要设定为负数）；
> z-index未设置时  默认为auto

```css
.box{
    z-index: 100;
}
```

