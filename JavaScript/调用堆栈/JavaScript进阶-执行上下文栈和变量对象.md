### 前言

在阅读本篇文章之前, 请先了解**执行上下文**及**执行栈**的基础知识点, 移步[《JavaScript进阶-执行上下文(理解执行上下文一篇就够了)》](https://juejin.im/post/5db85b866fb9a0207d4cbf92).

本篇文章是接着介绍**执行上下文**的要点和讲解**变量提升**.



### 变量提升

在使用`javascript`编写代码的时候, 我们知道, 声明一个变量用`var`, 定义一个函数用`function`.那你知道程序在运行它的时候, 都经历了什么吗?



#### 变量声明提升

首先是用`var`定义一个变量的时候, 例如:

```javascript
var a = 10;
```

大部分的编程语言都是先声明变量再使用, 但是`javascript`有所不同, 上面的代码, 实际相当于这样执行:

```javascript
var a;
a = 10;
```

因此有了下面这段代码的执行结果:

```javascript
console.log(a); // 声明,先给一个默认值undefined;
var a = 10; // 赋值,对变量a赋值了10
console.log(a); // 10
```

上面的代码👆在第一行中并不会报错`Uncaught ReferenceError: a is not defined`, 是因为**声明提升**, 给了`a`一个默认值.

这就是最简单的**变量声明提升**.



#### 函数声明提升

定义函数也有两种方法:

- 函数声明: `function foo () {}`;
- 函数表达式: `var foo = function () {}`.

第二种**函数表达式**的声明方式更像是给一个变量`foo`赋值一个匿名函数.

那这两种在函数声明的时候有什么区别吗?

**案例一🌰**:

```javascript
console.log(f1) // function f1(){}
function f1() {} // 函数声明
console.log(f2) // undefined
var f2 = function() {} // 函数表达式
```

可以看到, 使用**函数声明**的函数会将**整个函数**都提升到作用域(后面会介绍到)的最顶部, 因此打印出来的是整个函数;

而使用**函数表达式**声明则类似于**变量声明提升**, 将`var f2`提升到了顶部并赋值`undefined`.

---

我们将案例一的代码添加一点东西:

**案例二🌰**:

```javascript
console.log(f1) // function f1(){...}
f1(); // 1
function f1() { // 函数声明
	console.log('1')
}
console.log(f2) // undefined
f2(); // 报错: Uncaught TypeError: f2 is not a function
var f2 = function() { // 函数表达式
	console.log('2')
}
```

虽然`f1()`在`function f1 () {...}`之前,但是却可以正常执行;

而`f2()`却会报错, 原因在案例一中也介绍了是因为在调用`f2()`时, `f2`还只是`undifined`并没有被赋值为一个函数, 因此会报错.



#### 声明优先级: 函数大于变量

通过上面的介绍我们已经知道了两种声明提升, 但是当遇到函数和变量同名且都会被提升的情况时, **函数声明**的优先级是要**大于变量声明**的.

- 变量声明会被函数声明覆盖
- 可以重新赋值

**案例一🌰**:

```javascript
console.log(f1); // f f1() {...}
var f1 = "10";
function f1() {
	console.log('我是函数')
}
// 或者将 var f1 = "10"; 放到后面
```

案例一说明了变量声明会被函数声明所覆盖.

**案例二🌰**:

```javascript
console.log(f1); // f f1() { console.log('我是新的函数') }
var f1 = "10";

function f1() {
		console.log('我是函数')
}

function f1() {
		console.log('我是新的函数')
}
```

案例二说明了前面声明的函数会被后面声明的同名函数给覆盖.

如果你搞懂了, 来做个小练习?

**练习✍️**

```javascript
function test(arg) {
		console.log(arg);
		var arg = 10;
		function arg() {
				console.log('函数')
		}
		console.log(arg)
}
test('LinDaiDai');
```



**答案📖**

```javascript
function test(arg) {
		console.log(arg); // f arg() { console.log('函数') }
		var arg = 10;
		function arg() {
				console.log('函数')
		}
		console.log(arg); // 10
}
test('LinDaiDai');
```

1. 函数里的形参`arg`被后面**函数声明**的`arg`给覆盖了, 所以第一个打印出的是函数;
2. 当执行到`var arg = 10`的时候, `arg`又被赋值了`10`, 所以第二个打印出`10`.



### 执行上下文栈的变化

先来看看下面两段代码, 在执行结果上是一样的, 那么它们在执行的过程中有什么不同吗?

```javascript
var scope = "global";
function checkScope () {
	var scope = "local";
	function fn () {
		return scope;
	}
	return fn();
}
checkScope();
```

```javascript
var scope = "global"
function checkScope () {
	var scope = "local"
	function fn () {
		return scope
	}
	return fn;
}
checkScope()();
```

答案是 **执行上下文栈的变化**不一样。

在第一段代码中, 栈的变化是这样的:

```javascript
ECStack.push(<checkscope> functionContext);
ECStack.push(<f> functionContext);
ECStack.pop();
ECStack.pop();
```

可以看到`fn`后被推入栈中, 但是先执行了, 所以先被推出栈;

---

而在第二段中, 栈的变化为:

```javascript
ECStack.push(<checkscope> functionContext);
ECStack.pop();
ECStack.push(<f> functionContext);
ECStack.pop();
```

由于`checkscope`是先推入栈中且先执行的, 所以在`fn`被执行前就被推出了.



### VO/AO

接下来要介绍两个概念:

- **VO(变量对象)**, 也就是`variable object`, **创建执行上下文**时与之关联的会有一个变量对象，该上下文中的所有变量和函数全都保存在这个对象中。

- **AO(活动对象)**, 也就是``activation object`,**进入到一个执行上下文**时，此执行上下文中的变量和函数都可以被访问到，可以理解为被激活了。



活动对象和变量对象的区别在于:

- 变量对象（**VO**）是规范上或者是JS引擎上实现的，并不能在JS环境中直接访问。
- 当进入到一个执行上下文后，这个变量对象才会被**激活**，所以叫活动对象（**AO**），这时候活动对象上的各种属性才能被访问。

上面似乎说的比较难理解😢, 没关系, 我们慢慢来看.

### 执行过程

首先来看看一个**执行上下文(EC)**被创建和执行的过程:

1. 创建阶段:

- 创建变量、参数、函数`arguments`对象;

- 建立作用域链;

- 确定`this`的值.

2. 执行阶段:

 变量赋值, 函数引用, 执行代码.

#### 进入执行上下文

在创建阶段, 也就是还没有执行代码之前

此时的变量对象包括(如下顺序初始化):

1. 函数的所有形参(仅在函数上下文): 没有实参, 属性值为`undefined`;
2. 函数声明：如果变量对象已经存在相同名称的属性，则完全**替换**这个属性;
3. 变量声明：如果变量名称跟已经声明的形参或函数相同，则变量声明**不会干扰**已经存在的这类属性

一起来看下面的例子🌰:

```javascript
function fn (a) {
	var b = 2;
	function c () {};
	var d = function {};
	b = 20
}
fn(1)
```

对于上面的例子, 此时的`AO`是:

```javascript
AO = {
	arguments: {
		0: 1,
		length: 1
	},
	a: 1,
	b: undefined,
	c: reference to function c() {},
	d: undefined
}
```

可以看到, 形参`arguments`此时已经有赋值了, 但是变量还是`undefined`.



#### 代码执行

到了代码执行时, 会修改变量对象的值, 执行完后`AO`如下:

```javascript
AO = {
	arguments: {
		0: 1,
		length: 1
	},
	a: 1,
	b: 20,
	c: reference to function c() {},
	d: reference to function d() {}
}
```

在此阶段, 前面的变量对象中的值就会被赋值了, 此时变量对象处于激活状态.



### 总结

- 全局上下文的变量对象初始化是全局对象, 而函数上下文的变量对象初始化只有`Arguments`对象;
- `EC`创建阶段分为创建阶段和代码执行阶段;
- 在进入执行上下文时会给变量对象**添加形参、函数声明、变量声明**等初始的属性值;

- 在代码执行阶段，会再次修改变量对象的属性值.



### 后语

参考文章:

[《聊一聊javascript执行上下文》](https://juejin.im/post/5ac301d151882510fd3fcf3a#heading-2)

[《木易杨前端进阶-JavaScript深入之执行上下文栈和变量对象》](https://muyiy.cn/blog/1/1.2.html#执行上下文)