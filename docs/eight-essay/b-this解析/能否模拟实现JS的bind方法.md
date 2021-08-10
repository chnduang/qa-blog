## 能否模拟实现JS的bind方法（高频考点）

> [https://mp.weixin.qq.com/s/Sas7eltchfa9GaVQIMzSxA](https://mp.weixin.qq.com/s/Sas7eltchfa9GaVQIMzSxA)

## 前言

> 这是面试官问系列的第二篇，旨在帮助读者提升`JS`基础知识，包含`new、call、apply、this、继承`相关知识。
> `面试官问系列`文章如下：感兴趣的读者可以点击阅读。
> 1.[面试官问：能否模拟实现JS的new操作符](https://mp.weixin.qq.com/s?__biz=MzA5MjQwMzQyNw==&mid=2650747275&idx=1&sn=bb679c3534bad87d5f9650e313fcf43e&chksm=88663207bf11bb11a61ab43b345dafa881d1f5f9aab919b5646764dab6ec597ce44be4b13389&token=769761577&lang=zh_CN&scene=21#wechat_redirect)
> 2.面试官问：能否模拟实现JS的bind方法（本文）
> 3.[面试官问：能否模拟实现JS的call和apply方法](https://mp.weixin.qq.com/s?__biz=MzA5MjQwMzQyNw==&mid=2650744687&idx=1&sn=ea517155eddbed9511cf6b5e2b9f24ca&chksm=886624e3bf11adf540a6cb1e0f51077b0938757f389e1de666fc953635af167d9de9ea0278ff&token=2051144447&lang=zh_CN&scene=21#wechat_redirect)
> 4.[面试官问：JS的this指向](https://mp.weixin.qq.com/s?__biz=MzA5MjQwMzQyNw==&mid=2650744695&idx=1&sn=63c761b9129c3c55ad7a2c21ddb4d82b&chksm=886624fbbf11aded9c57e7846c98961848cee7871f5e10bac3bdb949e9135fbc2095ae677102&token=1471663946&lang=zh_CN&scene=21#wechat_redirect)
> 5.[面试官问：JS的继承](http://mp.weixin.qq.com/s?__biz=MzA5MjQwMzQyNw==&mid=2650744527&idx=1&sn=3db8bffc690b1b6abd0c38ccaa0f37d3&chksm=88662543bf11ac554181d36d618bcc5d058e555265a6963bc0e8a02ebe3cceee0ec61cee1383&scene=21#wechat_redirect)

用过`React`的同学都知道，经常会使用`bind`来绑定`this`。

```
import React, { Component } from 'react';
class TodoItem extends Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(){
        console.log('handleClick');
    }
    render(){
        return  (
            <div onClick={this.handleClick}>点击</div>
        );
    };
}
export default TodoItem;
```

**那么面试官可能会问是否想过`bind`到底做了什么，怎么模拟实现呢。**

> 附上之前写文章写过的一段话：已经有很多模拟实现`bind`的文章，为什么自己还要写一遍呢。学习就好比是座大山，人们沿着不同的路登山，分享着自己看到的风景。你不一定能看到别人看到的风景，体会到别人的心情。只有自己去登山，才能看到不一样的风景，体会才更加深刻。

先看一下`bind`是什么。从上面的`React`代码中，可以看出`bind`执行后是函数，并且每个函数都可以执行调用它。眼见为实，耳听为虚。读者可以在控制台一步步点开**例子1**中的`obj`:

```
var obj = {};
console.log(obj);
console.log(typeof Function.prototype.bind); // function
console.log(typeof Function.prototype.bind());  // function
console.log(Function.prototype.bind.name);  // bind
console.log(Function.prototype.bind().name);  // bound
```

![图片](https://mmbiz.qpic.cn/mmbiz_png/Mpt86EGjlpsvT5hPrdvtpxo2ZKOm1kNDLLLkN0Esdw7FD4iaVbtWKjpGnqK9usznCicW7SaLV5nRWWQGgMCENVew/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)`Function.prototype.bind`

### 因此可以得出结论1：

1、`bind`是`Functoin`原型链中`Function.prototype`的一个属性，每个函数都可以调用它。
2、`bind`本身是一个函数名为`bind`的函数，返回值也是函数，函数名是`bound`。（打出来就是`bound加上一个空格`）。知道了`bind`是函数，就可以传参，而且返回值`'bound '`也是函数，也可以传参，就很容易写出**例子2**：
后文统一 `bound` 指原函数`original` `bind`之后返回的函数，便于说明。

```
var obj = {
    name: '若川',
};
function original(a, b){
    console.log(this.name);
    console.log([a, b]);
    return false;
}
var bound = original.bind(obj, 1);
var boundResult = bound(2); // '若川', [1, 2]
console.log(boundResult); // false
console.log(original.bind.name); // 'bind'
console.log(original.bind.length); // 1
console.log(original.bind().length); // 2 返回original函数的形参个数
console.log(bound.name); // 'bound original'
console.log((function(){}).bind().name); // 'bound '
console.log((function(){}).bind().length); // 0
```

### 由此可以得出结论2：

1、调用`bind`的函数中的`this`指向`bind()`函数的第一个参数。

2、传给`bind()`的其他参数接收处理了，`bind()`之后返回的函数的参数也接收处理了，也就是说合并处理了。

3、并且`bind()`后的`name`为`bound + 空格 + 调用bind的函数名`。如果是匿名函数则是`bound + 空格`。

4、`bind`后的返回值函数，执行后返回值是原函数（`original`）的返回值。

5、`bind`函数形参（即函数的`length`）是`1`。`bind`后返回的`bound`函数形参不定，根据绑定的函数原函数（`original`）形参个数确定。

根据结论2：我们就可以简单模拟实现一个简版`bindFn`

```
// 第一版 修改this指向，合并参数
Function.prototype.bindFn = function bind(thisArg){
    if(typeof this !== 'function'){
        throw new TypeError(this + 'must be a function');
    }
    // 存储函数本身
    var self = this;
    // 去除thisArg的其他参数 转成数组
    var args = [].slice.call(arguments, 1);
    var bound = function(){
        // bind返回的函数 的参数转成数组
        var boundArgs = [].slice.call(arguments);
        // apply修改this指向，把两个函数的参数合并传给self函数，并执行self函数，返回执行结果
        return self.apply(thisArg, args.concat(boundArgs));
    }
    return bound;
}
// 测试
var obj = {
    name: '若川',
};
function original(a, b){
    console.log(this.name);
    console.log([a, b]);
}
var bound = original.bindFn(obj, 1);
bound(2); // '若川', [1, 2]
```

如果面试官看到你答到这里，估计对你的印象60、70分应该是会有的。但我们知道函数是可以用`new`来实例化的。那么`bind()`返回值函数会是什么表现呢。
接下来看**例子3**：

```
var obj = {
    name: '若川',
};
function original(a, b){
    console.log('this', this); // original {}
    console.log('typeof this', typeof this); // object
    this.name = b;
    console.log('name', this.name); // 2
    console.log('this', this);  // original {name: 2}
    console.log([a, b]); // 1, 2
}
var bound = original.bind(obj, 1);
var newBoundResult = new bound(2);
console.log(newBoundResult, 'newBoundResult'); // original {name: 2}
```

从**例子3**种可以看出`this`指向了`new bound()`生成的新对象。

### 可以分析得出结论3：

1、`bind`原先指向`obj`的失效了，其他参数有效。

2、`new bound`的返回值是以`original`原函数构造器生成的新对象。`original`原函数的`this`指向的就是这个新对象。另外前不久写过一篇文章：[面试官问：能否模拟实现JS的new操作符](https://mp.weixin.qq.com/s?__biz=MzA5MjQwMzQyNw==&mid=2650747275&idx=1&sn=bb679c3534bad87d5f9650e313fcf43e&chksm=88663207bf11bb11a61ab43b345dafa881d1f5f9aab919b5646764dab6ec597ce44be4b13389&token=769761577&lang=zh_CN&scene=21#wechat_redirect)。简单摘要：**new做了什么：**

> 1.创建了一个全新的对象。
> 2.这个对象会被执行`[[Prototype]]`（也就是`__proto__`）链接。
> 3.生成的新对象会绑定到函数调用的this。
> 4.通过`new`创建的每个对象将最终被`[[Prototype]]`链接到这个函数的`prototype`对象上。
> 5.如果函数没有返回对象类型`Object`(包含`Functoin`, `Array`, `Date`, `RegExg`, `Error`)，那么`new`表达式中的函数调用会自动返回这个新的对象。

所以相当于`new`调用时，`bind`的返回值函数`bound`内部要模拟实现`new`实现的操作。话不多说，直接上代码。

```
// 第三版 实现new调用
Function.prototype.bindFn = function bind(thisArg){
    if(typeof this !== 'function'){
        throw new TypeError(this + ' must be a function');
    }
    // 存储调用bind的函数本身
    var self = this;
    // 去除thisArg的其他参数 转成数组
    var args = [].slice.call(arguments, 1);
    var bound = function(){
        // bind返回的函数 的参数转成数组
        var boundArgs = [].slice.call(arguments);
        var finalArgs = args.concat(boundArgs);
        // new 调用时，其实this instanceof bound判断也不是很准确。es6 new.target就是解决这一问题的。
        if(this instanceof bound){
            // 这里是实现上文描述的 new 的第 1, 2, 4 步
            // 1.创建一个全新的对象
            // 2.并且执行[[Prototype]]链接
            // 4.通过`new`创建的每个对象将最终被`[[Prototype]]`链接到这个函数的`prototype`对象上。
            // self可能是ES6的箭头函数，没有prototype，所以就没必要再指向做prototype操作。
            if(self.prototype){
                // ES5 提供的方案 Object.create()
                // bound.prototype = Object.create(self.prototype);
                // 但 既然是模拟ES5的bind，那浏览器也基本没有实现Object.create()
                // 所以采用 MDN ployfill方案 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create
                function Empty(){}
                Empty.prototype = self.prototype;
                bound.prototype = new Empty();
            }
            // 这里是实现上文描述的 new 的第 3 步
            // 3.生成的新对象会绑定到函数调用的`this`。
            var result = self.apply(this, finalArgs);
            // 这里是实现上文描述的 new 的第 5 步
            // 5.如果函数没有返回对象类型`Object`(包含`Functoin`, `Array`, `Date`, `RegExg`, `Error`)，
            // 那么`new`表达式中的函数调用会自动返回这个新的对象。
            var isObject = typeof result === 'object' && result !== null;
            var isFunction = typeof result === 'function';
            if(isObject || isFunction){
                return result;
            }
            return this;
        }
        else{
            // apply修改this指向，把两个函数的参数合并传给self函数，并执行self函数，返回执行结果
            return self.apply(thisArg, finalArgs);
        }
    };
    return bound;
}
```

面试官看到这样的实现代码，基本就是满分了，心里独白：这小伙子/小姑娘不错啊。不过可能还会问`this instanceof bound`不准确问题。上文注释中提到`this instanceof bound`也不是很准确，`ES6 new.target`很好的解决这一问题，我们举个**例子4**:

### `instanceof` 不准确，`ES6 new.target`很好的解决这一问题

```
function Student(name){
    if(this instanceof Student){
        this.name = name;
        console.log('name', name);
    }
    else{
        throw new Error('必须通过new关键字来调用Student。');
    }
}
var student = new Student('若');
var notAStudent = Student.call(student, '川'); // 不抛出错误，且执行了。
console.log(student, 'student', notAStudent, 'notAStudent');

function Student2(name){
    if(typeof new.target !== 'undefined'){
        this.name = name;
        console.log('name', name);
    }
    else{
        throw new Error('必须通过new关键字来调用Student2。');
    }
}
var student2 = new Student2('若');
var notAStudent2 = Student2.call(student2, '川');
console.log(student2, 'student2', notAStudent2, 'notAStudent2'); // 抛出错误
```

细心的同学可能会发现了这版本的代码没有实现`bind`后的`bound`函数的`name`MDN Function.name和`length`MDN Function.length。面试官可能也发现了这一点继续追问，如何实现，或者问是否看过`es5-shim`的源码实现`L201-L335`。如果不限`ES`版本。其实可以用`ES5`的`Object.defineProperties`来实现。

```
Object.defineProperties(bound, {
    'length': {
        value: self.length,
    },
    'name': {
        value: 'bound ' + self.name,
    }
});
```

### `es5-shim`的源码实现`bind`

直接附上源码（有删减注释和部分修改等）

```
var $Array = Array;
var ArrayPrototype = $Array.prototype;
var $Object = Object;
var array_push = ArrayPrototype.push;
var array_slice = ArrayPrototype.slice;
var array_join = ArrayPrototype.join;
var array_concat = ArrayPrototype.concat;
var $Function = Function;
var FunctionPrototype = $Function.prototype;
var apply = FunctionPrototype.apply;
var max = Math.max;
// 简版 源码更复杂些。
var isCallable = function isCallable(value){
    if(typeof value !== 'function'){
        return false;
    }
    return true;
};
var Empty = function Empty() {};
// 源码是 defineProperties
// 源码是bind笔者改成bindFn便于测试
FunctionPrototype.bindFn = function bind(that) {
    var target = this;
    if (!isCallable(target)) {
        throw new TypeError('Function.prototype.bind called on incompatible ' + target);
    }
    var args = array_slice.call(arguments, 1);
    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = apply.call(
                target,
                this,
                array_concat.call(args, array_slice.call(arguments))
            );
            if ($Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return apply.call(
                target,
                that,
                array_concat.call(args, array_slice.call(arguments))
            );
        }
    };
    var boundLength = max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        array_push.call(boundArgs, '$' + i);
    }
    // 这里是Function构造方式生成形参length $1, $2, $3...
    bound = $Function('binder', 'return function (' + array_join.call(boundArgs, ',') + '){ return binder.apply(this, arguments); }')(binder);

    if (target.prototype) {
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }
    return bound;
};
```

你说出`es5-shim`源码`bind`实现，感慨这代码真是高效、严谨。面试官心里独白可能是：你就是我要找的人，薪酬福利你可以和`HR`去谈下。

## 最后总结一下

1、`bind`是`Function`原型链中的`Function.prototype`的一个属性，它是一个函数，修改`this`指向，合并参数传递给原函数，返回值是一个新的函数。
2、`bind`返回的函数可以通过`new`调用，这时提供的`this`的参数被忽略，指向了`new`生成的全新对象。内部模拟实现了`new`操作符。
3、`es5-shim`源码模拟实现`bind`时用`Function`实现了`length`。
事实上，平时其实很少需要使用自己实现的投入到生成环境中。但面试官通过这个面试题能考察很多知识。比如`this`指向，原型链，闭包，函数等知识，可以扩展很多。
读者发现有不妥或可改善之处，欢迎指出。另外觉得写得不错，可以点个赞，也是对笔者的一种支持。

文章中的例子和测试代码放在`github`中bind模拟实现 github。bind模拟实现 预览地址 `F12`看控制台输出，结合`source`面板查看效果更佳。

```
// 最终版 删除注释 详细注释版请看上文
Function.prototype.bind = Function.prototype.bind || function bind(thisArg){
    if(typeof this !== 'function'){
        throw new TypeError(this + ' must be a function');
    }
    var self = this;
    var args = [].slice.call(arguments, 1);
    var bound = function(){
        var boundArgs = [].slice.call(arguments);
        var finalArgs = args.concat(boundArgs);
        if(this instanceof bound){
            if(self.prototype){
                function Empty(){}
                Empty.prototype = self.prototype;
                bound.prototype = new Empty();
            }
            var result = self.apply(this, finalArgs);
            var isObject = typeof result === 'object' && result !== null;
            var isFunction = typeof result === 'function';
            if(isObject || isFunction){
                return result;
            }
            return this;
        }
        else{
            return self.apply(thisArg, finalArgs);
        }
    };
    return bound;
}
```

## 推荐阅读

[我在阿里招前端，我该怎么帮你？（现在还可以加模拟面试群）](https://mp.weixin.qq.com/s?__biz=MzA5MjQwMzQyNw==&mid=2650745461&idx=1&sn=eee04a825483aa9187b4e5f52b20b2fe&chksm=886629f9bf11a0ef421eed7d42fe76a0b2431746116a60e76cb919d985fd78e847fb7669832e&token=678682054&lang=zh_CN&scene=21#wechat_redirect)
[如何拿下阿里巴巴 P6 的前端 Offer](https://mp.weixin.qq.com/s?__biz=MzA5MjQwMzQyNw==&mid=2650745366&idx=1&sn=247eab2756abbf2dfecb43398c64c71a&chksm=8866299abf11a08ca4a2836ef3dd4cc46ba58b4da9adbb036545e7b291696a2cf7dc72a46e62&token=1789278776&lang=zh_CN&scene=21#wechat_redirect)
[如何准备阿里P6/P7前端面试--项目经历准备篇](https://mp.weixin.qq.com/s?__biz=MzA5MjQwMzQyNw==&mid=2650745128&idx=1&sn=ac84f8a38008e45e368c17a99a9338c2&chksm=88662aa4bf11a3b202c62ae0bfd131c40bd1afb0937b129ff8d8c0e028691a1b3b63b483803c&token=605825829&lang=zh_CN&scene=21#wechat_redirect)
[大厂面试官常问的亮点，该如何做出？](https://mp.weixin.qq.com/s?__biz=MzA5MjQwMzQyNw==&mid=2650744843&idx=1&sn=3f9d80765a4c543f90a8d804beb74b80&chksm=88662b87bf11a291e49cefafd70335a9fbbc284a11e95542a328d44d5da51b370b2838252216&token=605825829&lang=zh_CN&scene=21#wechat_redirect)
[如何从初级到专家(P4-P7)打破成长瓶颈和有效突破](https://mp.weixin.qq.com/s?__biz=MzA5MjQwMzQyNw==&mid=2650745439&idx=1&sn=21297c7333f3e8417472dc5358032a50&chksm=886629d3bf11a0c572a6c876c38c0f3c44dc3d93eb5d6f066129008e2d236f5401f13a78ccf9&token=678682054&lang=zh_CN&scene=21#wechat_redirect)
**[若川知乎问答：2年前端经验，做的项目没什么技术含量，怎么办？](https://mp.weixin.qq.com/s?__biz=MzA5MjQwMzQyNw==&mid=2650744727&idx=1&sn=c0709ea50ef9a91ae157cac7d3638cc0&chksm=8866241bbf11ad0d5f5f1bf1c5c93a46a2092b9fdc9eb399c31d001e03b13748fb1a22335afe&token=192125900&lang=zh_CN&scene=21#wechat_redirect)
****[若川知乎高赞：有哪些必看的 JS库？](http://mp.weixin.qq.com/s?__biz=MzA5MjQwMzQyNw==&mid=2650746362&idx=1&sn=afe3a26cdbde1d423aae4fa99355f369&chksm=88662e76bf11a760a7f0a8565b9e8d52f5e4f056dc2682f213eec6475127d71f6f1d203d6c3a&scene=21#wechat_redirect)**

## 末尾



**你好，我是**[若川，江湖人称菜如若川，历时一年只写了一个学习源码整体架构系列](http://mp.weixin.qq.com/s?__biz=MzA5MjQwMzQyNw==&mid=2650746939&idx=2&sn=8744a672d3e176b4c6a846fd623d533f&chksm=886633b7bf11baa11df53a388ae583e6f0db3f59c8fb5638426d4758279ffbdc12fe96b38958&scene=21#wechat_redirect)**~(点击蓝字了解我)**

1. 关注`若川视野`，回复"pdf" 领取优质前端书籍pdf，回复"1"，可加群长期交流学习
2. 我的博客地址：https://lxchuan12.gitee.io 欢迎收藏
3. 觉得文章不错，可以点个`在看`呀^_^另外欢迎`留言`交流～