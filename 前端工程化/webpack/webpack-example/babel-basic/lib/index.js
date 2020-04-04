"use strict";

require("core-js/modules/es.array.includes");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.promise.finally");

var fn = function fn() {
  return 1;
}; // ES6箭头函数, 返回值为1


var num = Math.pow(3, 2); // ES7求幂运算符

var hasTwo = [1, 2, 3].includes(2);

var foo = function foo(a, b, c) {
  // ES7参数支持尾部逗号
  console.log('a:', a);
  console.log('b:', b);
  console.log('c:', c);
};

foo(1, 3, 4);
Promise.resolve()["finally"]();
console.log(fn());
console.log(num);
console.log(hasTwo);