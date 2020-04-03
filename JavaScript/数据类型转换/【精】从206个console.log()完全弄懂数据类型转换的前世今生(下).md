## 前言

你盼世界，我盼望你无`bug`。Hello  大家好！我是霖呆呆！

那年我十八岁，单纯，善良，懵懂，青涩，阳光，可爱...

现在的我...在面对`JS`类型转换的时候，依旧是...

我以为了解了`toString()`和`valueOf()`之后，我就是那个最懂你的男人...

直到我在你的心里看到一个叫做`Symbol.toPrimitive`的人...

这个人，他掌握着你转换的核心，甚至在必要的时候能够完全替代`toString()`和`valueOf()`。

我奔溃了...发疯似得去找谷哥和度娘，求他们告诉我战胜`Symbol.toPrimitive`的法门，最后，他们只说了一句话：

`"看完霖呆呆的这篇文章再来一波三连就可以了啊！！！"`

😂😂😂

抱歉，狗改不了吃屎，呸，秉性难移顽梗不化，忍不住写了个小短片哈 😄。

其实也是想要告诉大家，上一篇文章是重点，这篇文章也是重点，所以都要好好看哦。

有很多人觉得花了这么多的时间和这么多的精力来看呆呆的这两篇类型转换，就只为了弄懂这一个小小的知识点，感觉好亏啊，远没有刷一篇各个知识点都覆盖的面试总结的成就感高。其实我想说，面试总结类的文章固然可以帮助我们查漏补缺，但是对于`JS`基础知识的掌握我认为也是十分重要的。就像今天看到[Minute](https://juejin.im/user/5d7f13b0f265da03a1488a48)老哥的一篇[《非科班二本前端大厂面试的心路历程和总结（腾讯、头条、阿里、京东） | 掘金技术征文》](https://juejin.im/post/5e818e4de51d4546fb276d97)文章里说的一样：

![](https://user-gold-cdn.xitu.io/2020/4/3/1713ef98f38d2ee1?w=1344&h=396&f=jpeg&s=92733)

OK👌，玩归玩，闹归闹，类型转换把你教。

来看看通过阅读你可以学习到：

- 重写`toString`和`valueOf`
- `Symbol.toPrimitive`
- 使用`==`比较时的类型转换
- `+、-、*、/、%`的类型转换
- 几道大厂的面试题



## 前期准备

在正式阅读之前，我推荐你看一下本系列的上一篇[《从206个console.log()完全弄懂数据类型转换的前世今生(上)》](https://juejin.im/post/5e7f8314e51d4546fa4511c9)；这样有利于你阅读本篇文章。

让我们来回顾一下之前提到的`toPrimitive`执行流程：

![](https://user-gold-cdn.xitu.io/2020/4/3/1713eff805a570ba?w=4532&h=2828&f=png&s=712918)


## 1. 重写toString和valueOf

看完了上篇的对象转字符串，不知道你对`toPrimititve`的转换流程掌握了多少呢？

如果你感觉之前的那些例子还不太具有说明性，也就是说你还是没有感觉到`JS`确实是按我画的那个流程图来进行转换的话，你可以看看这里。

我们在上篇的`6.1`中提到过了，大部分的对象都是可以通过原型链查找到`Object.prototype`上的`toString`或者`valueOf`方法，然后使用它们。

但是你想想，如果我这个对象本身就有`toString`或者`valueOf`方法的话是不是就可以不用`Object.prototype`上的了，这其实就是我们常听到的重写。

你也许可以用这样的方式来覆盖原型链上的这两个方法：

```javascript
let obj = {
    toString () {
        return '1'
    },
    valueOf () {
        return 1
    }
}
```

甚至你还可以直接修改`Object.prototype`上的方法：

```javascript
Object.prototype.toString = function () {
  return 1
}
var b = {}
console.log(String(b)) // '1'
```

(当然，这种肯定是不推荐的哈，这会影响所有的对象)



### 1.1 题目一

（通过重写`toString()`和`valueOf()`来判断我们之前的`toPrimitive`流程是否正确）

上面👆两个例子我只是想告诉你，既然我们可以重写对象上的`toString()`和`valueOf`，那如果我们在重写的函数里面再加上`console.log(xxx)`，不就可以知道**对象转原始值**的具体过程是不是按我们设想的方式执行下去了吗？

比如这样：

```javascript
var b = {
  toString () {
    console.log('toString')
    return 1
  },
  valueOf () {
    console.log('valueOf')
    return [1, 2]
  },
}
console.log(Number(b))
```

想一下这里的执行结果 🤔️？

既然是用`Number()`方法来进行转换的话，那也就是执行了伪代码`toPrimitive(obj, 'number')`了。

那也就是说会先调用`valueOf()`函数，然后判断这个函数的返回值是否为原始值，再决定是继续调用`toString()`还是返回。

- 很显然，由于这里的`valueOf()`被重写了，所以调用`valueOf()`之后返回的是一个引用类型`[1, 2]`，所以它会继续执行`toString()`
- 也就是执行`[1, 2].toString()`，但是这时候的`toString()`也是被重写了的并且返回了数字`1`，所以我们根本没必要管`[1, 2].toString()`的结果了，而是直接将`1`返回。

所以整个过程结束之后，答案为：

```javascript
'valueof'
'toString'
1
```

这样看下来流程就很清晰了，它确实是按照我们预期的方向走的。



### 1.2 题目二

如果你理解了上面一题的话，咱再来看看这里：

```javascript
var b = {
  toString () {
    console.log('toString')
    return { name: 'b' }
  },
  valueOf () {
    console.log('valueOf')
    return [1, 2]
  },
}
console.log(String(b))
```

这次我是用的`String()`方法将`b`转为字符串。

而且要注意了，重写的`toString()`和`valueOf`都是返回的引用数据类型。那你可以想想到最后的结果会是什么吗？

来看看过程分析：

- 执行重写的`toString()`方法，返回引用类型`{name: 'b'}`
- 继续执行重写的`valueOf()`方法，返回引用类型`[1,2]`
- 哇，很难受，都经过两轮转换了还是引用类型，得抛错了。

没错，这里的转换过程最终是失败了的，因为还记得流程图中，最后一步了若还不是原始值的话，就会抛异常了。

所以结果为：

```javascript
'toString'
'valueOf'
Cannot convert object to primitive value at String
```



精彩精彩👏，我仿佛已经看到了完全弄懂对象转换原始值机制的曙光！！！

![](https://user-gold-cdn.xitu.io/2020/4/3/1713efb5307ba732?w=150&h=85&f=gif&s=8547)



### 1.3 题目三

(数组在进行`ToString`时的不同之处)

我们都知道，当数组在进行转字符串的时候，会把里面的每一项都转为字符串然后再进行`","`拼接返回。

那么为什么会有`","`拼接这一步呢？难道`toString()`在调用的时候还会调用`join()`方法吗？

为了验证我的想法💡，我做了一个实验，重写了一个数组的`join()`方法：

```javascript
var arr = [1, 2]
arr['join'] = function () {
  let target = [...this]
  return target.join('~')
}
console.log(String(arr))
```

重写的`join`函数中，`this`表示的就是调用的这个数组`arr`。

然后将返回值改为`"~"`拼接，结果答案竟然是：

```javascript
"1~2"
```

也就是说在`String(arr)`的过程中，它确实是隐式调用了`join`方法。

但是当我们重写了`toString()`之后，就不会管这个重写的`join`了：

```javascript
var arr = [1, 2]
arr['toString'] = function () {
  let target = [...this]
  return target.join('*')
}
arr['join'] = function () {
  let target = [...this]
  return target.join('~')
}
console.log(String(arr)) // "1*2"
```

可以看出`toString()`的优先级还是比`join()`高的。

现在我们又可以得出一个结论：

对象如果是数组的话，当我们不重写其`toString()`方法，在转换为字符串类型的时候，默认实现就是将调用`join()`方法的返回值作为`toString()`的返回值。



## 2. Symbol.toPrimitive

在我正为自己弄懂了`toPrimitive`而感到骄傲的时候，我得知了一个叫做`Symbol.toPrimitive`的家伙。

看这家伙的样子，让我想起了以前见到过的一些老大哥：`Symbol.hasInstance`、`Symbol.toStringTag`。

他们都有着酷酷的纹身：`Symbol`，并且之前的老大哥是能够让我们做一些自定义的事情，不知道这家伙是不是和我想的一样，也能够帮助我们重写`toPrimitive` 🤔️？

了解了事情的真相之后，我知道了自己还是不笨的，给猜对了。

`Symbol.toPrimitive`就是比重写`toString()`和`valueOf()`更屌的一个属性。

如果你在一个对象里重写了它的话，那么甚至都不会执行重写的`toString()`和`valueOf()`了。

(`Symbol.toPrimitive`也被叫做`@@toPrimitive`)



### 2.1 题目一

（`Symbol.toPrimitive`的基本使用-返回值为一个原始值）

你不信霖呆呆说的话？咱给整一个？

```javascript
var b = {
  toString () {
    console.log('toString')
    return { name: 'b' }
  },
  valueOf () {
    console.log('valueOf')
    return [1, 2]
  },
  [Symbol.toPrimitive] () {
    console.log('symbol')
    return '1'
  }
}
console.log(String(b))
console.log(Number(b))
```

这道题中，我把刚刚提到的三个属性都给重写了，你感觉结果会是什么？

😄记住呆呆刚刚说的话，`Symbol.toPrimitive`的优先级是最高的，所以这里只会执行它里面的内容。

因此结果为：

```javascript
'symbol'
'1'
'symbol'
1
```

并且大家可以看到，虽然`Symbol.toPrimitive`的返回值是`"1"`，但是最终的结果`String(b)`还是字符串，`Number(b)`还是数字，表明，最后还是会给返回值做一层对应的转换的。



### 2.2 题目二

（`Symbol.toPrimitive`的返回值为引用类型，或者没有返回值？）

如果它的返回值是引用类型，或者干脆没有返回值，就会继续执行`valueOf`或者`toString`吗？

结果并不会...来看看这里，我定义了对象`b和c`，并且重写了这三个属性：

```javascript
var b = {
  toString () {
    console.log('b.toString')
    return { name: 'b' }
  },
  valueOf () {
    console.log('b.valueOf')
    return [1, 2]
  },
  [Symbol.toPrimitive] () {
    console.log('b.symbol')
  }
}
var c = {
  toString () {
    console.log('c.toString')
    return { name: 'c' }
  },
  valueOf () {
    console.log('c.valueOf')
    return [1, 2]
  },
  [Symbol.toPrimitive] () {
    console.log('c.symbol')
    return [1, 2]
  }
}
console.log(String(b))
console.log(String(c))
```

执行结果：

```javascript
'b.symbol'
'undefined'
'c.symbol'
TypeError: Cannot convert object to primitive value
    at String
```

过程分析：

- `String(b)` 过程中打印出了`b.symbol`，说明还是执行了`Symbol.toPrimitive`方法的，但是这个方法并没有返回值，且也没有继续执行`valueOf()`或者`toString()`了，而是返回了字符串`"undefined"`
- `String(c)`过程中也打印了`c.symbol`，但是`Symbol.toPrimitive`的返回值是一个对象，却报错了。

所以从这道题，我们可以看出：

`Symbol.toPrimitive`它可谓是`一夫当关，万夫莫开`，只要有它在，就不会继续往下走了，它的返回结果就是作为最终的返回结果。

而且通过`String(c)`我们可以看出来：如果返回的是一个对象的话，也不会继续执行`valueOf()、toString()`了，而是判断它的返回值，如果是原始值那就返回，否则就抛出错误。


![](https://user-gold-cdn.xitu.io/2020/4/3/1713f04912c86d9e?w=498&h=465&f=jpeg&s=22709)


### 2.3 题目三

（带参数的`Symbol.toPrimitive`）

你以为`Symbol.toPrimitive`仅仅是这么简单吗？

No😺，它竟然还能接收参数！！！

它接收一个字符串类型的参数：`hint`，表示要转换到的原始值的预期类型。

且参数的取值为以下字符串的其中一个：

- `"number"`
- `"string"`
- `"default"`

嗯😺？霖呆呆我一惊，这怎么和之前介绍的`toPrimitive`那么像啊：

```javascript
toPrimitive(obj, 'number')
toPrimitive(obj, 'string')
```

也就是说传入了之后，就是告诉`Symbol.toPrimitive`要转换成哪个类型咯？

这么屌的功能，赶紧来试试：

```javascript
var b = {
  toString () {
    console.log('toString')
    return '1'
  },
  valueOf () {
    console.log('valueOf')
    return [1, 2]
  },
  [Symbol.toPrimitive] (hint) {
    console.log('symbol')
    if (hint === 'string') {
      console.log('string')
      return '1'
    }
    if (hint === 'number') {
      console.log('number')
      return 1
    }
    if (hint === 'default') {
      console.log('default')
      return 'default'
    }
  }
}
console.log(String(b))
console.log(Number(b))
```

这道题重写了`toString、valueOf、Symbol.toPrimitive`三个属性，通过上面👆的题目我们已经知道了只要有`Symbol.toPrimitive`在，前面两个属性就被忽略了，所以我们不用管它们。

而对于`Symbol.toPrimitive`，我将三种`hint`的情况都写上了，如果按照我的设想的话，在调用`String(b)`的时候应该是要打印出`string`的，调用`Number(b)`打印出`number`，结果也正如我所预想的一样：

```javascript
'string'
'1'
'number'
1
```

那么这里面的`"default"`是做什么的呀？它是什么时候执行的呢？

开始我的想法是如果没有`if (hint === 'string')`这一个判断的时候，是不是就会执行`"default"`了呢？

于是我把`if (hint === 'string')`和`'number'`这两个判断的内容给去掉了，发现它还是不会执行`"default"`：

```javascript
var b = {
  toString () {
    console.log('toString')
    return '1'
  },
  valueOf () {
    console.log('valueOf')
    return [1, 2]
  },
  [Symbol.toPrimitive] (hint) {
    console.log('symbol')
    // if (hint === 'string') {
    //   console.log('string')
    //   return '1'
    // }
    // if (hint === 'number') {
    //   console.log('number')
    //   return 1
    // }
    if (hint === 'default') {
      console.log('default')
      return 'default'
    }
  }
}
console.log(String(b))
console.log(Number(b))

// 'symbol'
// 'undefined'
// 'symbol'
// NaN
```

可以看到，执行结果竟然和题`2.2`中那个没有返回值的`b`有点像。

所以也就是说，这个`hint`它是在调用`Symbol.toPrimitive`的时候就已经确定了的，后面并不会改变。

比如`String(b)`时传的是`string`，`Number(b)`时传的是`number`。

而`default`这个情况，它涉及到`+`运算符，在第四节中会说到。


![](https://user-gold-cdn.xitu.io/2020/4/3/1713f06242205810?w=498&h=465&f=png&s=31834)


### 2.4 题目四

小伙子(姑娘)，听说你已经掌握`Symbol.toPrimitive`了？

OK👌，让我们来做个题巩固一下：

```javascript
class Person {
  constructor (name) {
    this.name = name
  }
  [Symbol.toPrimitive] (hint) {
    if (hint === 'default') {
      console.log('default')
      return 'default'
    }
    if (hint === 'string') {
      console.log('string')
      return '1'
    }
    if (hint === 'number') {
      console.log('number')
      return 1
    }
  }
}
let p1 = new Person('p1');
let p2 = new Person('p2');

console.log(String(p1))
console.log(Number(p2))
console.log(p1)
console.log(p2)
```

我把原来的对象，换成了现在的`class`，你不用想多，其实用它生成的实例就是一个对象，且能使用`Symbol.toPrimitive`。

所以这里的结果为：

```javascript
'string'
'1'
'number'
1
Person{ name: 'p1' }
Person{ name: 'p2' }
```

注意：这里的`p1、p2`为什么是没有表现出`Symbol.toPrimitive`函数的呢？

别忘了[《【何不三连】比继承家业还要简单的JS继承题-封装篇(牛刀小试)》](https://juejin.im/post/5e707417e51d45272054d5d3)这里说的，定义在`class`中的所有方法都相当于是定义在其原型对象上，也就是`Person.prototype`上，所以这里`p1、p2`虽然是遵循`Symbol.toPrimitive`，但是使用的却是它原型链上的。



### 总结-Symbol.toPrimitive

咱来总结一下哈。

- 如果重写了某个对象或者构造函数中的`toString、valueOf、Symbol.toPrimitive`方法，`Symbol.toPrimitive`的优先级是最高的
- 若是`Symbol.toPrimitive`函数返回的值不是基础数据类型(也就是原始值)，就会报错
- `Symbol.toPrimitive`接收一个字符串参数`hint`，它表示要转换到的原始值的预期类型，一共有`'number'、'string'、'default'`三种选项
- 使用`String()`调用时，`hint`为`'string'`；使用`Number()`时，`hint`为`'number'`
- `hint`参数的值从开始调用的时候就已经确定了



说实话，这回是真的有些膨胀了，现在不管是`toPrimitive`的执行机制，还是`Symbol.toPrimitive`的自定义咱都给搞懂了。

![](https://user-gold-cdn.xitu.io/2020/4/3/1713efb75bb9c454?w=255&h=255&f=jpeg&s=9431)

## 3. 使用==比较时的类型转换

上面👆整了这么多题，你倒是给👴来点实际会考的东西啊。

好哦，其实在实际中我们被考的比较多的可能就是用`==`来比较判断两个不同类型的变量是否相等。

而全等`===`的情况比较简单，一般不太会考，因为全等的条件就是：如果类型相等值也相等才认为是全等，并不会涉及到类型转换。

但是`==`的情况就相对复杂了，先给大家看几个比较眼熟的题哈：

```javascript
console.log([] == ![]) // true
console.log({} == true) // false
console.log({} == "[object Object]") // true
```

怎样？这几题是不是经常看到呀 😁，下面就让我们一个一个来看。

首先，我们还是得清楚几个概念，这个是硬性规定的，不看的话咱没法继续下去啊。

当使用`==`进行比较的时候，会有以下转换规则（判断规则）：

1. 两边类型如果相同，值相等则相等，如 `2 == 3`肯定是为`false`的了
2. 比较的双方都为基本数据类型：

- 若是一方为`null、undefined`，则另一方必须为`null或者undefined`才为`true`，也就是`null == undefined`为`true`或者`null == null`为`true`，因为`undefined`派生于`null`
- 其中一方为`String`，是的话则把`String`转为`Number`再来比较
- 其中一方为`Boolean`，是的话则将`Boolean`转为`Number`再来比较

3. 比较的一方有引用类型：

- 将引用类型遵循`ToNumber`的转换形式来进行比较(实际上它的`hint`是`default`，也就是`toPrimitive(obj, 'default')`，但是`default`的转换规则和`number`很像，具体可以看`3.10`)
- 两方都为引用类型，则判断它们是不是指向同一个对象

在一些文章中，会说道：

> 如果其中一方为Object，且另一方为String、Number或者Symbol，会将Object转换成字符串，再进行比较

(摘自[《神三元-(建议收藏)原生JS灵魂之问, 请问你能接得住几个？(上)》](https://juejin.im/post/5dac5d82e51d45249850cd20#heading-20)中的`3. == 和 ===有什么区别？`)

这样认为其实也可以，因为想想`toPrimitive(obj, 'number')`的过程：

- 若是输入值为引用数据类型，则先调用`valueOf()`方法
- 若是`valueOf()`方法的返回值是基本数据类型则直接返回，若不是则继续调用`toString()`
- 若是调用`toString()`的返回值是基本数据类型则返回，否则报错。

可以看到，首先是会执行`valueOf()`的，但是引用类型执行`valueOf()`方法，除了日期类型，其它情况都是返回它本身，也就是说执行完`valueOf()`之后，还是一个引用类型并且是它本身。那么我们是不是就可以将`valueOf()`这一步给省略掉，认为它是直接执行`toString()`的，这样做起题来也快了很多。

（虽然可以将它省略，但是你得知道实际是有这么一步的，这一点我们在题目`3.6`会验证）

为了方便记忆，我画了一张后面三个规则的转换图，接下来我们只需要按着这张图的转换规则来做题就可以了 😁。

![](https://user-gold-cdn.xitu.io/2020/4/3/1713f0a4afb615d6?w=1086&h=532&f=jpeg&s=78305)
（为了能有更好的做题体验，请你务必要将此图刻在心里）



### 3.1 题目一

(理解`类型相同`、`null、undefined`的情况)

来点简单的吧

```javascript
console.log(1 == 1)
console.log(1 == 2)

console.log(null == 0)
console.log(null == false)
console.log(null == {})

console.log(undefined == 0)
console.log(undefined == false)
console.log(undefined == {})

console.log(null == null)
console.log(undefined == undefined)
console.log(undefined == null)
```

谨记开头的转换规则来做题哦 😁。

所以这里的答案为：

```javascript
console.log(1 == 1) // true
console.log(1 == 2) // false

console.log(null == 0) // false
console.log(null == false) // false
console.log(null == {}) // false

console.log(undefined == 0) // false
console.log(undefined == false) // false
console.log(undefined == {}) // false

console.log(null == null) // true
console.log(undefined == undefined) // true
console.log(undefined == null) // true
```

可以看到，`undefined、null`除了和它自身以及对方相等之外，和其它的比较都为`false`。

（其实之前我总是以为`null == 0`或者`null == false`是为`true`的，因为之前可能会使用`!flag`这种方式来判断某个值是不是`truly`，当然越到后面越知道这种方式其实是很不严谨的哈）



### 3.2 题目二

（理解一方为`String`，另一方为`Number`的情况）

若是这种情况的话，会把`String`转成`Number`再来比较：

![](https://user-gold-cdn.xitu.io/2020/4/3/1713f0b2dd6ee2bf?w=1122&h=138&f=jpeg&s=25841)

```javascript
console.log('11' == 11)
console.log('1a' == 11)
console.log('11n' == 11)

console.log('0x11' == 17)
console.log('false' == 0)
console.log('NaN' == NaN)
```

这里可能会有几个陷阱，大家要小心了。

答案：

```javascript
console.log('11' == 11) // true
console.log('1a' == 11) // false
console.log('11n' == 11) // false

console.log('0x11' == 17) // true
console.log('false' == 0) // false
console.log('NaN' == NaN) // false
```

- `'11' == 11`没啥问题，字符串转为了数字
- `'1a'`转为数字之后是`NaN`
- `'11n'`转为数字之后也是`NaN`，可能大家会看成是`bigInt`类型的，但是注意了这里是字符串
- `'0x11'`，以`0x`开头的十六进制，所以转换为数字之后是`17`
- `'false'`是一个字符串哦，并不是`false`，所以结果是假值
- `'NaN'`也是字符串，不过这里要是真的`NaN`的话，那也是`false`，因为`NaN`这个六亲不认的连它自己都不全等(也就是`NaN===NaN`的结果为`false`)，只有用`Object.is(NaN, NaN)`才会被判断为`true`)


![](https://user-gold-cdn.xitu.io/2020/4/3/1713f15e814bc6d8?w=300&h=300&f=jpeg&s=9625)

### 3.3 题目三

（理解一方为`Boolean`的情况）

这种情况会将`Boolean`转为`Number`来比较，而通过上篇我们知道，`Boolean`转`Number`那是相当简单的，只有两种情况：

- true => 1
- false => 0

![](https://user-gold-cdn.xitu.io/2020/4/3/1713f172c9f19c71?w=1128&h=150&f=jpeg&s=25597)

所以如果有一方为`Boolean`的时候应该会很好做吧...

```javascript
console.log(true == 1)
console.log(false == 0)
console.log(true == '1')
console.log(false == '0')

console.log(true == '0')
console.log(true == 'false')
console.log(false == null)
```

是挺简单的哈：

```javascript
console.log(true == 1) // true
console.log(false == 0) // true
console.log(true == '1') // true
console.log(false == '0') // true

console.log(true == '0') // false
console.log(true == 'false') // false
console.log(false == null) // false
```

- 前两个没啥问题，`true`和`false`转为数字就是 `0`和`1`
- 第三个`true`转为数字为`1`，之后另一边是字符串`1`，依靠准则三，一方为字符串，则将这个字符串转为数字然后进行比较，所以结果为`1 == 1`的结果，也就是`true`
- 第四个和第三个情况一样，`false`转为数字`0`，之后后面的`"0"`也被转为数字`0`，所以结果为`true`
- 第五个，`true`被转换为了`1`，`'0'`被转换为了`0`，所以结果为`false`
- 第六个，`true`被转换为了`1`，`"false"`被转换为了`NaN`，所以结果为`false`
- 第七个，额，这个其实遵循准则一就可以了，`null`和`false`本身就是不相等的。

其实这里不知道有没有和我一样对`true == '0'`有疑问的呢 🤔️？

因为我们可能见过这么一段代码：

```javascript
if ('0') {
    console.log('我会被执行')
}
```

这里`if`内的内容是会被执行的，因为字符串`'0'`转换为布尔确实是`true`，那么我就总会认为`true == '0'`是对的。

所以这里要注意了，`'0'`确实是会被转换为`true`，也就是：

```javascript
if (true) {
    console.log('我会被执行')
}
```

但在这道题中是将它与`true`来做比较，那么就要遵循「有布尔先将布尔转换为数字」的规则。

所以其实也就是一个转换顺序的问题，`true == '0'`是先执行的布尔转数字的。

但是你不要以为是一个写法顺序的问题 😂，也就是说就算把`true`和`'0'`换个位置结果也是一样的：

```javascript
console.log('0' == true) // false
```

![](https://user-gold-cdn.xitu.io/2020/4/3/1713f26810ee2ca6?w=400&h=400&f=jpeg&s=19141)

### 3.4 题目四

(一方为对象的情况)

在第三节的开头那里呆呆已经说了，当一方有为对象的时候，实际是会将对象执行类似`ToNumber`操作之后再进行比较的，但是又由于对象的`valueOf()`基本都是它本身，所以我们可以认为省略了这一步，不过为了让大家心服口服，我这里还是得来验证一下：

```javascript
var b = {
  valueOf: function () {
    console.log('b.valueOf')
    return '1'
  },
  toString: function () {
    console.log('b.toString')
    return '2'
  }
}
var c = {
  valueOf: function () {
    console.log('c.valueOf')
    return {}
  },
  toString: function () {
    console.log('c.toString')
    return '2'
  }
}
console.log(b == 1)
console.log(c == 2)
```

这道题中，`b`的`valueOf()`返回的是一个基本数据类型

`c`的`valueOf()`返回的是一个引用类型。

因此结果为：

```javascript
'b.valueOf'
true
'c.valueOf'
'c.toString'
true
```

所以我们可以得到这张图：

![](https://user-gold-cdn.xitu.io/2020/4/3/1713f1ac168dace1?w=1130&h=268&f=jpeg&s=36312)

下面做两道题让我们练习一下哈。



### 3.5 题目五

（一方为非数组对象的情况）

```javascript
console.log({} == true)
console.log({} == false)
console.log({} == 1)
console.log({} == '1')
console.log({} == 0)
console.log({} == Symbol(1))
console.log({} == null)
console.log({} == {})
```

 哇，乍一看感觉好多啊，这...我怎么比的过来。

这时候你只要记得，有一方是`Object`时，把这个`Object`转为字符串再来比较就可以了。

而引用类型转字符串不知道大家还记得吗？

分为了`数组`和`非数组`两种情况，大致就是：

- `[] => ''`，`['1, 2'] => '1, 2'`
- 非数组情况另看

然后我们再来看看上面那道题👆，`{}`转为字符串其实是`"[object Object]"`

所以可以看出上面的执行结果全为`false`。

其中可能比较难理解的是：

- `{} == true`，转换过程为：

```javascript
{} == true
"[object Object]" == true // 对象转字符串
"[object Object]" == 1 // 布尔值转数字(准则四,一方为布尔，转换为数字)
NaN == 1 // 字符串转数字(准则三,一方为字符串另一方为数字则将字符串转数字)
// 结果为false
```

- `{} == 1`，转换过程为：

```javascript
{} == 1
"[object Object]" == 1 // 对象转字符串
NaN == 1 // 字符串转数字(准则三,一方为字符串另一方为数字则将字符串转数字)
// 结果为 false
```

- `{} == {}`: 这个你就理解为对象是引用类型，那么这两个对象都有自己独立的堆空间，肯定就是不相等的了。



### 3.6 题目六

（一方为数组的情况）


![](https://user-gold-cdn.xitu.io/2020/4/3/1713f1bf4b37d342?w=760&h=624&f=jpeg&s=56489)

```javascript
console.log([] == 0)
console.log([1] == 1)
console.log(['1'] == 1)

console.log([] == 1)
console.log(['1', '2'] == 1)
console.log(['1', '2'] == ['1', '2'])

console.log([{}, {}] == '[object Object],[object Object]')
console.log([] == true)
console.log([] == Symbol('1'))
```

题目解析：

```javascript
console.log([] == 0)
[] == 0
'' == 0 // []空数组转为字符串为空字符串
0 == 0 // 空字符串转为数字为0
// true

console.log([1] == 1)
[1] == 1
'1' == 1 // [1]非空数组且数组长度为1，转换为字符串为'1'
1 == 1 // '1'字符串转换为数字1
// true

console.log(['1'] == 1) // 转换过程和上面一个一样
// true

console.log([] == 1)
[] == 1
'' == 1 // 空数组转为字符串为''
0 == 1 // 空字符串转为数字为0
// false

console.log(['1', '2'] == 1)
['1', '2'] == 1
'1,2' == 1 // ['1', '2']数组转为字符串为'1,2'
NaN == 1 // '1,2'字符串转为数字为NaN

console.log(['1', '2'] == ['1', '2']) // 引用地址不同
// false

console.log([{}, {}] == '[object Object][object Object]')
[{}, {}] == '[object Object][object Object]'
// [{},{}]数组中的每一项也就是{}转为字符串为'[object Object]'，然后进行拼接
'[object Object],[object Object]' == '[object Object],[object Object]'
// true

console.log([] == true)
[] == true
[] == 1 // 有一项为布尔，因此将布尔true转为数字1
'' == 1 // 有一项为数组, 因此将[]转为空字符串
0 == 1 // 空字符串转为数字0
// false

console.log([] == Symbol('1'))
[] == Symbol('1')
'' == Symbol('1')
// false
```



### 3.7 题目七

（理解`!`运算符的转换）

当我们使用`!`的时候，实际上会将`!`后面的值转换为布尔类型来进行比较，这也就是我在题`3.1`说到过的不严谨的情况。

而且我发现这种转换是不会经过`ToNumber()`的，而是直接转换为了布尔值，让我们来验证一下：

```javascript
var b = {
  valueOf: function () {
    console.log('b.valueOf')
    return '1'
  },
  toString: function () {
    console.log('b.toString')
    return '2'
  }
}
console.log(!b == 1)
console.log(!b == 0)
```

这里的执行结果是：

```javascript
false
true
```

可以看到，`!b`它在转换的过程中并没有经过`valueOf`或者`toString`，而是直接转为了`false`



### 3.8 题目八

再来做几道题哈：

```javascript
console.log(!null == !0)
console.log(!undefined == !0)
console.log(!!null == !!0)

console.log(!{} == {})
console.log(!{} == [])
console.log(!{} == [0])
```

答案：

```javascript
console.log(!null == !0) // true
console.log(!undefined == !0) // true
console.log(!!null == !!0) // true

console.log(!{} == {}) // false
console.log(!{} == []) // true
console.log(!{} == [0]) // true
```

可以看到，刚刚还不相等的`null`和`0`在分别加上了`!`之后，就变为相等了。

前面三个输出结果应该都没有什么问题，来看看后面三个：

`!{} == {}`：

- 首先执行的是`!{}`，转换之后为`false`
- 相当于`false == {}`，一方有布尔的情况，将布尔转换为数字，即`0 == {}`
- 一方有对象，将对象转换为字符串，即`0 == '[object Object]'`
- 一方有字符串，将字符串转换为数字，即`0 == NaN`
- 因此结果为`false`

`!{} == []`：

- 首先执行的还是`!{}`，转换之后为`false`
- 相当于`false == []`，一方有布尔，将布尔转换为数字，即`0 == []`，
- 一方有对象，将对象转换为字符串，即`0 == '0'`
- 一方有字符串，将字符串转换为数字，即`0 == 0`
- 因此结果为`true`

而`!{} == [0]`的转换流程和`!{} == []`一样。



### 3.9 题目九

现在你能弄懂开始说的那几道题了吗？

让我们再来看看，这次肯定觉得很简单：

```javascript
var b = {
  valueOf() {
    console.log('valueOf')
    return []
  },
  toString () {
    console.log('toString')
    return false
  }
}
console.log(![] == [])
console.log(![] == b)
```

`![] == []`：

- 先将`![]`转换为布尔类型，`[]`为`true`，那么`![]`就是`false`
- 然后`[]`转为数字是为`0`，`0`与`false`比较，将`false`也转换为`0`，所以结果为`true`

`![] == b`：

- 同样的，`![]`转为了`false`
- `b`会先执行`valueOf`，然后执行`toString`，返回的也是`false`
- 所以结果为`true`

答案：

```javascript
false
'valueOf'
'toString'
true
```



### 3.10 题目十

(理解`==`比较时对象的`Symbol.toPrimitive`函数的`hint`参数)

```javascript
var b = {
  [Symbol.toPrimitive] (hint) {
    console.log(hint)
    if (hint === 'default') {
      return 2
    }
  }
}
console.log(b == 2)
console.log(b == '2')
```

通过上面👆几个案例，我们都可以看出对象在进行`==`比较时会经过类似于`ToNumber`的转换过程：

- 调用`valueOf()`
- 调用`toString()`

但其在进行重新`Symbol.toPrimitive`接收到的参数会是`"default"`，并不是`"number"`。

所以这里的答案为：

```javascript
'default'
true
'default'
true
```



### 3.11 题目十一

(函数在使用`==`时的转换)

函数其实也是一个对象，所以在进行`==`比较时也和普通对象一样处理即可。

但是我只想要提醒一点，在进行`==`比较时要注意是比较**函数本身**还是比较**函数的返回值**。

例如在这道题中：

```javascript
function f () {
  var inner = function () {
    return 1
  }
  inner.valueOf = function () {
    console.log('valueOf')
    return 2
  }
  inner.toString = function () {
    console.log('toString')
    return 3
  }
  return inner
}
console.log(f() == 1)
console.log(f()() == 1)
```

- `f()`表示的是`inner`这个函数，所以`f() == 1`相当于是`inner == 1`，因此此时就涉及到了`inner`函数的类型转换，就会触发`inner.valueOf() `，返回`2`，因此第一个是`false`
- `f()()`表示的是`inner()`调用之后的返回值，也就是`1`，所以此时是`1 == 1`进行比较，并不会涉及到`inner`函数的类型转换，也就不会触发`inner.valueOf()`，因此第二个为`true`。

结果：

```javascript
'valueOf'
false
true
```



### 总结-使用==比较

做完了这十一道题，相信你对`==`的比较应该比之前更了解了吧 😁，让我们来总结一波。

当使用`==`进行比较的时候，会有以下转换规则（判断规则）：

1. 两边类型如果相同，值相等则相等，如 `2 == 3`肯定是为`false`的了
2. 比较的双方都为基本数据类型：

- 若是一方为`null、undefined`，则另一方必须为`null或者undefined`才为`true`，也就是`null == undefined`为`true`或者`null == null`为`true`，因为`undefined`派生于`null`
- 其中一方为`String`，是的话则把`String`转为`Number`再来比较
- 其中一方为`Boolean`，是的话则将`Boolean`转为`Number`再来比较

3. 比较的一方有引用类型：

- 将引用类型遵循类似`ToNumber`的转换形式来进行比较(也就是`toPrimitive(obj, 'defalut')`
- 两方都为引用类型，则判断它们是不是指向同一个对象

当一方有为对象的时候，实际是会将对象执行`ToNumber`操作之后再进行比较的，但是又由于对象的`valueOf()`基本都是它本身，所以我们可以认为省略了这一步。

这里我贴上一张流程图，感觉画的挺不错的，大家可以对照着看一下：


![](https://user-gold-cdn.xitu.io/2020/4/3/1713ef80eabfb012?w=1494&h=959&f=png&s=41827)

(图片来源：https://segmentfault.com/a/1190000018827114)



## 4. +、-、*、/、%的类型转换

除了在`==`的比较中会进行类型转换之外，其它的运算符号也会有。

比如标题上常见的这五种。

这里我主要是分两类来说：

1. `-、*、/、%`这四种都会把符号两边转成数字来进行运算
2. `+`由于不仅是数字运算符，还是字符串的连接符，所以分为两种情况：

- 两端都是数字则进行数字计算
- 有一端是字符串，就会把另一端也转换为字符串进行连接



### 4.1 题目一

(四种简单运算符的类型转换)

先来说说除了`+`号以外的其它四种运算符的转换，由于基本数据类型应该都清楚，所以就不做说明了，这里主要是想说一下对象运算时的情况：

```javascript
var b = {}
console.log(b - '2')
console.log(b * '2')
console.log(b / '2')
console.log(b % '2')
console.log(b - [])
console.log(b - {})
```

`b`是一个对象，在进行这类运算的时候，把两端都转换为数字进行计算，而我们知道对象`{}`转为数字是`NaN`，所以答案全都是`NaN`。

答案：

```javascript
NaN
NaN
NaN
NaN
NaN
NaN
```



### 4.2 题目二

(四种运算符的实际转换-重写`toString()`和`valueOf()`)

我们将上面👆那道题的`b`对象重写一下它们的`toString()`和`valueOf()`方法，想想，如果它是遵循`ToNumber()`转换的话，那么以下的结果会是什么呢？

```javascript
var b = {
  valueOf () {
    console.log('valueOf')
    return {}
  },
  toString () {
    console.log('toString')
    return 1
  }
}

console.log(b - '2')
console.log(b * '2')
console.log(b / '2')
console.log(b % '2')
console.log(b - [])
console.log(b - {})
```

在调用`b`的时候，会先执行`valueOf()`方法，如果该方法返回的是一个基本数据类型则返回，否则继续调用`toString()`方法，很显然这里的`valueOf()`返回的还是一个引用类型，所以总会调用`toString()`，因此答案为：

```javascript
'valueOf'
'toString'
-1
'valueOf'
'toString'
2
'valueOf'
'toString'
0.5
'valueOf'
'toString'
1
'valueOf'
'toString'
1
'valueOf'
'toString'
NaN
```

这里要说一下的是最后两个输出结果。

`b - []`：

- `b`输出的是`1`，因为`[]`转换为数字我们知道是`0`，所以结果为`1`

`b - {}`

- 其实差不多，`b`为`1`，`{}`转为数字为`NaN`，所以结果为`NaN`



### 4.3 题目三

(四种运算符的实际转换-重写`Symbol.toPrimitive`)

`4.1`那道题我们除了重写`toString`和`valueOf`我们还可以重新什么呢？

嘻嘻，怎么能忘了`Symbol.toPrimitive`，如果重新了它，那你觉得它接收到的`hint`参数会是什么呢？

```javascript
var b = {
  [Symbol.toPrimitive] (hint) {
    if (hint === 'default') {
      console.log('default')
      return 'default'
    }
    if (hint === 'number') {
      console.log('number')
      return 1
    }
    if (hint === 'string') {
      console.log('string')
      return '2'
    }
  }
}

console.log(b - '2')
console.log(b * '2')
console.log(b / '2')
console.log(b % '2')
console.log(b - [])
console.log(b - {})
```

既然是会把运算符两边都转换为数字进行计算，那么`hint`接收到的肯定就是`'number'`了呀，没错，所以这里`b`总是会返回`1`，因此答案为：

```javascript
'number'
-1
'number'
2
'number'
0.5
'number'
1
'number'
1
'number'
NaN
```

yeah~感觉没啥难度。



### 4.4 题目四

(`+`号对于对象的转换)

- `+b`的情况就相当于转为数字
- `+`号两边有值则判断两边值的类型，若两边都为数字则进行数字计算，若有一边是字符串，就会把另一边也转换为字符串进行连接

```javascript
var b = {}
console.log(+b)
console.log(b + 1)
console.log(1 + b)
console.log(b + '')
```

依照着这个规则，我们可以得出答案：

```javascript
NaN
'[object Object]1'
'1[object Object]'
'[object Object]'
```



### 4.5 题目五

(`'+'`运算符与`String()`的区别)

同样的，我们给上题加上`Symbol.toPrimitive`看一下：

```javascript
var b = {
  [Symbol.toPrimitive] (hint) {
    if (hint === 'default') {
      console.log('default')
      return '我是默认'
    }
    if (hint === 'number') {
      console.log('number')
      return 1
    }
    if (hint === 'string') {
      console.log('string')
      return '2'
    }
  }
}
console.log(+b)
console.log(b + 1)
console.log(1 + b)
console.log(b + '')
console.log(String(b))
```

因为`+b`走的是转换数字的路线，所以它的`hint`肯定就是`number`。

可是对于`b + 1`这种字符串连接的情况，走的却不是`string`，而是`default`。

所以可以看到答案为：

```javascript
var b = {
  [Symbol.toPrimitive] (hint) {
    if (hint === 'default') {
      console.log('default')
      return '我是默认'
    }
    if (hint === 'number') {
      console.log('number')
      return 1
    }
    if (hint === 'string') {
      console.log('string')
      return '2'
    }
  }
}
console.log(+b) // number
console.log(b + 1) // default
console.log(1 + b) // default
console.log(b + '') // default
console.log(String(b)) // string

'number'
1
'default'
'我是默认1'
'default'
'1我是默认'
'default'
'我是默认'
'string'
'2'
```

可以看到`b + 1`和`String(b)`这两种促发的转换规则是不一样的

- `{} + 1`字符串连接时`hint`为`default`
- `String({})`时`hint`为`string`





### 4.6 题目六

鉴于我不知道上面👆的`default`和`number、string`有什么区别，所以我觉得应该要重写一下`toString`和`valueOf()`来看看会发生什么。

```javascript
var b = {
  valueOf () {
    console.log('valueOf')
    return {}
  },
  toString () {
    console.log('toString')
    return 1
  },
}
console.log(+b) // number
console.log(b + 1) // default
console.log(String(b)) // string
```

此时的结果为：

```javascript
'valueOf'
'toString'
1
'valueOf'
'toString'
2
'toString'
'1'
```

我发现`default`的转换方式和`number`很像，都是先执行判断有没有`valueOf`，有的话执行`valueOf`，然后判断`valueof`后的返回值，若是是引用类型则继续执行`toString`。(这点其实在题目`3.10`中也说到了)



### 4.7 题目七

(日期对象的数据转换)

之前我们有提到过，日期对象的转换比较特殊。(在[引用类型调用valueOf()](https://juejin.im/post/5e7f8314e51d4546fa4511c9#heading-40)中)

- 普通对象转换的`valueOf`返回的是它本身，也就是引用类型
- 日期对象的`valueOf`返回的是一个数字类型的毫秒数

```javascript
var date = new Date()

console.log(date.valueOf())
console.log(date.toString())

console.log(+date)
console.log('' + date)
```

所以我们可以看到这里的答案是：

```javascript
var date = new Date()

console.log(date.valueOf()) // 1585742078284
console.log(date.toString()) // Wed Apr 01 2020 19:54:38 GMT+0800 (中国标准时间)

console.log(+date) // 1585742078284
console.log('' + date) // Wed Apr 01 2020 19:54:38 GMT+0800 (中国标准时间)
```

`+date`是转换为数字，所以结果和`date.valueOf()`结果一致。

但是我们会发现这里的`'' + date`和上面的`'' + {}`就会有所不同了。

虽然同样都是被转换为字符串，但是还记得`'' + {}`的转换顺序吗？它的转换方式是遵循`ToNumber`的，也就是会先执行`valueOf()`，再执行`toString()`，由于`{}.valueOf`等于它本身，是引用类型，所以会继续执行`toString()`。

而`date`进行`+`号字符串连接不会遵循这种转换规则，而是优先调用`toString()`。



### 总结-运算符的类型转换


对于几种常用运算符的类型转换：

1. `-、*、/、%`这四种都会把符号两边转成数字来进行运算
2. `+`由于不仅是数字运算符，还是字符串的连接符，所以分为两种情况：

- 两端都是数字则进行数字计算(一元正号`+b`这种情况相当于转换为数字)
- 有一端是字符串，就会把另一端也转换为字符串进行连接



对象的`+`号类型转换：

- 对象在进行`+`号字符串连接的时候，`toPrimitive`的参数`hint`是`default`，但是`default`的执行顺序和`number`一样都是先判断有没有`valueOf`，有的话执行`valueOf`，然后判断`valueof`后的返回值，若是是引用类型则继续执行`toString`。(类似题`4.5`和`4.6`)
- 日期在进行`+`号字符串连接的时候，优先调用`toString()`方法。(类似题`4.7`)
- **一元正号是转换其他对象到数值的最快方法**,也是最推荐的做法，因为 **它不会对数值执行任何多余操作**。

mm...

不知道您看到现在还好不？应该还没炸吧

铺垫了这么久，是时候展示正在的技术了！

下面让我们来做几道综合题检验一下[阴笑～]

![](https://user-gold-cdn.xitu.io/2020/4/3/1713f2b59251b801?w=400&h=375&f=jpeg&s=19493)


## 5. 几道大厂的面试题

### 5.1 以下输出为？

```javascript
console.log([] == [])
console.log([] == ![])
console.log({} == 1)
```

- `==`号两边都是引用类型则判断是否为同一引用
- `[] == ![]`这个在`3.9`中说的很详细了
- `{} == 1`，简单来说两边都转换为数字，`{}`转换为数字为`NaN`，所以结果为`false`。详细来说：一方为对象，将对象转换为字符串进行比较，即`"[object Object]" == 1`；一方有字符串，将字符串转换为数字进行比较，即`NaN == 1`，所以结果为`false`

答案为：

```javascript
console.log([] == []) // false
console.log([] == ![]) // true
console.log({} == 1) // false
```



### 5.2 以下输出为？

```javascript
console.log({} + "" * 1)
console.log({} - [])
console.log({} + [])
console.log([2] - [] + function () {})
```

`{} + "" * 1`：

- 运算顺序遵循先乘后加，所以先执行`"" * 1`，结果为`0`，因为`""`转换为数字是`0`
- 之后执行`{} + 0`，将`{}`转换为字符串是`"[object Object]"`，`0`转换为字符串是`"0"`
- 所以结果为`"[object Object]0"`

`{} - []`：

- `-`号两边转换为数字，`{}`为`NaN`，`[]`为`0`，所以结果为`NaN`

`{} + []`：

- `{}`转为字符串为`"[object Object]"`，`[]`转为字符串为`""`，所以结果为`"[object Object]"`

`[2] - [] + function () {}`：

- `-`号两边转换为数字分别为`2`和`0`，所以`[2] - []`结果为`2`
- 之后`2 + function () {}`，两边转换为字符串拼接为`"2function () {}"`，因为函数是会转换为源代码字符串的。

答案为：

```javascript
console.log({} + "" * 1) // "[object Object]0"
console.log({} - []) // NaN
console.log({} + []) // "[object Object]"
console.log([2] - [] + function () {}) // "2function () {}"
```



### 5.3 你会几种让if(a == 1 && a == 2 && a == 3)条件成立的办法？

这道题相信大家看的不会少，除了重写`valueOf()`你还会哪些解法呢？

**解法一：重写`valueOf()`**

这个解法是利用了：当对象在进行`==`比较的时候实际是会先执行`valueOf()`，若是`valueOf()`的返回值是基本数据类型就返回，否则还是引用类型的话就会继续调用`toString()`返回，然后判断`toString()`的返回值，若是返回值为基本数据类型就返回，否则就报错。

现在`valueOf()`每次返回的是一个数字类型，所以会直接返回。

```javascript
// 1
var a = {
  value: 0,
  valueOf () {
    return ++this.value
  }
}
if (a == 1 && a == 2 && a == 3) {
  console.log('成立')
}
```



**解法二：重写`valueOf()`和`toString()`**

```javascript
var a = {
  value: 0,
  valueOf () {
    return {}
  },
  toString () {
    return ++this.value
  }
}
if (a == 1 && a == 2 && a == 3) {
  console.log('成立')
}
```

原理就是解法一的原理，只不过用到了当`valueOf()`的返回值是引用类型的时候会继续调用`toString()`。

这里你甚至都可以不用重写`valueOf()`，因为除了日期对象其它对象在调用`valueOf()`的时候都是返回它本身。

也就是说你也可以这样做：
```javascript
var a = {
  value: 0,
  toString () {
    return ++this.value
  }
}
if (a == 1 && a == 2 && a == 3) {
  console.log('成立')
}
```



**解法三：重写`Symbol.toPrimitive`**

想想是不是还可以用`Symbol.toPrimitive`来解呢？

结合题`3.10`我们知道，当对象在进行`==`比较的时候，`Symbol.toPrimitive`接收到的参数`hint`是`"defalut"`，那么我们只需要这样重写：

```javascript
var a = {
  value: 0,
  [Symbol.toPrimitive] (hint) {
    if (hint === 'default') {
      return ++this.value
    }
  }
}
if (a == 1 && a == 2 && a == 3) {
  console.log('成立')
}
```

这样结果也是可以的。



**解法四：定义class并重写valueOf()**

当然你还可以用`class`来写：

```javascript
class A {
  constructor () {
    this.value = 0
  }
  valueOf () {
    return ++this.value
  }
}
var a = new A()
if (a == 1 && a == 2 && a == 3) {
  console.log('成立')
}
```



**解法五：利用数组转为字符串会隐式调用`join()`**

什么 ？ 还有别的解法吗？而且我看解法五的题目有点没看懂啊。

让我们回过头去看看题`1.3`，那里提到了当数组在进行转字符串的时候，调用`toString()`的结果其实就是调用`join`的结果。

那和这道题有什么关系？来看看答案：

```javascript
let a = [1, 2, 3]
a['join'] = function () {
  return this.shift()
}
if (a == 1 && a == 2 && a == 3) {
  console.log('成立')
}
```

因为我们知道，对象如果是数组的话，当我们不重写其`toString()`方法，在转换为字符串类型的时候，默认实现就是将调用`join()`方法的返回值作为`toString()`的返回值。

所以这里我们重写了`a`的`join`方法，而这次重写做了两件事情：

1. 将数组`a`执行`a.shift()`方法，我们知道这会影响原数组`a`的，将第一项去除
2. 将刚刚去除的第一项返回回去

所以当我们在执行`a == 1`这一步的时候，由于隐式调用了`a['join']`方法，所以会执行上面👆说的那两件事情，后面的`a == 2`和`a == 3`同理。



**解法六：定义class继承Array并重写join()**

对于解法五我们同样可以用`class`来实现

```javascript
class A extends Array {
  join = this.shift
}
var a = new A(1, 2, 3)
if (a == 1 && a == 2 && a == 3) {
  console.log('成立')
}
```

这种写法比较酷🆒，但是第一次看可能不太能懂。

- 首先`A`这个类通过`extends`继承于`Array`，这样通过`new A`创建的就是一个数组
- 然后`A`重写了`join`方法，`join = this.shift`就相当于是`join = function () { return this.shift() }`
- 这样当每次调用`a == xxx`的时候，都会隐式调用我们自定义的`join`方法，执行和解法五一样的操作。



### 5.4 让if (a === 1 && a === 2 && a === 3)条件成立？

这道题看着和上面那道有点像，不过这里判断的条件是全等的。

我们知道全等的条件：

1. 左右两边的类型要相等，如果类型不相等则直接返回`false`，这点和`==`不同，`==`会发生隐式类型转换
2. 再判断值相不相等

而对于上面👆一题的解法我们都是利用了`==`会发生隐式类型转换这一点，显然如果再用它来解决这道题是不能实现的。

想想当我们在进行`a === xxx`判断的时候，实际上就是调用了`a`这个数据而已，也就是说我们要在调用这个数据之前，做一些事情，来达到我们的目的。

不知道这样说有没有让你想到些什么 🤔️？或许你和呆呆一样会想到`Vue`大名鼎鼎的数据劫持 😁。

想想在`Vue2.x`中不就是利用了`Object.defineProperty()`方法重新定义`data`中的所有属性，那么在这里我们同样也可以利用它来劫持`a`，修改`a`变量的`get`属性。

```javascript
var value = 1;
Object.defineProperty(window, "a", {
  get () {
    return this.value++;
  }
})
if (a === 1 && a === 2 && a === 3) {
  console.log('成立')
}
```

这里实际就做了这么几件事情：

- 使用`Object.defineProperty()`方法劫持全局变量`window`上的属性`a`
- 当每次调用`a`的时候将`value`自增，并返回自增后的值

（其实我还想着用`Proxy`来进行数据劫持，代理一下`window`，将它用`new Proxy()`处理一下，但是对于`window`对象好像没有效果...）



**解法二**

怎么办 😂，一碰到这种题我又想到了数组...

```javascript
var arr = [1, 2, 3];
Object.defineProperty(window, "a", {
  get () {
    return this.arr.shift()
  }
})
if (a === 1 && a === 2 && a === 3) {
  console.log('成立')
}
```

中了`shift()`的毒...当然，这样也是可以实现的。



**解法三**

还有就是[EnoYao](https://juejin.im/user/584c7f44ac502e0069275cd7)大佬那里看来的骚操作：

原文链接：https://juejin.im/post/5e66dc416fb9a07cab3aaa0a

```javascript
var aﾠ = 1;
var a = 2;
var ﾠa = 3;
if (aﾠ == 1 && a == 2 && ﾠa == 3) {
  console.log("成立");
}
```

说来惭愧...`a`的前后隐藏的字符我打不来 😂...

![](https://user-gold-cdn.xitu.io/2020/4/3/1713f31507e21748?w=288&h=207&f=jpeg&s=11559)

### 5.5  实现以下代码

现需要实现以下函数：

```javascript
function f () {
  /* 代码 */
}

console.log(f(1) == 1)
console.log(f(1)(2) == 3)
console.log(f(1)(2)(3) == 6)
```

首先看到这道题的时候让我想到了题目`3.11`，只不过这里是有传参的，并且返回值像是一个累计的过程。

也就是说会收集每次传递进来的参数然后进行一个累加并返回(这个很容易想到`reduce`方法)。

并且`f(1)(2)`这样的写法很像是偏应用，函数返回了一个函数。

那我们是不是可以在函数`f`内用一个变量数组来存放参数集合，然后返回一个函数(我命名为`inner`)，这个`inner`函数的作用是收集传递进来的参数将它添加到参数集合中。

之后就和`3.11`很像，在每次进行`==`比较的时候，`f`返回的`inner`函数会进行隐式类型转换，也就是会调用`inner`的`valueOf()`和`toString()`方法，那我们只需要重写这两个方法，并返回用`reduce`累加的参数的和就可以了。

代码也很简单，一起来看看：

```javascript
function f () {
  let args = [...arguments]
  var add = function () {
    args.push(...arguments)
    return add
  }
  add.valueOf = function () {
    return args.reduce((cur, pre) => {
      return cur + pre
    })
  }
  return add
}
console.log(f(1) == 1)
console.log(f(1)(2) == 3)
console.log(f(1)(2)(3) == 6)
```

当然，上面👆的`valueOf()`换成`toString()`也是可以的，因为我们已经知道了，对象`==`比较时类型转换的顺序其实就是先经过`valueOf`再到`toString`。



### 5.6 控制台输入{}+[]会怎样？

气氛不要这么凝重嘛...让我们最后来看道简单有趣的题。

这道有趣的题是从[LINGLONG](https://juejin.im/user/5cd2341ce51d456e5c5baba3)的一篇[《【js小知识】[]+ {} =？/{} +[] =?（关于加号的隐式类型转换）》](https://juejin.im/post/5e605528518825495c659769)那里看来的。

(PS: pick一波玲珑，这位小姐姐的文章写的都挺好的，不过热度都不高，大家可以支持一下呀 😁)

OK👌，来看看题目是这样的：

在控制台(比如浏览器的控制台)输入:

```javascript
{}+[]
```

的结果会是什么 🤔️？

咦～这道题上面不是做过了吗(题目`5.2`里的第三个`console.log()`)？

```javascript
console.log({}+[]) // "[object Object]"
```

但是注意这里的题目，是要在控制台输出哦。

此时我把这段代码在控制台输出结果发现答案竟然和预期的不一样：

```javascript
{}+[]
0
```

也就是说`{}`被忽略了，直接执行了`+[]`，结果为`0`。

知道原因的我眼泪掉了下来，原来它和之前提到的`1.toString()`有点像，也是因为`JS`对于代码解析的原因，在控制台或者终端中，`JS`会认为大括号`{}`开头的是一个空的代码块，这样看着里面没有内容就会忽略它了。

所以只执行了`+[]`，将其转换为`0`。

如果我们换个顺序的话就不会有这种问题：

![](https://user-gold-cdn.xitu.io/2020/4/3/1713ef9519c4a708?w=594&h=460&f=jpeg&s=41829)

(图片来源：https://juejin.im/post/5e605528518825495c659769#heading-12)

为了证实这一点，我们可以把`{}`当成空对象来调用一些对象的方法，看会有什么效果：

（控制台或者终端）

```javascript
{}.toString()
```

现在的`{}`依旧被认为是代码块而不是一个对象，所以会报错：

```javascript
Uncaught SyntaxError: Unexpected token '.'
```

解决办法可以用一个`()`将它扩起来：

```javascript
({}).toString
```

不过这东西在实际中用的不多，我能想到的一个就是在项目中(比如我用的`vue`)，然后定义`props`的时候，如果其中一个属性的默认值你是想要定义为一个空对象的话，就会用到：

```javascript
props: {
    target: {
        type: Object,
        default: () => ({})
    }
}
```

整完了整完了...啊...


![](https://user-gold-cdn.xitu.io/2020/4/3/1713f3418ea8c703?w=255&h=255&f=gif&s=103248)


## 后语

知识无价，支持原创。

参考文章：

- [《揭密“==”隐藏下的类型转换》](https://segmentfault.com/a/1190000018827114)
- [《EnoYao-大厂面试题分享：如何让(a===1&&a===2&&a===3)的值为true?》](https://juejin.im/post/5e66dc416fb9a07cab3aaa0a)
- [《LINGLONG-【js小知识】（关于加号的隐式类型转换）》](https://juejin.im/post/5e605528518825495c659769)
- [《冴羽-JavaScript深入之头疼的类型转换(上)》](https://juejin.im/post/5e7d7670f265da797f4afa84)
- [《神三元-(建议收藏)原生JS灵魂之问, 请问你能接得住几个？(上)》](https://juejin.im/post/5dac5d82e51d45249850cd20)



你盼世界，我盼望你无`bug`。这篇文章就介绍到这里。

可以看到，当我们了解了类型转换的原理之后发现并不是太难。关键就是在于半懂不懂的时候最可怕。就像没了解之前，我能很快的说出`{} == 1`的结果是`false`，但是现在脑袋里会先转上一圈：

- 一方为对象，将对象转换为字符串进行比较，即`"[object Object]" == 1`
- 一方有字符串，将字符串转换为数字进行比较，即`NaN == 1`，所以结果为`false`

对于一些简单的题甚至会迟钝一下...这些都是还不熟造成的，希望大家能够多多练习早日避免`呆呆`这种`呆`的状态。

用心创作，好好生活。这篇文章出了之后这段时间可能不会再出这种都是题目的文章了，做多了大家也会麻木不想看，所以后面会出一些原理性的文章，敬请期待吧，嘻嘻😁。

如果你觉得文章对你有帮助的话来个赞👍哦，谢谢啦～ 😁。

喜欢**霖呆呆**的小伙还希望可以关注霖呆呆的公众号 `LinDaiDai` 或者扫一扫下面的二维码👇👇👇.

![](https://user-gold-cdn.xitu.io/2020/3/29/17124271bbecd73e?w=900&h=500&f=gif&s=1632550)

我会不定时的更新一些前端方面的知识内容以及自己的原创文章🎉

你的鼓励就是我持续创作的主要动力 😊.

相关推荐:

[《全网最详bpmn.js教材》](https://juejin.im/post/5def372af265da33c84a4818)

[《【建议改成】读完这篇你还不懂Babel我给你寄口罩》](https://juejin.im/post/5e477139f265da574c566dda)

[《【建议星星】要就来45道Promise面试题一次爽到底(1.1w字用心整理)》](https://juejin.im/post/5e58c618e51d4526ed66b5cf)

[《【建议👍】再来40道this面试题酸爽继续(1.2w字用手整理)》](https://juejin.im/post/5e6358256fb9a07cd80f2e70)

[《【何不三连】比继承家业还要简单的JS继承题-封装篇(牛刀小试)》](https://juejin.im/post/5e707417e51d45272054d5d3)

[《【何不三连】做完这48道题彻底弄懂JS继承(1.7w字含辛整理-返璞归真)》](https://juejin.im/post/5e75e22951882549027687f9)

[《【精】从206个console.log()完全弄懂数据类型转换的前世今生(上)》](https://juejin.im/post/5e7f8314e51d4546fa4511c9)