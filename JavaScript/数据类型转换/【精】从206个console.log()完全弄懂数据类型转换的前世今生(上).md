## 前言

你盼世界，我盼望你无`bug`。Hello 大家好！我是霖呆呆！

这一期给大家带来的是一篇关于`JS`数据类型转换的文章，起因主要是前几天在刷类型转换的题时突然感觉自己对它们理解的还不够深刻啊，对于什么`[] == ![]、!{} == []`这类题总是一知半解，记了忘忘了记。

这让我很苦恼，决心给自己下点猛料，彻底弄懂它们的转换机制然后出几道魔鬼题来考考自己。

在写的时候也是蛮纠结的，开始写了一版全是题目的，但是后来发现如果全是题目不讲其原理的话，一些读者可能会一脸懵逼...所以后来我又加了关于`toString、valueOf、toPrimitive`的详细解析，再配合一些清晰的流程图，力求能将转换过程说的清楚明了 😁。

不过预防针可打在前头，由于前面`1-3`节是一些基础类型之间的转换，并不难，所以我不会花太多的篇幅在这上面，可能从第`4`节开始慢慢的有点内味了吧，[阴笑～]，觉得自己对基础类型之间转换有信心的小伙伴可以直接跳到第`4`节看哦。

希望整篇阅读下来你的脑子里并不是 `"淡黄的长裙...蓬松的头发..."`

![](https://user-gold-cdn.xitu.io/2020/3/29/17124105a0fdab92?w=640&h=715&f=jpeg&s=61668)

OK👌，来看看通过阅读你可以学习到：

- 其它数据类型转布尔值
- 原始值转字符串
- 原始值转数字
- 原始值转对象(基本类型的包装对象)
- toString
- Symbol.toStringTag
- valueOf
- ToPrimitive的执行机制
- 对象转字符串
- 对象转数字

（在写的过程中，看到[冴羽大大](https://juejin.im/user/58e4b9b261ff4b006b3227f4)也发表了一篇关于类型转换的[《JavaScript深入之头疼的类型转换(上)》](https://juejin.im/post/5e7d7670f265da797f4afa84)，完了，难道...我已经到了和大佬们心有灵犀的境界了吗，膨胀膨胀了，可以借鉴一下，哈哈哈）

另外「数据类型转换」系列我是分为了两篇文章来写，这一篇主要是讲解`String()、Number()`这种的转换方式，对于运算符号`+、==`这种的转换以及`toPrimitive`的一些高级用法我会放在下一篇文章里面。
嘻嘻，还是那句话，循序渐进嘛。


## 1. 其它数据类型转布尔值

转化为布尔值的情况是很简单的。

当我们在使用`Boolean()`来进行转换时，有如下转换规则：

| 参数类型                                | 结果  |
| --------------------------------------- | ----- |
| false、undefined、null、+0、-0、NaN、"" | false |
| 除了上面的情况                          | true  |

（另外需要注意的是，如果在使用`Boolean()`时不传参数结果也是为`false`的）

### 1.1 数字转布尔值

数字转布尔值，只需要记住：

- 除了`0, -0, NaN`这三种转换为`false`，其他的一律为`true`。

#### 1.1.1 题目一

```javascript
console.log(Boolean(0))
console.log(Boolean(-0))
console.log(Boolean(NaN))

console.log(Boolean(1))
console.log(Boolean(Infinity))
console.log(Boolean(-Infinity))
console.log(Boolean(100n))
console.log(Boolean(BigInt(100)))
```

记住上面👆的规律，这边我把`bigInt`类型的也拿过来试了一下，发现它也是为`true`。

因此答案为：

```javascript
console.log(Boolean(0)) // false
console.log(Boolean(-0)) // false
console.log(Boolean(NaN)) // false

console.log(Boolean(1)) // true
console.log(Boolean(Infinity)) // true
console.log(Boolean(-Infinity)) // true
console.log(Boolean(100n)) // true
console.log(Boolean(BigInt(100))) // true
```



### 1.2 字符串转布尔值

字符串转布尔也很简单，只需要记住：

- 除了空字符串`""`都为`true`。

#### 1.2.1 题目一

```javascript
console.log(Boolean(""))

console.log(Boolean("1"))
console.log(Boolean("NaN"))
console.log(Boolean("aaa"))
```

这里特别要注意的是`"NaN"`，它并不是`NaN`哦，而是一个字符串。

所以答案为：

```javascript
console.log(Boolean("")) // false

console.log(Boolean("1")) // true
console.log(Boolean("NaN")) // true
console.log(Boolean("aaa")) // true
```



### 1.3 其它类型转布尔值

其它类型，例如`null, undefined, 引用`转布尔值，这些相信大家其实也知道：

- `null、undefined`为`false`
- 引用类型，如对象，数组，类数组，日期，正则都为`true`。

#### 1.3.1 题目一

```javascript
var divs = document.getElementsByTagName('div')
console.log(Boolean(null))
console.log(Boolean(undefined))

console.log(Boolean({}))
console.log(Boolean({ name: 'obj' }))
console.log(Boolean([]))
console.log(Boolean(divs))
console.log(Boolean(new Date()))
console.log(Boolean(/(\[|\])/g))
```

结果为：

```javascript
var divs = document.getElementsByTagName('div')
console.log(Boolean(null)) // false
console.log(Boolean(undefined)) // false

console.log(Boolean({})) // true
console.log(Boolean({ name: 'obj' })) // true
console.log(Boolean([])) // true
console.log(Boolean(divs)) // true
console.log(Boolean(new Date())) // true
console.log(Boolean(/(\[|\])/g)) // true
```



## 2. 原始值转字符串

对于原始值转字符串，也有以下总结：

| 参数类型  | 结果                                                     |
| --------- | -------------------------------------------------------- |
| Undefined | "undefined"                                              |
| Null      | "null"                                                   |
| Boolean   | 如果参数是 true，返回 "true"。参数为 false，返回 "false" |
| Number    | 可以看题目2.1                                 |
| String    | 返回与之相等的值                                         |
| Symbol    | "Symbol()"                                               |

来做几道题强化一下吧。

### 2.1 数字转字符串

#### 2.1.1 题目一

```javascript
console.log(String(0))
console.log(String(1))
console.log(String(100))
console.log(String(NaN))
console.log(String(10n))
console.log(String(10n) === '10')
```

`bigInt`类型会被当成数字来处理。

答案为：

```javascript
console.log(String(0)) // '0'
console.log(String(1)) // '1'
console.log(String(100)) // '100'
console.log(String(NaN)) // 'NaN'
console.log(String(10n)) // '10'
console.log(String(10n) === '10') // true
```



### 2.2 Boolean、Symbol转为字符串

#### 2.2.1 题目一

这三种类型转换为字符串，比较简单：

```javascript
console.log(String(true))
console.log(String(false))
console.log(String(Symbol(1)))
```

答案：

```javascript
console.log(String(true)) // 'true'
console.log(String(false)) // 'false'
console.log(String(Symbol(1))) // 'Symbol(1)'
```



## 3. 原始值转数字

| 参数类型  | 结果                                                         |
| --------- | ------------------------------------------------------------ |
| Undefined | NaN                                                          |
| Null      | +0                                                           |
| Boolean   | 如果参数是 true，返回 1。参数为 false，返回 +0               |
| Number    | 返回与之相等的值                                             |
| String    | 纯数字的字符串(包括小数和负数、各进制的数)，会被转为相应的数字，否则为NaN |
| Symbol    | 使用Number()转会报错                                         |




#### 3.1 题目一

先来看看大家都知道的`string、null、undefined、Symbol`转数字

```javascript
console.log(Number("1"))
console.log(Number("1.1"))
console.log(Number("-1"))
console.log(Number("0x12"))
console.log(Number("0012"))

console.log(Number(null))
console.log(Number("1a"))
console.log(Number("NaN"))
console.log(Number(undefined))
console.log(Number(Symbol(1)))
```

答案为：

```javascript
console.log(Number("1")) // 1
console.log(Number("1.1")) // 1.1
console.log(Number("-1")) // -1
console.log(Number("0x12")) // 18
console.log(Number("0012")) // 12

console.log(Number(null)) // 0
console.log(Number("1a")) // NaN
console.log(Number("NaN")) // NaN
console.log(Number(undefined)) // NaN
console.log(Number(Symbol(1))) // TypeError: Cannot convert a Symbol value to a number
```

其实很好记：

- 纯数字的字符串(包括小数和负数、各进制的数)，会被转为相应的数字
- `null`转为`0`
- `Symbol`会报错
- 其它的基本类型，包括非纯数字的字符串、`NaN`，`undefined`都会被转为`NaN`



#### 3.2 题目二

（`Boolean`类型转数字）

布尔值转数字也是非常简单的，只有两种情况：

```javascript
console.log(Number(true)) // 1
console.log(Number(false)) // 0
```



### 3.3 题目三

还有一种大家可能会用到的转数字的方式，那就是使用：

- `parsetInt`，将结果转换为整数
- `parseFloat`，将结果转换为整数或者浮点数

它们在转换为数字的时候是有这么几个特点的：

- 如果字符串以`0x或者0X`开头的话，`parseInt`会以十六进制数转换规则将其转换为十进制，而`parseFloat`会解析为`0`
- 它们两在解析的时候都会跳过开头任意数量的空格，往后执行
- 执行过程中会尽可能多的解析数值字符，如果碰到不能解析的字符则会跳出解析忽略后面的内容
- 如果第一个不是非空格，或者开头不是`0x、-`的数字字面量，将最终返回`NaN`

来看几道题练习一下 😄：

```javascript
console.log(parseInt('10')) // 10
console.log(parseFloat('1.23')) // 1.23

console.log(parseInt("0x11")) // 17
console.log(parseFloat("0x11")) // 0

console.log(parseInt("  11")) // 11
console.log(parseFloat("  11")) // 11

console.log(parseInt("1.23a12")) // 1
console.log(parseFloat("1.23a12")) // 1.23

console.log(parseInt("  11")) // 11
console.log(parseFloat("  11")) // 11

console.log(parseInt("1a12")) // 1
console.log(parseFloat("1.23a12")) // 1.23

console.log(parseInt("-1a12")) // -1
console.log(parseFloat(".23")) // 0.23
```


一直做到现在感觉都还挺简单的哈 😄。


![](https://user-gold-cdn.xitu.io/2020/3/29/1712411321eca47c?w=350&h=350&f=jpeg&s=17764)

## 4. 原始值转对象

原始值，也就是基础数据类型。

### 4.1 String对象

让我们先来认识一个叫做`String`的对象，它的原型链是这样的：

![](https://user-gold-cdn.xitu.io/2020/3/29/171240954454620d?w=1464&h=1360&f=png&s=152210)

可以看到，它本质上是一个构造函数，`String.__proto__`指向的是`Function.prototype`。

`String`其实有两种用法，一种是配合`new`来当构造函数用，一种是不用`new`：

- 当 String() 和运算符 new 一起作为构造函数使用时，它返回一个新创建的 String 对象，存放的是字符串 *s* 或 *s* 的字符串表示(不过自从推出了`Symbol`之后就不推荐使用`new String`这种做法了)。
- 当不用 new 运算符调用 String() 时，它只把 *s* 转换成原始的字符串，并返回转换后的值

什么意思呢 🤔️？通俗点来说：

```javascript
typeof String(1) // 'string'
typeof new String(1) // 'object'
```
使用`typeof`会发现类型都是不同的。


### 4.2 基本类型的包装对象

哈哈哈。

和它一起的其实还有另外两个`"亲兄弟"`：`Number、Boolean`；

以及它的`"表哥表妹"`：`Symbol、BigInt`。 😄

为什么说`Number、Boolean`就是亲的，而后面两个就是表的呢 🤔️？

这个霖呆呆是以相似程度来区分的。

也就是说`Number、Boolean`和`String`一样都有两种用法，带`new`和不带`new`。

而`Symbol、BigInt`就只能不带`new`使用。(因为它们是`ES6`之后出来的，对它们调用`new`会报错)

所以你会看到这个现象：

```javascript
console.log(Number(1)) // 1
console.log(new Number(1)) // Number{1}
console.log(Boolean(true)) // true
console.log(new Boolean(true)) // Boolean{true}

console.log(Symbol(1)) // Symbol(1)
console.log(BigInt(1)) // 1n
console.log(new Symbol(1)) // TypeError: Symbol is not a constructor
console.log(new BigInt(1)) // TypeError: BigInt is not a constructor
```

而上面的`Number{1}、Boolean{true}`，它就是我要介绍的**基本类型的包装对象**，也被称为**基本类型的包装类**，也可以叫做**原始值包装对象**（有很多的叫法不过大家应该都知道它表示的就是这个意思）。

可以看到要想产生一个基础数据类型的包装对象只需要使用`new`来调用它们各自的构造函数即可：

```javascript
console.log(new Number(1)) // Number{1}
console.log(new String('1')) // String{1}
console.log(new Boolean(true)) // Boolean{true}
```

这个`基本类型的包装对象`有什么特点呢？

- 使用`typeof`检测它，结果是`object`，说明它是一个对象
- 使用`toString()`调用的时候返回的是原始值的字符串(题`6.8.3`中会提到)

`But!!!`

前面已经说到了，目前`ES6`规范是不建议用`new`来创建基本类型的包装类的，我想大概是为了和`Symbol、BigInt`它们统一吧。

那么现在更推荐用什么方式来创建基本类型的包装类呢？

唔...那就是`Object`这个构造函数。



### 4.3 Object()

`Object()`构造函数它可以接收一个任意类型的变量，然后进行不同的转换。

也就是说七种基本数据类型，或者引用数据类型你都可以传入进去。

不过这里我主要是为了介绍基本数据类型转对象，所以就以几个基本数据类型来做分析：

```javascript
console.log(new Object('1')) // String{'1'}
console.log(new Object(1)) // Number{1}
console.log(new Object(true)) // Boolean{true}
console.log(new Object(Symbol(1))) // Symbol{Symbol(1)}
console.log(new Object(10n)) // BigInt{10n}

console.log(new Object(null)) // {}
console.log(new Object(undefined)) // {}
```

可以看到，你传入的基本数据类型是什么类型的，那么最终的结果就会转为对应的包装类，但是对于`null、undefined`它们会被忽略，生成的会是一个空对象。



### 总结-原始值转对象

原始值转对象主要有以下总结：

- `String、Number、Boolean`有两种用法，配合`new`使用和不配合`new`使用，但是`ES6`规范不建议使用`new`来创建基本类型的包装类。
- 现在更加推荐用`new Object()`来创建或转换为一个基本类型的包装类。

**基本类型的包装对象的特点：**

- 使用`typeof`检测它，结果是`object`，说明它是一个对象
- 使用`toString()`调用的时候返回的是原始值的字符串(题`6.8.3`中会提到)



## 5. 对象转字符串/数字前期准备

对象转字符串和数字的过程比较复杂，会涉及到一个可能大家之前没有听到过的方法：**toPrimitive()**

它的作用其实就是输入一个值，然后返回一个**一定是基本类型的值**，否则会抛出一个类型错误异常。

先上一张执行流程图，让大家感受一下`绝望、孤独、寂寞、冷...`

![](https://user-gold-cdn.xitu.io/2020/3/29/1712407602f41e86?w=4532&h=2828&f=png&s=712918)



虽然它的功能会有些复杂，不过问题不大，待看完后面的内容之后你就能搞懂它了，在介绍`toPrimitive()`之前，我得先详细介绍一下`toString()`和`valueOf()`方法才行，因为弄懂了它们你才能彻底吃透`toPrimitive()`。😄



## 6. toString()

### 6.1 toString()存在于哪里

在此之前，我翻了很多关于`toString()`的资料，大多都是介绍了它的用法，但是它真正存在于哪里呢？

可能比较常见的一种说法是它存在于`Object`的原型对象中，也就是`Object.prototype`上，那么对于基本数据类型，`Number、String、Boolean、 Symbol、BigInt`呢？它们自身有这个方法吗？或者它们的原型对象上有吗？

本着一探到底的精神，我打印出了`Number`和`Number.prototype`：

```javascript
console.log(Number)
console.log(Number.prototype)
```

![](https://user-gold-cdn.xitu.io/2020/3/29/171240883a863cfc?w=1734&h=892&f=jpeg&s=208248)

然后我发现了几件事：

- `Number`只是一个构造函数，打印出来显示的会是源代码
- `Number.prototype`上确实也有`toString()`
- `Number.prototype.__proto__`也就是`Object.prototype`上也有`toString()`

然后我又试了一下`String、Boolean、Symbol`发现结果也和上面一样。

其实不难理解，看过[《💦【何不三连】做完这48道题彻底弄懂JS继承(1.7w字含辛整理-返璞归真)》](https://juejin.im/post/5e75e22951882549027687f9)的小伙伴都知道，所有对象的原型链到最后都会指向`Object.prototype`，算是都"继承"了`Object`的对象实例，因此都能使用`toString()`方法，但是对于不同的内置对象为了能实现更适合自身的功能需求，都会重写该方法，所以你可以看到`Number.prototype`上也会有该方法。

**所以我们可以先得出第一个结论：**

- 除了`null、undefined`以外的其它数据类型(基本数据类型+引用数据类型)，它们构造函数的原型对象上都有`toString()`方法
- 基本数据类型构造函数原型对象上的`toString()`会覆盖`Object`原型对象上的`toString()`方法

（当然，等你看到`6.9`之后你就会发现这种说法其实并不太准确，但是大多数时候我们都只是关心谁可以用它，而不是它存在于哪里）



### 6.2 谁可以调用toString()

这个问题，其实在上面👆已经给出答案了，所有对象除了`null、undefined`以外的任何值都可以调用`toString()`方法，通常情况下它的返回结果和`String`一样。

其实这里，我们最容易搞混的就是`String`和`toString`。

之前总是为了将某个类型转为字符串胡乱的用这两个属性。

- `String`是一个类似于`Function`这样的对象，它既可以当成对象来用，用它上面的静态方法，也可以当成一个构造函数来用，创建一个`String`对象
- 而`toString`它是除了`null、undefined`之外的数据类型都有的方法，通常情况下它的返回结果和`String`一样。

但是就会有小伙伴问了，那为什么`'1'.toString()`也可以成功呢？那是因为代码在运行的时候其实是做了转换为包装类的处理，类似于下面这段代码：

```javascript
var str = new Object('1');
str.toString();
str = null;
```

过程解析：

- 创建`Object`实例，将`s`变为了`String{"1"}`对象
- 调用实例方法`toString()`
- 用完之后立即销毁这个实例

可是我们之前不是看到了一个`String`的东西吗？这里的第一步为什么不能使用`var str = new String('1')`呢？

![](https://user-gold-cdn.xitu.io/2020/3/29/1712412a17d0f22e?w=255&h=255&f=jpeg&s=9785)

其实前面也已经说到了，由于`Symbol`和`BigInt`它们是不能使用`new`来调用的，会报错，并且目前`ES6`的规范也不推荐使用`new`来创建这种基本类型的包装类，所以这里使用的是`new Object()`。



但是当我们在代码中试图使用`1.toString()`，发现编辑器已经报错不允许我们这样做了。

难道数字就不可以吗 🤔️？最开始会有这么奇怪的疑问是因为我们都忽视了一件事，那就是`.`它也是属于数字里的一部分啊 😂。

比如`1.2`、`1.3`。所以当你想要使用`1.toString()`的时候，`JavaScript`的解释器会把它作为数字的一部分，这样就相当于`(1.)toString`了，很显然这是一段错误的代码。

既然这样的话，如果我还(`喝唔安黄`)给代码一个`.`是不是就可以了，于是我尝试了一下：

```javascript
console.log(1.1.toString())
```

发现它竟然能正常打印出来：

```javascript
"1.1"
```

这也就再次证明了`1.toString()`会将`.`归给`1`所属，而不是归给`toString()`。

当然如果你用的一个变量来承载这个数字的话也是可以的：

```javascript
var num = 1;
console.log(num.toString()) // true
```

所以在此我们只需要先记住谁可以调用`toString`：

- 除了`null、undefined`的其它基本数据类型还有对象都可以调用它
- 在使用一个数字调用`toString()`的时候会报错，除非这个数字是一个小数或者是用了一个变量来盛放这个数字然后调用。(`1.1.toString()`或者`var a = 1; a.toString();`)



### 6.3 toString()的call调用

可能大家看的比较多的一种用法是这样的：

```javascript
Object.prototype.toString.call({ name: 'obj' }) // '[object Object]'
```

先来点硬知识，`Object.prototype.toString`这个方法会根据这个对象的`[[class]]`内部属性，返回由 `"[object " 和 class 和 "]"` 三个部分组成的字符串。

啥意思？`[[class]]`内部属性是个啥 🤔️？

这里你还真别想多，你就按字面意思来理解它就好了，想想，`class` 英文单词的意思->`类`。

那好，我就认为它代表的是一类事物就行了。

就比如

- 数组是一类，它的`[[class]]`是`Array`
- 字符串是一类，它的`[[class]]`是`String`
- `arguments`是一类，它的`[[class]]`是`Arguments`

另外，关于`[[class]]`的种类是非常多的，你也不需要记住全部，只需要知道一些常用的，基本的，好理解的就可以了。

所以回到`Object.prototype.toString.call()`这种调用方式来，现在你可以理解它的作用了吧，**它能够帮助我们准确的判断某个数据类型**，也就是辨别出是数组还是数字还是函数，还是`NaN`。😊

另外鉴于它的返回结果是`"[object Object]"`这样的字符串，而且前面的`"[object ]"`这八个字符串都是固定的(包括`"t"`后面的空格)，所以我们是不是可以封装一个方法来只拿到`"Object"`这样的字符串呢？

很简单，上代码：

```javascript
function getClass (obj) {
    let typeString = Object.prototype.toString.call(obj); // "[object Object]"
    return typeString.slice(8, -1);
}
```

可以看到，我给这个函数命名为`getClass`，这也就呼应了它原本的作用，是为了拿到对象的`[[class]]`内部属性。

另外，在拿到了`"[object Object]"`字符串之后，是用了一个`.slice(8, -1)`的字符串截取功能，去除了前八个字符`"[object ]"`和最后一个`"]"`。

现在让我们来看看一些常见的数据类型吧：

```javascript
function getClass(obj) {
    let typeString = Object.prototype.toString.call(obj); // "[object Array]"
    return typeString.slice(8, -1);
}
console.log(getClass(new Date)) // Date
console.log(getClass(new Map)) // Map
console.log(getClass(new Set)) // Set
console.log(getClass(new String)) // String
console.log(getClass(new Number)) // Number
console.log(getClass(true)) // Boolean
console.log(getClass(NaN)) // Number
console.log(getClass(null)) // Null
console.log(getClass(undefined)) // Undefined
console.log(getClass(Symbol(42))) // Symbol
console.log(getClass({})) // Object
console.log(getClass([])) // Array
console.log(getClass(function() {})) // Function
console.log(getClass(document.getElementsByTagName('p'))) // HTMLCollection

console.log(getClass(arguments)) // Arguments
```

`"霖呆呆，这么多，这是人干的事吗？"`

`"性平气和，记住一些常用的就行了..."`

`"啪!"`

![](https://user-gold-cdn.xitu.io/2020/3/29/1712414228917e28?w=296&h=280&f=jpeg&s=11799)


### 6.4 toString.call()与typeof的区别

好滴👌，通过刚刚的学习，我们了解到了，`toString.call`这种方式是为了获取某个变量更加具体的数据类型。

咦～说到数据类型，我们原来不是有一个`typeof`吗？它和`toString.call()`又啥区别？

首先帮大家回顾一下`typeof`它的显示规则：

- 对于原始类型来说(也就是`number、string`这种)，除了`null`都可以显示正确的类型
- `null`因为历史版本的原因被错误的判断为了`"object"`
- 对于引用类型来说(也就是`object、array`这种)，除了函数都会显示为`"object"`
- 函数会被显示为`function`

所以呀，`typeof`的缺点很明显啊，我现在有一个对象和一个数组，或者一个日期对象，我想要仔细的区分它，用`typeof`肯定是不能实现的，因为它们得到的都是`"object"`。

所以，采用我们封装的`getClass()`显然是一个很好的选择。

（当然，了解`instanceof`的小伙伴可能也知道，用`instanceof`去判断也是可以的，不过这边不扯远，具体可以看一下三元大大的[《(建议收藏)原生JS灵魂之问, 请问你能接得住几个？(上)》](https://juejin.im/post/5dac5d82e51d45249850cd20#heading-14)，里面的第二篇有提到这个问题。或者你可以期待一下呆呆后面的文章，那里也会详细讲到哦，这里先卖个关子，哈哈）

![](https://user-gold-cdn.xitu.io/2020/3/29/1712417d00d39e39?w=500&h=340&f=png&s=86974)

### 6.5 toString.call()调用和toString()的区别

刚刚我们说到的`toString()`的用法是使用`toString.call()`的方式，那么更多的使用肯定是某个变量后面之间接着`toString()`呀，就比如这样：

```javascript
true.toString() // 'true'
```

请大家一定要区分清楚`true.toString()`和`Object.prototype.toString.call(true)`这两种用法啊：

- `true.toString()`是将`true`转为字符串
- `toString.call(true)`是获取`true` 它的`[[class]]`内部属性：

```javascript
true.toString() // 'true'
Object.prototype.toString.call(true) // "[object Boolean]"
```



由于`toString.call()`这种用法之前说的已经比较详情了，所以下面的内容都是围绕着`true.toString()`这种调用方式来讲。



### 6.6 不同情况下的toString()

那么在不同的数据类型调用`toString()`会有什么不同呢？

这里我主要是分为两大块来说：

- 基本数据类型调用
- 引用类型调用

### 6.7 基本数据类型调用toString

对于基本数据类型来调用它，超级简单的，你就想着就是把它的原始值换成了字符串而已：

```javascript
console.log('1'.toString()) // '1'
console.log(1.1.toString()) // '1.1'
console.log(true.toString()) // 'true'
console.log(Symbol(1).toString()) // 'Symbol(1)'
console.log(10n.toString()) // '10'
```



### 6.8 引用类型调用toString

比较难的部分是引用类型调用`toString()`，而且我们知道引用类型根据`[[class]]`的不同是分了很多类的，比如有`Object`、`Array`、`Date`等等。

那么不同类之间的`toString()`是否也不同呢 🤔️？

没错，不同版本的`toString`主要是分为：

- 数组的`toString`方法是将每一项转换为字符串然后再用`","`连接
- 普通的对象(比如`{name: 'obj'}`这种)转为字符串都会变为`"[object Object]"`
- `函数(class)、正则`会被转为源代码字符串
- `日期`会被转为本地时区的日期字符串
- 原始值的包装对象调用`toString`会返回原始值的字符串



好的👌，扯了这么多知识点，终于可以先上几道题了 😁。

（没有题目做我好难受～）

![](https://user-gold-cdn.xitu.io/2020/3/29/171241b00ecbebea?w=151&h=197&f=jpeg&s=8401)

#### 6.8.1 题目一

（数组的`toString()`用法）

先来看点简单的：

```javascript
console.log([].toString())
console.log([1].toString())
console.log([1, 2].toString())
console.log(['1', '2'].toString())

console.log(['', ''].toString())
console.log([' ', ' '].toString())
```

答案：

```javascript
console.log([].toString()) // ""
console.log([1].toString()) // "1"
console.log([1, 2].toString()) // "1,2"
console.log(['1', '2'].toString()) // "1,2"

console.log(['', ''].toString()) // ","
console.log([' ', ' '].toString()) // " , "
```

没啥难度。

需要注意的可能就是`[].toString()`的时候，由于数组一项都没有，所以得到的肯定是一个空字符串。

另外需要注意的是最后两个，一个是完全的空字符串，一个是带了空格的。



#### 6.8.2 题目二

（非数组类型的其它对象）

```javascript
console.log({}.toString())
console.log({name: 'obj'}.toString())

console.log(class A {}.toString())
console.log(function () {}.toString())
console.log(/(\[|\])/g.toString())
console.log(new Date().toString())
```

依照上面👆的第`2,3,4`条规则，答案会为：

```javascript
'[object Object]'
'[object Object]'

'class A {}'
'function () {}'
'/(\[|\])/g1'
'Fri Mar 27 2020 12:33:16 GMT+0800 (中国标准时间)'
```



#### 6.8.3 题目三

（原始值包装对象调用`toString()`）

原始值包装对象在上面👆的第四章已经讲到了，也就是：

```javascript
Number{1}
String{'1'}
Boolean{true}
```

这样的对象。

当它们在调用`toString()`方法的时候，会返回它们原始值的字符串，就像这样：

```javascript
console.log(new Object(true).toString()) // "true"
console.log(new Object(1).toString()) // "1"
console.log(new Object('1').toString()) // "1"
console.log(new Object(Symbol(1)).toString()) // "Symbol(1)"
console.log(new Object(BigInt(10)).toString()) // "10"
```



#### 6.8.4 题目四

（`Map、Set`类型调用`toString`）

在做题的时候，我又想着测试一下`Map、Set`类型调用`toString`会是什么样的。

```javascript
console.log(new Map().toString())
console.log(new Set().toString())
console.log(new Array(['1']).toString())
```

发现结果竟然是：

```javascript
console.log(new Map().toString()) // "[object Map]"
console.log(new Set().toString()) // "[object Set]"
console.log(new Array(['1']).toString()) // "1"
```

这看的我有点懵了，怎么前面两个的结果有点像是`Object.prototype.toString.call()`的调用结果呢？而如果是数组的话，却又遵循了数组转字符串的转换规则...

啊啊啊啊...好不容易弄懂了一些，这怎么又跑出来个`Map、Set`。

![](https://user-gold-cdn.xitu.io/2020/3/29/17124511cc1dbc13?w=297&h=219&f=jpeg&s=13858)

好奇心趋势着我将`new Map()`这个实例对象打印出来看看：

```javascript
console.log(new Map())
```

![](https://user-gold-cdn.xitu.io/2020/3/29/1712409b54950e1e?w=834&h=1086&f=jpeg&s=166748)
嘶～

我好像嗅到了一丝八卦的气息，我发现`Map.prototype`和并没有和`Number.prototype`一样有它自身的`toString()`方法，而只是`Object.prototype`上才有。

并且好像有一个我们从来没有见过的属性：`Symbol(Symbol.toStringTag)`，而且它的值正好是`"Map"`。



### 6.9 Symbol.toStringTag

不懂就查，搜了一波`Symbol.toStringTag`之后，我就恍然大悟了。

[《Symbol.toStringTag》](https://cloud.tencent.com/developer/section/1192219)上是这样描述它的：

该`Symbol.toStringTag`公知的符号是在创建对象的默认字符串描述中使用的字符串值属性。它由该`Object.prototype.toString()`方法在内部访问。

看不懂没关系，你这样理解就可以了，它其实就是决定了刚刚我们提到所有数据类型中`[[class]]`这个内部属性是什么。

比如数字，我们前面得到的`[[class]]`是`Number`，那我就可以理解为数字这个类它的`Symbol.toStringTag`返回的就是`Number`。

只不过在之前我们用到的`Number、String、Boolean`中并没有`Symbol.toStringTag`这个内置属性，它是在我们使用`toString.call()`调用的时候才将其辨别返回。

而刚刚我们打印出了`new Map()`，可以看到`Symbol.toStringTag`它是确确实实存在于`Map.prototype`上的，也就是说它是`Map、Set`内置的一个属性，因此当我们直接调用`toString()`的时候，就会返回`"[object Map]"`了。

额，我们是不是就可以这样理解呢？

- 没有`Symbol.toStringTag`内置属性的类型在调用`toString()`的时候相当于是`String(obj)`这样调用转换为相应的字符串
- 有`Symbol.toStringTag`内置属性的类型在调用`toString()`的时候会返回相应的标签(也就是`"[object Map]"`这样的字符串)

我们常用的带有`Symbol.toStringTag`内置属性的对象有：

```javascript
console.log(new Map().toString()) // "[object Map]"
console.log(new Set().toString()) // "[object Set]"
console.log(Promise.resolve().toString()) // "[object Promise]"
```



而且我发现了它和`Symbol.hasInstance`一样，可以允许我们自定义标签。

(`Symbol.hasInsance`的作用是自定义`instanceof`的返回值)

什么是自定义标签呢 🤔️？

也就是说，假如我们现在创建了一个类，并且用`toString.call()`调用它的实例对象是会有如下结果：

```javascript
class Super {}
console.log(Object.prototype.toString.call(new Super())) // "[object Object]"
```

很好理解，因为产生的`new Super()`是一个对象嘛，所以打印出的会是`"[object Object]"`。

但是现在有了`Symbol.toStringTag`之后，我们可以改后面的`"Object"`。

比如我重写一下：

```javascript
class Super {
  get [Symbol.toStringTag] () {
    return 'Validator'
  }
}
console.log(Object.prototype.toString.call(new Super())) // "[object Validator]"
```

这就是`Symbol.toStringTag`的厉害之处，它能够允许我们自定义标签。

但是有一点要注意了，`Symbol.toStringTag`重写的是`new Super()`这个实例对象的标签，而不是重写`Super`这个类的标签，也就是说这里有区别的：

```javascript
class Super {
  get [Symbol.toStringTag] () {
    return 'Validator'
  }
}
console.log(Object.prototype.toString.call(Super)) // "[object Function]"
console.log(Object.prototype.toString.call(new Super())) // "[object Validator]"
```

因为`Super`它本身还是一个函数，只有`Super`产生的实例对象才会用到我们的自定义标签。



### 总结-toString()

内容好多啊，我们总结着理顺来，这样才好记。



**谁可以调用toString()？**

- 除了`null、undefined`的其它基本数据类型还有对象都可以调用它，通常情况下它的返回结果和`String`一样。
- 在使用一个数字调用`toString()`的时候会报错，除非这个数字是一个小数或者是用了一个变量来盛放这个数字然后调用。(`1.1.toString()`或者`var a = 1; a.toString();`)



**Object.prototype.toString.call()是做什么用的？**

- 返回某个数据的内部属性`[[class]]`，能够帮助我们准确的判断出某个数据类型
- 比`typeof`判断数据类型更加的准确



**不同数据类型调用toString()**

- 原始数据类型调用时，把它的原始值换成了字符串
- 数组的`toString`方法是将每一项转换为字符串然后再用`","`连接
- 普通的对象(比如`{name: 'obj'}`这种)转为字符串都会变为`"[object Object]"`
- `函数(class)、正则`会被转为源代码字符串
- `日期`会被转为本地时区的日期字符串
- 原始值的包装对象调用`toString`会返回原始值的字符串
- 拥有`Symbol.toStringTag`内置属性的对象在调用时会变为对应的标签`"[object Map]"`



**Symbol.toStringTag**

- 它是某些特定类型的内置属性，比如`Map、Set、Promise`
- 主要作用是可以允许我们自定义标签，修改`Object.prototype.toString.call()`的返回结果



![](https://user-gold-cdn.xitu.io/2020/3/29/171241c29ec371ea?w=440&h=550&f=jpeg&s=54516)


## 7. valueOf()

接下来要介绍的是`toString()`的孪生兄弟`valueOf`，为什么说是它的孪生兄弟呢 🤔️？

因为它们有很多相同的特性，比如前面我们提到的`toString()`的存在位置，我们可以回头看看`6.1`的那张图，发现有`toString()` 的地方也有`valueOf()`。

另一个要介绍它的重要原因是在`对象转基础数据类型`中，与`toString()`相辅相成的就是它了。

它的作用主要是：

**把对象转换成一个基本数据的值**。

所以我们可以看出它两的区别：

- `toString`主要是把对象转换为字符串
- `valueOf`主要把对象转换成一个基本数据的值



让我们先来看看`valueOf`的基本用法吧。



###  7.1 基本数据类型调用valueOf()

基本数据类型的调用也是很简单的，它只要返回调用者原本的值就可以了：

```javascript
console.log('1'.valueOf()) // '1'
console.log(1.1.valueOf()) // 1.1
console.log(true.valueOf()) // true
console.log(Symbol(1).valueOf()) // Symbol(1)
console.log(10n.valueOf()) // 10n
```

看着好像没变啊，没错，所以你可以用下面👇的方式来验证一下：

```javascript
var str = '1'
console.log(str.valueOf() === str) // true
```



### 7.2 引用类型调用valueOf()

引用类型调用`valueOf()`并不难，你只需要记住：

- 非日期对象的其它引用类型调用`valueOf()`默认是返回它本身
- 而日期对象会返回一个`1970 年 1 月 1 日以来的毫秒数`。

比如：

```javascript
console.log([].valueOf()) // []
console.log({}.valueOf()) // {}
console.log(['1'].valueOf()) // ['1']
console.log(function () {}.valueOf()) // ƒ () {}
console.log(/(\[|\])/g.valueOf()) // /(\[|\])/g
console.log(new Date().valueOf()) // 1585370128307
```



### 总结-valueOf()

**valueOf()的基本用法**

- 基本数据类型调用，返回调用者原本的值
- 非日期对象的其它引用类型调用`valueOf()`默认是返回它本身
- 而日期对象会返回一个`1970 年 1 月 1 日以来的毫秒数`(类似于`1585370128307`)。



## 8. toPrimitive

弄懂了难啃的`toString()`和`valueOf()`，终于到了我们的主角`toPrimitive`...

泪牛满面 😢。

不过不可大意，它才是最难啃的那块知识点。

先让我们来看看它的函数语法：

```javascript
ToPrimitive(input, PreferredType?)
```

参数：

- 参数一：`input`，表示要处理的输入值
- 参数二：`PerferredType`，期望转换的类型，可以看到语法后面有个问号，表示是非必填的。它只有两个可选值，`Number`和`String`。

而它对于传入参数的处理是比较复杂的，现在让我们来看看开篇的那幅流程图：

![](https://user-gold-cdn.xitu.io/2020/3/29/171240a59da4851e?w=4532&h=2828&f=png&s=712918)


根据流程图，我们得出了这么几个信息：

1. 当不传入 PreferredType 时，如果 input 是日期类型，相当于传入 String，否则，都相当于传入 Number。
2. 如果是 ToPrimitive(obj, Number)，处理步骤如下：

- 如果 obj 为 基本类型，直接返回
- 否则，调用 valueOf 方法，如果返回一个原始值，则 JavaScript 将其返回。
- 否则，调用 toString 方法，如果返回一个原始值，则 JavaScript 将其返回。
- 否则，JavaScript 抛出一个类型错误异常。

3. 如果是 ToPrimitive(obj, String)，处理步骤如下：

- 如果 obj为 基本类型，直接返回
- 否则，调用 toString 方法，如果返回一个原始值，则 JavaScript 将其返回。
- 否则，调用 valueOf 方法，如果返回一个原始值，则 JavaScript 将其返回。
- 否则，JavaScript 抛出一个类型错误异常。

(总结来源[《冴羽-JavaScript深入之头疼的类型转换(上)》](https://juejin.im/post/5e7d7670f265da797f4afa84#heading-8))

上面👆的图其实只是看着很复杂，细心的小伙伴可能会发现，在图里红框裱起来的地方，只有`toString()`和`valueOf()`方法的执行顺序不同而已。

如果 PreferredType 是 String 的话，就先执行 `toString()`方法

如果 PreferredType 是 Number 的话，就先执行 `valueOf()`方法

霖呆呆建议你先自己在草稿纸上将这幅流程图画一遍，之后再来做题有助于记忆 😁。



## 9. 对象转字符串

### 9.1 题目一

（最基本的转换）

好吧，呆呆，我看你扯了这么多`toPrimitive`的转换流程，可我也没看出有什么实际的用处啊。

这...没啊，其实我们很早就用上了啊，只不过你之前可能不知道而已。

比如当我们使用`String()`来转换一个对象为字符串的时候：

```javascript
console.log(String({}))
```

大家都知道结果是：

```javascript
"[object Object]"
```

但它为什么是这样呢？看着结果和`toString()`调用的结果好像啊。

这里其实就用到了`toPrimitive`的转换规则呀。

你看看，我们把上面👆的代码换成`toPrimitive`的伪代码看看：

```javascript
toPrimitive({}, 'string')
```

OK👌，来回顾一下刚刚的转换规则：

1. `input`是`{}`，是一个引用类型，`PerferredType`为`string`
2. 所以调用`toString()`方法，也就是`{}.toString()`
3. `{}.toString()`的结果为`"[object Object]"`，是一个字符串，为基本数据类型，然后返回，到此结束。

哇～

是不是一切都说得通了，好像不难吧 😁。

没错，当使用`String()`方法的时候，`JS`引擎内部的执行顺序确实是这样的，不过有一点和刚刚提到的步骤不一样，那就是最后返回结果的时候，其实会将最后的基本数据类型再转换为字符串返回。

也就是说上面👆的第三步我们得拆成两步来：

3. `{}.toString()`的结果为`"[object Object]"`，是一个字符串，为基本数据类型
4. 将这个`"[object Object]"`字符串再做一次字符串的转换然后返回。(因为`"[object Object]"`已经是字符串了，所以原样返回，这里看不出有什么区别)

将最后的结果再转换为字符串返回这一步，其实很好理解啊。你想想，我调用`String`方法那就是为了得到一个字符串啊，你要是给我返回一个`number、null`啊什么的，那不是隔壁老王干的事嘛～

（咳咳，霖呆呆的真名姓王哈 [害羞～]）

![](https://user-gold-cdn.xitu.io/2020/3/29/171241cae8da2c00?w=375&h=333&f=jpeg&s=17374)


### 9.2 题目二

上面👆的转换好像并不能看出来最后会转为字符串那一步的效果啊，那么来看看这道题：

```javascript
console.log(String(null))
console.log(String(new Object(true)))
```

想想这里的转换规则。

对于`String(null)`：

- 传入的`input`是个基础数据类型，这简单啊，直接返回它就可以了
- 返回的值是一个`null`，然后再把它转为字符串`"null"`，所以最后返回的是`"null"`。

对于`String(new Object(true))`：

- 传入的`new Object(true)`是一个基本类型的包装类`Boolean{true}`
- 它也是属于引用类型，因此会调用`toString()`
- 而基本类型的包装类我们在题`6.8.3`中已经说到了，它调用`toString()`方法是会返回原始值的字符串，也就是`"true"`
- 返回值`"true"`是基本数据类型，最后再进行一层字符串转换(还是它本身)，然后返回`"true"`。

答案：

```javascript
console.log(String(null)) // "null"
console.log(String(new Object(true))) // true
```





如果你能看到这的话，怎样？是不是有点那啥感觉了。


![](https://user-gold-cdn.xitu.io/2020/3/29/17124560ffb07745?w=690&h=518&f=jpeg&s=45814)

 

### 9.3 题目三

（数组转字符串）

数组转字符串我总结了一下主要是这样：

- 空数组`[]`是被转换为空字符串`""`
- 若是数组不为空的话，则将每一项转换为字符串然后再用`","`连接

配合着引用类型转字符串我画了一张图。

![](https://user-gold-cdn.xitu.io/2020/3/29/171240ab851640ba?w=760&h=624&f=jpeg&s=56489)

先来看点简单的：

```javascript
console.log(String([]))
console.log(String([1]))
console.log(String([1, 2]))
console.log(String(['1', '2']))
```

答案：

```javascript
console.log(String([])) // ""
console.log(String([1])) // "1"
console.log(String([1, 2])) // "1,2"
console.log(String(['1', '2'])) // "1,2"
```

没啥难度。

让我们用`toPrimitive`的转换规则来说一下：

对于`String([1, 2])`：

- `input`为数组`[1, 2]`，因此使用`toString()`方法调用
- `[1, 2]`转为字符串为`"1,2"`，字符串`"1,2"`为原始数据类型，则返回(由于返回值都是字符串我就省略还有一个字符串的转换过程不说了)



### 9.4 题目四

让我们加上`Boolean、函数、NaN`看看：

```javascript
console.log(String([true, false]))
console.log(String([NaN, 1]))

console.log(String([function () {}, 1]))
console.log(String([{ name: 'obj' }, { name: 'obj2' }]))
```

解析：

- 类型全都是数组，就是将数组的每一项转换为字符串然后用`","`连接
- 前两个都没啥问题
- 第三个，函数转为字符串是其源代码字符串，也就是`"function () {}"`
- 第四个，里面的每一项是一个对象，且转为字符串为`"[object, Object]"`，所以结果会有两个`"[object Object]"`用`","`连接

答案为：

```javascript
console.log(String([true, false])) // "true,false"
console.log(String([NaN, 1])) // "NaN,1"

console.log(String([function () {}, 1])) // "function () {},1"
// "[object Object],[object Object]"
console.log(String([{ name: 'obj' }, { name: 'obj2' }]))
```

所以做这类题时，你一般只要谨记这个准则：

- 若是数组不为空的话，则将每一项转换为字符串然后再用`","`连接

就可以了，然后再看里面具体的每一项会被转成什么。



### 9.5 题目五

(日期类型转字符串)

```javascript
console.log(String(new Date()))
console.log(String(new Date('2020/12/09')))
```

日期类型的对象转字符串在题`6.8.2`中也已经说到过了，它会被转为本地时区的日期字符串，所以结果为：

```javascript
console.log(String(new Date())) // Sat Mar 28 2020 23:49:45 GMT+0800 (中国标准时间)
console.log(String(new Date('2020/12/09'))) // Wed Dec 09 2020 00:00:00 GMT+0800 (中国标准时间)
```



### 总结-对象转字符串

对于**对象转字符串**，也就是调用`String()`函数，总结如下：

- 如果对象具有 toString 方法，则调用这个方法。如果他返回一个原始值，JavaScript 将这个值转换为字符串，并返回这个字符串结果。
- 如果对象没有 toString 方法，或者这个方法并不返回一个原始值，那么 JavaScript 会调用 valueOf 方法。如果存在这个方法，则 JavaScript 调用它。如果返回值是原始值，JavaScript 将这个值转换为字符串，并返回这个字符串的结果。()
- 否则，JavaScript 无法从 toString 或者 valueOf 获得一个原始值，这时它将抛出一个类型错误异常。

其实也就是走的`toPrimitive(object, 'string')`这种情况。


![](https://user-gold-cdn.xitu.io/2020/3/29/171241f34022469f?w=440&h=438&f=jpeg&s=45467)

## 10. 对象转数字

如果大家弄懂了**对象转字符串**的话，那么弄懂**对象转数字**也不难了。

刚刚我们说了对象转字符串也就是`toPrimitive(object, 'string')`的情况，

那么对象转数字就是`toPrimitive(object, 'number')`。

区别就是转数字会先调用`valueOf()`后调用`toString()`。



### 10.1 题目一

（最基本的转换）

```javascript
console.log(Number({}))
console.log(Number([]))
console.log(Number([0]))
console.log(Number([1, 2]))
```

对于`Number({})`：

- 传入的是一个对象`{}`，因此调用`valueOf()`方法，该方法在题`7.1`中已经提到过了，它除了日期对象的其它引用类型调用都是返回它本身，所以这里还是返回了对象`{}`
- `valueOf()`返回的值还是对象，所以继续调用`toString()`方法，而`{}`调用`toString()`的结果为字符串`"[object Object]"`，是一个基本数据类型
- 得到基础数据类型了，该要返回了，不过在这之前还得将它在转换为数字才返回，那么`"[object Object]"`转为数字为`NaN`，所以结果为`NaN`

对于`Number([])`：

- 传入的是一个数组`[]`，因此调用`valueOf()`方法，返回它自身`[]`
- `[]`继续调用`toString()`方法，而空数组转为字符串是为`""`
- 最后再将空字符串`""`转为数字`0`返回

对于`Number([0])`：

- 因为`[0]`转为字符串是为`"0"`，最后在转为数字`0` 返回

对于`Number([1, 2])`：

- 传入的是一个数组`[1, 2]`，所以调用`valueOf()`方法返回的是数组本身`[1,2]`
- 所以继续调用`toString()`方法，此时被转换为了`"1,2"`字符串
- `"1,2"`字符串最后被转为数字为`NaN`，所以结果为`NaN`

结果：

```javascript
console.log(Number({})) // NaN
console.log(Number([])) // 0
console.log(Number([0])) // 0
console.log(Number([1, 2])) // NaN
```



### 10.2 题目二

（日期类型转数字）

来看个比较特殊的日期类型转数字

```javascript
console.log(Number(new Date()))
```

过程解析：

- 传入的是一个日期类型的对象`new Date()`，因此调用`valueOf()`，在题目`7.2`中已经说了，日期类型调用`valueOf()`是会返回一个毫秒数
- 毫秒数为数字类型，也就是基本数据类型，那么直接返回(其实还有一步转为数字类型的过程)，所以结果为`1585413652137`

答案：

```javascript
console.log(Number(new Date())) // 1585413652137
```



### 总结-对象转数字

所以对于对象转数字，总结来说和对象转字符串差不多：

- 如果对象具有 valueOf 方法，且返回一个原始值，则 JavaScript 将这个原始值转换为数字并返回这个数字

- 否则，如果对象具有 toString 方法，且返回一个原始值，则 JavaScript 将其转换并返回。

- 否则，JavaScript 抛出一个类型错误异常。


![](https://user-gold-cdn.xitu.io/2020/3/29/171245987325975f?w=300&h=300&f=jpeg&s=10505)


可算是给👴整完了这`206`个`console.log()`，吸口气休息一会...



## 后语

知识无价，支持原创。

参考文章：

- [《冴羽-JavaScript深入之头疼的类型转换(上)》](https://juejin.im/post/5e7d7670f265da797f4afa84)
- [《神三元-(建议收藏)原生JS灵魂之问, 请问你能接得住几个？(上)》](https://juejin.im/post/5dac5d82e51d45249850cd20)
- [《LINGLONG-【js小知识】（关于加号的隐式类型转换）》](https://juejin.im/post/5e605528518825495c659769)
- [《ES5-ToString》](http://es5.github.io/#x9.8)


你盼世界，我盼望你无`bug`。这篇文章就介绍到这里。

其实我在学习数据类型转换的的历程是这样的：

`满心欢喜 -> 决心弄懂 -> 眉头紧锁 -> 表情凝重 -> 生无可恋 -> 小彻小悟`


确实有一个生无可恋的时候，哈哈哈，不过在坚持下去之后也算是`"小彻小悟"`吧，为啥不是大彻大悟，这个...人还是要谦虚点的哈。

用心创作，好好生活。如果你觉得文章对你有帮助的话来个赞👍哦，谢谢啦～ 😁。

喜欢**霖呆呆**的小伙还希望可以关注霖呆呆的公众号 `LinDaiDai` 或者扫一扫下面的二维码👇👇👇.

![](https://user-gold-cdn.xitu.io/2020/3/29/17124271bbecd73e?w=900&h=500&f=gif&s=1632550)

我会不定时的更新一些前端方面的知识内容以及自己的原创文章🎉

你的鼓励就是我持续创作的主要动力 😊.

相关推荐:

[《全网最详bpmn.js教材》](https://juejin.im/post/5def372af265da33c84a4818)

[《【建议改成】读完这篇你还不懂Babel我给你寄口罩》](https://juejin.im/post/5e477139f265da574c566dda)

[《【建议星星】要就来45道Promise面试题一次爽到底(1.1w字用心整理)》](https://juejin.im/post/5e58c618e51d4526ed66b5cf)

[《【建议👍】再来40道this面试题酸爽继续(1.2w字用手整理)》](https://juejin.im/post/5e6358256fb9a07cd80f2e70)

[《🔥【何不三连】比继承家业还要简单的JS继承题-封装篇(牛刀小试)》](https://juejin.im/post/5e707417e51d45272054d5d3)

[《💦【何不三连】做完这48道题彻底弄懂JS继承(1.7w字含辛整理-返璞归真)》](https://juejin.im/post/5e75e22951882549027687f9)

