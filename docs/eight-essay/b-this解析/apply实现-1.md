## apply/call/bind 自我实现

> [https://mp.weixin.qq.com/s/dTADi6_vwrpZ5IlgDK_4GQ](https://mp.weixin.qq.com/s/dTADi6_vwrpZ5IlgDK_4GQ)

面试题：“call/apply/bind源码实现”，事实上是对 JavaScript 基础知识的一个综合考核。

相关知识点：

1. 作用域；
2. this 指向；
3. 函数柯里化；
4. 原型与原型链；

### call/apply/bind 的区别

1. 三者都可用于显示绑定 `this`;

2. `call/apply` 的区别方式在于参数传递方式的不同；

3. - `fn.call(obj, arg1, arg2, ...)`， 传参数列表，以逗号隔开；
   - `fn.apply(obj, [arg1, arg2, ...])`， 传参数数组；

4. `bind` 返回的是一个待执行函数，是函数柯里化的应用，而 `call/apply` 则是立即执行函数

### 思路初探

```
Function.prototype.myCall = function(context) {
    // 原型中 this 指向的是实例对象，所以这里指向 [Function: bar]
    console.log(this);  // [Function: bar]
    // 在传入的上下文对象中，创建一个属性，值指向方法 bar
    context.fn = this;  // foo.fn = [Function: bar]
    // 调用这个方法，此时调用者是 foo，this 指向 foo
    context.fn();
    // 执行后删除它，仅使用一次，避免该属性被其它地方使用（遍历）
    delete context.fn;
};

let foo = {
    value: 2
};

function bar() {
    console.log(this.value);
}
// bar 函数的声明等同于：var bar = new Function("console.log(this.value)");

bar.call(foo);   // 2;
```

### call 的源码实现

初步思路有个大概，剩下的就是完善代码。

```
// ES6 版本
Function.prototype.myCall = function(context, ...params) {
  // ES6 函数 Rest 参数，使其可指定一个对象，接收函数的剩余参数，合成数组
  if (typeof context === 'object') {
    context = context || window;
  } else {
    context = Object.create(null);
  }

  // 用 Symbol 来作属性 key 值，保持唯一性，避免冲突
  let fn = Symbol();
  context[fn] = this;
  // 将参数数组展开，作为多个参数传入
  const result = context[fn](...params);
  // 删除避免永久存在
  delete(context[fn]);
  // 函数可以有返回值
  return result;
}

// 测试
var mine = {
    name: '以乐之名'
}

var person = {
  name: '无名氏',
  sayHi: function(msg) {
    console.log('我的名字：' + this.name + '，', msg);
  }
}

person.sayHi.myCall(mine, '很高兴认识你！');
// 我的名字：以乐之名，很高兴认识你！
```

*知识点补充：*

1. ES6 新的原始数据类型 `Symbol`，表示独一无二的值;
2. `Object.create(null)` 创建一个空对象

```
// 创建一个空对象的方式

// eg.A
let emptyObj = {};

// eg.B
let emptyObj = new Object();

// eg.C
let emptyObj = Object.create(null);
```

使用 `Object.create(null)` 创建的空对象，不会受到原型链的干扰。原型链终端指向 `null`，不会有构造函数，也不会有 `toString`、 `hasOwnProperty`、`valueOf` 等属性，这些属性来自 `Object.prototype`。有原型链基础的伙伴们，应该都知道，所有普通对象的原型链都会指向 `Object.prototype`。

所以 `Object.create(null)` 创建的空对象比其它两种方式，更干净，不会有 `Object` 原型链上的属性。

ES5 版本：

1. 自行处理参数；
2. 自实现 `Symobo`

```
// ES5 版本

// 模拟Symbol
function getSymbol(obj) {
  var uniqAttr = '00' + Math.random();
  if (obj.hasOwnProperty(uniqAttr)) {
    // 如果已存在，则递归自调用函数
    arguments.callee(obj);
  } else {
    return uniqAttr;
  }
}

Function.prototype.myCall = function() {
  var args = arguments;
  if (!args.length) return;

  var context = [].shift.apply(args);
  context = context || window;

  var fn = getSymbol(context);
  context[fn] = this;

  // 无其它参数传入
  if (!arguments.length) {
    return context[fn];
  }

  var param = args[i];
  // 类型判断，不然 eval 运行会出错
  var paramType = typeof param;
  switch(paramType) {
    case 'string':
      param = '"' + param + '"'
    break;
    case 'object':
      param = JSON.stringify(param);
    break;
  }

  fnStr += i == args.length - 1 ? param : param + ',';

  // 借助 eval 执行
  var result = eval(fnStr);
  delete context[fn];
  return result;
}

// 测试
var mine = {
    name: '以乐之名'
}

var person = {
  name: '无名氏',
  sayHi: function(msg) {
    console.log('我的名字：' + this.name + '，', msg);
  }
}

person.sayHi.myCall(mine, '很高兴认识你！');
// 我的名字：以乐之名，很高兴认识！
```

### apply 的源码实现

`call` 的源码实现，那么 `apply` 就简单，两者只是传递参数方式不同而已。

```
Function.prototype.myApply = function(context, params) {
    // apply 与 call 的区别，第二个参数是数组，且不会有第三个参数
    if (typeof context === 'object') {
        context = context || window;
    } else {
        context = Object.create(null);
    }

    let fn = Symbol();
    context[fn] = this;
    const result context[fn](...params);
    delete context[fn];
    return result;
}
```

### bind 的源码实现

1. `bind` 与 `call/apply` 的区别就是返回的是一个待执行的函数，而不是函数的执行结果;
2. `bind` 返回的函数作为构造函数与 `new` 一起使用，绑定的 `this` 需要被忽略;

> 调用绑定函数时作为this参数传递给目标函数的值。如果使用new运算符构造绑定函数，则忽略该值。—— MDN

```
Function.prototype.bind = function(context, ...initArgs) {
    // bind 调用的方法一定要是一个函数
    if (typeof this !== 'function') {
      throw new TypeError('not a function');
    }
    let self = this;
    let F = function() {};
    F.prototype = this.prototype;
    let bound = function(...finnalyArgs) {
      // 将前后参数合并传入
      return self.call(this instanceof F ? this : context || this, ...initArgs, ...finnalyArgs);
    }
    bound.prototype = new F();
    return bound;
}
```

不少伙伴还会遇到这样的追问，不使用 `call/apply`，如何实现 `bind` ？

骚年先别慌，不用 `call/apply`，不就是相当于把 `call/apply` 换成对应的自我实现方法，算是偷懒取个巧吧。

本篇 `call/apply/bind` 源码实现，算是对之前文章系列知识点的一次加深巩固。

“心中有码，前路莫慌。”

参考文档：

- MDN - Function.prototype.bind()
- 不用call和apply方法模拟实现ES5的bind方法