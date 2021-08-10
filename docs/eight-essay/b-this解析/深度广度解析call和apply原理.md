## 深度广度解析 call 和 apply 原理、使用场景及实现

> [https://mp.weixin.qq.com/s/6Iw8wUf3fzh9PislaVVVaQ](https://mp.weixin.qq.com/s/6Iw8wUf3fzh9PislaVVVaQ)

[【进阶3-1期】JavaScript 深入之史上最全--5 种 this 绑定全面解析](https://mp.weixin.qq.com/s?__biz=MzU3NjczNDk2MA==&mid=2247483817&idx=1&sn=f7ca086e10835e822e610de54849691b&scene=21#wechat_redirect)

本篇文章重点介绍 `call` 和 `apply` 原理、使用场景及实现。

#### call() 和 apply()

> call() 方法调用一个函数, 其具有一个指定的 `this` 值和分别地提供的参数(**参数的列表**)。

`call()` 和 `apply()`的区别在于，`call()`方法接受的是**若干个参数的列表**，而`apply()`方法接受的是**一个包含多个参数的数组**

举个例子：

```js
var func = function(arg1, arg2) {
     ...
};

func.call(this, arg1, arg2); // 使用 call，参数列表
func.apply(this, [arg1, arg2]) // 使用 apply，参数数组
```

#### 常用用法

下面列举一些常用用法：

##### 1、合并两个数组

```js
var vegetables = ['parsnip', 'potato'];
var moreVegs = ['celery', 'beetroot'];

// 将第二个数组融合进第一个数组
// 相当于 vegetables.push('celery', 'beetroot');
Array.prototype.push.apply(vegetables, moreVegs);
// 4

vegetables;
// ['parsnip', 'potato', 'celery', 'beetroot']
```

当第二个数组(如示例中的 `moreVegs` )太大时不要使用这个方法来合并数组，因为**一个函数能够接受的参数个数是有限制**的。不同的引擎有不同的限制，JS核心限制在 65535，有些引擎会抛出异常，有些不抛出异常但丢失多余参数。

如何解决呢？方法就是**将参数数组切块后循环传入目标方法**

```js
function concatOfArray(arr1, arr2) {
    var QUANTUM = 32768;
    for (var i = 0, len = arr2.length; i < len; i += QUANTUM) {
        Array.prototype.push.apply(
            arr1, 
            arr2.slice(i, Math.min(i + QUANTUM, len) )
        );
    }
    return arr1;
}

// 验证代码
var arr1 = [-3, -2, -1];
var arr2 = [];
for(var i = 0; i < 1000000; i++) {
    arr2.push(i);
}

Array.prototype.push.apply(arr1, arr2);
// Uncaught RangeError: Maximum call stack size exceeded

concatOfArray(arr1, arr2);
// (1000003) [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...]
```

##### 2、获取数组中的最大值和最小值

```js
var numbers = [5, 458 , 120 , -215 ]; 
Math.max.apply(Math, numbers);   //458    
Math.max.call(Math, 5, 458 , 120 , -215); //458

// ES6
Math.max.call(Math, ...numbers); // 458
```

为什么要这么用呢，因为数组 `numbers` 本身没有 `max`方法，但是 `Math`有呀，所以这里就是借助 `call / apply`  使用 `Math.max` 方法。

##### 3、验证是否是数组

```js
function isArray(obj){ 
    return Object.prototype.toString.call(obj) === '[object Array]';
}
isArray([1, 2, 3]);
// true

// 直接使用 toString()
[1, 2, 3].toString();     // "1,2,3"
"123".toString();         // "123"
123.toString();         // SyntaxError: Invalid or unexpected token
Number(123).toString(); // "123"
Object(123).toString(); // "123"
```

可以通过`toString()` 来获取每个对象的类型，但是不同对象的 `toString()`有不同的实现，所以通过 `Object.prototype.toString()` 来检测，需要以 `call() / apply()` 的形式来调用，传递要检查的对象作为第一个参数。

另一个**验证是否是数组**的方法

```js
var toStr = Function.prototype.call.bind(Object.prototype.toString);
function isArray(obj){ 
    return toStr(obj) === '[object Array]';
}
isArray([1, 2, 3]);
// true

// 使用改造后的 toStr
toStr([1, 2, 3]);     // "[object Array]"
toStr("123");         // "[object String]"
toStr(123);         // "[object Number]"
toStr(Object(123)); // "[object Number]"
```

上面方法首先使用 `Function.prototype.call`函数指定一个 `this` 值，然后 `.bind` 返回一个新的函数，始终将 `Object.prototype.toString` 设置为传入参数。其实等价于 `Object.prototype.toString.call()` 。

这里有一个**前提**是`toString()`方法**没有被覆盖**

```js
Object.prototype.toString = function() {
    return '';
}
isArray([1, 2, 3]);
// false
```

##### 4、类数组对象（Array-like Object）使用数组方法

```js
var domNodes = document.getElementsByTagName("*");
domNodes.unshift("h1");
// TypeError: domNodes.unshift is not a function

var domNodeArrays = Array.prototype.slice.call(domNodes);
domNodeArrays.unshift("h1"); // 505 不同环境下数据不同
// (505) ["h1", html.gr__hujiang_com, head, meta, ...] 
```

类数组对象有下面两个特性

- 1、具有：指向对象元素的数字索引下标和 `length` 属性
- 2、不具有：比如 `push` 、`shift`、 `forEach` 以及 `indexOf`等数组对象具有的方法

要说明的是，类数组对象是一个**对象**。JS中存在一种名为**类数组**的对象结构，比如 `arguments`对象，还有DOM API 返回的 `NodeList` 对象都属于类数组对象，类数组对象不能使用 `push/pop/shift/unshift` 等数组方法，通过 `Array.prototype.slice.call` 转换成真正的数组，就可以使用 `Array`下所有方法。

**类数组对象转数组**的其他方法：

```js
// 上面代码等同于
var arr = [].slice.call(arguments)；

ES6:
let arr = Array.from(arguments);
let arr = [...arguments];
```

`Array.from()` 可以将两类对象转为真正的数组：**类数组**对象和**可遍历**（iterable）对象（包括ES6新增的数据结构 Set 和 Map）。

**PS扩展一**：为什么通过 `Array.prototype.slice.call()` 就可以把类数组对象转换成数组？

其实很简单，`slice` 将 `Array-like` 对象通过下标操作放进了新的 `Array` 里面。

下面代码是 MDN 关于 `slice` 的Polyfill，链接 Array.prototype.slice()

```js
Array.prototype.slice = function(begin, end) {
      end = (typeof end !== 'undefined') ? end : this.length;

      // For array like object we handle it ourselves.
      var i, cloned = [],
        size, len = this.length;

      // Handle negative value for "begin"
      var start = begin || 0;
      start = (start >= 0) ? start : Math.max(0, len + start);

      // Handle negative value for "end"
      var upTo = (typeof end == 'number') ? Math.min(end, len) : len;
      if (end < 0) {
        upTo = len + end;
      }

      // Actual expected size of the slice
      size = upTo - start;

      if (size > 0) {
        cloned = new Array(size);
        if (this.charAt) {
          for (i = 0; i < size; i++) {
            cloned[i] = this.charAt(start + i);
          }
        } else {
          for (i = 0; i < size; i++) {
            cloned[i] = this[start + i];
          }
        }
      }

      return cloned;
    };
  }
```

**PS扩展二**：通过 `Array.prototype.slice.call()` 就足够了吗？存在什么问题？

在**低版本IE下不支持**通过`Array.prototype.slice.call(args)`将类数组对象转换成数组，因为低版本IE（IE < 9）下的`DOM`对象是以 `com` 对象的形式实现的，js对象与 `com` 对象不能进行转换。

兼容写法如下：

```js
function toArray(nodes){
    try {
        // works in every browser except IE
        return Array.prototype.slice.call(nodes);
    } catch(err) {
        // Fails in IE < 9
        var arr = [],
            length = nodes.length;
        for(var i = 0; i < length; i++){
            // arr.push(nodes[i]); // 两种都可以
            arr[i] = nodes[i];
        }
        return arr;
    }
}
```

**PS 扩展**三：为什么要有类数组对象呢？或者说类数组对象是为什么解决什么问题才出现的？

> JavaScript类型化数组是一种类似数组的**对象**，并提供了一种用于访问原始二进制数据的机制。 `Array`存储的对象能动态增多和减少，并且可以存储任何JavaScript值。JavaScript引擎会做一些内部优化，以便对数组的操作可以很快。然而，随着Web应用程序变得越来越强大，尤其一些新增加的功能例如：音频视频编辑，访问WebSockets的原始数据等，很明显有些时候如果使用JavaScript代码可以快速方便地通过类型化数组来操作原始的二进制数据，这将会非常有帮助。

一句话就是，可以更快的操作复杂数据。

##### 5、调用父构造函数实现继承

```js
function  SuperType(){
    this.color=["red", "green", "blue"];
}
function  SubType(){
    // 核心代码，继承自SuperType
    SuperType.call(this);
}

var instance1 = new SubType();
instance1.color.push("black");
console.log(instance1.color);
// ["red", "green", "blue", "black"]

var instance2 = new SubType();
console.log(instance2.color);
// ["red", "green", "blue"]
```

在子构造函数中，通过调用父构造函数的`call`方法来实现继承，于是`SubType`的每个实例都会将`SuperType` 中的属性复制一份。

缺点：

- 只能继承父类的**实例**属性和方法，不能继承原型属性/方法
- 无法实现复用，每个子类都有父类实例函数的副本，影响性能

更多继承方案查看我之前的文章。JavaScript常用八种继承方案

#### call的模拟实现

> 以下内容参考自 JavaScript深入之call和apply的模拟实现

先看下面一个简单的例子

```js
var value = 1;
var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

bar.call(foo); // 1
```

通过上面的介绍我们知道，`call()`主要有以下两点

- 1、`call()`改变了this的指向
- 2、函数 `bar` 执行了

##### 模拟实现第一步

如果在调用`call()`的时候把函数 `bar()`添加到`foo()`对象中，即如下

```js
var foo = {
    value: 1,
    bar: function() {
        console.log(this.value);
    }
};

foo.bar(); // 1
```

这个改动就可以实现：改变了this的指向并且执行了函数`bar`。

但是这样写是有副作用的，即给`foo`额外添加了一个属性，怎么解决呢？

解决方法很简单，用 `delete` 删掉就好了。

所以只要实现下面3步就可以模拟实现了。

- 1、将函数设置为对象的属性：`foo.fn = bar`
- 2、执行函数：`foo.fn()`
- 3、删除函数：`delete foo.fn`

代码实现如下：

```js
// 第一版
Function.prototype.call2 = function(context) {
    // 首先要获取调用call的函数，用this可以获取
    context.fn = this;         // foo.fn = bar
    context.fn();            // foo.fn()
    delete context.fn;        // delete foo.fn
}

// 测试一下
var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

bar.call2(foo); // 1
```

完美！

##### 模拟实现第二步

第一版有一个问题，那就是函数 `bar` 不能接收参数，所以我们可以从 `arguments`中获取参数，取出第二个到最后一个参数放到数组中，为什么要抛弃第一个参数呢，因为第一个参数是 `this`。

类数组对象转成数组的方法上面已经介绍过了，但是这边使用ES3的方案来做。

```js
var args = [];
for(var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']');
}
```

参数数组搞定了，接下来要做的就是执行函数 `context.fn()`。

```js
context.fn( args ); // 这样不行
```

上面直接调用肯定不行，`args` 会自动调用 `args.toString()` 方法，说白了这就是一个字符串。

这边采用 `eval`方法来实现，拼成一个函数。

```js
eval('context.fn(' + args +')')
```

所以说第二个版本就实现了，代码如下：

```js
// 第二版
Function.prototype.call2 = function(context) {
    context.fn = this;
    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }
    eval('context.fn(' + args +')');
    delete context.fn;
}

// 测试一下
var foo = {
    value: 1
};

function bar(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value);
}

bar.call2(foo, 'kevin', 18); 
// kevin
// 18
// 1
```

完美！！

##### 模拟实现第三步

还有2个细节需要注意：

- 1、this 参数可以传 `null` 或者 `undefined`，此时 this 指向 window
- 2、函数是可以有返回值的

实现上面的两点很简单，代码如下

```js
// 第三版
Function.prototype.call2 = function (context) {
    var context = context || window; // 实现细节 1
    context.fn = this;

    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }

    var result = eval('context.fn(' + args +')');

    delete context.fn
    return result; // 实现细节 2
}

// 测试一下
var value = 2;

var obj = {
    value: 1
}

function bar(name, age) {
    console.log(this.value);
    return {
        value: this.value,
        name: name,
        age: age
    }
}

bar.call2(null); // 2

console.log(bar.call2(obj, 'kevin', 18));
// 1
// {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }
```

完美！！！

#### call和apply模拟实现汇总

##### call的模拟实现

ES3：

```js
Function.prototype.call = function (context) {
    var context = context || window;
    context.fn = this;

    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }
    var result = eval('context.fn(' + args +')');

    delete context.fn
    return result;
}
```

ES6：

```js
Function.prototype.call = function (context) {
  context = context || window;
  context.fn = this;

  let args = [...arguments].slice(1);
  let result = context.fn(...args);

  delete context.fn
  return result;
}
```

##### apply的模拟实现

ES3：

```js
Function.prototype.apply = function (context, arr) {
    var context = context || window;
    context.fn = this;

    var result;
    // 判断是否存在第二个参数
    if (!arr) {
        result = context.fn();
    } else {
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')');
    }

    delete context.fn
    return result;
}
```

ES6：

```js
Function.prototype.apply = function (context, arr) {
    context = context || window;
    context.fn = this;

    let result;
    if (!arr) {
        result = context.fn();
    } else {
        result = context.fn(...arr);
    }

    delete context.fn
    return result;
}
```

**PS**: 上期思考题留到下一期讲解，下一期介绍重点介绍 `bind` 原理及实现

#### 参考

> JavaScript深入之call和apply的模拟实现
>
> MDN之Array.prototype.push()
>
> MDN之Function.prototype.apply()
>
> MDN之Array.prototype.slice()
>
> MDN之Array.isArray()
>
> JavaScript常用八种继承方案
>
> 深入浅出 妙用Javascript中apply、call、bind

#### 往期文章查看

- [【进阶3-1期】JavaScript深入之史上最全--5种this绑定全面解析](https://mp.weixin.qq.com/s?__biz=MzU3NjczNDk2MA==&mid=2247483817&idx=1&sn=f7ca086e10835e822e610de54849691b&scene=21#wechat_redirect)
- [【进阶3-2期】JavaScript深入之重新认识箭头函数的this](https://mp.weixin.qq.com/s?__biz=MzU3NjczNDk2MA==&mid=2247483830&idx=1&sn=dba4f2b1870898f018e6bceaa4da6d12&scene=21#wechat_redirect)

#### 进阶系列目录

地址：https://github.com/yygmind/blog

- *√*【进阶1期】 调用堆栈

- *√*【进阶2期】 作用域闭包

- 【进阶3期】 this全面解析
- 【进阶4期】 深浅拷贝原理
- 【进阶5期】 原型Prototype
- 【进阶6期】 高阶函数
- 【进阶7期】 事件机制
- 【进阶8期】 Event Loop原理
- 【进阶9期】 Promise原理
- 【进阶10期】Async/Await原理
- 【进阶11期】防抖/节流原理
- 【进阶12期】模块化详解
- 【进阶13期】ES6重难点
- 【进阶14期】计算机网络概述
- 【进阶15期】浏览器渲染原理
- 【进阶16期】webpack配置
- 【进阶17期】webpack原理
- 【进阶18期】前端监控
- 【进阶19期】跨域和安全
- 【进阶20期】性能优化
- 【进阶21期】VirtualDom原理
- 【进阶22期】Diff算法
- 【进阶23期】MVVM双向绑定
- 【进阶24期】Vuex原理
- 【进阶25期】Redux原理
- 【进阶26期】路由原理
- 【进阶27期】VueRouter源码解析
- 【进阶28期】ReactRouter源码解析