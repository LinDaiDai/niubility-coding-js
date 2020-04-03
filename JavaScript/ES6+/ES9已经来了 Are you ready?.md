# ES9

### 前言

该篇文章主要是介绍了ES9新加的一些特性。

### 1. 异步迭代

在`async/await`的某些时刻，你可能尝试在同步循环中调用异步函数。例如：

```
async function process(array) {
  for (let i of array) {
    await doSomething(i);
  }
}
复制代码
```

这段代码不会正常运行，下面这段同样也不会：

```
async function process(array) {
  array.forEach(async i => {
    await doSomething(i);
  });
}
复制代码
```

这段代码中，循环本身依旧保持同步，并在在内部异步函数之前全部调用完成。

ES2018引入异步迭代器（asynchronous iterators），这就像常规迭代器，除了`next()`方法返回一个Promise。因此`await`可以和`for...of`循环一起使用，以串行的方式运行异步操作。例如：

```
async function process(array) {
  for await (let i of array) {
    doSomething(i);
  }
}
```



### 2. Promise.finally()

在ES6中，一个`Promise`链要么成功进入最后一个`then()`要么失败触发`catch()`。而实际中，我们可能需要无论`Promise`无论成功还是失败，都运行相同的代码。例如清除，删除回话，关闭数据库连接等操作。

ES9中，允许使用`finally()`来指定最终的逻辑。

如下：

```
        let count = () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(100)
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
            console.log('async')
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
        .finally(() => {
            console.log('finally')
        }) 
        
        //执行结果
        async
        {count: 100, list: [1, 2, 3]}
        finally
```



### 3. Rest/Spread 属性

#### 3.1 ES6中(...)

在ES6中引入了三点`...`，作用主要是`Rest参数和扩展运算符`:

作用对象仅用于数组

1.将一个未知数量的参数表示一个数组:

```
restParam(1, 2, 3, 4, 5);

function restParam(p1, p2, ...p3) {
  // p1 = 1
  // p2 = 2
  // p3 = [3, 4, 5]
}
```

2.扩展运算符：

```
const values = [99, 100, -1, 48, 16];
console.log( Math.max(...values) ); // 100
```

#### 3.2 ES9中(...)

在ES9中为对象提供了像数组一样的Rest参数和展开运算符。

> Rest参数用法

```
        var obj = {
            a: 1,
            b: 2,
            c: 3
        }
        const { a, ...param } = obj;
        console.log(a)     //1
        console.log(param) //{b: 2, c: 3}
        
```

> Spread用法，用于收集所有的剩余参数：

```
        var obj = {
            a: 1,
            b: 2,
            c: 3
        }
		function foo({a, ...param}) {
            console.log(a);
            console.log(param)
        }
```

跟数组一样，Rest参数只能在声明的结尾处使用。此外，它只适用于每个对象的顶层，如果对象中嵌套对象则无法适用。

> 扩展运算符可以在其他对象内使用

```
const obj1 = { a: 1, b: 2, c: 3 };
const obj2 = { ...obj1, z: 26 };
// obj2 is { a: 1, b: 2, c: 3, z: 26 }
```



#### 3.3 Spread的使用场景



> 1.浅拷贝
>
> 可以利用(...)来进行一个对象的拷贝，但是这种拷贝只能拷贝对象的可枚举自有属性。

```
        var obj = {
            name: 'LinDaiDai',
            looks: 'handsome',
            foo() {
                console.log('old');
            },
            set setLooks(newVal) {
                this.looks = newVal
            },
            get getName() {
                console.log(this.name)
            }
        }

        var cloneObj = {...obj};
        cloneObj.foo = function() {
            console.log('new')
        };
        console.log(obj)     
        // { name: 'LinDaiDai',looks: 'handsome', foo: f foo(), get getName:f getName(), set setLooks: f setLooks(newVal)}
        console.log(cloneObj)
        // { name: 'LinDaiDai',looks: 'handsome', foo: f foo(), getName: undefined, setLooks: undefined }
        obj.foo()
        // old
        cloneObj.foo()
        // new 
```

如上所示，定义了一个对象`obj` 并使用`(...)`进行对象的拷贝，修改对象内的函数`foo()`，并不会影响原有的对象，但是原有对象的`setter`和`getter`却不能拷贝过去。

> 2.合并俩个对象

```
const merged = {...obj1, ...obj2};
//同：
const merged = Object.assign({}, obj1, obj2);
```



### 4. 正则表达式命名捕获组

#### 4.1 基本用法

`Javascript`正则表达式中使用`exec()`匹配能够返回一个对象，一个包含匹配字符串的类数组。

如下面案例中的匹配日期格式：

```
//正则表达式命名捕获组
        const reDate = /(\d{4})-(\d{2})-(\d{2})/,
              match = reDate.exec('2018-08-06');
        console.log(match);
        // [2018-08-06, 2018, 08, 06]
        
        // 这样就可以直接用索引来获取年月日：
        match[1] // 2018
        match[2] // 08
        match[3] // 06
```

返回一个数组，数组第0项为与正则表达式相匹配的文本，第 1 个元素是与 RegExpObject 的第 1 个子表达式相匹配的文本（如果有的话），第 2 个元素是与 RegExpObject 的第 2 个子表达式相匹配的文本（如果有的话），以此类推。

上面的案例，若是改变正则表达式的结构就有可能改变匹配对象的索引。

如进行如下修改：

```
//正则表达式命名捕获组
        const reDate = /(\d{2})-(\d{2})-(\d{4})/,
              match = reDate.exec('2018-08-06');
        console.log(match);
        // [2018-08-06, 08, 06, 2018]
        
        // 但此时年月日的索引就改变了
        match[3] // 2018
        match[1] // 08
        match[2] // 06
```

**可以看到上面写法的弊端，因此在ES9中允许命名捕获组使用符号`?<name>`,如下：**

```
        const reDate = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/,
              match = reDate.exec('2018-08-06')
        console.log(match);
        // [2018-08-06, 08, 06, 2018, groups: {day: 06, month: 08, year: 2018}]
        
        //此时可以使用groups对象来获取年月日
        match.groups.year // 2018
        match.groups.month // 08
        match.groups.day  // 06
```

命名捕获组的写法相当于是把每个匹配到的捕获组都定义了一个名字，然后存储到返回值的`groups`属性中。

#### 4.2 结合`replace()`

命名捕获也可以使用在`replace()`方法中。例如将日期转换为美国的 MM-DD-YYYY 格式：

```
const reDate = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/,
      d = '2018-08-06'
      USADate = d.replace(reDate, '$<month>-$<day>-$<year>');
console.log(USADate);
// 08-06-2018
```



还可以将中文名的姓和名调换：

```
const reName = /(?<sur>[a-zA-Z]+)-(?<name>[a-zA-Z]+)/;
      Chinese = 'Lin-DaiDai',
      USA = Chinese.replace(reName, '$<name>-$<sur>');
console.log(USA);
// DaiDai-Lin
```



### 5. 正则表达式反向断言

#### 5.1 基本用法

先来看下正则表达式先行断言是什么：

如获取货币的符号

```
        const noReLookahead = /\D(\d+)/,
        	  reLookahead = /\D(?=\d+)/,
        	  match1 = noReLookahead.exec('$123.45'),
              match2 = reLookahead.exec('$123.45');
        console.log(match1[0]); // $123   
        console.log(match2[0]); // $
```

可以看到若是在正则表达式中加入`?=`的话，匹配会发生，但不会有任何捕获，并且断言没有包含在整个匹配字段中。

在ES9中可以允许反向断言：

```
        const reLookahead = /(?<=\D)[\d\.]+/;
              match = reLookahead.exec('$123.45');
        console.log(match[0]); // 123.45
```

使用`?<=`进行反向断言，可以使用反向断言获取货币的价格，而忽略货币符号。

#### 5.2 肯定反向断言

上面的案例为肯定反向断言，也就是说`\D`这个条件必须存在，若是:

```
        const reLookahead = /(?<=\D)[\d\.]+/;
              match1 = reLookahead.exec('123.45'),
              match2 = reLookahead.exec('12345');
        console.log(match1[0]); // 45
        console.log(match2);  // null
```

可以看到`match1`匹配到的是`45`,这是由于在`123`前面没有任何符合`\D`的匹配内容，它会一直找到符合`\D`的内容，也就是`.`然后返回后面的内容。

而若是没有满足前面肯定反向断言的条件的话，则返回`null`.



### 6. 正则表达式`dotAll`模式

正则表达式中点`.`匹配除回车外的任何单字符，标记`s`改变这种行为，允许行终止符的出现:

```
/hello.world/.test('hello\nworld');  // false

/hello.world/s.test('hello\nworld'); // true

console.log(/hello.world/s.test(`hello
world`))   // true
```



### 7. 正则表达式 Unicode 转义

到目前为止，在正则表达式中本地访问 Unicode 字符属性是不被允许的。ES2018添加了 Unicode 属性转义——形式为`\p{...}`和`\P{...}`，在正则表达式中使用标记 `u` (unicode) 设置，在`\p`块儿内，可以以键值对的方式设置需要匹配的属性而非具体内容。

```
    const reGreekSymbol = /\p{Script=Greek}/u;
    console.log(reGreekSymbol.test('π')); // true
```

`Greek`为希腊语的意思。



### 8. 非转义序列的模板字符串

最后，ES2018 移除对 ECMAScript 在带标签的模版字符串中转义序列的语法限制。

之前，`\u`开始一个 unicode 转义，`\x`开始一个十六进制转义，`\`后跟一个数字开始一个八进制转义。这使得创建特定的字符串变得不可能，例如Windows文件路径 `C:\uuu\xxx\111`。更多细节参考[模板字符串](https://link.juejin.im?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2Ftemplate_strings)。



### 后语

知识产权无价，支持原创。

参考文章：

[[译] ES2018（ES9）的新特性](https://juejin.im/post/5b2a186cf265da596d04a648)

[【译】ES2018 新特性：Rest/Spread 特性](https://juejin.im/post/5b431280e51d4519133f74d1)

ES6/ES7/ES8/ES9 可以看到javascript并没有让我们失望，这几年的更新没有落下，不间断的学习，才能保证自己被这个社会淘汰...