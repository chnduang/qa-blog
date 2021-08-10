## 慎用JSON.stringify

## 前言

项目中遇到一个 bug，一个组件为了保留一份 JSON 对象，使用 JSON.stringify 将其转换成字符串，这样做当然是为了避免对象是引用类型造成数据源的污染。

但发现后面使用 JSON.parse 方法之后，发现数据有所变化。

代码简化：

```js
let obj = {  name: 'Gopal',  age: Infinity};
let originObj = JSON.stringify(obj)
console.log(originObj) // {"name":"Gopal","age":null}
```

可以看到，Infinity 变成了 null，从而导致了后面的 bug。其实项目中自己踩 JSON.stringify 的坑已经很多了，借此机会好好整理一下，也给大家一个参考

解决方法1：

简单粗暴，重新给 age 属性赋值

解决方法2：

```js
  function censor(key, value) {
    if (value === Infinity) {
      return 'Infinity';
    }
    return value;
  }
  var b = JSON.stringify(a, censor);
  var c = JSON.parse(b, function (key, value) {
    return value === 'Infinity' ? Infinity : value;
  });
```

这就有点绕了，当做参考吧，其实我自己是直接使用了第一种方法。不过这里可以看到 JSON.stringify 实际上还有第二个参数，那它有什么用呢？接下来我们揭开它的神秘面纱。

## JSON.stringify 基础语法

```js
JSON.stringify(value[, replacer [, space]])
```

### 概念

MDN 中文文档对它的解释如下：

> JSON.stringify() 方法将一个 JavaScript 值**（对象或者数组）**转换为一个 JSON 字符串，如果指定了 replacer 是一个函数，则可以选择性地替换值，或者如果指定了 replacer 是一个数组，则可选择性地仅包含数组指定的属性。

我个人觉得是有所不妥的，不妥之处在于“对象或者数组”，因为实际上对于普通的值，我们也可以使用 JSON.stringify，只是我们很少这么用罢了。不过这个问题不大，我们文中介绍的也都是针对对象或者数组。

```
JSON.stringify('foo');   // '"foo"'
```

英文版的解释就会合理很多

> The JSON.stringify() method converts a JavaScript object or value to a JSON string, optionally replacing values if a replacer function is specified or optionally including only the specified properties if a replacer array is specified.

简单来说，JSON.stringify() 就是将值转换为相应的 JSON 格式字符串。

### JSON.stringify 强大的第二个参数 replacer

这个参数是可选的，可以是一个函数，也可以是一个数组

当是一个函数的时候，则在序列化的过程中，被序列化的每个属性都会经过该函数的转换和处理，看如下代码：

```
let replacerFun = function (key, value) {  console.log(key, value)  if (key === 'name') {    return undefined  }  return value}
let myIntro = {  name: 'Gopal',  age: 25,  like: 'FE'}
console.log(JSON.stringify(myIntro, replacerFun))// {"age":25,"like":"FE"}
```

这里其实就是一个筛选的作用，利用的是 JSON.stringify 中对象属性值为 undefined 就会在序列化中被忽略的特性（后面我们会提到）

值得注意的是，在一开始 replacer 函数会被传入一个空字符串作为 key 值，代表着要被 stringify 的这个对象

上面 console.log(key, value) 输出的值如下：

```
 { name: 'Gopal', age: 25, like: 'FE' }name Gopalage 25like FE{"age":25,"like":"FE"}
```

可以看出，通过第二个参数，我们可以更加灵活的去操作和修改被序列化目标的值

当第二个参数为数组的时候，只有包含在这个数组中的属性名才会被序列化

```
JSON.stringify(myIntro, ['name']) // {"name":"Gopal"}
```

### 中看不中用的第三个参数

指定缩进用的空白字符串，更多时候就是指定一个数字，代表几个空格：

```
let myIntro = {  name: 'Gopal',  age: 25,  like: 'FE'}
console.log(JSON.stringify(myIntro))console.log(JSON.stringify(myIntro, null, 2))
// {"name":"Gopal","age":25,"like":"FE"}// {//   "name": "Gopal",//   "age": 25,//   "like": "FE"// }
```

## JSON.stringify 使用场景

### 判断对象/数组值是否相等

```
let a = [1,2,3],    b = [1,2,3];JSON.stringify(a) === JSON.stringify(b);// true
```

### localStorage/sessionStorage 存储对象

我们知道 localStorage/sessionStorage 只可以存储字符串，当我们想存储对象的时候，需要使用 JSON.stringify 转换成字符串，获取的时候再 JSON.parse

```
// 存function setLocalStorage(key,val) {    window.localStorage.setItem(key, JSON.stringify(val));};// 取function getLocalStorage(key) {    let val = JSON.parse(window.localStorage.getItem(key));    return val;};
```

### 实现对象深拷贝

```
let myIntro = {  name: 'Gopal',  age: 25,  like: 'FE'}
function deepClone() {  return JSON.parse(JSON.stringify(myIntro))}
let copyMe = deepClone(myIntro)copyMe.like = 'Fitness'console.log(myIntro, copyMe)
// { name: 'Gopal', age: 25, like: 'FE' } { name: 'Gopal', age: 25, like: 'Fitness' }
```

### 路由（浏览器地址）传参

因为浏览器传参只能通过字符串进行，所以也是需要用到 JSON.stringify

## JSON.stringify 使用注意事项

看了上面，是不是觉得 JSON.stringify 功能很强大，立马想在项目中尝试了呢？稍等稍等，先看完以下的注意事项再做决定吧，可能在某些场景下会触发一些难以发现的问题

### 转换属性值中有 toJSON 方法，慎用

转换值中如果有 toJSON 方法，该方法返回的值将会是最后的序列化结果

```
// toJSONlet toJsonMyIntro = {  name: "Gopal",  age: 25,  like: "FE",  toJSON: function () {    return "前端杂货铺";  },};
console.log(JSON.stringify(toJsonMyIntro)); // "前端杂货铺"
```

### 被转换值中有 undefined、任意的函数以及 symbol 值，慎用

分为两种情况

一种是数组对象，undefined、任意的函数以及 symbol 值会被转换成 null

```
JSON.stringify([undefined, Object, Symbol("")]);// '[null,null,null]'
```

一种是非数组对象，在序列化的过程中会被忽略

```
JSON.stringify({ x: undefined, y: Object, z: Symbol("") });// '{}'
```

对于这种情况，我们可以使用 JSON.stringify 的第二个参数，使其达到符合我们的预期



```
const testObj = { x: undefined, y: Object, z: Symbol("test") }
const resut = JSON.stringify(testObj, function (key, value) {  if (value === undefined) {    return 'undefined'  } else if (typeof value === "symbol" || typeof value === "function") {    return value.toString()  }  return value})
console.log(resut)// {"x":"undefined","y":"function Object() { [native code] }","z":"Symbol(test)"}
```

### 包含循环引用的对象，慎用

```
let objA = {  name: "Gopal",}
let objB = {  age: 25,}
objA.age = objBobjB.name = objAJSON.stringify(objA)
```

会报以下错误：

```
Uncaught TypeError: Converting circular structure to JSON    --> starting at object with constructor 'Object'    |     property 'age' -> object with constructor 'Object'    --- property 'name' closes the circle    at JSON.stringify (<anonymous>)    at <anonymous>:1:6
```

### 以 symbol 为属性键的属性，慎用

所有以 symbol 为属性键的属性都会被完全忽略掉，即便 replacer 参数中强制指定包含了它们。

```
JSON.stringify({ [Symbol.for("foo")]: "foo" }, [Symbol.for("foo")])// '{}'
JSON.stringify({ [Symbol.for("foo")]: "foo" }, function (k, v) {  if (typeof k === "symbol") {    return "a symbol";  }})// undefined
```

### 值为 NaN 和 Infinity，慎用

数组的值，或者非数组对象属性值为 NaN 和 Infinity 的，会被转换成 null

```
let me = {  name: "Gopal",  age: Infinity,  money: NaN,};let originObj = JSON.stringify(me);console.log(originObj); // {"name":"Gopal","age":null,"money":null}
JSON.stringify([NaN, Infinity])// [null,null]
```

### 具有不可枚举的属性值时，慎用

不可枚举的属性默认会被忽略：

```
let person = Object.create(null, {  name: { value: "Gopal", enumerable: false },  age: { value: "25", enumerable: true },})
console.log(JSON.stringify(person))// {"age":"25"}
```

## 总结

JSON.stringify 在实际应用中确实很方便的解决了我们很多问题，比如简单的深拷贝等。但是我们在使用时候，也需要知道它有哪些不足之处，在目标值如果是一些特殊值的情况下，可能序列化后的结果会不符合我们的预期，这个时候就需要慎用