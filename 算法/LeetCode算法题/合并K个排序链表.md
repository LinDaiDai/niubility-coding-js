### 题目描述

合并 *k* 个排序链表，返回合并后的排序链表。请分析和描述算法的复杂度。

**实例🌰**:

```
输入:
[
  1->4->5,
  1->3->4,
  2->6
]
输出: 1->1->2->3->4->4->5->6
```



### 解题思路

一、暴力法(链表逐一进行合并)

- 利用`for`循环, 依次比较第`i`项和第`i+1`项, 然后将这两项合为一个链表;
- 用上面合成的链表再和后面的项做对比;
- 合成两个链表的方法是利用递归, 比较两项谁的`val`值更大.



二、转化为数组排序

- 先将输入进来的链表集合转化为一个一维数组;
- 将该数组排序;
- 将排序后的数组重新生成为链表输出.



### coding

方法一:

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
var mergeKLists = function(lists) {
    if (!lists || lists.length <= 0) return null
    if (lists.length === 1) return lists[0]
    let currentList = lists[0]
    for (let i = 1; i < lists.length; i++) {
        currentList = mergeKList(currentList, lists[i])
    }
    return currentList
};
/**
* 合并两个链表
* @param {ListNode[]} 链表
* @return {ListNode}
*/
var mergeKList = function (l1, l2) {
    if (!l1) return l2
    if (!l2) return l1
    let newList = new ListNode(null)
    if (l1.val < l2.val) {
        newList.val = l1.val
        newList.next = mergeKList(l1.next, l2)
    } else {
        newList.val = l2.val
        newList.next = mergeKList(l1, l2.next)
    }
    return newList
}
```

- 需要遍历整个数组k趟，每趟遍历n<=N个链表节点，时间复杂度为O(kN)

- 所有操作基于原链表节点，空间复杂度为O(1)

执行用时: **584 ms**, 内存消耗: **67.6MB**.

方法二:

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
var mergeKLists = function(lists) {
    if (!lists || lists.length === 0) return null
    if (lists.length === 1) return lists[0]
    let collect = lists.reduce((allList, list) => {
        return allList.concat(transformListToArray(list))
    }, [])
    collect = collect.sort((a, b) => a - b);
    return transformArrayToList(collect)
};
// 将数组转化为链表
function transformArrayToList (arr) {
    let list = new ListNode(null)
    let node = list
    while (arr.length > 0) {
        node.next = new ListNode(arr.shift())
        node = node.next
    }
    return list.next
}
// 将链表转化为数组
function transformListToArray (node) {
    let arr = []
    while (node) {
        arr.push(node.val)
        node = node.next
    }
    return arr
}
```

- 遍历所有节点时间复杂度O(n),申请数组空间，空间复杂度O(n)
- 对数组进行排序，JS中sort算法喂快排，时间复杂度为O(logn)
- 数组转化为链表，时间复杂度为O(n)，空间复杂度为O(n)

执行用时: **196 ms**, 内存消耗: **51.2MB**.