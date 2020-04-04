### 题目描述

输入一个递增排序的数组和一个数字`S`，在数组中查找两个数，使得他们的和正好是`S`，如果有多对数字的和等于`S`，输出两个数的乘积最小的。



### 解题思路

> 数组中可能有多对符合条件的结果，而且要求输出乘积最小的，说明要分布在两侧 比如 `3,8` `5,7` 要取`3,8`。

由于题目中已经说明了数组是递增排序的数组,所以定义两个指针一左一右，不断逼近结果，最后取得最终值。

1. 定义一个小索引`left`, 从`0`开始;
2. 定义一个大索引`right`从`array.length - 1`开始;
3. 判断两个数的值相加是否等于`s`;
4. 若是小于`s`,则左指针向右移;
5. 若是大于`s`,则右指针向左移动;
6. 终止条件为`left ===right`.

### coding

```javascript
function findNumbersWithSum(array, sum) {
    if (array && array.length > 0) {
        let left = 0,
            right = array.length - 1;
        while (left < right) {
            const total = array[left] + array[right] // 计算当前两个指针的合
            if (total > sum) {
                right--;
            } else if (total < sum) {
                left++;
            } else {
                return array[left] * array[right]
            }
        }
    }
    return 0
}
```

**测试代码**

```javascript
console.log(findNumbersWithSum([3, 5, 7, 8]))
// 24
```

