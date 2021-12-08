# JavaScript数组扁平化(flat)方法

## Q: 多维数组=>一维数组

```
let arr = [1, [2, [3, [4, 5]]], 6];
// [1,2,3,4,5,6]
let str = jsON.stringify(ary);
```

### ① 直接调用 flat()

注意：flat和flatMap方法为ES2019(ES10)方法，目前还未在所有浏览器完全兼容

```
arr.flat(Infinity);
```

### ② 扩展运算符

通过判断数组中是否存在是 数组的值，一层一层的解构

```
while (ary.some(Array.isArray)) {
  ary = [].concat(...ary);
}
```

### ③ 使用replace

```
str.replace(/(\[\]))/g, '').split(',');
```

### ④递归处理

```
let result = [];
let fn = function(ary) {
  for(let i = 0; i < ary.length; i++) }{
    let item = ary[i];
    if (Array.isArray(ary[i])){
      fn(item);
    } else {
      result.push(item);
    }
  }
}
```

### ⑤ 用 reduce 实现数组的 flat 方法

```
function flatten(ary) {
  return ary.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flatten(cur) : cur);
  })
}
let ary = [1, 2, [3, 4], [5, [6, 7]]]
console.log(ary.MyFlat(Infinity))



const flattened = [
    [0, 1],
    [2, 3],
    [4, 5],
].reduce((accumulator, current) => accumulator.concat(current), []);
console.log(flattened); // [ 0, 1, 2, 3, 4, 5 ]
```