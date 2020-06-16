# ES7+ES8

## 前言

本篇文章主要介绍ES7+ES8的一些新功能，并结合ES6的一些API做出了相应的比较。

## ES7

### 1.Array.prototype.includes()

> includes()作用,是查找一个值在不在数组里,若是存在则返回true,不存在返回false.

1.基本用法：

```
['a', 'b', 'c'].includes('a')     // true
['a', 'b', 'c'].includes('d')     // false
```

2.接收俩个参数：**要搜索的值和搜索的开始索引**

```
['a', 'b', 'c', 'd'].includes('b')         // true
['a', 'b', 'c', 'd'].includes('b', 1)      // true
['a', 'b', 'c', 'd'].includes('b', 2)      // false
```

3.与`ES6中的indexOf()`比较

有些时候是等效的

```
['a', 'b', 'c'].includes('a')          //true
['a', 'b', 'c'].indexOf('a') > -1      //true

var arr = [1, 2, 3]
var a = 1;
arr.includes(a)   //true
arr.indexOf(a)    //0 
```

- 在判断 +0 与 -0 时，被认为是相同的。

```
[1, +0, 3, 4].includes(-0)    //true
[1, +0, 3, 4].indexOf(-0)     //1
```

- 只能判断简单类型的数据，对于复杂类型的数据，比如对象类型的数组，二维数组，这些，是无法判断的.

```
var arr = [1, [2, 3], 4]
arr.includes([2, 3])   //false
arr.indexOf([2, 3])    //-1
```



**优缺点比较**

- 简便性

`includes()`返回的是布尔值，能直接判断数组中存不存在这个值，而`indexOf()`返回的是索引，这一点上前者更加方便。

- 精确性

  两者都是采用`===`的操作符来作比较的，不同之处在于：对于`NaN`的处理结果不同。

  我们知道js中	`NaN === NaN`	的结果是false,`indexOf()`也是这样处理的，但是`includes()`不是这样的。

  ```
  let demo = [1, NaN, 2, 3]

  demo.indexOf(NaN)        //-1
  demo.includes(NaN)       //true
  ```

**总结：**

> 由于它对NaN的处理方式与indexOf不同，假如你只想知道某个值是否在数组中而并不关心它的索引位置，建议使用includes()。如果你想获取一个值在数组中的位置，那么你只能使用indexOf方法。



### 2.求幂运算符

基本用法：

```
3 ** 2  //9
效果同
Math.pow(3, 2) //9
```

由于是运算符，所以可以和 `+=`一样的用法

```
var b = 3;
b **= 2;
console.log(b); //9
```



## ES8

### 1.async await

异步函数`async function()`

#### 1.1作用

避免有更多的请求操作，出现多重嵌套，也就是俗称的“回调地狱”

```
this.$http.jsonp('/login', (res) => {
  this.$http.jsonp('/getInfo', (info) => {
    // do something
  })
})
```

因此提出了ES6的Promise,将回调函数的嵌套，改为了链式调用：

```
var promise = new Promise((resolve, reject) => {
  this.login(resolve);
})
.then(() => {
  this.getInfo()
})
.catch(() => {
  console.log('Error')
})
```

#### 1.2声明方式

异步函数存在以下四种使用形式：

- 函数声明： `async function foo() {}`
- 函数表达式： `const foo = async function() {}`
- 对象的方式： `let obj = { async foo() {} }`
- 箭头函数： `const foo = async () => {}`



#### 1.3支持返回Promise和同步的值

async用于定义一个异步函数，该函数返回一个Promise。
如果async函数返回的是一个同步的值，这个值将被包装成一个理解resolve的Promise，等同于`return Promise.resolve(value)`。
await用于一个异步操作之前，表示要“等待”这个异步操作的返回值。await也可以用于一个同步的值。

```javascript
    //async await
    //返回Promise
    let timer = async function timer() {
        return new Promise((reslove, reject) => {
            setTimeout(() => {
                reslove('a');
            }, 1000);
        })
    }
    timer().then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err.message);
    })

    //返回同步的值
    let sayHello = async function sayHello() {
        let hi = 'hello world'//等同于return Promise.resolve(hi);
        return hi
    }
    sayHello().then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err.message);
    })
```



#### 1.4对异常的处理

> 首先来看下`Promise`中对异常的处理

1.使用`reject`

```javascript
let promise = new Promise((reslove, reject) => {
  setTimeout(() => {
  	reject('promise使用reject抛出异常')  
  }, 1000)
})
promise().then(res => {
  console.log(res)
})
.catch(err => {
  console.log(err)     //'promise使用reject抛出异常'
})

```

2.使用`new Error()`

```javascript
let promise = new Promise((reslove, reject) => {
  	throw new Error('promise使用Error抛出异常') //使用throw异常不支持放在定时器中
})
promise().then(res => {
  console.log(res)
})
.catch(err => {
  console.log(err.message)     //'promise使用Error抛出异常'
})

```

3.`reject`一个`new Error()`

```javascript
let promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('promise抛出异常'));
        }, 1000);
    })

    promise.then(res => {
        console.log(res);
    })
    .catch(err => {
        console.log(err.message);  //'promise抛出异常'
    })
```

> `async`对异常的处理也可以直接用`.catch()`捕捉到

```javascript
	//async抛出异常
    let sayHi = async sayHi => {
            throw new Error('async抛出异常');
    }
    sayHi().then(res => {
        console.log(res);
    })
    .catch(err => {
        console.log(err.message);
    })
```

> 和Promise链的对比：

我们的async函数中可以包含多个异步操作，其异常和Promise链有相同之处，如果有一个Promise被reject()那么后面的将不会再进行。

```javascript
    let count = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject('promise故意抛出异常')
            }, 1000);
        })
    }
    let list = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([1, 2, 3])
            }, 1000);
        })
    }

    let getList = async () => {
        let c = await count()
        console.log('async')    //此段代码并没有执行
        let l = await list()
        return { count: c, list: l }
    }
    console.time('start');
    getList().then(res => {
        console.log(res)
    })
    .catch(err => {
        console.timeEnd('start')
        console.log(err)
    })
    
    //start: 1000.81494140625ms
    //promise故意抛出异常
```

可以看到上面的案例，`async`捕获到了一个错误之后就会立马进入`.catch()`中，不执行之后的代码



#### 1.5并行

上面的案例中，async采用的是串行处理

count()和list()是有先后顺序的

```javascript
let c = await count()
let l = await list()
```

实际用法中，若是请求的两个异步操作没有关联和先后顺序性可以采用下面的做法

```javascript
let res = await Promise.all([count(), list()])
return res

//res的结果为
//[ 100, [ 1, 2, 3 ] ]
```



案例详情为：

```javascript
let count = ()=>{
    return new Promise((resolve,reject) => {
        setTimeout(()=>{
            resolve(100);
        },500);
    });
}

let list = ()=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve([1,2,3]);
        },500);
    });
}

let getList = async ()=>{
    let result = await Promise.all([count(),list()]);
    return result;
}
console.time('begin');
getList().then(result => {
    console.timeEnd('begin');  //begin: 505.557ms
    console.log(result);       //[ 100, [ 1, 2, 3 ] ]
}).catch(err => {
    console.timeEnd('begin');
    console.log(err);
});
```

> 我们将count()和list()使用Promise.all()“同时”执行，这里count()和list()可以看作是“并行”执行的，所耗时间将是两个异步操作中耗时最长的耗时。
> 最后得到的结果是两个操作的结果组成的数组。我们只需要按照顺序取出数组中的值即可。



#### 1.6与Generator的关系

先来回顾一下ES6中`Generator`函数的用法：

```javascript
    function* getList() {
        const c = yield count()
        const l = yield list()
        return 'end'
    }
    var gl = getList()
    console.log(gl.next()) // {value: Promise, done: false}
    console.log(gl.next()) // {value: Promise, done: false}
    console.log(gl.next()) // {value: 'end', done: true}
```

> 虽然Generator将异步操作表示得很简洁，但是流程管理却不方便（即何时执行第一阶段、何时执行第二阶段）。此时，我们便希望能出现一种能自动执行Generator函数的方法。我们的主角来了：async/await。

**ES8引入了async函数，使得异步操作变得更加方便。简单说来，它就是Generator函数的语法糖。**

```javascript
let getList = async () => {
  const c = await count()
  const l = await list()
}
```



### 2.Object.entries()

#### 2.1作用

> 作用：将一个对象中可枚举属性的键名和键值按照二维数组的方式返回。
>
> 若对象是数组，则会将数组的下标作为键值返回。

```
Object.entries({ one: 1, two: 2 })    //[['one', 1], ['two', 2]]
Object.entries([1, 2])                //[['0', 1], ['1', 2]]
```

#### 2.2要点

1.若是键名是`Symbol`，编译时会被自动忽略

```javascript
Object.entries({[Symbol()]:1, two: 2})  //[['two', 2]]
```

2.`entries()`返回的数组顺序和`for`循环一样，即如果对象的key值是数字，则返回值会对key值进行排序，返回的是排序后的结果

```javascript
Object.entries({ 3: 'a', 4: 'b', 1: 'c' })    //[['1', 'c'], ['3', 'a'], ['4', 'b']]
```

3.利用`Object.entries()`创建一个真正的`Map`

```javascript
    var obj = { foo: 'bar', baz: 42 };
    
    var map1 = new Map([['foo', 'bar'], ['baz', 42]]); //原本的创建方式
    var map2 = new Map(Object.entries(obj));    //等同于map1

    console.log(map1);// Map { foo: "bar", baz: 42 }
    console.log(map2);// Map { foo: "bar", baz: 42 }
```

#### 2.3自定义`Object.entries()`

`Object.entries`的原理其实就是将对象中的键名和值分别取出来然后推进同一个数组中

```javascript
    //自定义entries()
    var obj = { foo: 'bar', baz: 42 };
    function myEntries(obj) {
        var arr = []
        for (var key of Object.keys(obj)) {
            arr.push([key, obj[key]])
        }
        return arr
    }
    console.log(myEntries(obj))
    
    //Generator版本
    function* genEntryies(obj) {
        for (let key of Object.keys(obj)) {
            yield [key, obj[key]]
        }
    }
    var entryArr = genEntryies(obj);
    console.log(entryArr.next().value) //["foo", "bar"]
    console.log(entryArr.next().value) //["baz", 42]
```



### 3.Object.values()

#### 3.1作用

> 作用：只返回自己的键值对中属性的值。它返回的数组顺序，也跟`Object.entries()`保持一致

```javascript
Object.values({ one: 1, two: 2 })            //[1, 2]
Object.values({ 3: 'a', 4: 'b', 1: 'c' })    //['c', 'a', 'b']
```

#### 3.2与Object.keys()比较

> ES6中的`Object.keys()`返回的是键名

```javascript
    var obj = { foo: 'bar', baz: 42 };
    console.log(Object.keys(obj)) //["foo", "baz"]
    console.log(Object.values(obj)) //["bar", 42]
    
    //Object.keys()的作用就类似于for...in
    function myKeys() {
        let keyArr = []
        for (let key in obj1) {
            keyArr.push(key)
            console.log(key)
        }
        return keyArr
    }
    console.log(myKeys(obj1)) //["foo", "baz"]
```



#### 3.3entries()、values()总结

```javascript
    var obj = { foo: 'bar', baz: 42 };
    console.log(Object.keys(obj)) //["foo", "baz"]
    console.log(Object.values(obj)) //["bar", 42]
    console.log(Object.entries(obj)) //[["foo", "bar"], ["baz", 42]]
```



### 4.字符串填充

#### 4.1padStart()和padEnd()

> 字符串填充`padStart()`和`padEnd()`

> 用法
>
> String.padStart(targetLength, padding)
>
> 参数：字符串目标长度和填充字段

```javascript
'Vue'.padStart(10)           //'       Vue'
'React'.padStart(10)         //'     React'
'JavaScript'.padStart(10)    //'JavaScript'
```

#### 4.2要点

1.填充函数只有在字符长度小于目标长度时才有效,而且目标长度如果小于字符串本身长度时，字符串也不会做截断处理，只会原样输出

```javascript
'Vue'.padEnd(10, '_*')           //'Vue_*_*_*_'
'React'.padEnd(10, 'Hello')      //'ReactHello'
'JavaScript'.padEnd(10, 'Hi')    //'JavaScript'
'JavaScript'.padEnd(8, 'Hi')     //'JavaScript'
```



### 5.Object.getOwnPropertyDescriptors()

#### 5.1作用

> 该方法会返回目标对象中所有属性的属性描述符，该属性必须是对象自己定义的，不能是从原型链继承来的。

```javascript
    var obj = {
        id:  1,
        name: '霖呆呆',
        get gender() {
            console.log('gender')
        },
        set grad(d) {
            console.log(d)
        }
    }
    console.log(Object.getOwnPropertyDescriptors(obj))
 //输出   
{
  gender: {
    configurable: true,
    enumerable: true,
    get: f gender(),
    set: undefined
  },
  grade: {
    configurable: true,
    enumerable: true,
    get: undefined,
    set: f grade(g)
  },
  id: {
    configurable: true,
    enumerable: true,
    value: 1,
    writable: true
  },
  name: {
    configurable: true,
    enumerable: true,
    value: '霖呆呆',
    writable: true
  }
}
```

> 第二个参数,用于指定属性的属性描述符

```javascript
Object.getOwnPropertyDescriptors(obj, 'id')

//输出结果应该为
{
  id: {
    configurable: true,
    enumerable: true,
    value: 1,
    writable: true
  }
}
```

但是我在谷歌/火狐浏览器试了好像没有效果,有知道原因的小伙请留言

#### 5.2与`getOwnPropertyDescriptor()`比较

> ES6中也有一个返回目标对象可枚举属性的方法

```javascript
var obj = {
    id: 1,
    name: '霖呆呆',
    get gender() {
        console.log('gender')
    },
    set grad(d) {
        console.log(d)
    }
}
console.log(Object.getOwnPropertyDescriptor(obj, 'id'))
        
//输出结果
 {
  id: {
    configurable: true,
    enumerable: true,
    value: 1,
    writable: true
  }
}
```

**两者的区别：一个是只返回知道属性名的描述对象,一个返回目标对象所有自身属性的描述对象**



#### 5.3自定义该方法

```javascript
        function myDescriptors(obj) {
            let descriptors = {}
            for (let key in obj) {
                descriptors[key] = Object.getOwnPropertyDescriptor(obj, key)
            }
            return descriptors
        }
        console.log(myDescriptors(obj))
        //返回的结果和该方法一样
        
        //其中上面自定义方法的for...in也可以换成,效果也是一样的
        for (let key of Object.keys(obj)) {
            descriptors[key] = Object.getOwnPropertyDescriptor(obj, key)
        }
```



### 6.函数参数支持尾部逗号

该特性允许我们在定义或者调用函数时添加尾部逗号而不报错

```javascript
        let foo = function (
                a,
                b,
                c,
            ) {
                console.log('a:', a)
                console.log('b:', b)
                console.log('c:', c)
            }
            foo(1, 3, 4, )

            //输出结果为：
            a: 1
            b: 3
            c: 4
```

> 它适用于那种多行参数并且参数名很长的情况，开发过程中，如果忘记删除尾部逗号也没关系，ES8已经支持这种写法。



### 7.修饰器Decorator

> ES8神器Decorator，修饰器，也称修饰器模式

#### 7.1 伪Decorator

在介绍`Decorator`之前，我们先来实现这样一个功能：

定义一个函数，在调用这个函数时，能够执行一些其他额外操作

如下代码,定义`doSometing()`,在调用它时再执行其他代码

```javascript
        function doSometing(name) {
            console.log('Hello ' + name)
        }
        function myDecorator(fn) {
            return function() {
                console.log('start')
                const res = fn.apply(this, arguments)
                console.log('end')
                return res
            }
        }
        const wrapped = myDecorator(doSometing)
        doSometing('lindaidai')
        //Hello lindaidai
        
        wrapped('lindaidai')
        //start 
        //Hello lindaidai
        //end
```

**可以看到上面的操作：其实就是一个函数包装成另一个函数,这样的方式我们称之为“修饰器”**	

同理，我们是不是能用一个什么东西附着在我们的类或者类的属性上，让它们也有一些附加的属性或者功能呢，比如这样：

```javascript
@addSkill
class Person { }

function addSkill(target) {
    target.say = "hello world";
}
```

在`Person`这个类中，开始定义的时候是什么属性都没有的，在其上面使用`@`来附着上一个函数，这个函数的功能是给目标对象添加额外的属性`say`。

这样`Person`这个类就有了`say`这个属性了。

此时控制台输出：

```javascript
console.log(Person['say']) //'hello world'
```

同样的，如果想使用`Person`这个类创建出来的对象也能附加上一些属性，可以在目标对象的原型对象中进行添加：

```javascript
@addSkill
class Person { }

function addSkill(target) {
    target.say = "hello world"; //直接添加到类中
    target.prototype.eat = "apple"; //添加到类的原型对象中
}
var personOne = new Person()

console.log(Person['say']) // 'hello world'
console.log(personOne['eat']) // 'apple'
```

> 上面案例中的`@addSkill`其实就是一个最简单的修饰器。

当然，如果你将上面案例中的代码复制到你html文件中，会发现它并不能如愿的执行:

![image.png](https://user-gold-cdn.xitu.io/2018/8/5/1650a97ecb4447f7?w=1240&h=590&f=png&s=554048)


那是因为decorator是es7提供的方法，在浏览器中是无法直接运行的，如果你想要使用它，我们需要提前做一些准备，对它进行编译。

如果你不想深入其中，只是想单纯的了解并使用它可以参考下面的简易教程。

#### 7.2 快速使用

网上使用`Decorator`的教材有很多，大多都是要需要使用插件来让浏览器支持`Decorator`。这里长话短说，贴上一个最精简的使用教程：

> 1.创建一个名为：Decorator的文件夹

> 2.在文件夹目录下执行命令行

```
$ npm i babel-plugin-transform-decorators-legacy babel-register --save-dev
```

此时文件夹下会出现俩个文件： node_modules 依赖文件夹和package.json-lock.json

> 3.创建文件 complie.js

```javascript
require('babel-register')({
    plugins: ['transform-decorators-legacy']
});
require("./app.js")
```

> 4.创建文件 app.js

```javascript
@addSkill
class Person { }
function addSkill(target) {
  target.say = "hello world";
}
console.log(Person.say)   //'hello world'
```

> 5.在根目录下执行指令：

```javascript
node complie.js
```

此时可以看到命令行中打印出了 hello world

简单介绍下上面步骤的原理：

第二步中使用了俩个基础插件：

```
transform-decorators-legacy：
//是第三方插件，用于支持decorators

babel-register：
//用于接入node api
```

第三步、第四步创建的俩个文件

```javascript
complie.js  //用来编译app
app.js   //使用了装饰器的js文件
```

第五步：

```
原理：
1，node执行complie.js文件；
2，complie文件改写了node的require方法；
3，complie在引用app.js，使用了新的require方法；
4，app.js在加载过程中被编译，并执行。
```



> 当然你也可以将app.js替换为app.ts 不过别忘了把complie.js中的app.js修改为app.ts

```javascript
// app.ts
@addSkill
class Person { }
function addSkill(target) {
    target.say = "hello world";
}
console.log(Person['say'])   
//这里如果直接使用Person.say会提示say属性不存在,如我使用的vscode编辑器就会报错,是因为ts的原因，只需要用[]的形式获取对象属性即可。
```

**注：ts中有些语法是和js中不一样的，比如有些对象上提示没有属性的时候，只需要换一种获取对象属性的方式即可。**



#### 7.3 类修饰器

直接作用在类上面的修饰器，我们可以称之为类修饰器。

如上面案例中的`@addSkill`就是一个类修饰器，它修改了`Person`这个类的行为，为它加上了静态属性`say`。

`addSkill`函数的参数target是`Person`这个类本身。

>  1.修饰器的执行原理基本就是这样：

```javascript
@decorator
class A {}

// 等同于

class A {}
A = decorator(A) || A;
```

**换句话说，类修饰器是一个对类进行处理的函数。**

它的第一个参数target就是函数要处理的目标类。

> 2.多参数

当然如果你想要有多个参数也是可以的，我们可以在修饰器外面再封装一层函数：

```javascript
@addSkill("hello world")
class Person { }
function addSkill(text) {
    return function(target) {
        target.say = text;
    }
}
console.log(Person.say)  //'hello world'
```

上面代码中，修饰器`addSkill`可以接受参数，这就等于可以修改修饰器的行为。

> 3.修饰器在什么时候执行。

先来看一个案例：

```javascript
@looks
class Person { }
function looks(target) {
    console.log('I am handsome')
    target.looks = 'handsome'
}

console.log(Person['looks'])

//I am handsome
//handsome
```

在修饰器`@looks`中添加一个`console.log()`语句，却发现它是最早执行的，其次才打印出`handsome`。

**这是因为装饰器对类的行为的改变，是代码编译时发生的，而不是在运行时。这意味着，装饰器能在编译阶段运行代码。也就是说，装饰器本质就是编译时执行的函数。**	

> 装饰器是在编译时就执行的函数



#### 7.4 方法修饰器

上面的案例中，修饰器作用的对象是类本身。

当然修饰器不仅仅这么简单，它也可以作用在类里的某个方法或者属性上，这样的修饰器我们称它为方法修饰器。

如下面的案例：

```javascript
class Person {
    constructor() {}
    @myname  //方法修饰器
    name() {
        console.log('霖呆呆') 
    }
}
function myname(target, key, descriptor) {
    console.log(target);
    console.log(key);
    console.log(descriptor);
    descriptor.value = function() {
        console.log('霖呆呆')
    }
}

var personOne = new Person() //实例化
personOne.name() //调用name()方法


//打印结果：
Person {}
name
{ value: [Function: name],
  writable: true,
  enumerable: false,
  configurable: true 
 }
霖呆呆
```

上面案例中的修饰器`@myname`是放在`name()`方法上的，`myname`函数有三个参数：

```
target: 类的原型对象，上例是Person.prototype
key: 所要修饰的属性名  name
descriptor: 该属性的描述对象
```

我们改变了`descriptor`中的`value`，使之打印出霖呆呆。

#### 7.5 多个修饰器的执行顺序

若是同一个方法上有多个修饰器，会像剥洋葱一样，先从外到内进入，然后由内向外执行。

```javascript
class Person {
    constructor() {}
    @dec(1)
    @dec(2)
    name() {
        console.log('霖呆呆')
    }
}
function dec(id) {
    console.log('out', id);
    return function(target, key, descriptor) {
        console.log(id);
    }
}

var person = new Person()
person.name()
//结果
out 1
out 2
2
1
霖呆呆
```

如上所属，外层修饰器`dec(1)`先进入，但是内层修饰器`dec(2)`先执行。

#### 7.6 不能作用于函数

修饰器不能作用于函数之上，这是因为函数和变量一样都会提升

```javascript
var counter = 0;

var add = function () {
  counter++;
};

@add
function foo() {
}
```

如上面的例子所示，给函数`foo()`定义了修饰器`@add`，作用是想将`counter++`

预计的结果`counter`为1，但实际上却还是为0

原因：

定义的函数`foo()`会被提升至最上层，定义的变量`counter`和`add`也会被提升，效果如下：

```javascript
@add
function foo() {
}

var counter;
var add;

counter = 0;

add = function () {
  counter++;
};
```



总之，由于存在函数提升，使得修饰器不能用于函数。类是不会提升的，所以就没有这方面的问题。

另一方面，如果一定要修饰函数，可以采用高阶函数的形式直接执行。

如在7.1中的例子所示：

```javascript
        function doSometing(name) {
            console.log('Hello' + name)
        }
        function myDecorator(fn) {
            return function() {
                console.log('start')
                const res = fn.apply(this, arguments)
                console.log('end')
                return res
            }
        }
        const wrapped = myDecorator(doSometing)
        doSometing('lindaidai')
        //Hellowlindaidai
        
        wrapped('lindaidai')
        //start 
        //Hellowlindaidai
        //end
```

### 后语
知识无价，尊重原创。

参考文集：

[10分钟学会ES7+ES8](https://www.cnblogs.com/zhuanzhuanfe/p/7493433.html)

[JavaScript中的装饰器--Decorator](https://juejin.im/post/5ab26c87f265da23866fc80d)

[es7-decorator修饰器运行环境搭建及实践](http://www.guofengxian.com/2017/08/11/es7-decorator%E4%BF%AE%E9%A5%B0%E5%99%A8%E8%BF%90%E8%A1%8C%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA%E5%8F%8A%E5%AE%9E%E8%B7%B5/)

[阮一峰Decorator详解](http://es6.ruanyifeng.com/#docs/decorator)http://es6.ruanyifeng.com/#docs/decorator)