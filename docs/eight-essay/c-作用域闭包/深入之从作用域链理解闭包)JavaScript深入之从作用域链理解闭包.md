# 深入之从作用域链理解闭包)JavaScript深入之从作用域链理解闭包

> [https://muyiy.cn/blog/2/2.2.html](https://muyiy.cn/blog/2/2.2.html)

红宝书(p178)上对于闭包的定义：**闭包是指有权访问另外一个函数作用域中的变量的函数**，

MDN 对闭包的定义为：**闭包是指那些能够访问自由变量的函数**。

其中**自由变量**，指在函数中使用的，但既不是函数参数`arguments`也不是函数的局部变量的变量，其实就是另外一个函数作用域中的变量。

使用上一篇文章的例子来说明下**自由变量**

```js
function getOuter(){
  var date = '1127';
  function getDate(str){
    console.log(str + date);  //访问外部的date
  }
  return getDate('今天是：'); //"今天是：1127"
}
getOuter();
```

其中`date`既不是参数`arguments`，也不是局部变量，所以`date`是自由变量。

总结起来就是下面两点：

- 1、是一个函数（比如，内部函数从父函数中返回）
- 2、能访问上级函数作用域中的变量（哪怕上级函数上下文已经销毁）

## [#](https://muyiy.cn/blog/2/2.2.html#分析)分析

首先来一个简单的例子

```js
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}

var foo = checkscope(); // foo指向函数f
foo();					// 调用函数f()
```

简要的执行过程如下：

1. 进入全局代码，创建全局执行上下文，全局执行上下文**压入执行上下文栈**

2. 全局执行**上下文初始化**

3. 执行 checkscope 函数，创建 checkscope 函数执行上下文，checkscope 执行上下文被压入执行上下文栈

4. checkscope 执行**上下文初始化**，创建变量对象、作用域链、this等

5. checkscope 函数执行完毕，checkscope 执行上下文从执行上下文栈中弹出

6. 执行 f 函数，创建 f 函数执行上下文，f 执行上下文被压入执行上下文栈

7. f 执行**上下文初始化**，创建变量对象、作用域链、this等

8. f 函数执行完毕，f 函数上下文从执行上下文栈中弹出

   ![img](http://resource.muyiy.cn/image/2019-07-24-060256.jpg)

那么**问题**来了， 函数f 执行的时候，checkscope 函数上下文已经被销毁了，那函数f是如何获取到scope变量的呢？

上文（[【进阶2-1期】深入浅出图解作用域链和闭包](https://mp.weixin.qq.com/s/qZ1fYcJQEpD3O9bXOAQx0Q)）介绍过，函数f 执行上下文维护了一个作用域链，会指向指向`checkscope`作用域，作用域链是一个数组，结构如下。

```js
fContext = {
    Scope: [AO, checkscopeContext.AO, globalContext.VO],
}
```

所以指向关系是当前作用域 --> `checkscope`作用域--> 全局作用域，即使 checkscopeContext 被销毁了，但是 JavaScript 依然会让 checkscopeContext.AO（活动对象） 活在内存中，f 函数依然可以通过 f 函数的作用域链找到它，这就是闭包实现的**关键**。

## [#](https://muyiy.cn/blog/2/2.2.html#概念)概念

上面介绍的是实践角度，其实闭包有很多种介绍，说法不一。

汤姆大叔翻译的关于闭包的文章中的定义，ECMAScript中，闭包指的是：

- 1、从理论角度：所有的函数。因为它们都在创建的时候就将上层上下文的数据保存起来了。哪怕是简单的全局变量也是如此，因为函数中访问全局变量就相当于是在访问自由变量，这个时候使用最外层的作用域。
- 2、从实践角度：以下函数才算是闭包：
  - 即使创建它的上下文已经销毁，它仍然存在（比如，内部函数从父函数中返回）
  - 在代码中引用了自由变量

## [#](https://muyiy.cn/blog/2/2.2.html#面试必刷题)面试必刷题

```js
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i);
  };
}

data[0]();
data[1]();
data[2]();
```

如果知道闭包的，答案就很明显了，都是3

循环结束后，全局执行上下文的VO是

```js
globalContext = {
    VO: {
        data: [...],
        i: 3
    }
}
```

执行 data[0] 函数的时候，data[0] 函数的作用域链为：

```js
data[0]Context = {
    Scope: [AO, globalContext.VO]
}
```

由于其自身没有i变量，就会向上查找，所有从全局上下文查找到i为3，data[1] 和 data[2] 是一样的。

### [#](https://muyiy.cn/blog/2/2.2.html#解决办法)解决办法

改成闭包，方法就是`data[i]`返回一个函数，并访问变量`i`

```js
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = (function (i) {
      return function(){
          console.log(i);
      }
  })(i);
}

data[0]();	// 0
data[1]();	// 1
data[2]();	// 2
```

循环结束后的全局执行上下文没有变化。

执行 data[0] 函数的时候，data[0] 函数的作用域链发生了改变：

```text
data[0]Context = {
    Scope: [AO, 匿名函数Context.AO, globalContext.VO]
}
```

匿名函数执行上下文的AO为：

```js
匿名函数Context = {
    AO: {
        arguments: {
            0: 0,
            length: 1
        },
        i: 0
    }
}
```

因为闭包执行上下文中贮存了变量`i`，所以根据作用域链会在`globalContext.VO`中查找到变量`i`,并输出0。

## [#](https://muyiy.cn/blog/2/2.2.html#思考题)思考题

上面必刷题改动一个地方，把for循环中的`var i = 0`，改成`let i = 0`。结果是什么，为什么？？？

```js
var data = [];

for (let i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i);
  };
}

data[0]();
data[1]();
data[2]();
```

## [#](https://muyiy.cn/blog/2/2.2.html#参考)参考

> [JavaScript深入之闭包](https://github.com/mqyqingfeng/Blog/issues/9)