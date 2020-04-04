### 题目描述

将一个给定字符串根据给定的行数，以从上往下、从左到右进行 Z 字形排列。

比如输入字符串为 `"LEETCODEISHIRING"` 行数为 3 时，排列如下：

```
L   C   I   R
E T O E S I I G
E   D   H   N
```

之后，你的输出需要从左往右逐行读取，产生出一个新的字符串，比如：`"LCIRETOESIIGEDHN"`。

请你实现这个将字符串进行指定行数变换的函数：

```javascript
conver(s, numRows)
```

**示例一🌰**

```javascript
输入: s = "LEETCODEISHIRING", numRows = 3
输出: "LCIRETOESIIGEDHN"
```

**示例二🌰**

```javascript
输入: s = "LEETCODEISHIRING", numRows = 4
输出: "LDREOEIIECIHNTSG"
解释:

L     D     R
E   O E   I I
E C   I H   N
T     S     G
```



### 解题思路

1. 考虑字符串长度为0或者1的情况;
2. 考虑输入的`numRows`为0或者小于字符串长度的情况;
3. 通过比较字符串的长度和`numRows`来定义一个行的最小长度`len`;
4. 定义当前的下标`loc`和是否向下移动`down`;
5. 判断`loc`是否是在列的头或者列的尾部,从而改变移动的方向`down`;
6. `down`决定了`loc`是`+1`还是`-1`

### coding

```javascript
/**
 * @param {string} s
 * @param {number} numRows
 * @return {string}
 */
var convert = function(s, numRows) {
    if (!s || !numRows) return ''
    let len = Math.min(s.length, numRows)
    if (len === 1) return s
    
    let array = Array.from({length: len}, i => '')
    let loc = 0,
        down = false;
    let rstStr = ''
    for (const c of s) {
        array[loc] += c;
        if (loc === 0 || loc === numRows - 1) // 在列的头部或者尾部
            down = !down
        loc += down ? 1 : -1
    }
    return array.join('');
};
```

**测试代码**

```javascript
convert('A', 2)
// 'A'
convert('AB', 1)
// 'AB'
convert('LinDaiDai', 3)
// 'LaiiDianD'
```

