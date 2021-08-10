## Array 原型方法源码实现大解密

> [https://muyiy.cn/blog/6/6.3.html#引言](https://muyiy.cn/blog/6/6.3.html#引言)

## 引言 

几个常用数组方法的使用方式已经在【进阶 6-1 期】 中介绍过了，今天这篇文章主要看看 ECMA-262 规范中是如何定义这些方法的，并且在看完规范后我们用 JS 模拟实现下，透过源码探索一些底层的知识，希望本文对你有所帮助。

## Array.prototype.map

完整的结构是 `Array.prototype.map(callbackfn[, thisArg])`，`map` 函数接收两个参数，一个是必填项回调函数，另一个是可选项 callbackfn 函数执行时的 this 值。

`map` 方法的主要功能就是把原数组中的每个元素按顺序执行一次  `callbackfn` 函数，并且把所有返回的结果组合在一起生成一个新的数组，`map` 方法的返回值就是这个新数组。

ECMA-262 规范文档实现如下。

1. Let O be ? ToObject(this value).

2. Let len be ? LengthOfArrayLike(O).

3. If IsCallable(callbackfn) is false, throw a TypeError exception.

4. If thisArg is present, let T be thisArg; else let T be undefined.

5. Let A be ? ArraySpeciesCreate(O, len).

6. Let k be 0.

7. Repeat, while k < len

8. 1. Let Pk be ! ToString(k).
   2. Let kPresent be ? HasProperty(O, Pk).

9. If kPresent is true, then

10. 1. Let kValue be ? Get(O, Pk).
    2. Let mappedValue be ? Call(callbackfn, T, « kValue, k, O »).
    3. Perform ? CreateDataPropertyOrThrow(A, Pk, mappedValue).

11. Set k to k + 1.

12. Return A.


用 JS 来模拟实现，核心逻辑如下：

```
Array.prototype.map = function(callbackfn, thisArg) {
  // 异常处理
  if (this == null) {
      throw new TypeError("Cannot read property 'map' of null or undefined");
  }
  // Step 1. 转成数组对象，有 length 属性和 K-V 键值对
  let O = Object(this)
  // Step 2. 无符号右移 0 位，左侧用 0 填充，结果非负
  let len = O.length >>> 0
  // Step 3. callbackfn 不是函数时抛出异常
  if (typeof callbackfn !== 'function') {
    throw new TypeError(callbackfn + ' is not a function')
  }
  // Step 4.
  let T = thisArg
  // Step 5.
  let A = new Array(len)
  // Step 6.
  let k = 0
  // Step 7.
  while(k < len) {
    // Step 7.1、7.2、7.3
    // 检查 O 及其原型链是否包含属性 k
    if (k in O) {
      // Step 7.3.1
      let kValue = O[k]
      // Step 7.3.2 执行 callbackfn 函数
      // 传入 this, 当前元素 element, 索引 index, 原数组对象 O
      let mappedValue = callbackfn.call(T, kValue, k, O)
        // Step 7.3.3 返回结果赋值给新生成数组
      A[k] = mappedValue
    }
    // Step 7.4
    k++
  }
  // Step 8. 返回新数组
  return A
}

// 代码亲测已通过
```

看完代码其实挺简单，核心就是在一个 `while` 循环中执行 `callbackfn`，并传入 4 个参数，回调函数具体的执行逻辑这里并不关心，只需要拿到返回结果并赋值给新数组就好了。

只有 O 及其原型链上包含属性 k 时才会执行  `callbackfn` 函数，所以对于稀疏数组 empty 元素或者使用 `delete` 删除后的索引则**不会被调用**。

```
let arr = [1, , 3, , 5]
console.log(0 in arr) // true
delete arr[0]
console.log(0 in arr) // false
console.log(arr) // [empty × 2, 3, empty, 5]
arr.map(ele => {
  console.log(ele) // 3, 5
})
```

`map` 并不会修改原数组，不过也不是绝对的，如果你在 `callbackfn` 中修改了原数组，那还是会改变。那问题来了，修改后会影响到 `map` 自身的执行吗？

答案是会的！不过得区分以下几种情况。

- 原数组新增元素：因为 `map` 第一次执行时 length 已经确定了，所以不影响
- 原数组修改元素：传递给 `callbackfn` 的元素是 map 遍历到它们那一瞬间的值，所以可能受影响
- 修改当前索引之前的元素，不受影响
- 修改当前索引之后的元素，受影响
- 原数组删除元素：被删除的元素无法被访问到，所以可能受影响
- 删除当前索引之前的元素，已经访问过了，所以不受影响
- 删除当前索引之后的元素，受影响

简单看下面几个例子，在 `callbackfn` 中不要改变原数组，不然会有意想不到的情况发生。

```
// 1、原数组新增元素，不受影响
let arr = [1, 2, 3]
let result = arr.map((ele, index, array) => {
  array.push(4);
  return ele * 2
})
console.log(result) 
// 2, 4, 6
// ----------- 完美分割线 -----------


// 2、原数组修改当前索引之前的元素，不受影响
let arr = [1, 2, 3]
let result = arr.map((ele, index, array) => {
  if (index === 1) {
    array[0] = 4
  }
  return ele * 2
})
console.log(result) 
// 2, 4, 6
// ----------- 完美分割线 -----------


// 3、原数组修改当前索引之后的元素，受影响
let arr = [1, 2, 3]
let result = arr.map((ele, index, array) => {
  if (index === 1) {
    array[2] = 4
  }
  return ele * 2
})
console.log(result) 
// 2, 4, 8
```

最后来说说 `this`，源码中有这么一段 `callbackfn.call(T, kValue, k, O)`，其中  `T` 就是 `thisArg` 值，如果没有设置，那就是 undefined。

根据【进阶 3-3 期】  中对于 call 的解读，传入 undefined 时，非严格模式下指向 Window，严格模式下为 undefined。记住这时候回调函数不能用箭头函数，因为箭头函数是没有自己的 this 的。

```
// 1、传入 thisArg 但使用箭头函数
let name = 'Muyiy'
let obj = {
    name: 'Hello',
    callback: (ele) => {
        return this.name + ele
    }
}
let arr = [1, 2, 3]
let result = arr.map(obj.callback, obj);
console.log(result) 
// ["1", "2", "3"]，此时 this 指向 window
// 那为啥不是 "Muyiy1" 这样呢，不急，第 3 步介绍
// ----------- 完美分割线 -----------


// 2、传入 thisArg，使用普通函数
let name = 'Muyiy'
let obj = {
    name: 'Hello',
    callback: function (ele) {
        return this.name + ele
    }
}
let arr = [1, 2, 3]
let result = arr.map(obj.callback, obj);
console.log(result) 
// ["Hello1", "Hello2", "Hello3"]，完美
// ----------- 完美分割线 -----------

// 3、不传入 thisArg，name 使用 let 声明
let name = 'Muyiy'
let obj = {
    name: 'Hello',
    callback: function (ele) {
        return this.name + ele
    }
}
let arr = [1, 2, 3]
let result = arr.map(obj.callback);
console.log(result)
// ["1", "2", "3"]
// 为什么呢，因为 let 和 const 声明的变量不会挂载到 window 上
// ----------- 完美分割线 -----------

// 4、不传入 thisArg，name 使用 var 声明
var name = 'Muyiy'
let obj = {
    name: 'Hello',
    callback: function (ele) {
        return this.name + ele
    }
}
let arr = [1, 2, 3]
let result = arr.map(obj.callback);
console.log(result)
// ["Muyiy1", "Muyiy2", "Muyiy3"]
// 看看，改成 var 就好了
// ----------- 完美分割线 -----------

// 5、严格模式
'use strict'
var name = 'Muyiy'
let obj = {
    name: 'Hello',
    callback: function (ele) {
        return this.name + ele
    }
}
let arr = [1, 2, 3]
let result = arr.map(obj.callback);
console.log(result)
// TypeError: Cannot read property 'name' of undefined
// 因为严格模式下 this 指向 undefined
```

上面这部分实操代码介绍了 5 种情况，分别是传入 thisArg 两种情况，非严格模式下两种情况，以及严格模式下一种情况。这部分的知识在之前的文章中都有介绍过，这里主要是温故下。如果这块知识不熟悉，可以详细看我的 博客

## Array.prototype.filter

完整的结构是 `Array.prototype.filter(callbackfn[, thisArg])`，和 `map` 是一样的。

`filter` 字如其名，它的主要功能就是过滤，`callbackfn` 执行结果如果是 true 就返回当前元素，false 则不返回，返回的所有元素组合在一起生成新数组，并返回。如果没有任何元素通过测试，则返回空数组。

所以这部分源码相比 `map` 而言，多了一步判断 `callbackfn` 的返回值。

ECMA-262 规范文档实现如下。

1. Let O be ? ToObject(this value).

2. Let len be ? LengthOfArrayLike(O).

3. If IsCallable(callbackfn) is false, throw a TypeError exception.

4. If thisArg is present, let T be thisArg; else let T be undefined.

5. Let A be ? ArraySpeciesCreate(O, 0).

6. Let k be 0.

7. Let to be 0.

8. Repeat, while k < len

9. 1. Let kValue be ? Get(O, Pk).
   2. Let selected be ! ToBoolean(? Call(callbackfn, T, « kValue, k, O »)).
   3. If selected is true, then
   4. Set k to k + 1.
   5. Perform ? CreateDataPropertyOrThrow(A, ! ToString(to), kValue).
   6. Set to to to + 1.
   7. Let Pk be ! ToString(k).
   8. Let kPresent be ? HasProperty(O, Pk).
   9. If kPresent is true, then

10. Return A.


用 JS 来模拟实现，核心逻辑如下：

```
Array.prototype.filter = function(callbackfn, thisArg) {
  // 异常处理
  if (this == null) {
      throw new TypeError("Cannot read property 'map' of null or undefined");
  }
  if (typeof callbackfn !== 'function') {
    throw new TypeError(callbackfn + ' is not a function')
  }

  let O = Object(this), len = O.length >>> 0,
      T = thisArg, A = new Array(len), k = 0
  // 新增，返回数组的索引
  let to = 0

  while(k < len) {
    if (k in O) {
      let kValue = O[k]
      // 新增
      if (callbackfn.call(T, kValue, k, O)) {
        A[to++] = kValue;
      }
    }
    k++
  }

  // 新增，修改 length，初始值为 len
  A.length = to;
  return A
}

// 代码亲测已通过
```

看懂 `map` 再看这个实现就简单多了，改动点在于判断 `callbackfn` 返回值，新增索引 `to`，这样主要避免使用 `k` 时生成空元素，并在返回之前修改 `length` 值。

这部分源码还是挺有意思的，惊喜点在于 `A.length = to`，之前还没用过。

## Array.prototype.reduce

`reduce` 可以理解为「归一」，意为海纳百川，万剑归一，完整的结构是 `Array.prototype.reduce(callbackfn[, initialValue])`，这里第二个参数并不是 thisArg 了，而是初始值 `initialValue`，关于初始值之前有介绍过。

- 如果没有提供 `initialValue`，那么第一次调用 `callback` 函数时，`accumulator`使用原数组中的第一个元素，`currentValue` 即是数组中的第二个元素。
- 如果提供了 `initialValue`，`accumulator` 将使用这个初始值，`currentValue`使用原数组中的第一个元素。
- 在没有初始值的空数组上调用 `reduce` 将报错。

ECMA-262 规范文档实现如下。

1. Let O be ? ToObject(this value).

2. Let len be ? LengthOfArrayLike(O).

3. If IsCallable(callbackfn) is false, throw a TypeError exception.

4. If len is 0 and initialValue is not present, throw a TypeError exception.

5. Let k be 0.

6. Let accumulator be undefined.

7. If initialValue is present, then

8. 1. Set accumulator to initialValue.

9. Else,

10. 1. Let Pk be ! ToString(k).
    2. Set kPresent to ? HasProperty(O, Pk).
    3. If kPresent is true, then
    4. Set k to k + 1.
    5. Set accumulator to ? Get(O, Pk).
    6. Let kPresent be false.
    7. Repeat, while kPresent is false and k < len
    8. If kPresent is false, throw a TypeError exception.

11. Repeat, while k < len

12. 1. Let kValue be ? Get(O, Pk).
    2. Set accumulator to ? Call(callbackfn, undefined, « accumulator, kValue, k, O »).
    3. Let Pk be ! ToString(k).
    4. Let kPresent be ? HasProperty(O, Pk).
    5. If kPresent is true, then
    6. Set k to k + 1.

13. Return accumulator.

用 JS 来模拟实现，核心逻辑如下：

```
Array.prototype.reduce = function(callbackfn, initialValue) {
  // 异常处理
  if (this == null) {
      throw new TypeError("Cannot read property 'map' of null or undefined");
  }
  if (typeof callbackfn !== 'function') {
    throw new TypeError(callbackfn + ' is not a function')
  }
  let O = Object(this)
  let len = O.length >>> 0
  let k = 0, accumulator

  // 新增
  if (initialValue) {
    accumulator = initialValue
  } else {
    // Step 4.
    if (len === 0) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    // Step 8.
    let kPresent = false
    while(!kPresent && (k < len)) {
      kPresent = k in O
      if (kPresent) {
        accumulator = O[k] 
      }
      k++
    }
  }

  while(k < len) {
    if (k in O) {
      let kValue = O[k]
      accumulator = callbackfn.call(undefined, accumulator, kValue, k, O)
    }
    k++
  }
  return accumulator
}

// 代码亲测已通过
```

这部分源码主要多了对于 `initialValue` 的处理，有初始值时比较简单，即 `accumulator = initialValue`，`kValue = O[0]`。

无初始值处理在 Step 8，循环判断当 O 及其原型链上存在属性 k 时，`accumulator = O[k]` 并退出循环，因为 `k++`，所以 `kValue = O[k++]`。

更多的数组方法有 `find`、`findIndex`、`forEach` 等，其源码实现也是大同小异，无非就是在 `callbackfn.call` 这部分做些处理，有兴趣的可以看看 TC39 和 MDN 官网，参考部分链接直达。

## 注意

`forEach` 的源码和 `map` 很相同，在 map 的源码基础上做些改造就是啦。

```
Array.prototype.forEach = function(callbackfn, thisArg) {
  // 相同
  ...
  while(k < len) {
    if (k in O) {
      let kValue = O[k]

      // 这部分是 map
      // let mappedValue = callbackfn.call(T, kValue, k, O)
      // A[k] = mappedValue

      // 这部分是 forEach
      callbackfn.call(T, kValue, k, O)
    }
    k++
  }
  // 返回 undefined
  // return undefined
}
```

可以看到，不同之处在于不处理 `callbackfn` 执行的结果，也不返回。

特意指出来是因为在此之前看到过一种错误的说法，叫做「forEach 会跳过空，但是 map 不跳过」

为什么说 `map` 不跳过呢，因为原始数组有 empty 元素时，map 返回的结果也有 empty 元素，所以不跳过，但是这种说法并不正确。

```
let arr = [1, , 3, , 5]
console.log(arr) // [1, empty, 3, empty, 5]

let result = arr.map(ele => {
  console.log(ele) // 1, 3, 5
  return ele
})
console.log(result) // [1, empty, 3, empty, 5]
```

看 `ele` 输出就会明白 map 也是跳空的，原因就在于源码中的 `k in O`，这里是检查 O 及其原型链是否包含属性 k，所以有的实现中用 `hasOwnProperty` 也是不正确的。

另外 `callbackfn` 中不可以使用 break 跳出循环，是因为 break 只能跳出循环，而 `callbackfn` 并不是循环体。如果有类似的需求可以使用`for..of`、`for..in`、 `some`、`every` 等。

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

熟悉源码之后很多问题就迎刃而解啦，感谢阅读。

## 参考

- TC39 Array.prototype.map
- TC39 Array.prototype.filter
- TC39 Array.prototype.reduce
- MDN Array.prototype.map
- MDN Array.prototype.filter
- MDN Array.prototype.reduce

### References

`[1]` 【进阶 6-1 期】: *https://www.muyiy.cn/blog/6/6.1.html*
`[2]` 【进阶 3-3 期】: *https://muyiy.cn/blog/3/3.3.html*
`[3]` 博客: *https://muyiy.cn/blog/*
`[4]` TC39 Array.prototype.map: *https://tc39.es/ecma262/#sec-array.prototype.map*
`[5]` TC39 Array.prototype.filter: *https://tc39.es/ecma262/#sec-array.prototype.filter*
`[6]` TC39 Array.prototype.reduce: *https://tc39.es/ecma262/#sec-array.prototype.reduce*
`[7]` MDN Array.prototype.map: *https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map*
`[8]` MDN Array.prototype.filter: *https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter*
`[9]` MDN Array.prototype.reduce: *https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce*