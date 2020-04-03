# 基本的表单标签

## 1. form

双标签

语义：定义表单

> 代码⌨️

```html
<form action="form_action.asp" method="get">
  <p>First name: <input type="text" name="fname" /></p>
  <p>Last name: <input type="text" name="lname" /></p>
  <input type="submit" value="Submit" />
</form>
```



### 1.1 属性

#### 1. action

> 作用：表单需要提交的地址,向何处发送表单数据

> 代码⌨️

```html
<form action="URL">
```

URL为表单提交的地址,可能的值有：

- 绝对 URL - 指向其他站点（比如 src="www.example.com/example.htm"）
- 相对 URL - 指向站点内的文件（比如 src="example.htm"）



#### 2. method

> 作用：表单提交的方式

> 代码⌨️

```html
<form action="example.htm" method="get">
  <p>First name: <input type="text" name="fname" /></p>
  <p>Last name: <input type="text" name="lname" /></p>
  <input type="submit" value="Submit" />
</form>
```

可能的值有：

* get 也是默认值,一般用于从服务器上获取数据,安全性上不如post
* post 一般用于向服务器传送数据



## 2. input

单标签

语意: 输入型表单控件

> 代码⌨️

```html
<input type="submit" value="Submit" />
```



### 2.1 属性

#### 1. type

> 作用：规定input元素的类型

> 代码⌨️

```html
<input type="submit" />
```

可能的值：

1.text  文本输入框,默认值

> 属性✍️

placeholder   文本框提示语

maxlength     文本可输入最大长度

```html
<input type="text" placeholder="请输入" maxlength="20" />
```



2.password    密文输入框

也是一个文本输入框,与它的区别是密文输入框内输入的内容是不可见的,会被显示为一个个小黑点.

> 属性✍️

placeholder   文本框提示语

maxlength     文本可输入最大长度



3.radio   单选框

相同类型的单选框，name 属性需要相同

> 属性✍️

name   设置radio的名称

value 属性值

disabled 是否禁用 设置了这个属性之后单选框为禁用状态

checked    单选框的默认选项    checked="checked"

```html
<input type="radio" name="sex" value="man"/>男
<input type="radio" name="sex" value="girl"/>女

<!--默认为男-->
<input type="radio" name="sex" checked="checked"/>男
<input type="radio" name="sex"/>女

<!--直接写checked也是和上面等效的-->
<input type="radio" name="sex" checked/>男
<input type="radio" name="sex"/>女

<!--禁用状态-->
<input type="radio" name="sex" disabled/>男
<input type="radio" name="sex"/>女
```



4.checkbox   复选框

> 属性✍️

name   设置checkbox的名称

value 属性值

disabled 是否禁用 设置了这个属性之后多选框为禁用状态

checked    复选框的默认选项    checked="checked"

```html
<input type="checkbox" name="hobby" value="eat" checked/>吃饭
<input type="checkbox" name="hobby" value="sleep"/>睡觉
<input type="checkbox" name="hobby" value="swim"/>洗澡
<input type="checkbox" name="hobby" value="programme"/>编程
```



5.hidden   隐藏

这种类型的输入元素实际上是隐藏的。

这个不可见的表单元素的 value 属性保存了一个要提交给 Web 服务器的任意字符串。

如果想要提交并非用户直接输入的数据的话，就是用这种类型的元素。

> 属性✍️

name  设置或返回隐藏域的名称

value  设置或返回隐藏域的 value 属性的值

```html
<input type="hidden" name="height" value="100"/>
```



6.button   表单的普通按钮

> 属性✍️

value 按钮上显示的字 

disabled  是否禁用按钮

```html
<input type="button" value="点击">
```



7.submit     表单的提交按钮

> 属性✍️

value 按钮上显示的字 

name  设置或返回submit的名称

disabled  是否禁用按钮

> 与button的区别

- `<input type="button" />` 这就是一个按钮,如果你不写javascript 的话,按下去什么也不会发生
- `<input type="submit" />` 这样的按钮用户点击之后会自动提交 form,除非你写了javascript 阻止它
- `<button></button>`这个按钮放在 form 中也会点击自动提交,比前两个的优点是按钮的内容不光可以有文字,还可以有图片等多媒体内容.（当然，前两个用图片背景也可以做到）.它的缺点是不同的浏览器得到的 value 值不同;可能还有其他的浏览器兼容问题



8.reset     重置按钮

> 属性✍️

value 按钮上显示的字,默认值为“重置“

name  设置或返回重置按钮的名称

disabled  是否禁用按钮



#### 2. name

> 作用：定义 input 元素的名称   (键值对：名称 = 数值 ，KEY = VALUE)

> 代码⌨️

```html
<input name="firstName" />
```



#### 3. value

> 作用： input输入内容的值

> 代码⌨️

```html
<input type="submit" value="Submit" />
```



## 3. select

下拉菜单

双标签

内部需要使用option 来作为菜单的列表项

name设置给select , option 设置 value

可以通过设置selected 属性来设置默认首选项

```html
<select name="wd">
	<option value="选项1">选项1</option>
   	<option value="选项1">选项1</option>
</select>
```



## 4. textarea

文本输入域

单标签

> CSS属性

resize   设置文本框是否可拉伸,设置为 "none" 则不可以

```css
textarea {
    resize: none;
}
```

> 属性✍️

name 设置并返回textarea的名称

value 设置或返回在 textarea 中的文本

placeholder   文本框提示语

maxlength     文本可输入最大长度

cols  文本框的宽度

rows 文本框的高度

disabled  是否被禁用

```html
<textarea cols="3" rows="10" maxlength="20" placeholder="请输入"></textarea>
```

