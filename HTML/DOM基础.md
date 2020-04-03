# DOM基础

## 第一章:DOM概述

### 1.1DOM以及节点概念

​	

文档对象模型DOM（Document Object Model）定义访问和处理HTML文档的标准方法。

	DOM 将HTML文档呈现为带有元素、属性和文本的树结构（节点树）。
	
	![img1](https://github.com/LinDaiDai/JavaScript/blob/master/DomImg/img1.png?raw=trueE:\JavaScript\DomImg\img1.png)
	
	**HTML**文档可以说由节点构成的集合，DOM节点有:

1. 元素节点：**上图中<html>、<body>、<p>等都是元素节点，即标签。**

   

2. 文本节点:**向用户展示的内容，如<li>...</li>中的JavaScript、DOM、CSS等文本,即标签内部的纯文本.**

   

3. 属性节点:元素属性，如<a>标签的链接属性href="http://www.imooc.com",即标签的属性.



 document节点是每个文档的根节点

document节点下面只有一个 html节点，我们称之为**文档元素**。

(documentElement)文档元素是文档的最外层元素，其他元素都包含在文档元素中。

一个文档只能有一个文档元素，在html中文档元素永远是 `<html>`元素。

在DOM树中，html文档中每一处标记都可以用树中的一个节点来表示。

html(元素)标签，通过元素节点表示属性，通过属性节点来表示文档类型，通过文档类型节点来表示注释，通过注释类型来表示

### 1.2节点的属性(特性)



每一个节点都有三个特点: 

    1.nodeName      节点名称(只读)    
    
    2.nodeValue     节点值(设置或返回节点的值)     
    
    3.nodeType      节点类型

1.**nodeName**：节点名称(nodeName 始终包含 HTML 元素的大写字母标签名) nodeName 是只读的

2.元素节点的 nodeName 与标签名相同

3.属性节点的 nodeName 与属性名相同（元素.getAttributeNode(“属性名”)获取属性节点）4.文本节点的 nodeName 始终是 #text（通过元素的子节点获取）

5.注释节点的nodeName是#comment（通过元素的子节点获取）

6.文档节点的 nodeName 始终是 #document

7.**nodeValue**：节点值 （设置或返回节点的值）

8.元素节点的 nodeValue 是 undefined 或 null

9.属性节点的 nodeValue 是属性值

10.文本节点的 nodeValue 是文本本身

11.注释节点的nodeValue是注释里面的内容

12.文档节点的nodeValue 是null

13.**nodeType**：节点类型

14.元素 element 1

15.属性 attr 2

16.文本 text 3

17.注释 comments 8

18.文档 document 9

*例:*	

```
<body>
<p id = "p" class = "abc">您好</p>
<script>
    var p = document.getElementById('p');
    p.nodeName      P
    p.nodeValue     null
    p.nodeType     1     元素节点
    var text = p.firstChild;
    text.nodeName     #text
    text.nodeValue     您好
    text.nodeType     3     文本节点
    var attrNode = p.getAttributeNode("id");
    attrNode.nodeName     id
    attrNode.nodeValue     p
    attrNode.nodeType     2     属性节点
 </script>
 </body>
```



## 第二章:document对象

### 2.1获取节点

#### 1.getElementById('id名')

	根据元素的id名来获取节点
	
	**IE5以下不兼容**

#### 2.getElementsByTagName('标签名')

	根据元素的标签名来获取节点.一个文档中可能会存在很多相同的标签名,因此用此方法获取到的是多个element组成的集合

#### 3.getElementsByName('name')	

	根据标签的name属性来获取节点,返回的也是多个element组成的集合;
	
	**注:**不是所有标签都有name属性,只有 **表达标签** 才有name属性(切某些低版浏览器不支持)

#### 4.querySelector('css选择器')

	参数:指定一个或多个匹配元素的css选择器.可以用id, 类, 类型,属性,属性值等来选取元素.

对于多个选择器,使用逗号隔开,返回一个匹配的元素,

返回值:匹配指定css选择器的第一个元素, 若没找到,返回null.



document.querySelector   获取第一个      

 var p = document.querySelector("#box > p"); //box 这个 id 下的 p标签       

console.log(p);

=><p>abc</p>  

#### 5.querySelectorAll('css选择器')

	获取满足选择器里的所有标签

#### 6.documentElement(元素)

> documentElement 属性以一个元素对象返回一个文档的文档元素。HTML 文档返回对象为 **HTML元素**。

```
<body>
    <script type="text/javascript">
        alert(document.documentElement.nodeName);    // html
        alert(document.documentElement.nodeValue);    // null
        alert(document.documentElement.nodeType);    // 1
    </script>
</body>
```

### 2.2 Node关系 获取操作

#### 1.节点与节点之间的关系

父（parent）节点 父节点拥有任意数量的子节点

子（child）节点 子节点拥有一个父节点

兄弟（sibling）节点 同级的子节点被称为同胞（兄弟或姐妹）。

同胞是拥有相同父节点的节点根 (root) 节点 

一个文档只能有一个根节点。

对html文档来说，根节点就是documentElement。

根节点不可能有父节点

![img2](https://github.com/LinDaiDai/JavaScript/blob/master/DomImg/img2.png?raw=true)



#### 2.获取操作

```
var div = document.querySelector("div");
var allNodes = div.childNodes;          //childNodes会把所有类型节点都获取到,包裹元素节点,文本节点(空格换行符等),属性节点;

但主要是为了获取元素节点(nodeType为1)
方法1:
for( var c in allNode){
if( c.nodeType ==1){
document.write(c)
}
}
方法2:
var allNodes = div.children;          //div的所有子节点(只有元素节点,不包裹文本等其他节点)
var count = div.childElementCount;     //div的所有子节点的个数 ,也可以之间用 allNodes.length;
var firstChild = div.firstElementChild;     //div的第一个元素节点
var lastChild = div.lastElementChild;          //div的最后一个元素节点
var secondChild = div.firstElementChild.nextElementSibling;     //div的第二个元素节点
var lastSecondChild = div.lastElementChild.previousElementSibling;     //div的倒数第二个元素节点
div == div.firstElementChild.parentNode;                              //div的第一个元素节点的父节点就是div本身
注:若把 children 换为childNodes 以及把后面全部的Element去掉,则会选取所有类型的节点
```

#### 3.创建修改操作

##### 3.1 createTextNode( )

		创建文本节点
	
	`var text = document.createTextNode("这个是文本节点");`

##### 3.2 createElement( )

		创建元素节点	
	
		可以是 div  p   span  ul  li 等
	
	`var ele = document.createElement("div");`

##### 3.3 appendChild( )

	给一个元素追加child节点
	
	`document.body.appendChild(ele); //添加到body的最后一个子节点之后; `

##### 3.4 insertBefore( )

	fatherNode.insertBefore(newNode, existingNode);
	
	参数:	1.要插入的节点	2.目标节点
	
	在一个节点前插入一个节点

将一个新创建的元素插入到某个元素之前

     如:在ul中,有3个li ,要将新创建的一个li 插入到第一位,
          ul.insertBefore(li,ul.firstElementChild);
        将li 插入到最后一位:
          1.ul.appendChild(li);
          2.ul.insertBefore(li,null/undefined);			
##### 3.5 removeChild( )

	移除子节点
	
	fatherNode.removeChild(node)

##### 3.6 replaceChild( )

	fatherNode.replaceChild(newNode,existingNode)
	
	替换子节点

##### 3.7 cloneNode( )

	node.cloneNode(deep)
	
	克隆节点
	
	参数 deep 可以指定节点的精确克隆
	
		1.若不写参数,只拷贝当前的这个元素节点,不包过它的子节点
	
		2.参数为 **true** ,**它还将递归复制当前节点的所有子孙节点**.	

#### 4.元素属性操作

	##### 4.1 getAttribute( ):获取属性值



    <ul id = "abc" class = "one">
    如 获取 ul 的 id 
         console.log(ul.getAttribute("id"));
     => abc
    ##### 4.2 setAttribute( ):

添加或设置属性值

          1.如将 ul 的 id 名更换  
              div.setAttribute("id" , "box")
              ul 的 id 变为 box 
          2.将 ul 的class 再添加俩个类名
               div.setAttribute("class" , div.getAttribute("class") + " two");
    ##### 4.3 removeAttribute( )
    
    *element*.removeAttribute(*attributename*)
    
    参数：必需。规定要删除的属性的名称
    
    *例:* 一个可以转换形态的按钮
    
    <body>  
    <input id="input1" type="button" value="点我可以转换我的状态" onclick="myFunction();">
    <script>
        function myFunction() {            
            var input1 = document.getElementById("input1");
            var typeValue = input1.getAttribute("type");
            if(typeValue){
                input1.removeAttribute("type");    //如果type属性有值就把这个属性去掉
            }else {
                input1.setAttribute("type", "button");    //如果type属性不存就添加属性。
            }
        };
    </script>   
    </body>
##### 4.4 hasAttribute( )

	element.hasAttribute(attributename)
	
	参数：必须。判断指定的属性名是否存在。

#### 5.元素节点的常用属性

##### 5.1 基本属性

	div.nodeName   所有节点都有
	
	div.tagName     只针对元素节点
	
	div.id           获取id
	
	div.id = "abc"    增加/替换 id
	
	div.className = "one"    增加/替换 class
	
	checked 属性     表单标签特有的

##### 5.2 innerHTML属性

	innerHTML 属性设置或返回标签的开始和结束标签之间的 HTML。
	
	值为为文本	
	
	若要改变innerHTML(**要改变的值一定要放在.innerHTML之后**); 

```
var num =5;  num="我是字符串";   num=true;
var span = document.getElementById('span').innerHTML=num;     正确写法
alert(typeof(span));     //num是什么属性或者赋值给它的是什么属性, span就是什么属性;
var span = document.getElementById('span').innerHTML;
span = num;                                                  错误写法
```

```
1.利用innerHTML 获取标签内的所有内容,返回一个字符串
alert(box.innerHTML); //获取这个元素节点里的文本(包含HTML标签),类型为string
正常浏览器显示:    <span>我是span</span>
IE                 <SPAN>我是span</SPAN>

2.利用innerHTML 设置一个字符串,会把字符串中的有效的标签解析出来.
  如,给div标签中添加一个内容是 "abc" 的p 标签
        var div = document.querySelector(div);
        div.innerHTML = "<p>abc</p>";
```

​	

##### 5.3 innerText属性

	1.innerText值获取标签中的文本内容，子标签本身不会获取到。
	
	2.去修改的时候，即使带有标签也会把标签作为纯文本来对待，而不会解析为标签
	
	**注:和innerHTML不同,它并不会解析有效的标签,而是把它作为纯文本对待**

##### 5.4 outerHTML

	1.**读取值** 把包过标签自身和它里面的内容都获取到    
	
	2.**设置值** 把标签用字符串来替换掉,如果字符串中有有效的标签,会被解析.
	
	**注:和innerHTML不同,它可以读取包过标签自身**

##### 5.5 value

		如果一个标签可以拥有value值，则可以可以通过element.value来获取。
	
		一般表单数据才具有vlaue：input、textarea、select

##### 5.6 获取元素的属性(offset)

	**注:** 以下四个属性只能读取 不能对元素进行修改;
	
	1.offsetWidth  	获取元素的实际宽度	包含border 和 padding 在内
	
	2.offsetHeight 	获取元素的实际高度	包含border 和 padding 在内
	
	3.offsetLeft 		元素定位之后相对于参照物父容器的偏移
	
	4.offsetTop 		元素定位之后相对于参照物父容器的偏移


​	

#### 6.样式表的属性--css脚本化

##### 6.1 获取和修改行内样式表     

	2种方式访问到行内样式:
	
		1.element.style.css属性名    
	
	       2.element.style["css属性名"]

##### 6.2 获取内部样式表和外部样式表

	1.对于IE: 对象.currentStyle["属性名"]     
	
	    2.其他浏览器: window.getComputedStyle(对象,null)["属性名"]

##### 6.3 字符串模板

``字符串${变量}``

```
element.style.backgroundColor = `rgba(  
       ${randomInt(0,255)},
       ${randomInt(0,255)},
       ${randomInt(0,255)},
       ${Math.random()*0.+0.4}`;
```