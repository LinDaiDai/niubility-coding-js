## 二叉搜索树的第k个节点

### 题目描述

给定一棵二叉搜索树，请找出其中的第k小的节点。 例如， （5，3，7，2，4，6，8） 中，按结点数值大小顺序第三小结点的值为4。

### 解题思路

1. 利用二叉搜索树**中序遍历**就是按从小到大的特性；
2. 中序遍历排好序后返回对应`k-1`下标的那一项节点。

### coding

```javascript
/*
* 二叉树结点类
*/
class Node {
    constructor(value = 0, left = null, right = null) {
        this.value = value;
        this.left = left;
        this.right = right;
    }
}
/**
* 二叉搜索树的第k个节点
* @param {Node} root
* @param {Number} target
 */
function KthNode(root, target) {
    const arr = []
    inOrderRec(root, arr)
    if (target > 0 && target <= arr.length) {
        return arr[target - 1]
    }
    return null;
}
/*
* 二叉树中序遍历
*/
function inOrderRec (node, arr) {
    if (node) {
        inOrderRec(node.left, arr)
        arr.push(node)
        inOrderRec(node.right, arr)
    }
}

const root = new Node(1, new Node(2), new Node(3, null, new Node(-1)));
console.log(KthNode(root, 3))
// { value: 3, left: null, right: { value: -1, left: null, right: null } }
```

