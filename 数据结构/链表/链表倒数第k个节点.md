### 题目描述

输入一个链表，输出该链表中倒数第k个结点。

### 解题思路

第一种思路:

1. 利用链表的最后一项的`next`为`null`的特性来找到链表的总长度`length`
2. 找到`length`之后,在找到`length-1`项,需要循环2次.

优化的思路:

1. 设定两个节点,两个节点之间相差`k`个节点;
2. 当前面一个节点到达终点之后就取后面的节点;
3. 需要考虑到`k`是否为`0`或者会大于`length`的情况,以及`head`是否为`null`.

### coding

```javascript
/*
* 获取链表中的倒数第k个节点
* @params {ListNode} list
* @params {Number} k
* @returns {Node}
*/
function findKthToTail(list, k) {
    if (!list || !k) return null
    let front = list // 前一个节点
    let behind = list // 后一个节点
    let i = 1 // 当前是第几个节点
    while (front.next) {
        i++
        front = front.next
        if (i > k) {
            behind = behind.next
        }
    }
    return (k <= i) && behind // 判断k是否小于链表长度
}
```

**测试代码**

```javascript
function ListNode(val) {
    this.val = val
    this.next = null
}
/**
 * 将数组转换为链表
 */
function transformArrayToList(array) {
    let list = new ListNode(null)
    let node = list
    while (array.length > 0) {
        let val = array.pop()
        node.next = new ListNode(val)
        node = node.next
    }
    return list.next
}
/*
* 获取链表中的倒数第k个节点
* @params {ListNode} list
* @params {Number} k
* @returns {Node}
*/
function findKthToTail(list, k) {
    if (!list || !k) return null
    let front = list
    let behind = list
    let i = 1
    while (front.next) {
        i++
        front = front.next
        if (i > k) {
            behind = behind.next
        }
    }
    return (k <= i) && behind
}

let list = transformArrayToList([5, 4, 3, 2])
console.log(findKthToTail(list, 2)) // { val: 4, next: {...} }
console.log(findKthToTail(list, 5)) // false
```



