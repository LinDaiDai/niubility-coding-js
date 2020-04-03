# nth伪类选择器

## 1 :nth-child(){ }

> 作用： 选择父元素的第几个子元素

```html
<body>
	<div>
		<p></p>
		<p></p>
		<p></p>
	</div>
</body>
```

### 用法1:所有子元素: 

```css
div:nth-child(n){
	color: red;
}
```



### 用法2:所有奇数子元素: 

```css
div:nth-child(2n+1){
	color: red;
}
```



### 用法3:所有偶数子元素 : 

```css
div:nth-child(2n){
	color: red;
}
```



### 用法4:选择父元素的第几个子元素

```css
div:nth-child(2){
	color: red;
}
```



### 用法5:选择父元素标签内部第n个元素 

**第n个元素必须的是:前面的这个标签才能生效 如果匹配失败，则不生效**

例：

```html
<style>
    ul p:nth-child(2) {
        background: red;/*无效：想选择的是ul下的第二个p标签，但ul标签中没有p标签 所以不能生效;*/
    }
    ul li:nth-child(2) {/*有效：想选择的是ul下的第二个li标签，nth-child(2)前面也是li 所以能生效;*/
        background: red;
    }
</style>
<body>
    <ul>
        <li>我是li1</li>
        <li>我是li2</li>
    </ul>
</body>
```

### 用法6 :nth-child(n+m){}     

> 表示从第m个值开始,取包裹m的之后的所有项

例：

```
:nth-child(n+2){}     表示选取除了第一项的所有项

:nth-child(-n+m){}     表示选取前m项(包裹m)
如：:nth-child(-n+2)     表示选取第一第二项;
```



## 2 :nth-last-child(){}

> 用法：与`:nth-child()`用法相似，不过是从后往前

如：

选择父元素的倒数第二个子元素的 div 标签

```css
 div:nth-last-child(2){ }
```



## 3 :nth-of-type(){ }

> 作用：选择属于其父元素的 第几个标签元素

例：选择父元素的第二个p标签和第二个li标签

```html
<style>
    ul p:nth-of-type(2) {
    	background: red;
    }
    ul li:nth-of-type(2) {
    	background: red;
    }
</style>
<body>
    <ul>
        <p>我是p1</p>
        <p>我是p2</p><!--红色-->
        <li>我是li1</li>
        <li>我是li2</li><!--红色-->
    </ul>
</body>
```



## 4 :nth-last-of-type(){ }

> 选择属于其父元素的倒数 第几个标签元素



