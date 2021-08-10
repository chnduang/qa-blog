## 送你 54 道 JavaScript 面试题

> [https://mp.weixin.qq.com/s/ejdZjDjk87xr-VBYNVzYQw](https://mp.weixin.qq.com/s/ejdZjDjk87xr-VBYNVzYQw)

### 前言

> 大家好，我叫TianTian，一个爱瞎折腾，爱算法的Acmer爱好者，梳理一些比较好的JS题目，复习完还是收获很大，分享给大家❤️

题目主要来自看到过的易错题，还有经典的**44道 JavaScript Puzzlers!**，出自原文链接

**stackoverflow** 这上面有很多Questions不错的，可以好好补一补基础

> JS易错题暂时很长一段时间就不更新啦，TypeScript都出来了，TS真香
>
> ➡️给个小建议，可以先看完第一题，要是没有问题的话，后面的基本上也可以跳过

GitHub仓库点这里

开始吧👇

### `.` VS `=` 操作符优先级

```
  let a = {n : 1};
        let b = a;
        a.x = a = {n: 2};

        
        console.log(a.x)
        console.log(b.x)
```

输出是什么呢？

真的想明白了吗？

**答案**



undefined

{ n : 2}



### 你真的了解作用域吗

```
  var a = 0,  
            b = 0;
        function A(a) {
            A = function (b) {
                console.log(a + b++)
            }
            console.log(a++)
        }
        A(1)
        A(2)
```

留给你们思考，我可是第一遍就做错了(；′⌒`)

**答案 1 4**

可以好好想一想，你会茅塞顿开的。

### 类数组的length

```
  var obj = {
            "2" : 3,
            "3" : 4,
            "length" : 2,
            "splice" : Array.prototype.splice,
            "push" : Array.prototype.push
        }
        obj.push(1)
        obj.push(2)
        console.log(obj)
```

这段代码的执行结果？

```
答案：Object(4) [empty × 2, 1, 2, splice: ƒ, push: ƒ]
```



```
解释就是第一次使用push,obj对象的push方法设置obj[2] = 1,obj.length++

解释就是第一次使用push,obj对象的push方法设置obj[3] = 2,obj.length++

使用console.log()方法输出的时候，因为obj上有length属性和splice方法，故将其作为数组输出打印

打印时因为数组未设置下标为0和1的值，故打印的结果就是empty，主动获取obj[0] = undefined
```

### 非匿名自执行函数，函数名只读

```
  var b = 10;
        (function b(){
            // 'use strict'
            b = 20
            console.log(b)
        })()
```

输出的结果是什么？

```
Function b
- 如标题一样，非匿名自执行函数，函数名不可以修改，严格模式下会TypeError，
- 非严格模式下，不报错，修改也没有用。
- 查找变量b时,立即执行函数会有内部作用域，会先去查找是否有b变量的声明，有的话，直接复制
- 确实发现具名函数Function b(){} 所以就拿来做b的值
- IIFE的函数内部无法进行复制(类似于const)
```

### 非匿名自执行函数 II

```
  var b = 10;
        (function b(){
            // 'use strict'
            var b = 20
            console.log(window.b) 
            console.log(b)
        })()
```

输出是多少呢？

```
10
20
// 访问b变量的时候,发现var b = 20;在当前作用域中找到了b变量，于是把b的值作为20
```

### 非匿名自执行函数 III

```
  var b = 10;
        (function b(){
            console.log(b)
            b = 5
            console.log(window.b)
            var b = 20
            console.log(b)
        })()
```

输出的结果是多少呢？

这个问题应该不难，就留给你们思考吧

### 变量提升

```
var name = 'World!';
(function () {
    if (typeof name === 'undefined') {
        var name = 'Jack';
        console.log('Goodbye ' + name);
    } else {
        console.log('Hello ' + name);
    }
})();
```

在 JavaScript中， Fun 和 var 会被提升

相当于

```
var name = 'World!';
(function () {
    var name;
    if (typeof name === 'undefined') {
        name = 'Jack';
        console.log('Goodbye ' + name);
    } else {
        console.log('Hello ' + name);
    }
})();
```

巩固一下：

```
 var str = 'World!';   
    (function (name) {
    if (typeof name === 'undefined') {
        var name = 'Jack';
        console.log('Goodbye ' + name);
    } else {
        console.log('Hello ' + name);
    }
    })(str);
    答案：Hello World 因为name已经变成函数内局部变量
```

### 最大整数

```
var END = Math.pow(2, 53);
var START = END - 100;
var count = 0;
for (var i = START; i <= END; i++) {
    count++;
}
console.log(count);
```

一个知识点:Infinity

```
在 JS 里, Math.pow(2, 53) == 9007199254740992 是可以表示的最大值. 最大值加一还是最大值. 所以循环不会停.
```

### 稀疏数组与密数组

```
var ary = [0,1,2];
ary[10] = 10;
ary.filter(function(x) { return x === undefined;});
```

执行结果如何呢？

做这个题目，你需要了解稀疏数组和密集数组

- 译 JavaScript中的稀疏数组与密集数组
- Array/filter

看过源码的同学应该知道，filter源码中，会去判断数组的这个索引值是不是数组的一个属性，有兴趣的同学可以看看我写的这篇关于数组的：[干货👍]从详细操作js数组到浅析v8中array.js

```
0 in ary; => true
3 in ary; => false
10 in ary; => true
也就是说 从 3 - 9 都是没有初始化的'坑'!, 这些索引并不存在与数组中. 在 array 的函数调用的时候是会跳过这些'坑'的.
```

所以答案就是[]

### 浮点运算

```
var two   = 0.2
var one   = 0.1
var eight = 0.8
var six   = 0.6
[two - one == one, eight - six == two]
```

你认为结果是多少呢？面试遇到这个问题，应该怎么回答呢？

```
[true,false]
```

可以看看这些文章：

- 探寻 JavaScript 精度问题以及解决方案
- 从0.1+0.2=0.30000000000000004再看JS中的Number类型

### Switch

```
function showCase(value) {
    switch(value) {
    case 'A':
        console.log('Case A');
        break;
    case 'B':
        console.log('Case B');
        break;
    case undefined:
        console.log('undefined');
        break;
    default:
        console.log('Do not know!');
    }
}
showCase(new String('A'));
```

运行结果如何呢？

```
switch 是严格比较, String 实例和 字符串不一样.
答案自然是'Do not know' 
所以一般情况下,写switch语句，也建议写default
```

String("A")

```
function showCase2(value) {
    switch(value) {
    case 'A':
        console.log('Case A');
        break;
    case 'B':
        console.log('Case B');
        break;
    case undefined:
        console.log('undefined');
        break;
    default:
        console.log('Do not know!');
    }
}
showCase2(String('A'));
```

运行结果呢？

```
答案：Case A
解析：String('A')就是返回一个字符串
```

### %运算符

```
function isOdd(num) {
    return num % 2 == 1;
}
function isEven(num) {
    return num % 2 == 0;
}
function isSane(num) {
    return isEven(num) || isOdd(num);
}
var values = [7, 4, '13', -9, Infinity];
values.map(isSane);
```

运行的结果如何呢？

```
答案：[true, true, true, false, false]
解析：%如果不是数值会调用Number（）去转化
     '13' % 2       // 1
      Infinity % 2  //NaN  Infinity 是无穷大
      -9 % 2        // -1
巩固：9 % -2        // 1   余数的正负号随第一个操作数
```

### 数组的原型是什么

```
Array.isArray( Array.prototype )
```

这段代码的执行结果？

```
答案：true
解析：Array.prototype是一个数组
数组的原型是数组，对象的原型是对象，函数的原型是函数
```

### 宽松相等 ==

```
[]==[]
```

答案是什么呢

```
答案：false
解析：两个引用类型， ==比较的是引用地址
```

### == 和 !优先级

```
[]== ![] 
```

结果是什么呢？

```
(1)! 的优先级高于== ，右边Boolean([])是true,取返等于 false
(2)一个引用类型和一个值去比较 把引用类型转化成值类型，左边0
(3)所以 0 == false  答案是true
```

### 数字与字符串相加减

```
'5' + 3
'5' - 3
```

结果是多少呢？

```
答案：53  2
解析：加号有拼接功能，减号就是逻辑运算
巩固：typeof (+"1")   // "number" 对非数值+—常被用来做类型转换相当于Number()
```

### 一波骚操作  + - + + + - +

```
1 + - + + + - + 1
```

结果是多少呢

```
答案：2
解析：+-又是一元加和减操作符号，就是数学里的正负号。负负得正哈。 
巩固： 一元运算符还有一个常用的用法就是将自执行函数的function从函数声明变成表达式。
      常用的有 + - ～ ！void
      + function () { }
      - function () { }
      ~ function () { }
      void function () { }
```

### 又是稀疏数组？Array.prototype.map()

```
var ary = Array(3);
ary[0]=2
ary.map(function(elem) { return '1'; });
```

输出结果是多少呢？

```
稀疏数组

题目中的数组其实是一个长度为3, 但是没有内容的数组, array 上的操作会跳过这些未初始化的'坑'.

所以答案是 ["1", empty × 2]
```

这里贴上 Array.prototype.map 的 polyfill.

```
Array.prototype.map = function(callback, thisArg) {

        var T, A, k;

        if (this == null) {
            throw new TypeError(' this is null or not defined');
        }

        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }
        if (arguments.length > 1) {
            T = thisArg;
        }
        A = new Array(len);
        k = 0;
        while (k < len) {
            var kValue, mappedValue;
            if (k in O) {
                kValue = O[k];
                mappedValue = callback.call(T, kValue, k, O);
                A[k] = mappedValue;
            }
            k++;
        }
        return A;
    };
```

### JS是如何存储

```
var a = 111111111111111110000,
b = 1111;
a + b;
```

这段代码的执行结果？

```
答案：11111111111111111000
解析：在JavaScript中number类型在JavaScript中以64位（8byte）来存储。
这64位中有符号位1位、指数位11位、实数位52位。
2的53次方时，是最大值。
其值为：9007199254740992（0x20000000000000）。
超过这个值的话，运算的结果就会不对.
```

### 数组比较大小

```
var a = [1, 2, 3],
    b = [1, 2, 3],
    c = [1, 2, 4]
a ==  b
a === b
a >   c
a <   c
```

这段代码的执行结果？

```
答案：false, false, false, true
解析：相等（==）和全等（===）还是比较引用地址
     引用类型间比较大小是按照字典序比较，就是先比第一项谁大，相同再去比第二项。
```

### 三元运算符优先级

```
var val = 'smtg';
console.log('Value is ' + (val === 'smtg') ? 'Something' : 'Nothing');
```

这段代码的执行结果？

```
答案：Something
解析：字符串连接比三元运算有更高的优先级 
     所以原题等价于 'Value is true' ? 'Somthing' : 'Nonthing' 
     而不是 'Value   is' + (true ? 'Something' : 'Nonthing')
巩固：
    1 || fn() && fn()   //1  
    1 || 1 ? 2 : 3 ;    //2  
```

### 原型

```
var a = {}, b = Object.prototype;
[a.prototype === b, Object.getPrototypeOf(a) === b] 
```

执行结果是多少呢

```
答案：false, true
解析：Object 的实例是 a，a上并没有prototype属性
     a的__poroto__ 指向的是Object.prototype，也就是Object.getPrototypeOf(a)。a的原型对象是b
```

### 原型II

```
function f() {}
var a = f.prototype, b = Object.getPrototypeOf(f);
a === b         
```

这段代码的执行结果？

```
答案：false
解析：a是构造函数f的原型 ： {constructor: ƒ}
b是实例f的原型对象 ： ƒ () { [native code] }
```

### 函数名称

```
function foo() { }
var oldName = foo.name;
foo.name = "bar";
[oldName, foo.name]     
```

代码执行结果是什么？

```
答案：["foo", "foo"]
解析：函数的名字不可变.
```

### [typeof null, null instanceof Object]

```
答案：["object", false]
解析：null代表空对象指针，所以typeof判断成一个对象。可以说JS设计上的一个BUG
     instanceof 实际上判断的是对象上构造函数，null是空当然不可能有构造函数
巩固：null == undefined //true    null === undefined //flase
```

### [ [3,2,1].reduce(Math.pow), [].reduce(Math.pow) ]

```
答案：Error
解析：Math.pow (x , y)  x 的 y 次幂的值
     reduce（fn,total）
     fn (total, currentValue, currentIndex, arr) 
         如果一个函数不传初始值，数组第一个组默认为初始值.
         [3,2,1].reduce(Math.pow)
         Math.pow(3,2) //9
         Math.pow(9,1) //9

巩固题,可以做一做：
  [].reduce(Math.pow)       //空数组会报TypeError
     [1].reduce(Math.pow)      //只有初始值就不会执行回调函数，直接返回1
     [].reduce(Math.pow,1)     //只有初始值就不会执行回调函数，直接返回1
     [2].reduce(Math.pow,3)    //传入初始值，执行回调函数，返回9
```

### replace

```
"1 2 3".replace(/\d/g, parseInt)
```

输出是什么呢？

```
答案："1 NaN 3"
解析：replace() 回调函数的四个参数:
      1、匹配项  
      2、与模式中的子表达式匹配的字符串  
      3、出现的位置  
      4、stringObject 本身 。
如果没有与子表达式匹配的项，第二参数为出现的位置.所以第一个参数是匹配项，第二个参数是位置
 parseInt('1', 0)
 parseInt('2', 2)  //2进制中不可能有2
 parseInt('3', 4)
```

### eval用法

```
function f() {}
var parent = Object.getPrototypeOf(f);
f.name // ?
parent.name // ?
typeof eval(f.name) // ?
typeof eval(parent.name) //  ?  
```

这段代码的执行结果？

```
答案："f", "Empty", "function", error
解析：f的函数名就是f
     parent是f原型对象的名字为"" ,
     先计算eval(f.name) 为 f,f的数据类型是function
     eval(parent.name) 为undefined, "undefined"
```

### new  Date()

```
var a = new Date("2014-03-19"),
b = new Date(2014, 03, 19);
[a.getDay() === b.getDay(), a.getMonth() === b.getMonth()]
```

这段代码的执行结果？

```
答案：[false, false]
解析：var a = new Date("2014-03-19")    //能够识别这样的字符串，返回想要的日期
      Wed Mar 19 2014 08:00:00 GMT+0800 (CST)
      b = new Date(2014, 03, 19);       //参数要按照索引来
      Sat Apr 19 2014 00:00:00 GMT+0800 (CST)
      月是从0索引，日期是从1 
      getDay()是获取星期几
      getMonth()是获取月份所以都不同
巩固： [a.getDate() === b.getDate()] //true
```

### new  Date() II

```
var a = Date(0);
var b = new Date(0);
var c = new Date();
[a === b, b === c, a === c]
```

这段代码的执行结果？

```
答案：[false, false, false]
解析：当日期被作为构造函数调用时，它返回一个相对于划时代的对象（JAN 01 1970）。
当参数丢失时，它返回当前日期。当它作为函数调用时，它返回当前时间的字符串表示形式。
a是字符串   a === b // 数据类型都不同，肯定是false
b是对象     b === c // 引用类型，比的是引用地址
c也是对象   a === c // 数据类型都不同，肯定是false
```

### new  Date() III

```
var a = new Date("epoch")
```

你认为结果是多少呢？

```
答案：Invalid Date {}
解析：您得到“无效日期”，这是一个实际的日期对象（一个日期的日期为true）。但无效。这是因为时间内部保持为一个数字，在这种情况下，它是NA。
      在chrome上是undefined 
      正确的是格式是var d = new Date(year, month, day, hours, minutes, seconds, milliseconds);
```

### Function.length

```
var a = Function.length,
b = new Function().length
a === b
```

这段代码的执行结果是？

```
答案：false
解析：首先new在函数带（）时运算优先级和.一样所以从左向右执行
     new Function() 的函数长度为0
巩固：function fn () {
         var a = 1;
      }
      console.log(fn.length) 
      //0 fn和new Function()一样
```

> 要是看过往期的这篇文章[诚意满满✍]带你填一些JS容易出错的坑 就可以给我点个赞👍关注一下啦，下面的内容都是这篇文章的内容。

### [1,2,5,10].sort()

不写回调函数的话，是按照什么排序呢？

JavaScript默认使用字典序(alphanumeric)来排序。因此结果是[1,10,2,5]

正确排序的话，应该[1,2,5,10].sort( (a,b) => a-b )

### "b" + "a" + +"a" + "a"

你认为输出是什么？

上面的表达式相当于'b'+'a'+ (+'a')+'a'，因为（+'a'）是NaN，所以：

'b'+'a'+ (+'a')+'a' = 'b'+'a'+ "NaN"+'a'='baNaNa'

### 闭包

这是一个经典JavaScript面试题

```
  let res = new Array()
        for(var i = 0; i < 10; i++){
            res.push(function(){
                return console.log(i)
            })
        }
        res[0]() 
        res[1]()
        res[2]()
```

期望输出的是0,1,2,实际上却不会。原因就是涉及**作用域**，怎么解决呢？

- [x] 使用let代替var，形成块级作用域
- [x] 使用bind函数。

```
res.push(console.log.bind(null, i))
```

解法还有其他的，比如使用IIFE，形成私有作用域等等做法。

### 又一经典闭包问题

```
function fun(n,o) {
  console.log(o)
  return {
    fun:function(m){
      return fun(m,n);
    }
  };
}
var a = fun(0);  a.fun(1);  a.fun(2);  a.fun(3);//undefined,?,?,?
var b = fun(0).fun(1).fun(2).fun(3);//undefined,?,?,?
var c = fun(0).fun(1);  c.fun(2);  c.fun(3);//undefined,?,?,?
```

**留给你们思考**

### 隐式转换

```
var a = [0];
if (a) {
  console.log(a == true);
} else {
  console.log("wut");
}
```

你们觉得答案是多少呢？这题涉及到隐式转换了，这个坑我自己的好好补一补

// 答案：false

**再来一道？**

```
function fn() {
    return 20;
}
console.log(fn + 10); // 输出结果是多少
function fn() {
    return 20;
}
fn.toString = function() {
    return 10;
}
console.log(fn + 10);  // 输出结果是多少？
function fn() {
    return 20;
}

fn.toString = function() {
    return 10;
}

fn.valueOf = function() {
    return 5;
}

console.log(fn + 10); // 输出结果是多少？
```

**说到底JS类型转换的好好补一补了**

### 你真的理解操作符吗

```
[1<2<3,3<2<1]
//[false,false]
//[true,true]
//[false,true]
//[true,false]
```

选一个吧，比较操作符，赋值运算符优先级哪个更高呢？

### 0.1+0.2  !== 0.3  ?

面试的时候，问你这个问题，要是回答错误的话，估计面试官对基础很是怀疑！！！

问你这个题目的时候，你可以牵扯出很多问题，比如JS如何存储小数的呢？比如聊一聊二进制，比如实际开发中，遇到精度的问题，你是怎么解决的，你有什么好办法。

聊完这个，你可以牵扯出最大安全数，比如JavaScript的最大安全整数是多少，超出这个范围的话，怎么解决精度问题呢？

ES规范中新提出的BigInt解决了什么问题呢，你又发现了BigInt中哪些坑呢？

如何解决精度问题呢？

这里推荐Number-Precision库，不到1K的体积。

### arguments

```
  function sidEffecting(ary) {
            ary[0] = ary[2];
        }
        function bar(a, b, c) {
            c = 10
            sidEffecting(arguments);
            return a + b + c;
        }
        function demo (arg) {
            arg.name = 'new Name'
        }
        console.log(bar(2, 2, 2))
```

涉及到ES6语法，这题答案肯定都会做是22，但是呢，稍微改变一下题目，就比较坑了….

```
  function sidEffecting(ary) {
            ary[0] = ary[2];
        }
        function bar(a, b, c = 4) {
            c = 10
            sidEffecting(arguments);
            return a + b + c;
        }
        function demo (arg) {
            arg.name = 'new Name'
        }
        console.log(bar(2, 2, 2))
```

这个答案是多少呢？根据MDN上对argument有更加准确的定义，看argument

> 当非严格模式中的函数**有**包含剩余参数、默认参数和解构赋值，那么`arguments`对象中的值**不会**跟踪参数的值（反之亦然）。

找到这句话，bar函数存在默认参数，并且在非严格模式下，所以不会跟踪参数的值，自然结果就14

**请读者细细体会**

### 浏览器懵逼史

```
  let demo1 = {class: "Animal", name: 'sheet'};
        console.log(demo1.class)
```

比较流氓，这个跟浏览器相关，class是保留字（现在的话，class是关键字），答案并不要紧，重要的是自己在取属性名称的时候尽量避免保留字. 如果使用的话请加引号 a['class']。

**保留字vs关键字**

个人理解的话，关键字就是有特殊含义的，不用用作变量名。比如

```
let class = 123;
```

现在看来肯定报错，那有什么需要我们注意的呢？

```
let undefined = 123;
```

这样子并不会报错，这个跟浏览器有点关系，这样子看来undefined不是关键字。所以为了保险起见，**建议大家在判断一个变量是不是未定义的话，尽量使用void 0 === undefined**很有可能undefined会被当作是变量来赋值

**void 0 值就是undefined**

### ["1", "2", "3"].map(parseInt)

这个应该是经常遇见的题了，搞明白很简单，map函数怎么使用，parseInt函数怎么使用

关于Array数组的话，我之前写了一篇文章，从**源码角度解析大部分方法**

点进去重温一遍：[干货👍]从详细操作js数组到浅析v8中array.js

map接受两个参数，一个callback，一个this，即调用函数时this指向，其中callback回调函数是三个参数，一个currentValue，index，array；

parseInt接受两个参数：string,radix(基数)

返回NaN有两种情况

- `radix` 小于 `2` 或大于 `36` ，或
- 第一个非空格字符不能转换为数字。
- 当radix是0或者undefined时，又是特殊情况，具体异步MDN

```
parseInt('1', 0);
parseInt('2', 1);
parseInt('3', 2);
```

两者结合的话，结果自然很明显，[1,NaN,NaN]

### Math.min() 为什么比 Math.max() 大？

```
  Math.min() < Math.max() // false
```

按照常规思路的话，应该是true，毕竟最小值应该小于最大值，但是实际情况是false

原因：

- Math.min 的参数是 0 个或者多个。如果是多个参数很容易理解，返回参数中最小的。
- 如果是0个参数，或者没有参数，则返回 **Infinity**。
- 而 Math.max() 没有传递参数时返回的是 -Infinity。

要是面试官问这个问题，额。。。。

### [].concat[1,2,3]

输出是什么?注意不是[].concat([1,2,3])

```
// [1,2,3]

// Uncaught SyntaxError: ....

// undefined
```

答案是undefined，原因是什么呢？

1. 第一步计算[].concat,结果是Array.prototype.concat

2. 第二步执行一个逗号操作符，逗号操作符对它的每个操作对象求值（从左至右），然后返回最后一个操作对象的值。

   ```
   >1,2,3
   返回3
   ```

3. 第三步执行一个数组访问运算或属性访问运算

所以上面[].concat[1,2,3] 等价于Array.prototype.concat[3]

那么结果自然就是 `undefined`。

### [1,2,NaN,3].indexOf(NaN)

//2 or -1

- indexOf方法会进行严格相等判断
- NaN !== NaN

怎么办呢？

```
let realIsNaN = value => typeof value === 'number' && isNaN(value);
```

先要判断类型，是因为字符串转换会先转换成数字，转换失败为 NaN。所以和 NaN 相等。

```
isNaN('jjjj') —> true
```

第二种方法

```
let realIsNaN = value => value !== value;
```

### Number.isFinite & isFinite

```
Number.isFinite('0') === isFinite('0')

Number.isFinite(0) === isFinite('0')
```

打印结果是什么，能不能具体说一说？

> Number.isFinite()检测有穷性的值，唯一和全局isFinite()函数相比，这个方法不会强制将一个非数值的参数转换成数值，这就意味着，只有数值类型的值，且是有穷的（finite），才返回 `true`。

自然答案就是 false,true

### 一道容易被人轻视的面试题

```
function Foo() {
    getName = function () { alert (1); };
    return this;
}
Foo.getName = function () { alert (2);};
Foo.prototype.getName = function () { alert (3);};
var getName = function () { alert (4);};
function getName() { alert (5);}

//请写出以下输出结果：
Foo.getName();
getName();
Foo().getName();
getName();
new Foo.getName();
new Foo().getName();
new new Foo().getName();
```

### push方法

```
let newList = [1,2,3].push(4)
console.log(newList.push(4))
```

认为输出什么？

// Error

原因在于Array.prototype.push()返回的是新数组的长度，所以呢4.push(5)自然Error

------

### 自动分号插入

```
function foo1()
{
 return {
     bar: "hello"
 };
}

function foo2()
{
 return
 {
     bar: "hello"
 };
}
var a=foo1();
var b=foo2();
console.log(a) //Object {bar: "hello"}
console.log(b) //underfind
//仔细看就知道了
// 会在第10行加入一个`;`
```

会在第10行自动加一个分号; 所以返回的就是undefined

------

### let var

```
function foo() {
let a = b = 0;
a++;
return a;
}
foo();
typeof a; // => ???
typeof b; // => ???
```

上面的let a = b = 0; 等价于 window.b  = 0, let a = b;

------

### 眼力题

```
const length = 4;
const numbers = [];
for (var i = 0; i < length; i++);{
  numbers.push(i + 1);
}

numbers; // => ???
```

唯一需要注意的就是`for语句`后面带了`;`沙雕题

加了`;`，会认为for执行完，所以指定的都是空语句，最后numbers为[5]

------

### 获取字符串中特定索引字符

```
console.log('Hello World'[4])
```

使用的就是方括号表示法获取字符串特定索引的字符，值得注意的是，IE7低版本使用的是charAt()

所以这题输出o

------

### !==

```
const name = 'TianTianUp'
console.log(!typeof name === 'string')
console.log(!typeof name === 'object')
```

typeof name 返回的是 ’string‘, 字符串’string‘是一个truthy值。因此！typeof name 返回一个布尔值false。所以

false === ’string'

和 false === ’object‘返回false

(检测一个类型的值话，我们应该使用 !==而不是!typeof)

------

### forEach

```
const nums = [1, 2, 3, 4, 5, 6];
let firstEven;
nums.forEach(n => {
  if (n % 2 ===0 ) {
    firstEven = n;
    return n;
  }
});
console.log(firstEven);
```

唯一需要注意的就是forEach源码是怎么写的，看过源码的都知道，forEach使用return是不能中止循环的，或者说每一次调用callback函数，终止的是当前的一次，而不是整个循环。

结果自然就是6