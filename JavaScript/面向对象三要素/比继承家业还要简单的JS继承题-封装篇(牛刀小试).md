## 前言

你盼世界，我盼望你无`bug`。Hello 大家好！我是霖呆呆！

（这个号称全掘金最臭不要脸的男人又成功用标题把你骗了进来，哈哈 😄）

`"先给你个三连"`

![](https://user-gold-cdn.xitu.io/2020/3/17/170e71451d9a8286?w=250&h=350&f=jpeg&s=43459)

滴滴滴～ 又是一星期没见了

看着右侧目录这么一大排的`题目一、题目二、题目三...`你是不很开心，终于...又有题做了。

你会发现霖呆呆的文章每期都是这么丰满，字动不动就是上万，题目动不动就是好几十题，我也很担心你们会不会不想去看。

包括我自己其实也不是特别愿意去看一些大篇幅的文章。

(当然，炒鸡棒的文章除外哈，比如掘金上都超好看)

因此最近我转化了一种思路，将一些知识点化为题目，让我们在做题的同时来消化理解它。

这样就避免了整篇文章都是概念性的东西，有些枯燥😅。

(不过对于一些硬性必须记的东西大家也千万不能偷懒得记着啊)

而且这几天我发现了一些很奇怪的事情，有些读者就是冲着我文章的评论来的。就比如我的那篇[Promise面试题](https://juejin.im/post/5e58c618e51d4526ed66b5cf)，一哥们就挑明了和我说：

`"我是直接看的评论，很精彩"`

我是直接看评论的...

你跳过霖呆呆辛辛苦苦写的`1.1w字`的内容，点到评论区看评论？！😭

最最最主要的是！！！😭

你还不点赞...不点赞...点赞...赞！！！😭

我...设计师...给我配个我在风中凌乱的表情包。

[表情包风中凌乱～]

`"你？！开除！"`

哈哈哈～

`玩归玩闹归闹,JS继承把你教！`

其实这是一篇系列型的文章，让我们转到系列介绍去看看吧...

等会见...



## JS继承系列介绍

看过霖呆呆文章的小伙伴应该都感觉的出，我比较喜欢针对每个知识点出一些比较**细节的题目**，然后将这些细节连串起来最后组合成大家**最爱的综合题**😄。

该系列主要为了让我们彻底理解`JavaScript`面向对象的三大特性：`封装`、`继承`、`多态`。

`"咦～这三大特性我知道啊，大清都完了你还在这谈"`

啊~ 看到这里你先别着溜，开始的我也是和你一样觉得背背概念，写点小例子就懂了，直到霖呆呆自己给自己出了几道`魔鬼`题，我才发现之前对它们的理解还是不太全面...因此才有了本系列。

系列总目录：

- 封装
  - `ES6`之前的封装-构造函数
  - `ES6`之后的封装-`class`

- 继承
  - 原型链继承
  - 构造继承
  - 组合继承
  - 寄生组合继承
  - 原型式继承
  - `class`中的`extends`继承
- 多态

(在开始写之前本想要一篇文章全部搞定的，但是发现字真太多了，所以才分开来写，而且我终于又可以用我最爱的`绯红`主题了 😄)

这一章节主要是想向大家介绍一下`JS`面向对象的第一大特性-**封装**，也是为了给后面最重要的`继承`打好基础。

题目也不太多，总共17道，算是牛刀小试吧。

通过阅读本章节你可以学习到：

- `ES6`之前的封装-构造函数
- `ES6`之后的封装-`class`



## 前期准备

先来理解一些最最最基本的概念：

（一）

```javascript
// 1. 构造函数
function Cat (name) {
    this.name
}
// 2. 构造函数原型对象
Cat.prototype
// 3. 使用Cat构造函数创建的实例'乖乖'
var guaiguai = new Cat('guaiguai')
// 4. 构造函数的静态方法,名为fn
Cat.fn = function () {}
// 5. 原型对象上的方法,名为fn
Cat.prototype.fn = function () {}
```

![实例原型链](https://user-gold-cdn.xitu.io/2020/3/17/170e717b74663dea?w=1344&h=574&f=png&s=225103)

（二）

`语法糖`的意思是现有技术本可以实现，但是采用某种写法会更加简洁优雅。

比如`class`就是语法糖。

（三）

原型链继承的思维导图

(这个暂时看不懂没关系，在继承那一章节中会讲到)


![](https://user-gold-cdn.xitu.io/2020/3/17/170e718601592273?w=1590&h=1036&f=jpeg&s=153722)

### 封装

把客观事物封装成抽象的类，隐藏属性和方法，仅对外公开接口。

### 1. ES6之前的封装

（虽然以下内容是概念部分，但是对你解题很有帮助哦，请务必仔细阅读它 😁）

都知道`ES6`的`class`实际就是一个语法糖，那么在`ES6`之前，是没有类这个概念的，因此是借助于**原型对象**和**构造函数**来实现。

- 私有属性和方法：只能在构造函数内访问不能被外部所访问(在构造函数内使用`var`声明的属性)
- 公有属性和方法(或实例方法)：对象外可以访问到对象内的属性和方法(在构造函数内使用`this`设置，或者设置在构造函数原型对象上比如`Cat.prototype.xxx`)
- 静态属性和方法：定义在构造函数上的方法(比如`Cat.xxx`)，不需要实例就可以调用(例如`Object.assign()`)



#### 1.1 题目一

(理解**私有属性方法**和**公有属性方法**)

比如我现在想要封装一个生产出猫，名为`Cat`的构造函数。

- 由于猫的`心`和`胃`都是我们肉眼看不见的，所以我把它们设置为私有属性(隐藏起来)
- 并且猫的`心跳`我们也是看不到的，所以我把它设置为私有方法(隐藏起来)
- 然后猫的`毛色`是可以看见的，所以我把它设置为公有属性
- 并且猫`跳起来`这个动作我们是看的到的，所以我把它设置为公有方法

```javascript
function Cat (name, color) {
  var heart = '❤️'
  var stomach = '胃'
  var heartbeat = function () {
    console.log(heart + '跳')
  }

  this.name = name
  this.color = color

  this.jump = function () {
    heartbeat() // 能跳起来表明这只猫是活的,心也就能跳
    console.log('我跳起来了~来追我啊')
  }
}
var guaiguai = new Cat('guaiguai', 'white')
console.log(guaiguai)
guaiguai.jump()
```

上述代码打印出来的应该是：

```
Cat{ name: 'guaiguai', color: 'white', jump: function(){} }
❤️跳
我跳起来了~来追我啊
```

可以看到，我们生产出名字叫做`乖乖`的小猫咪只有这几个属性能访问到(也就是能被肉眼看到)，为公有属性：

- `name`
- `color`
- `jump`

而私有属性，是我们看不到的：

- `heart`
- `somach`
- `heartbeat`

所以如果你想要直接使用它是不能够的：

```
// 私有
console.log(guaiguai.heart) // undefined
console.log(guaiguai.stomach) // undefined
guaiguai.heartbeat() // 报错
```

**小结：**

很好区分：

- 在函数内用`var`定义的就是私有的
- 在函数内用`this`承接的就是公有


小猫咪: `"凭啥每次都是用我举例子"`

霖呆呆: `"因为你可爱撒～"`

小猫咪: `"嘻嘻"`

![](https://user-gold-cdn.xitu.io/2020/3/17/170e71ae0adef31f?w=300&h=300&f=png&s=183329)


#### 1.2 题目二

(理解**静态属性方法**和**公有属性方法**)

我们现在往刚刚的`Cat`构造函数中加些东西。

- 我们需要对`Cat`这个构造函数加一个描述，表明它是用来生产猫的，所以我把`descript`设置为它的静态属性

- 由于一听到猫这种动物就觉得它会卖萌，所以我把`卖萌`这个动作设置为它的静态方法
- 由于猫都会用唾液清洁身体，所以我把`清洁身体`这个动作设置为它的公有方法

```javascript
// 这段是旧代码
function Cat (name, color) {
  var heart = '❤️'
  var stomach = '胃'
  var heartbeat = function () {
    console.log(heart + '跳')
  }

  this.name = name
  this.color = color

  this.jump = function () {
    heartbeat() // 能跳起来表明这只猫是活的,心也就能跳
    console.log('我跳起来了~来追我啊')
  }
}
// 这段是新增的代码
Cat.descript = '我这个构造函数是用来生产出一只猫的'
Cat.actingCute = function () {
  console.log('一听到猫我就想到了它会卖萌')
}
Cat.prototype.cleanTheBody = function () {
  console.log('我会用唾液清洁身体')
}
var guaiguai = new Cat('guaiguai', 'white')

console.log(Cat.descript)
Cat.actingCute()
console.log(guaiguai.descript)
guaiguai.cleanTheBody()
```

上述代码打印出来的应该是：

```
'我这个构造函数是用来生产出一只猫的'
'一听到猫我就想到了它会卖萌'
undefined
'我会用唾液清洁身体'
```

可以看到，我们定义的`descript`和`actingCute`是定义在构造函数`Cat`上的，所以可以直接被`Cat`调用，为静态属性和方法。

但是`descript`和`actingCute`并不能存在于`乖乖`这个实例上，`descript`只是对构造函数`Cat`的描述，并不是对`乖乖`的描述，所以打印出`undefined`。

不过`清洁`身体是定义在原型对象`prototype`中的，属于公有方法(实例方法)，也就是`乖乖`这个实例可以用它来调用。

静态属性和方法：

- `descript`
- `actingCute`

实例(公有)属性和方法：

- `name`
- `color`
- `jump`
- `cleanTheBody`

**小结：**

也很好区分：

- 在构造函数上也就是使用`Cat.xxx`定义的是静态属性和方法
- 在构造函数内使用`this`设置，或者设置在构造函数原型对象上比如`Cat.prototype.xxx`，就是公有属性和方法(实例方法)



（也有小伙伴可能会有疑问，这个`静态属性和方法`是有什么用的啊，感觉我们编码的时候并没有用到过啊。`Really?` 哈哈 😄，`Promise.all()、Promise.race()、Object.assign()、Array.form()`这些不就是吗？）

（至于`实例方法`，想想`push、shift`，它们实际上不是存在于原型对象上的吗？`Array.prototype.push`）




#### 1.3 题目三

（理解**实例自身的属性**和**定义在构造函数原型对象中的属性**的区别）

OK👌，霖呆呆你刚刚既然已经说了使用`this.xxx = xxx`的方式和使用`Cat.prototype.xxx = xxx`都是属于实例对象`guaiguai`上的公有属性，那它们是有什么区别吗？

来看这道题我们就能理解它们的区别了：

```javascript
function Cat (name) {
  this.name = name
}
Cat.prototype.prototypeProp = '我是构造函数原型对象上的属性'
Cat.prototype.cleanTheBody = function () {
  console.log('我会用唾液清洁身体')
}
var guaiguai = new Cat('guaiguai')
console.log(guaiguai)
console.log(guaiguai.name)
console.log(guaiguai.prototypeProp)
guaiguai.cleanTheBody()
```

这里输出的结果 🤔️？

```
Cat {name: "guaiguai"}
'guaiguai'
'我是构造函数原型对象上的属性'
'我会用唾液清洁身体'
```

看到没，`name`是使用`this.xxx = xxx`的形式定义的，它能直接让实例`guaiguai`就拥有这个属性。

而`prototypeProp 、cleanTheBody`毕竟是定义在构造函数原型上的，所以并不能出现在实例`guaiguai`上，但是`guaiguai`却能访问和调用它们。

因此我们得出结论：

**定义在构造函数原型对象上的属性和方法虽然不能直接表现在实例对象上，但是实例对象却可以访问或者调用它们**



#### 1.4 题目四

既然我们已经知道了**实例自身的属性**和**定义在构造函数原型对象中的属性**的区别，那么我们一般是如何区分它们的呢？

来看看这里：

```javascript
function Cat (name) {
  this.name = name
}
Cat.prototype.prototypeProp = '我是构造函数原型对象上的属性'
Cat.prototype.cleanTheBody = function () {
  console.log('我会用唾液清洁身体')
}
var guaiguai = new Cat('guaiguai')

for (key in guaiguai) {
  if (guaiguai.hasOwnProperty(key)) {
    console.log('我是自身属性', key)
  } else {
    console.log('我不是自身属性', key)
  }
}
console.log('-分隔符-')
console.log(Object.keys(guaiguai))
console.log(Object.getOwnPropertyNames(guaiguai))
```

这道题中，我分别用了三种方式来获取实例对象`guaiguai`上的属性名：

- `for...in...`
- `Object.keys()`
- `Object.getOwnPropertyNames()`

输出的结果为：

```
'我是自身属性 name'
'我不是自身属性 prototypeProp'
'我不是自身属性 cleanTheBody'
'-分隔符-'
["name"]
["name"]
```

由此可以得出：

- 使用`for...in...`能获取到实例对象自身的属性和原型链上的属性
- 使用`Object.keys()`和`Object.getOwnPropertyNames()`只能获取实例对象自身的属性
- 可以通过`.hasOwnProperty()`方法传入属性名来判断一个属性是不是实例自身的属性

（上面👆的说法其实并不太严谨，因为要建立在可枚举属性的前提下(属性的`enumerable`为`true`)，不过这边我不发散下去了...）



#### 1.5 题目五

下面让我们来做道题，看看你到底有没有掌握上面的知识点呢 😁。

```javascript
function Person (name, sex) {
  this.name = name
  this.sex = sex
  var evil = '我很邪恶'
  var pickNose = function () {
    console.log('我会扣鼻子但不让你看见')
  }
  this.drawing = function (type) {
    console.log('我要画一幅' + type)
  }
}
Person.fight = function () {
  console.log('打架')
}
Person.prototype.wc = function () {
  console.log('我是个人我会wc')
}
var p1 = new Person('lindaidai', 'boy')
console.log(p1.name)
console.log(p1.evil)
p1.drawing('国画')
p1.pickNose()
p1.fight()
p1.wc()
Person.fight()
Person.wc()
console.log(Person.sex)
```



答案：

```
'lindaidai'
undefined
'我要画一幅国画'
Uncaught TypeError: p1.pickNose is not a function
Uncaught TypeError: p1.fight is not a function
'我是个人我会wc'
'打架'
Uncaught TypeError: Person.wc is not a function
undefined
```

解析：

- `name`为公有属性，实例访问它打印出`'lindaidai'`
- `evil`为私有属性，实例访问它打印出`'undefined'`
- `drawing`是共有(实例)方法，实例调用它打印出`'我要画一幅国画'`
- `pickNose`是私有方法，实例调用它会报错，因为它并不存在于实例上
- `fight`是静态方法，实例调用它报错，因为它并不存在于实例上
- `wc`存在于构造函数的原型对象中，使用实例调用它打印出`'我是个人我会wc'`
- `fight`存在于构造函数上，使用构造函数调用它打印出`'打架'`
- `wc`存在于构造函数的原型对象中，并不存在于构造函数中，所以报错
- `sex`为公有(实例)属性，并不存在于构造函数上，使用构造函数访问它为`undefined`

这里大家可能会有一个疑惑点了，为什么最后一个`Person.sex`也会是`undefined`呢？

我明明已经这样写了：

```javascript
function Person (sex) {
	this.sex = sex
}
```

看起来`sex`是定义在`Person`里的呀。

注意了，`this.sex`表示的是给使用构造函数创建的实例上增加属性`sex`，而不是给构造函数本身增加(只有`Person.sex`才是给构造函数上增加属性)。



#### 1.6 题目六

如果我的构造函数和构造函数原型对象上存在相同名称的属性咋办呢 🤔️ ？

```javascript
function Cat () {
  this.color = 'white'
  this.getColor = function () {
    console.log(this.color)
  }
}
Cat.prototype.color = 'black'
var cat = new Cat()
cat.getColor()
```

这里的执行结果为：

```
'white'
```

其实这个很好理解，你原型对象上虽然有一个名叫`color`的属性，但是我实例对象自己就也有一个啊，那我为什么要用你的呢？只有我自己没有，我才会到你那里去拿。

所以这也就引出了另一个经常听到的概念：

**当访问一个对象的属性 / 方法时，它不仅仅在该对象上查找，还会查找该对象的原型，以及该对象的原型的原型，一层一层向上查找，直到找到一个名字匹配的属性 / 方法或到达原型链的末尾（`null`）。**

也就是大名鼎鼎的**原型链查找**。

咱要是没理解没关系哈，一起来看下面一个例子。



#### 1.7 题目七

现在我在`Cat`的原型对象上，还有它原型对象的原型对象上都定义一个叫做`color`的属性。

(原型对象本质也是个对象，所以它的`__proto__`也就是`Object.prototype`)

```javascript
function Cat () {
  this.color = 'white'
  this.getColor = function () {
    console.log(this.color)
  }
}
Cat.prototype.color = 'black'
Object.prototype.color = 'yellow'
Object.prototype.feature = 'cute'
var cat = new Cat()

cat.getColor()
console.log(cat)
console.log(cat.feature)
```

然后让我们来看看结果：

```
'white'
Cat {color: "white", getColor: ƒ}
'cute'
```

看到了不。

`color`这个属性还是以它自身的`white`为主，但是`feature`这个属性没在实例`cat`上吧，所以它就会向上层一层查找，结果在`Object.prototype`中找到了，因此打印出`cute`。

整个过程就是这样：

![](https://user-gold-cdn.xitu.io/2020/3/17/170e71bafeaf11ab?w=1222&h=1558&f=png&s=1067939)

(偷个懒，盗个图😂，图片来源https://muyiy.cn/idea/)



#### 1.8 题目八

`"等会等会，让我缓一下"`

`"wc，我突然就想明白了很多事情！"`

比如下面这种写法：

```javascript
var obj = { name: 'obj' }
console.log(obj.toString())
console.log(obj.hasOwnProperty('name'))
console.log(Object.prototype)
```

为什么我的`obj`中明明就没有`toString()、hasOwnProperty()`方法，但是我却可以调用它。

现在我知道了，原来`obj`本质是个`Object`类型。

使用`var obj = { name: 'obj' }`就相当于是调用了`new Object`：

```javascript
var obj = new Object({ 'name': 'obj' })
```

这样的话，我当然就可以使用`Object.prototype`上的方法啦！

执行结果为：

![](https://user-gold-cdn.xitu.io/2020/3/17/170e71c2fda3d9b2?w=682&h=660&f=png&s=322297)

(`obj.toString()`这里的结果为`[object Object]`应该都知道是什么原因吧？)



#### 总结-构造函数

现在在来回头看看那句话：

**把客观事物封装成抽象的类，隐藏属性和方法，仅对外公开接口**

是不是好理解多了呢？

然后让我们对**构造函数配合原型对象**封装来做一个总结吧：

**(一) 私有属性、公有属性、静态属性概念：**

- 私有属性和方法：只能在构造函数内访问不能被外部所访问(在构造函数内使用`var`声明的属性)，见题`1.1`
- 公有属性和方法(或实例方法)：对象外可以访问到对象内的属性和方法(在构造函数内使用`this`设置，或者设置在构造函数原型对象上比如`Cat.prototype.xxx`)，见题`1.2`
- 静态属性和方法：定义在构造函数上的方法(比如`Cat.xxx`)，不需要实例就可以调用(例如`Object.assign()`)



**(二) 实例对象上的属性和构造函数原型上的属性：**

- 定义在**构造函数原型对象上的属性和方法**虽然不能直接表现在实例对象上，但是实例对象却可以访问或者调用它们。(见题`1.3`)
- 当访问一个对象的属性 / 方法时，它不仅仅在该对象上查找，还会查找该对象的原型，以及该对象的原型的原型，一层一层向上查找，直到找到一个名字匹配的属性 / 方法或到达原型链的末尾（`null`）。(见题`1.7`)



**(三) 遍历实例对象属性的三种方法:**

- 使用`for...in...`能获取到实例对象自身的属性和原型链上的属性
- 使用`Object.keys()`和`Object.getOwnPropertyNames()`只能获取实例对象自身的属性
- 可以通过`.hasOwnProperty()`方法传入属性名来判断一个属性是不是实例自身的属性



### 2. ES6之后的封装

在`ES6`之后，新增了`class` 这个关键字。

它可以用来代替构造函数，达到创建“一类实例”的效果。

并且类的数据类型就是**函数**，所以用法上和构造函数很像，直接用`new`命令来配合它创建一个实例。

还有一件事你可能不知道吧，那就是，**类的所有方法都定义在类的prototype属性上面**。

例如：

```javascript
class Cat {
    constructor() {}
    toString () {}
    toValue () {}
}
// 等同于
function Cat () {}
Cat.prototype = {
    constructor() {}
    toString () {}
    toValue () {}
}
```

这个可以看下面👇的题目`2.2`来理解它。



####  2.1 题目一

现在我们将`1.1`的题目换成`class`版本的来看看。

```javascript
class Cat {
  constructor (name, color) {
    var heart = '❤️'
    var stomach = '胃'
    var heartbeat = function () {
      console.log(heart + '跳')
    }

    this.name = name
    this.color = color
    this.jump = function () {
      heartbeat()
     	console.log('我跳起来了~来追我啊')
    }
  }
}
var guaiguai = new Cat('guaiguai', 'white')
console.log(guaiguai)
guaiguai.jump()
```

其实你会发现，当你使用`class`的时候，它会默认调用`constructor`这个函数，来接收一些参数，并构造出一个新的实例对象(`this`)并将它返回，因此它被称为`constructor`构造方法(函数)。

(另外，其实如果你的`class`没有定义`constructor`，也会隐式生成一个`constructor`方法)

可以看到，经过用`class`改造后的`Cat`

公有(实例)属性和方法：

- `name`
- `color`
- `jump`

而对于私有属性，个人感觉上述的`heart`不应该叫做私有属性，它只不过被局限于`constructor`这个构造函数中，是这个作用域下的变量而已。

执行结果：

```
Cat{ name: 'guaiguai', color: 'white', jump: function () {} }
❤️跳
'我跳起来了~来追我啊'
```



#### 2.2 题目二

（弄懂在类中定义属性或方法的几种方式）

```javascript
class Cat {
  constructor () {
    var heart = '❤️'
    this.name = 'guaiguai'
    this.jump = function () {}
  }
  color = 'white'
  cleanTheBody = function () {
    console.log('我会用唾液清洁身体')
  }
  hideTheShit () {
    console.log('我在臭臭完之后会把它藏起来')
  }
}
var guaiguai = new Cat()
console.log(guaiguai)
console.log(Object.keys(guaiguai))
guaiguai.cleanTheBody()
guaiguai.hideTheShit()
```

请仔细看看这道题，在这里面我用了四种不同的方式来定义一些属性。

1. 在`constructor`中`var`一个变量，它只存在于`constructor`这个构造函数中
2. 在`constructor`中使用`this`定义的属性和方法会被定义到实例上
3. 在`class`中使用`=`来定义一个属性和方法，效果与第二点相同，会被定义到实例上
4. 在`class`中直接定义一个方法，会被添加到`原型对象prototype`上

至此，这道题的答案为：

```javascript
Cat {color: "white", name: "guaiguai", cleanTheBody: ƒ, jump: ƒ}
["color", "cleanTheBody", "name", "jump"]
'我会用唾液清洁身体'
'我在臭臭完之后会把它藏起来'
```

解析：

- `heart`只能在`constructor`函数中使用，因此不会出现在实例上。
- `name、jump、color、cleanTheBody`满足于上面👆说到的第二点和第三点
- `hideTheShit`是在类里直接定义的，满足于上面👆说的第四点，因此它不会被`Object.keys()`获取到。
- `hideTheShit`虽然是在原型对象中，但是也还是能被实例对象所调用，因此最后一段代码也会被执行`'我在臭臭完之后会把它藏起来'`

![](https://user-gold-cdn.xitu.io/2020/3/17/170e71ffb18a7607?w=440&h=440&f=jpeg&s=20960)

这四种定义的方式已经介绍完了 😁，相信大家比较迷惑的一点就是以下这两种方式的定义吧：

```javascript
class Cat {
    cleanTheBody = function () {}
    hideTheShit () {}
}
```

看起来都是定义一个函数呀，为什么第一个就可以在实例对象中，而第二个是在原型对象中呢 🤔️ ？

其实不需要特意的去记住它，你只需要知道：**在类的所有方法都定义在类的prototype属性上面**。

这里的`cleanTheBody`你可以理解为它和`color`一样只是一个普通的变量，只不过这个变量是个函数，所以它并不算是定义在类上的函数，因此不会存在于原型对象上。

而`hideTheShit`是实实在在的定义在类上的方法，所以它和`constructor`方法一样，都是在类的原型对象上。

转化为伪代码就是：

```javascript
class Cat {
    constructor() {}
    hideTheShit () {}
}
// 等同于
function Cat () {}
Cat.prototype = {
    constructor() {}
    hideTheShit () {}
}
```



#### 2.3 题目三

(在`class`定义静态属性和方法)

前面我们给`Cat`定义静态属性和方法是采用这种方式，`Cat.xxx`：

```javascript
function Cat () {...}
Cat.descript = '我这个构造函数是用来生产出一只猫的'
Cat.actingCute = function () {
  console.log('一听到猫我就想到了它会卖萌')
}
```

在`class`中你也可以使用`Cat.xxx`这种方式定义，因为前面说过了，`class`本质也是个对象。

但除此之外，你还可以使用`static`标识符表示它是一个静态的属性或者方法：

```javascript
class Cat {
  static descript = '我这个类是用来生产出一只猫的'
  static actingCute () {
    console.log('一听到猫我就想到了它会卖萌')
  }
	// static actingCute = function () {} // 这种写法也是设置静态的方法
}
```



OK👌，现在让我们来做做下面这道题吧 😊：

```javascript
class Cat {
  constructor (name, color) {
    var heart = '❤️'
    var stomach = '胃'
    var heartbeat = function () {
      console.log(heart + '跳')
    }
    this.name = name
    this.color = color
    heartbeat()
    this.jump = function () {
      console.log(this)
      console.log('我跳起来了~来追我啊')
    }
  }
  cleanTheBody = function () {
    console.log('我会用唾液清洁身体')
  }
  static descript = '我这个类是用来生产出一只猫的'
  static actingCute () {
    console.log(this)
    console.log('一听到猫我就想到了它会卖萌')
  }
}
Cat.staticName = 'staticName'
var guaiguai = new Cat('guaiguai', 'white')

console.log(guaiguai)
guaiguai.jump()
guaiguai.cleanTheBody()
console.log(guaiguai.descript)
guaiguai.actingCute()

Cat.actingCute()
console.log(Cat.descript)
console.log(Cat.staticName)
```

结果：

```
❤️跳
Cat{ name: 'guaiguai', color: 'white', jump: function(){}, cleanTheBody: function(){} }
Cat{ name: 'guaiguai', color: 'white', jump: function(){}, cleanTheBody: function(){} }
'我跳起来了~来追我啊'
'我会用唾液清洁身体'
undefined
Uncaught TypeError: guaiguai.actingCute is not a function

class Cat{...}
'一听到猫我就想到了它会卖萌'
'我这个类是用来生产出一只猫的'
'staticName'
```

结果分析：

- 首先在构造`guaiguai`这个对象的时候会执行`heartbeat`方法，打印出`❤️跳`

- 其次打印出的`guaiguai`它只会拥有`class`中定义的实例属性和方法，所以并不会有`descript`和`actingCute`
- `jump`中的`this`指向的是实例对象`guaiguai`，并且执行了`'我跳起来了~来追我啊'`
- 直接定义在`class`中的属性或者方法就相当于是定义在`Cat.prototype`上，所以也属于实例方法，`cleanThebody`会执行打印出`'我会用唾液清洁身体'`
- 使用了`static`定义的属性和方法为静态属性和方法，并不存在于实例上，所以打印出`undefined`和报错
- `actingCute`使用了`static`修饰符，所以它是静态方法，存在于`Cat`这个类上，因此它里面的`this`指向这个类，并且执行了`'一听到猫我就想到了它会卖萌'`
- `descript`使用了`static`修饰符，所以它是静态属性，打印出`'我这个类是用来生产出一只猫的'`
- `Cat.staticName = 'staticName'`就相当于定义了一个静态属性，所以打印出`staticName`



#### 2.4 题目四

我们再来看看这道题，友情提示，这是个坑 🤮...

```javascript
var a = new A()
function A () {}
console.log(a)

var b = new B()
class B {}
console.log(a)
```

你开始的预想是不是：

```
A{}
B{}
```

😁，结果却发现报错了：

```
A {}
Uncaught ReferenceError: Cannot access 'B' before initialization
```

那是因为，函数`A`是会被提升至作用域的最顶层，所以可以在定义函数`A`之前使用`new A()`

**但是类却不存在这种提升机制**，所以当你执行`new B()`的时候它就会告诉你在`B`没有初始化之前不能使用它。

尽管我们知道，`class`它的本质也是一个函数：

```javascript
console.log(typeof B) // function
```



#### 2.5 题目五

坑二 🤮...

```javascript
class Cat {
  constructor () {
    this.name = 'guaiguai'
    var type = 'constructor'
  }
  type = 'class'
  getType = function () {
    console.log(this.type)
    console.log(type)
  }
}
var type = 'window'
var guaiguai = new Cat()
guaiguai.getType()
```

这里的执行结果是什么呢？

主要是考察了你对作用域以及`class`的理解。

答案为：

```
'class'
'window'
```

解析：

- 调用`getType`函数的是`guaiguai`，所以里面的`this`指向了`guaiguai`，而`guaiguai`上的`type`为`class`
- 当要打印出`type`的时候，发现`getType`函数中并没有这个变量，所以就向外层查找，找到了`window`中存在这个变量，因此打印出`window`。(`var type = 'constructor'`是函数`constructor`中的变量)



#### 2.6 题目六

既然做到了函数类型的题目，那怎么能不想到箭头函数呢？嘿嘿 。

阴笑～

让我们将`2.5`中的`getType`函数换成箭头函数看看？

```javascript
class Cat {
  constructor () {
    this.name = 'guaiguai'
    var type = 'constructor'
  }
  type = 'class'
  getType = () => {
    console.log(this.type)
    console.log(type)
  }
}
var type = 'window'
var guaiguai = new Cat()
guaiguai.getType()
console.log(guaiguai)
```

现在调用`guaiguai.getType()`你觉得会是啥？

`"既然箭头函数内的this是由外层作用域决定的，那这里外层作用域是window，当然this.type就是'window'咯"`

咦～

还记得我之前说过的，`class`的本质是个函数吗？所以你碰到`class`内有箭头函数的题目，把它当成构造函数创建对象来处理就可以了。

在构造函数中如果使用了箭头函数的话，`this`指向的就是这个实例对象。

因此将`class`转化为构造函数的话，伪代码为：

```javascript
function Cat () {
  this.type = 'class'
  this.getType = () => {
    console.log(this.type)
    console.log(type)
  }
}
Cat.prototype.constructor = function () {
  this.name = 'guaiguai'
  var type = 'constructor'
}
var type = 'window'
var guaiguai = new Cat()
guaiguai.constructor()
guaiguai.getType()
console.log(guaiguai)
```

别的都好理解，这里为啥，`constructor`要放在原型对象中，并且要在`var guaiguai = new Cat()`下面再调用它呢？

嘻嘻，还记得在`2.2`中我们就说过了吗，任何放在类上的方法都相当于写在原型对象上，并且在使用类的时候，会隐式执行`constructor`函数。这两段代码就是为了模拟这个操作。

这样的话，上面👆两个题目的结果都是：

```
'class'
'window'
Cat {type: "class", name: "guaiguai", getType: ƒ}
```



`哇～`

`有点意思哈～`

`class还能这样玩？😁`

`霖呆呆你....你臭不要脸`

不过上面对于箭头函数还有不理解的小伙伴可以查看这篇

[《【建议👍】再来40道this面试题酸爽继续(1.2w字用手整理)》](https://juejin.im/post/5e6358256fb9a07cd80f2e70)

文章中的`7.4`题，里面介绍了**构造函数对象中普通函数和箭头函数的区别**。

![](https://user-gold-cdn.xitu.io/2020/3/17/170e71fa3f8a80ff?w=343&h=270&f=png&s=72820)

#### 2.7 题目七

如果在`class`中存在两个相同的属性或者方法会怎么样呢 🤔️？

```javascript
class Cat {
  constructor () {
    this.name = 'cat1'
  }
  name = 'cat2'
  getName = function  () {
    console.log(this.name)
  }
}
var cat = new Cat()
cat.getName()
```

这道题中，我们调用`getName`方法，打印出的会是：

```
'cat1'
```

所以可以看出`constructor`中定义的相同名称的属性和方法会覆盖在`class`里定义的。



#### 2.8 题目八

那么，原型对象中相同名称的属性和方法呢？

```javascript
class Cat {
  constructor () {
    this.name = 'cat1'
  }
  name = 'cat2'
  getName = function  () {
    console.log(this.name)
  }
}
Cat.prototype.name = 'cat3'
var cat = new Cat()
cat.getName()
```

答案：

```
'cat1'
```

没错，还是以`constructor`中的为准。这里和构造函数中同名属性的处理方式是一样的，可以看上面👆的`1.7`题。



#### 2.9 题目九

好吧 😅，现在可以加大难度了：

```javascript
class Cat {
  constructor () {
    this.name = 'guaiguai'
    var type = 'constructor'
    this.getType = () => {
      console.log(this.type)
      console.log(type)
    }
  }
  type = 'class'
  getType = () => {
    console.log(this.type)
    console.log(type)
  }
}
var type = 'window'
var guaiguai = new Cat()
guaiguai.getType()
console.log(guaiguai)
```

首先我们很清楚，如果`type`打印出的是`window`那就表示使用的是第二个`getType`，否则表示用的是第一个`getType`。

那么根据题`2.7`，我们可以看出，第一个`getType`是会覆盖第二个的，所以执行结果为：

```
'class'
'constructor'
Cat {type: "class", name: "guaiguai", getType: ƒ}
```



#### 总结-class

来吧，对`class`实现封装也来做个总结呗：

**(一) class的基本概念：**

- 当你使用`class`的时候，它会默认调用`constructor`这个函数，来接收一些参数，并构造出一个新的实例对象(`this`)并将它返回。
- 如果你的`class`没有定义`constructor`，也会隐式生成一个`constructor`方法



**(二) class中几种定义属性的区别：**：

- 在`constructor`中`var`一个变量，它只存在于`constructor`这个构造函数中

- 在`constructor`中使用`this`定义的属性和方法会被定义到实例上

- 在`class`中使用`=`来定义一个属性和方法，效果与第二点相同，会被定义到实例上

- 在`class`中直接定义一个方法，会被添加到`原型对象prototype`上

- 在`class`中使用了`static`修饰符定义的属性和方法被认为是静态的，被添加到类本身，不会添加到实例上



**(三) other:**

- `class`本质虽然是个函数，但是并不会像函数一样提升至作用域最顶层
- 如遇`class`中箭头函数等题目请参照构造函数来处理
- 使用`class`生成的实例对象，也会有沿着原型链查找的功能


## 后语

知识无价，支持原创。

参考文章：

- [《前端瓶子君-JS 继承的 六 种实现方式》](https://juejin.im/post/5d6bede851882564c31263de)
- [《Js三大特性--封装、继承以及多态》](https://blog.csdn.net/qq_22896159/article/details/81779667)
- [《浅谈JavaScript的面向对象和它的封装、继承、多态》](https://segmentfault.com/a/1190000017342103)


你盼世界，我盼望你无`bug`。这篇文章就介绍到这里，让我们先打好面向对象的基础，才能挑战后面的`魔鬼`题目 😄。(才能继承家产，哈哈哈)

![](https://user-gold-cdn.xitu.io/2020/3/17/170e72822a3fc8e6?w=1004&h=566&f=png&s=848645)

系列中的`继承`和`多态`霖呆呆也会在近几天给更出来，请期待一小下吧 😄。

最后，正经的给个三连吧 😂。

喜欢**霖呆呆**的小伙还希望可以关注霖呆呆的公众号 `LinDaiDai` 或者扫一扫下面的二维码👇👇👇.


![](https://user-gold-cdn.xitu.io/2020/3/17/170e729eebf9a86a?w=900&h=500&f=gif&s=1632550)

我会不定时的更新一些前端方面的知识内容以及自己的原创文章🎉

你的鼓励就是我持续创作的主要动力 😊.

相关推荐:


[《全网最详bpmn.js教材》](https://juejin.im/post/5def372af265da33c84a4818)

[《你的掘金文章本可以这么炫（博客美化工具一波带走）》](https://juejin.im/post/5e4ca743f265da576b565ee1)

[《【建议改成】读完这篇你还不懂Babel我给你寄口罩》](https://juejin.im/post/5e477139f265da574c566dda)

[《【建议星星】要就来45道Promise面试题一次爽到底(1.1w字用心整理)》](https://juejin.im/post/5e58c618e51d4526ed66b5cf)

[《【建议👍】再来40道this面试题酸爽继续(1.2w字用手整理)》](https://juejin.im/post/5e6358256fb9a07cd80f2e70)