## 一文搞懂 this、apply、call、bind

> [https://mp.weixin.qq.com/s/Rg6pm0ZHqCewG2QfHC4-3A](https://mp.weixin.qq.com/s/Rg6pm0ZHqCewG2QfHC4-3A)


**this的指向**

“this” 关键字允许在调用函数或方法时决定哪个对象应该是焦点。

在JavaScript中this可以是全局对象、当前对象或者任意对象，这完全取决于函数的调用方式，this 绑定的对象即函数执行的上下文环境。

在 ES5 中，其实 this 的指向，始终坚持一个原理：this 永远指向最后调用它的那个对象，正是由于调用function的对象不同，才导致了this的指向不同

```js
var test = {
  a: 5,
  b: 6,
  sum: function (a, b) {
    function getA(a) {
      this.a = a;
      // 在window上增加了一个全局变量a      return this.a; // 此处this = window
    }
    function getB(b) {
      this.b = b; //在window上增加了一个全局变量b      return this.b; // 此处this = window
    }
    return getA(a) + getB(b);
  },
};
console.log(test.sum(4, 3)); // 7console.log(a);     // 4   (打印结果为 window.a)  console.log(b);     // 3   (打印结果为 window.b)
```
```js
// e.g.2
var user = {
  name: 'Echoyya',
  age: 27,
  greet() {
    console.log(this.name)
  },
  bf: {
    name: 'KK.unlock',
    greet() {
      console.log(this.name)
    }
  }
}

user.greet()      // Echoyya
user.bf.greet()   // KK.unlock
```
如果 greet 函数不是 user 对象的函数，只是一个独立的函数。
```js
function greet () {
  console.log(this.name)
}

var user = { name: 'Echoyya' 
```
如何能让 greet 方法调用的时候将 this 指向 user 对象？不能再像之前使用 user.greet()，因为 user 并没有 greet 方法。

我们可以通过一些方法去改变this的指向

### **怎样改变 this 的指向**

#### **（1）使用ES6中箭头函数**

箭头函数中的 this 始终指向函数定义时的 this，而非执行时。箭头函数中没有 this 绑定，必须通过查找作用域链来决定其值，如果箭头函数被非箭头函数包含，则 this 绑定的是最近一层非箭头函数的 this，否则，this 为 undefined”。

也正因如此，箭头函数不能用于构造函数

```js

var name = "windowsName";

var obj = {
  name: "Echoyya",
  func1: function () {
    console.log(this.name)
  },
  func2: () => {
      console.log(this.name)
    }
};

obj.func1() // Echoyya

obj.func2() // windowsName
```

#### **（2）函数内部使用 _this = this**

如果不使用 ES6，那么这种方式应该是最简单且不易出错的方式了，先将调用这个函数的对象保存在变量 _this 中，然后在函数中都使用这个 _this。

obj调用func时 this 指向obj，防止setTimeout 被 window 调用，导致 setTimeout 中的 this 指向 window，设置 var _this = this，将 this(指向变量 obj) 赋值给一个变量 _this，这样，在 func 中使用_this 就指向对象 obj

```js
var name = "windowsName";

var obj = {
  name: "Echoyya",
  func: function () {
    var _this = this;
    setTimeout(function () {
      console.log(_this.name)
    }, 1000);
  }
};

obj.func() // Echoyya
```

#### （3）使用call，apply，bind方法

call、apply、bind 方法是每个函数都有的一个方法，允许在调用函数时为函数指定上下文。可以改变 this 指向

##### **call 与 apply**

- call 方法，第一个参数会作为函数被调用时的上下文。即this 指向传给 call 的第一个参数。
- 传递参数给使用 .call 调用的函数时，需要在指定上下文（第一个参数）后一个一个地传入。
- 语法：fun.call(thisArg [, arg1[, arg2[, ...]]])

站在函数应用的角度我们知道了call与apply的用途，那这两个方法又有什么区别呢，其实区别就一点，参数传递方式不同。

1. call方法中接受的是一个参数列表，第一个参数指向this，其余的参数在函数执行时都会作为函数形参传入函数。

2. - 语法：fn.call(this, arg1, arg2, ...);

3. 而apply不同的地方是，除了第一个参数作为this指向外，其它参数都被包裹在一个数组中，在函数执行时同样会作为形参传入。

4. - 语法：fn.apply(this, [arg1, arg2, ...]);

除此之外，两个方法的效果完全相同：

```js

var o = {
    a: 1
};

function fn(b, c) {
    console.log(this.a + b + c);
};
fn.call(o, 2, 3);     // 6
fn.apply(o, [2, 3]);  //6
```

##### **关于 bind**

bind要单独说一下，因为它与call，apply还不太一样。call与apply在改变this的同时，就立刻执行，而bind绑定this后并不会立马执行，而是返回一个新的绑定函数，需要在执行一下。

```js
var o = {
    a: 1
};

function fn(b, c) {
    console.log(this.a + b + c);
};

var fn2 = fn.bind(o, 2, 3);

fn2();   //6
```

```js
var name = 'windowsName'

function greet () {
  console.log(this.name)
}

var user = { name: 'Echoyya' }

greet()          // windowsName
greet.bind()()   // windowsName  (非严格模式下，默认指向window)
greet.bind(user)()   // Echoyya
```

```js
var obj = {
  name: "Echoyya",
  func: function () {
    setTimeout(function () {
      console.log(this.name)
    }.bind(obj)(), 100);
  }
};

obj.func() // Echoyya
```

##### **call、apply、bind 区别**

call、apply、bind 都是可以改变 this 的指向的，但是这三个函数稍有不同。

```js
var test = {
  a: 5,
  b: 6,
  sum: function (a, b) {
    var self = this;

    function getA() {
      return self.a;
    }

    function getB() {
      return self.b;
    }
    console.log(a, b);    // call, apply, bind 传入参数
    return getA() + getB();
  }
}
var obj = {
  a: 2,
  b: 3
};

console.log(test.sum.call(obj, 4, 5));    // 4,5,5  (self = this = obj)   
console.log(test.sum.apply(obj, [6, 7])); // 6,7,5  (self = this = obj)   
console.log(test.sum.bind(obj, 8, 9)());  // 8,9,5  (self = this = obj)
```

**apply 和 call 的区别**

- .apply 和 .call 本质相同，他们的区别只是传入的参数不同。

- - 传递参数给使用 .call 调用的函数时，需要在指定上下文（第一个参数）后一个一个地传入（参数列表）。
  - 传递参数给使用 .apply 调用的函数时，可以用数组传参而且 .apply 会在函数中自动展开（参数数组）。

**call、apply、bind到底有什么区别？bind返回的方法还能修改this指向吗？**

1. apply与call是函数应用，指定this的同时也将方法执行，bind不同，它只是负责绑定this并返回一个新方法，不会执行。

2. 尝试打印返回的新函数fn2，可以看到它并不是一个普通的function，而是一个bound function，简称绑定函数：

3. - TargetFunction 指向 bind 前的函数；
   - BoundThis 是绑定的 this 指向；
   - BoundArgs 是传入的其它参数了。

4. ![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

5. 当我们执行fn2时，有点类似于TargetFunction.apply(BoundThis,BoundArgs)。可以得出一个结论，当执行绑定函数时，this指向与形参在bind方法执行时已经确定了，无法改变。

6. bind多次后执行，函数this还是指向第一次bind的对象。

```js
var o1 = { a: 1 };
var o2 = { a: 2 };

function fn(b, c) {
    console.log(this.a + b + c);
};

var fn1 = fn.bind(o1, 2, 3);

//尝试再次传入形参
fn1(4, 4);           //6

//尝试改变this
fn1.call(o2);        //6

//尝试再次bind
fn1.bind(o2, 1, 1)()   // 6
```

其实很好理解，当执行fn1时，本质上等于window.fn1()，如果this还能被改变，那this岂不是得指向window，那bind方法就没太大意义了。