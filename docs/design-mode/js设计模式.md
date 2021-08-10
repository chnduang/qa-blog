## JavaScript设计模式--前奏 

**设计模式应遵守的原则：** 
（1）最少知识原则：一个软件实体应当尽可能少地与其他实体发生相互作用（把对象划分成较小的粒度，以便提高复用性） 
（2）开放-封闭原则：软件实体（类、模块、函数）等应该是可以扩展的，但是不可修改。

一、原型模式

JavaScript基于原型的委托机制实现对象与对象之间的继承。 
当对象无法响应某个请求时，会把该请求委托给它自己的原型。 
构造器有原型，实例对象没有原型，有一个名为**proto**的属性，其默认指向它的构造器的原型对象，即{constructor}.prototype。 
**示例一：**

> ```
> var obj = {name: "ligang"};var A = function() {};
> A.prototype = obj;var a = new A();
> console.log(a.name);  // ligang
> ```

（1）遍历对象a中所有属性，未找到name属性 
（2）查找name属性的请求被委托给对象a的对象构造器的原型，它被a.**proto**记录着并且指向A.prototype，而其被设置为对象obj 
（3）在对象obj中找到name属性，并返回。 
**示例二：**

> ```
> var obj = {name: "ligang"};var A = function(name) {
>     this.name = name;
> };
> A.prototype = obj;var a = new A();
> console.log(a.name);  // undefined
> ```

（1）首选遍历对象a中的所有属性，存在name属性，但未赋值

**示例三：**

> ```
> var obj = {name: "ligang"};var A = function() {};
> A.prototype = obj;var B = function() {};
> B.prototype = new A();var b = new B();
> console.log(b.name);    // ligang
> ```

查找顺序： 
b对象 –> b.**proto**(即：B.prototype) –> new A()对象 –> B.prototype –> obj

二、this



## 1. 词法作用域

首先明确JavaScript只具备词法作用域（书写代码时函数声明的位置来决定），不具备动态作用域。通过下述示例说明。 
备注：词法作用域详见：《JavaScript词法作用域（你不知道的JavaScript）》 
**示例一：**

> ```
> function foo() {
>     console.log(a);
> }function bar() {
>     var a = 1;
>     foo();  
> }
> bar();      // ReferenceError
> ```

**示例二：**

> ```
> function foo() {
>     console.log(this.a);        
> // this指向window
> }
> function bar() {
>     var a = 1;
>     foo();  
> }
> bar();     
>  // undefined
> ```

**示例三：**

> ```
> function foo() {
>     console.log(this.a);
> }function bar() {
>     this.a = 1;
>     foo();
> }
> bar();      // 1
> ```

如果JavaScript存在动态作用域，示例一的结果应该为1。

## 2. this

下面补充几点this注意事项 
备注：关于this详见：《JavaScript中的this（你不知道的JavaScript）》

（1）this指向（构造器调用） 
**示例一：**

> ```
> var MyClass = function() {
>     this.age = 25;    this.name = "ligang";
> };var obj = new MyClass();
> console.log("姓名：" +　obj.name + " 年龄：" + obj.age);  
>  // 姓名：ligang    年龄：25
> ```

**示例二：**

> ```
> var MyClass = function() {
>     this.age = 25;    this.name = "ligang";    return {
>         name: "camile"
>     };
> };var obj = new MyClass();
> console.log("姓名：" +　obj.name + " 年龄：" + obj.age);   
> // 姓名：camile 年龄：undefined
> ```

**注意：**如果构造器显式地返回一个object类型的对象，那么此次运算最终返回这个对象，而不是我们之前期待的this。

## 3. 指定函数内部this指向

call、apply、Function.prototype.bind 
其中Function.prototype.bind部分浏览器不兼容，兼容性请查看http://caniuse.com/ 
**模拟实现Function.prototype.bind：**

> ```
> Function.prototype.bind = function() {
>     var self = this,
>         context = [].shift.call(arguments),
>         args = [].slice.call(arguments);    
> return function() {
>         return self.apply(context, 
> [].concat.call(args, 
> [].slice.call(arguments)));
>     };
> };
> // 测试
> var obj = {
>     name: "ligang"};
> var func = function(a, b, c) {
>     console.log(this.name);
>     console.log([a, b, c])
> }.bind(obj, 1, 2);
> 
> func(3);
> ```



三、闭包和高阶函数



## 1. 闭包

对象以方法的形式包含了过程，而闭包则是在过程中一环境的形式包含了数据。 
**示例：缓存机制**

> ```
> var mult = (function() {
>     var cache = {};    return function() {
>         var args = Array.prototype.join.call(arguments, ",");   
>      if(args in cache) {            
>      return cache[args];
>         }       
>  var a = 1;       
>   for(var i = 0,
>    l = arguments.length; i < l; i++) {
>             a = a * arguments[i];
>         }        return cache[args] = a;
>     }
> })();
> 
> console.log(mult(1, 2, 3));
> console.log(mult(1, 2, 3));     
> // 再次计算，直接从缓存中取
> ```

**注意：**闭包容易导致循环引用，从而导致内存溢出。可以通过把这些变量置为null，回收这些变量。

## 2. 高阶函数

高阶函数：函数作为参数传递；函数作为返回值输出。 
（1）回调函数

> ```
> function fun(callback) {
>     console.log(1);    
> if(typeof callback === 'function'){
>         setTimeout(function() {
>             callback();
>         });
>     }
> }
> 
> fun(function(){console.log(2);});
> ```

（2）判断数据类型

> ```
> var isType = function(type) {return function(obj) {
>  return Object.prototype.toString.call(obj) === '[object' + type + ']';
>     }
> };
> var isArray = isType("Array");
> var isNumber = isType("Number");
> 
> isArray([]);
> isNumber("123");
> ```

（3）单例

> ```
> var getSingle = function(fn) {
>     var result;    
> return function() {
>         return result || (result = fn.apply(this, arguments));
>     };
> };
> function testSingle(){}
> getSingle(testSingle)() === getSingle(testSingle)();   
>  // true
> ```
