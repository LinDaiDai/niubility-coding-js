### Vue模版的编译原理是什么？

`Vue`模版编译，也就是`compilte`阶段，它其实就是将`template`转化为`render function` 的过程，它会经过以下三个阶段：

1. `parse`阶段将`template`字符串通过各种正则表达式生成一颗抽象语法树`AST`，在解析的过程中是通过`while`不断循环这个字符串，每解析完一个标签指针向下移动；并且用栈来建立节点间的层级关系，也就是用来保存解析好的标签头。
2. `optimize`阶段将生成的抽象语法树`AST`进行静态标记，这些被标记为静态的节点在后面的`patch`过程中会被跳过对比，从而达到优化的目的。标记的主要过程是为每个节点设置类似于`static`这样的属性，或者给根节点设置一个`staticRoot`属性表明这是不是一个静态根。

3. 在进入到`generate`阶段之前，说明已经生成了被静态标记过的`AST`，而`generate`就是将`AST`转化为`render function`字符串。



### Vue模版的编译阶段是怎样实现`optimize`的？

`optimize`主要是为了给`parse`阶段生成的`AST`进行静态标记。

这些被标记为静态的节点在后面的`patch`过程中会被跳过对比，从而达到优化的目的。

`AST`抽象语法树，实际就是一个`JavaScript`对象，而进行静态标记，就是给其中的每个节点定义一个类似于叫`static`的属性，或者给根节点设置一个`staticRoot`属性表明这是不是一个静态根。

例如下面👇的这颗`AST`，在刚开始是没有`static`属性的，经过`optimize`阶段就有了：

```diff
{
	'type': 1,
	'attrsMap': {
		'class': 'wrap'
	},
	'staticClass': 'wrap'
	'tag': 'div',
+	'static': false,
+ 'staticRoot': false,
	'children': [
		{
			'type': 3,
			'attrsMap': {
				'class': 'header'
			},
			'staticClass': 'header',
			'tag': 'div',
+			'static': true
		},
		{
			'type': 2,
			'attrsMap': {
				'class': 'footer',
				'v-if': 'isShow'
			},
			'ifConditions': [
				'exp': 'isShow'
			],
			'staticClass': 'footer',
			'tag': 'div',
+			'static': false
		}
	]
}
```



实现一个`optimize`函数，首先我们需要一个用来判断是否为「静态」的函数。



#### isStatic函数

判断一个节点是否为「静态」，判断的标准是：

- 节点的`type`为`2`(表达式节点)，为非静态节点，返回`false`。
- 节点的`type`为`3`(文本节点)，为静态节点，返回`true`。
- 若是节点中存在`if`或者`for`这样的条件时，也为非静态节点，返回`false`。

```javascript
// 判断是否是静态节点
function isStatic (node) {
  const { type } = node
  if (type === 2) { // 表达式节点
    return false
  } else if (type === 3) { // 文本节点
    return true
  }
  return (!node.if && !node.for) // 不存在if和for
}
```



#### markStatic函数

有了判断是否为「静态」的函数之后，就需要遍历所有节点，然后打上标记了。

标记的依据是：

- 首先通过`isStatic`判断当前节点是否为静态的节点，设置好`static`属性
- 然后会遍历所有的子节点，设置好`static`属性，如果其中有子节点为非静态的，则当前节点也是非静态的。

来看看伪代码：

```javascript
function markStatic (node) {
  node.static = isStatic(node) // 标记当前节点的static
  if (node.type === 1) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i]
      markStatic(child) // 标记子节点
      if (!child.static) {
        node.static = false
      }
    }
  }
}
```

父节点为非静态节点时，它下面的所有子节点就一定为非静态吗？

不一定，例如下面这种情况，就不是：

```html
<div class="wrap">
	<div class="header">我是头部静态节点</div>
	<div class="footer" v-if="isShow">我是尾部非静态节点</div>
</div>
```



#### markStaticRoots

除了使用`markStatic`函数来给每个节点标记`static`属性之外，还可以用一个名为`markStaticRoots`的函数来标记是否为静态根(`staticRoot`)，将`staticRoot`属性设置为`true`。

试想一下，下面这个结构：

```html
<div class="wrap">
	<div class="header">我是头部静态节点</div>
	<div class="footer">我是尾部静态节点</div>
</div>
```

这段`template`下的节点全为静态节点，我们就可以将其标记为静态根。

判断的条件是：

- 传入的节点本身的`static`就是为`true`
- 并且该节点有子节点且不止有一个文本节点

```javascript
function markStaticRoots () {
  if (node.type === 1) {
    if (node.static && node.children && !(
      node.children.length === 1 && node.children[0].type === 3
    )) {
      node.staticRoot = true
      return
    } else {
      node.staticRoot = false
    }
  }
}
```



#### optimize函数

现在可以来实现`optimize`函数了：

```javascript
function optimize (rootAst) {
  markStatic(rootAst)
  markStaticRoots(rootAst)
}
```





### nextTick的实现

Vue.js 实现了一个 `nextTick` 函数，传入一个 `cb` ，这个 `cb` 会被存储到一个队列中，在下一个 tick 时触发队列中的所有 `cb` 事件。

```javascript
let callbacks = [];
let pending = false;

function nextTick (cb) {
    callbacks.push(cb);

    if (!pending) {
        pending = true;
        setTimeout(flushCallbacks, 0);
    }
}

function flushCallbacks () {
    pending = false;
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
        copies[i]();
    }
}
```

这样做的目的是：

例如在一个时间点内，一直调用`nextTick`

```
nextTick(cb)
nextTick(cb)
nextTick(cb)

由于setTimeout的原因，pending变为了true之后就不会执行if里的代码了，而是等定时器执行了之后才变回来
```

