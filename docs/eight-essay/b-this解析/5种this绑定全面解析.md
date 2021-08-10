# JavaScript深入之史上最全--5种this绑定全面解析

> [https://mp.weixin.qq.com/s/P7YeQvscLUGS3OILeijH9A](https://mp.weixin.qq.com/s/P7YeQvscLUGS3OILeijH9A)

`this`的绑定规则总共有下面5种。

- 1、默认绑定（严格/非严格模式）
- 2、隐式绑定
- 3、显式绑定
- 4、new绑定
- 5、箭头函数绑定

## 1 调用位置

调用位置就是函数在代码中**被调用的位置**（而不是声明的位置）。

查找方法：

- 分析调用栈：调用位置就是当前正在执行的函数的**前一个调用**中

  ```js
  function baz() {
      // 当前调用栈是：baz
      // 因此，当前调用位置是全局作用域
      
      console.log( "baz" );
      bar(); // <-- bar的调用位置
  }
  
  function bar() {
      // 当前调用栈是：baz --> bar
      // 因此，当前调用位置在baz中
      
      console.log( "bar" );
      foo(); // <-- foo的调用位置
  }
  
  function foo() {
      // 当前调用栈是：baz --> bar --> foo
      // 因此，当前调用位置在bar中
      
      console.log( "foo" );
  }
  
  baz(); // <-- baz的调用位置
  ```

- 使用开发者工具得到调用栈：

  设置断点或者插入`debugger;`语句，运行时调试器会在那个位置暂停，同时展示当前位置的函数调用列表，这就是**调用栈**。找到栈中的**第二个元素**，这就是真正的调用位置。

## 2 绑定规则

### 2.1 默认绑定

- **独立函数调用**，可以把默认绑定看作是无法应用其他规则时的默认规则，this指向**全局对象**。
- **严格模式**下，不能将全局对象用于默认绑定，this会绑定到`undefined`。只有函数**运行**在非严格模式下，默认绑定才能绑定到全局对象。在严格模式下**调用**函数则不影响默认绑定。

```js
function foo() { // 运行在严格模式下，this会绑定到undefined
    "use strict";
    
    console.log( this.a );
}

var a = 2;

// 调用
foo(); // TypeError: Cannot read property 'a' of undefined

// --------------------------------------

function foo() { // 运行
    console.log( this.a );
}

var a = 2;

(function() { // 严格模式下调用函数则不影响默认绑定
    "use strict";
    
    foo(); // 2
})();
```

### 2.2 隐式绑定

当函数引用有**上下文对象**时，隐式绑定规则会把函数中的this绑定到这个上下文对象。对象属性引用链中只有上一层或者说最后一层在调用中起作用。

```js
function foo() {
    console.log( this.a );
}

var obj = {
    a: 2,
    foo: foo
};

obj.foo(); // 2
```

> 隐式丢失

被隐式绑定的函数特定情况下会丢失绑定对象，应用默认绑定，把this绑定到全局对象或者undefined上。

```js
// 虽然bar是obj.foo的一个引用，但是实际上，它引用的是foo函数本身。
// bar()是一个不带任何修饰的函数调用，应用默认绑定。
function foo() {
    console.log( this.a );
}

var obj = {
    a: 2,
    foo: foo
};

var bar = obj.foo; // 函数别名

var a = "oops, global"; // a是全局对象的属性

bar(); // "oops, global"
```

参数传递就是一种隐式赋值，传入函数时也会被隐式赋值。回调函数丢失this绑定是非常常见的。

```js
function foo() {
    console.log( this.a );
}

function doFoo(fn) {
    // fn其实引用的是foo
    
    fn(); // <-- 调用位置！
}

var obj = {
    a: 2,
    foo: foo
};

var a = "oops, global"; // a是全局对象的属性

doFoo( obj.foo ); // "oops, global"

// ----------------------------------------

// JS环境中内置的setTimeout()函数实现和下面的伪代码类似：
function setTimeout(fn, delay) {
    // 等待delay毫秒
    fn(); // <-- 调用位置！
}
```

### 2.3 显式绑定

通过`call(..)` 或者 `apply(..)`方法。第一个参数是一个对象，在调用函数时将这个对象绑定到this。因为直接指定this的绑定对象，称之为显示绑定。

```js
function foo() {
    console.log( this.a );
}

var obj = {
    a: 2
};

foo.call( obj ); // 2  调用foo时强制把foo的this绑定到obj上
```

显示绑定无法解决丢失绑定问题。

解决方案：

- 1、硬绑定

创建函数bar()，并在它的内部手动调用foo.call(obj)，强制把foo的this绑定到了obj。这种方式让我想起了**借用构造函数继承**，没看过的可以点击查看 [JavaScript常用八种继承方案](https://juejin.im/post/5bcb2e295188255c55472db0)

```js
function foo() {
    console.log( this.a );
}

var obj = {
    a: 2
};

var bar = function() {
    foo.call( obj );
};

bar(); // 2
setTimeout( bar, 100 ); // 2

// 硬绑定的bar不可能再修改它的this
bar.call( window ); // 2
```

典型应用场景是创建一个包裹函数，负责接收参数并返回值。

```js
function foo(something) {
    console.log( this.a, something );
    return this.a + something;
}

var obj = {
    a: 2
};

var bar = function() {
    return foo.apply( obj, arguments );
};

var b = bar( 3 ); // 2 3
console.log( b ); // 5
```

创建一个可以重复使用的辅助函数。

```js
function foo(something) {
    console.log( this.a, something );
    return this.a + something;
}

// 简单的辅助绑定函数
function bind(fn, obj) {
    return function() {
        return fn.apply( obj, arguments );
    }
}

var obj = {
    a: 2
};

var bar = bind( foo, obj );

var b = bar( 3 ); // 2 3
console.log( b ); // 5
```

ES5内置了`Function.prototype.bind`，bind会返回一个硬绑定的新函数，用法如下。

```js
function foo(something) {
    console.log( this.a, something );
    return this.a + something;
}

var obj = {
    a: 2
};

var bar = foo.bind( obj );

var b = bar( 3 ); // 2 3
console.log( b ); // 5
```

- 2、API调用的“上下文”

JS许多内置函数提供了一个可选参数，被称之为“上下文”（context），其作用和`bind(..)`一样，确保回调函数使用指定的this。这些函数实际上通过`call(..)`和`apply(..)`实现了显式绑定。

```js
function foo(el) {
	console.log( el, this.id );
}

var obj = {
    id: "awesome"
}

var myArray = [1, 2, 3]
// 调用foo(..)时把this绑定到obj
myArray.forEach( foo, obj );
// 1 awesome 2 awesome 3 awesome
```

### 2.4 new绑定

- 在JS中，`构造函数`只是使用`new`操作符时被调用的`普通`函数，他们不属于某个类，也不会实例化一个类。
- 包括内置对象函数（比如`Number(..)`）在内的所有函数都可以用`new`来调用，这种函数调用被称为构造函数调用。
- 实际上并不存在所谓的“构造函数”，只有对于函数的“**构造调用**”。

使用`new`来调用函数，或者说发生构造函数调用时，会自动执行下面的操作。

- 1、创建（或者说构造）一个新对象。
- 2、这个新对象会被执行`[[Prototype]]`连接。
- 3、这个新对象会绑定到函数调用的`this`。
- 4、如果函数没有返回其他对象，那么`new`表达式中的函数调用会自动返回这个新对象。

使用`new`来调用`foo(..)`时，会构造一个新对象并把它（`bar`）绑定到`foo(..)`调用中的this。

```js
function foo(a) {
    this.a = a;
}

var bar = new foo(2); // bar和foo(..)调用中的this进行绑定
console.log( bar.a ); // 2
```

**手写一个new实现**

```js
function create() {
	// 创建一个空的对象
    var obj = new Object(),
	// 获得构造函数，arguments中去除第一个参数
    Con = [].shift.call(arguments);
	// 链接到原型，obj 可以访问到构造函数原型中的属性
    obj.__proto__ = Con.prototype;
	// 绑定 this 实现继承，obj 可以访问到构造函数中的属性
    var ret = Con.apply(obj, arguments);
	// 优先返回构造函数返回的对象
	return ret instanceof Object ? ret : obj;
};
```

使用这个手写的new

```js
function Person() {...}

// 使用内置函数new
var person = new Person(...)
                        
// 使用手写的new，即create
var person = create(Person, ...)
```

**代码原理解析**：

- 1、用`new Object()`的方式新建了一个对象`obj`
- 2、取出第一个参数，就是我们要传入的构造函数。此外因为 shift 会修改原数组，所以 `arguments`会被去除第一个参数
- 3、将 `obj`的原型指向构造函数，这样`obj`就可以访问到构造函数原型中的属性
- 4、使用`apply`，改变构造函数`this` 的指向到新建的对象，这样 `obj`就可以访问到构造函数中的属性
- 5、返回 `obj`

## 3 优先级

```flow
st=>start: Start
e=>end: End
cond1=>condition: new绑定
op1=>operation: this绑定新创建的对象，
				var bar = new foo()
				
cond2=>condition: 显示绑定
op2=>operation: this绑定指定的对象，
				var bar = foo.call(obj2)
				
cond3=>condition: 隐式绑定
op3=>operation: this绑定上下文对象，
				var bar = obj1.foo()
				
op4=>operation: 默认绑定
op5=>operation: 函数体严格模式下绑定到undefined，
				否则绑定到全局对象，
				var bar = foo()

st->cond1
cond1(yes)->op1->e
cond1(no)->cond2
cond2(yes)->op2->e
cond2(no)->cond3
cond3(yes)->op3->e
cond3(no)->op4->op5->e
```

在`new`中使用硬绑定函数的目的是预先设置函数的一些参数，这样在使用`new`进行初始化时就可以只传入其余的参数（**柯里化**）。

```js
function foo(p1, p2) {
    this.val = p1 + p2;
}

// 之所以使用null是因为在本例中我们并不关心硬绑定的this是什么
// 反正使用new时this会被修改
var bar = foo.bind( null, "p1" );

var baz = new bar( "p2" );

baz.val; // p1p2
```

## 4 绑定例外

### 4.1 被忽略的this

把`null`或者`undefined`作为`this`的绑定对象传入`call`、`apply`或者`bind`，这些值在调用时会被忽略，实际应用的是默认规则。

下面两种情况下会传入`null`

- 使用`apply(..)`来“展开”一个数组，并当作参数传入一个函数
- `bind(..)`可以对参数进行柯里化（预先设置一些参数）

```js
function foo(a, b) {
    console.log( "a:" + a + "，b:" + b );
}

// 把数组”展开“成参数
foo.apply( null, [2, 3] ); // a:2，b:3

// 使用bind(..)进行柯里化
var bar = foo.bind( null, 2 );
bar( 3 ); // a:2，b:3 
```

总是传入`null`来忽略this绑定可能产生一些副作用。如果某个函数确实使用了this，那默认绑定规则会把this绑定到全局对象中。

> 更安全的this

安全的做法就是传入一个特殊的对象（空对象），把this绑定到这个对象不会对你的程序产生任何副作用。

JS中创建一个空对象最简单的方法是**`Object.create(null)`**，这个和`{}`很像，但是并不会创建`Object.prototype`这个委托，所以比`{}`更空。

```js
function foo(a, b) {
    console.log( "a:" + a + "，b:" + b );
}

// 我们的空对象
var ø = Object.create( null );

// 把数组”展开“成参数
foo.apply( ø, [2, 3] ); // a:2，b:3

// 使用bind(..)进行柯里化
var bar = foo.bind( ø, 2 );
bar( 3 ); // a:2，b:3 
```

### 4.2 间接引用

间接引用下，调用这个函数会应用默认绑定规则。间接引用最容易在**赋值**时发生。

```js
// p.foo = o.foo的返回值是目标函数的引用，所以调用位置是foo()而不是p.foo()或者o.foo()
function foo() {
    console.log( this.a );
}

var a = 2;
var o = { a: 3, foo: foo };
var p = { a: 4};

o.foo(); // 3
(p.foo = o.foo)(); // 2
```

### 4.3 软绑定

- 硬绑定可以把this强制绑定到指定的对象（`new`除外），防止函数调用应用默认绑定规则。但是会降低函数的灵活性，使用**硬绑定之后就无法使用隐式绑定或者显式绑定来修改this**。
- **如果给默认绑定指定一个全局对象和undefined以外的值**，那就可以实现和硬绑定相同的效果，同时保留隐式绑定或者显示绑定修改this的能力。

```js
// 默认绑定规则，优先级排最后
// 如果this绑定到全局对象或者undefined，那就把指定的默认对象obj绑定到this,否则不会修改this
if(!Function.prototype.softBind) {
    Function.prototype.softBind = function(obj) {
        var fn = this;
        // 捕获所有curried参数
        var curried = [].slice.call( arguments, 1 ); 
        var bound = function() {
            return fn.apply(
            	(!this || this === (window || global)) ? 
                	obj : this,
                curried.concat.apply( curried, arguments )
            );
        };
        bound.prototype = Object.create( fn.prototype );
        return bound;
    };
}
```

使用：软绑定版本的foo()可以手动将this绑定到obj2或者obj3上，但如果应用默认绑定，则会将this绑定到obj。

```js
function foo() {
    console.log("name:" + this.name);
}

var obj = { name: "obj" },
    obj2 = { name: "obj2" },
    obj3 = { name: "obj3" };

// 默认绑定，应用软绑定，软绑定把this绑定到默认对象obj
var fooOBJ = foo.softBind( obj );
fooOBJ(); // name: obj 

// 隐式绑定规则
obj2.foo = foo.softBind( obj );
obj2.foo(); // name: obj2 <---- 看！！！

// 显式绑定规则
fooOBJ.call( obj3 ); // name: obj3 <---- 看！！！

// 绑定丢失，应用软绑定
setTimeout( obj2.foo, 10 ); // name: obj
```

## 5 this词法

ES6新增一种特殊函数类型：箭头函数，箭头函数无法使用上述四条规则，而是根据外层（函数或者全局）作用域（**词法作用域**）来决定this。

- `foo()`内部创建的箭头函数会捕获调用时`foo()`的this。由于`foo()`的this绑定到`obj1`，`bar`(引用箭头函数)的this也会绑定到`obj1`，**箭头函数的绑定无法被修改**(`new`也不行)。

```js
function foo() {
    // 返回一个箭头函数
    return (a) => {
        // this继承自foo()
        console.log( this.a );
    };
}

var obj1 = {
    a: 2
};

var obj2 = {
    a: 3
}

var bar = foo.call( obj1 );
bar.call( obj2 ); // 2，不是3！
```

ES6之前和箭头函数类似的模式，采用的是词法作用域取代了传统的this机制。

```js
function foo() {
    var self = this; // lexical capture of this
    setTimeout( function() {
        console.log( self.a ); // self只是继承了foo()函数的this绑定
    }, 100 );
}

var obj = {
    a: 2
};

foo.call(obj); // 2
```

代码风格统一问题：如果既有this风格的代码，还会使用 `seft = this` 或者箭头函数来否定this机制。

- 只使用词法作用域并完全抛弃错误this风格的代码；
- 完全采用this风格，在必要时使用`bind(..)`，尽量避免使用 `self = this` 和箭头函数。

## 上期思考题解

代码1：

```js
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}

checkscope()();                  
```

代码2：

```js
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}

var foo = checkscope(); 
foo();    
```

上面的两个代码中，`checkscope()`执行完成后，闭包`f`所引用的自由变量`scope`会被垃圾回收吗？为什么？

**解答**：

`checkscope()`执行完成后，代码1中自由变量特定时间之后**回收**，代码2中自由变量**不回收**。

首先要说明的是，现在主流浏览器的垃圾回收算法是**标记清除**，标记清除并非是标记执行栈的进出，而是**从根开始遍历**，也是一个找引用关系的过程，但是因为从根开始，相互引用的情况不会被计入。所以当垃圾回收开始时，从**Root**（全局对象）开始寻找这个对象的引用是否可达，如果引用链断裂，那么这个对象就会回收。

闭包中的作用域链中 parentContext.vo 是对象，被放在**堆**中，**栈**中的变量会随着执行环境进出而销毁，**堆**中需要垃圾回收，闭包内的自由变量会被分配到堆上，所以当外部方法执行完毕后，对其的引用并没有丢。

每次进入函数执行时，会重新创建可执行环境和活动对象，但函数的`[[Scope]]`是函数定义时就已经定义好的（**词法作用域规则**），不可更改。

- 对于代码1：

`checkscope()`执行时,将`checkscope`对象指针压入栈中，其执行环境变量如下

```js
checkscopeContext:{
    AO:{
        arguments:
        scope:
        f:
    },
    this,
    [[Scope]]:[AO, globalContext.VO]
}
```

执行完毕后**出栈**，该对象没有绑定给谁，从**Root**开始查找无法可达，此活动对象一段时间后会被回收

- 对于代码2：

`checkscope()`执行后，返回的是`f`对象，其执行环境变量如下

```js
fContext:{
    AO:{
        arguments:
    },
    this,
    [[Scope]]:[AO, checkscopeContext.AO, globalContext.VO]
}
```

此对象赋值给`var foo = checkscope();`，将`foo`压入栈中，`foo`指向堆中的`f`活动对象,对于`Root`来说可达，不会被回收。

如果一定要自由变量`scope`回收，那么该怎么办？？？

很简单，`foo = null;`，把引用断开就可以了。

## 本期思考题

依次给出console.log输出的数值。

```js
var num = 1;
var myObject = {
    num: 2,
    add: function() {
        this.num = 3;
        (function() {
            console.log(this.num);
            this.num = 4;
        })();
        console.log(this.num);
    },
    sub: function() {
        console.log(this.num)
    }
}
myObject.add();
console.log(myObject.num);
console.log(num);
var sub = myObject.sub;
sub();
```

## 参考

> [你不知道的JavaScript上卷—笔记](https://github.com/yygmind/Reading-Notes/blob/master/你不知道的JavaScript上卷.md)
>
> [Javascript 闭包，引用的变量是否被回收？](https://www.zhihu.com/question/40678847/answer/87982345)

