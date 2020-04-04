### 题目描述

给定一个链表，删除链表的倒数第 *n* 个节点，并且返回链表的头结点。

**示例🌰**:

```javascript
给定一个链表: 1->2->3->4->5, 和 n = 2.

当删除了倒数第二个节点后，链表变为 1->2->3->5.
```

**说明：**

给定的 *n* 保证是有效的。

### 解题思路

要删除链表中的某个节点, 其实就是: 

第一种: 将该节点的`val`设置为该节点下一项的`val`, 该节点的`next`设置为该节点下一项的`next`.

第二种: 将该节点的前一项的`next`指向该节点的下一项.

**实现方式**:

1. 获取整个列表的长度`len`, 然后用`len - n`得到要删除的节点从头开始的下标`idx`;
2. 定义一个新的链表,将新链表的`next`指向`head`;
3. 定义变量`pre`和`cur`分别盛放新链表和新链表的`next`;
4. 循环`idx`次, 更新每次的`pre`和`cur`;
5. 循环完之后将`pre`的`next`指向`cur`的`next`以达到删除第`idx`项的效果.

### coding

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function(head, n) {
    let len = getListNodeLen(head);
    if (n > len) return null;
    let idx = len - n; // 3
    let result = new ListNode();
    result.next = head;
    let pre = result;
    let cur = pre.next;
    for (let i = 0; i < idx; i++) {
        pre = cur;
        cur = pre.next;
    }
    pre.next = cur.next;
    return result.next;
};

var getListNodeLen = function (head) {
    let len = 0;
    let nowNode = head;
    while (nowNode) {
        len++;
        nowNode = nowNode.next;
    }
    return len;
}
```

执行用时: **68ms**, 内存消耗: **33.9MB**.

**测试用例**

```javascript
var removeNthFromEnd = function(head, n) {
    let len = getListNodeLen(head);
    if (n > len) return null;
    let idx = len - n; // 3
    let result = new ListNode();
    result.next = head;
    let pre = result;
    let cur = pre.next;
    for (let i = 0; i < idx; i++) {
        pre = cur;
        cur = pre.next;
    }
    pre.next = cur.next;
    return result.next;
};

var getListNodeLen = function(head) {
    let len = 0;
    let nowNode = head;
    while (nowNode) {
        len++;
        nowNode = nowNode.next;
    }
    return len;
}
let l3 = transformArrayToList([1, 2, 3, 4, 5])
let res = transformListToArray(removeNthFromEnd(l3, 2))
console.log(res) // [1, 2, 3, 5]
```

案例中用到的方法:

```javascript
/**
* Definition for singly-linked list.
*/
function ListNode(val) {
    this.val = val;
    this.next = null;
}
// 将链表转换为数组
function transformListToArray(node) {
    let array = []
    while (node) {
        array.push(node.val)
        node = node.next
    }
    return array
}
// 将数组转换为链表
function transformArrayToList(array) {
    // let array = num.toString().split('').reverse()
    function createList(array) {
        if (array.length === 0) return null
        let list = new ListNode(array[0])
        array.shift()
        list.next = createList(array)
        return list
    }
    return createList(array)
}
```

