var isNode = typeof global !== "undefined" &&
    ({}).toString.call(global) == '[object global]';
console.log(Object.prototype.toString.call(global))
console.log(isNode)