## 彻底搞懂JavaScript执行机制

> [](https://mp.weixin.qq.com/s/eamd3b4mIbaTl9T7JbetQw)

> 不管你是前端新手还是老鸟，在日常的工作或者面试的过程中总会遇到这样的情况：给定的几行代码，写出其输出内容和顺序。所以我们就需要搞懂javascript的运行原理和执行机制

前言

首先，我们先看一道经典的面试题

```
setTimeout(function(){
 console.log('定时器开始啦')
});

new Promise(function(resolve){
 console.log('马上执行for循环啦');
 for(var i = 0; i < 10000; i++){
  i == 99 && resolve();
 }
}).then(function(){
 console.log('执行then函数啦')
});

console.log('代码执行结束');
```

我把这段代码粘贴到chrome执行了一下，输出的结果如图所示

![图片](https://mmbiz.qpic.cn/mmbiz_png/JtAicy0ibicVGKXHBicARhApAhfQsu5sQUBuF3UJHREO6naRyfL4X99xcuv2gAbOEdfBb1MmquF37wdicLxicYy3pmicg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)



javascript灵魂三问

##### 1、为什么说js是单线程

JavaScript语言的一大特点就是 单线程 ，也就是说，同一个时间只能做一件事。那么，为什么JavaScript不能有多个线程呢？

技术的出现,都跟现实世界里的应用场景密切相关的。

JavaScript的主要用途是与用户互动，以及操作DOM。这决定了它只能是单线程，否则会带来很复杂的同步问题。

> 比如，假定现在同时有两个线程操作同一个DOM元素，一个线程在DOM节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？

所以js就被设计成单线程

HTML5提出Web Worker标准，允许JavaScript脚本创建多个线程，但是子线程完全受主线程控制，且不得操作DOM。这个新标准并没有改变js单线程的本质。

##### 2、JS为什么需要异步?

javascript事件循环既然js是单线程，那就像只有一个窗口的银行，客户需要排队一个一个办理业务，同理js任务也要一个一个顺序执行。如果一个任务耗时过长，那么后一个任务也必须等着。

如果JS中不存在异步,只能自上而下执行,如果上一行解析时间很长,那么下面的代码就会被阻塞。对于用户而言,阻塞就意味着"卡死",这样就导致了很差的用户体验

所以js存在 同步任务 和 异步任务 

> - **同步任务：在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务。**
> - **异步任务：不进入主线程、而进入"任务队列"（task queue）的任务，只有"任务队列"通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行。**

##### 3、js如何实现异步任务？

既然JS是单线程的,只能在一条线程上执行,又是如何实现的异步呢?

是通过的事件循环(event loop),理解了event loop机制,就理解了JS的执行机制

执行栈与任务队列

当javascript代码执行的时候会将不同的变量存于内存中的不同位置：堆（heap）和 栈（stack）中来加以区分。其中，堆里存放着一些对象。而栈中则存放着一些基础类型变量以及对象的指针。但是我们这里说的执行栈和上面这个栈的意义却有些不同。

> 执行栈

当我们调用一个方法的时候，js会生成一个与这个方法对应的执行环境（context），又叫执行上下文。这个执行环境中存在着这个方法的私有作用域，上层作用域的指向，方法的参数，这个作用域中定义的变量以及这个作用域的this对象。而当一系列方法被依次调用的时候，因为js是单线程的，同一时间只能执行一个方法，于是这些方法被排队在一个单独的地方。这个地方被称为执行栈。



![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)



> 任务队列（Task Queue）

js的另一大特点是非阻塞，实现这一点的关键在于任务队列

任务队列是 先进先出 的原则，先进队列的事件先执行，后进队列的事件后执行。

js引擎遇到一个异步任务后并不会一直等待其返回结果，而是会将这个任务挂起（压入到任务队列中），继续执行执行栈中的其他任务。当一个异步任务返回结果后，js会将这个任务加入与当前执行栈不同的另一个队列，我们称之为任务队列。被放入任务队列不会立刻执行其回调，而是等待当前执行栈中的所有任务都执行完毕， 主线程处于闲置状态时，主线程会去查找任务队列是否有任务。如果有，那么主线程会从中取出排在第一位的事件，并把这个任务对应的回调放入执行栈中，然后执行其中的同步代码，如此反复，这样就形成了一个无限的循环。（下图（转引自Philip Roberts的演讲《Help, I'm stuck in an event-loop》）。）

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

图中的stack表示我们所说的执行栈，web apis则是代表一些异步事件，而callback queue即事件队列。主线程运行的时候，产生堆（heap）和栈（stack），栈中的代码调用各种外部API，它们在"任务队列"中加入各种事件（click，load，done）。只要栈中的代码执行完毕，主线程就会去读取"任务队列"，依次执行那些事件所对应的回调函数。

Event Loop事件循环机制

主线程从"任务队列"中读取事件，这个过程是循环不断的，所以整个的这种运行机制又称为Event Loop（事件循环）。

（1）所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）。

（2）主线程之外，还存在一个"任务队列"（task queue）。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。

（3）同步和异步任务分别进入不同的执行"场所"，同步的进入主线程，异步的进入Event Table并注册函数。

（4）当指定的事情完成时，Event Table会将这个函数移入Event Queue。

（3）一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列（event Queue）"的异步任务,如果有就推入主线程中。

（4）主线程不断重复上面的步骤。

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

以上循环执行,这就是event loop

宏任务和微任务

> 宏任务（macro task）

包括整体代码script，setTimeout，setInterval

> 微任务（micro-task）

包括Promise，process.nextTick

不同类型的任务会进入对应的Event Queue，比如宏任务就会进入到宏任务的事件队列中，微任务就会进入到微任务的事件队列中。

事件循环的顺序，进入整体代码(宏任务)后，开始第一次循环。接着执行所有的微任务。然后再次从宏任务开始，找到其中一个任务队列执行完毕，再执行所有的微任务。

请看网络盗图

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

按照这种分类方式:JS的执行机制是

- **执行一个宏任务,过程中如果遇到微任务,就将其放到微任务的【事件队列】里**
- **当前宏任务执行完成后,会查看微任务的【事件队列】,并将里面全部的微任务依次执行完**

分析面试题

下面代码是文章开头的面试题：

```
setTimeout(function(){
 console.log('定时器开始啦')
});

new Promise(function(resolve){
 console.log('马上执行for循环啦');
 for(var i = 0; i < 10000; i++){
  i == 99 && resolve();
 }
}).then(function(){
 console.log('执行then函数啦')
});

console.log('代码执行结束');
```

首先执行script下的宏任务,遇到setTimeout,将其放到宏任务的【队列】里

遇到 new Promise直接执行,打印"马上执行for循环啦"

遇到then方法,是微任务,将其放到微任务的【队列里】

打印 "代码执行结束"

本轮宏任务执行完毕,查看本轮的微任务,发现有一个then方法里的函数, 打印"执行then函数啦"

到此,本轮的event loop 全部完成。

所以最后的执行顺序是【马上执行for循环啦 --- 代码执行结束 --- 执行then函数啦 --- 定时器开始啦】

写在最后

(1) js的异步我们从最开头就说javascript是一门单线程语言，不管是什么新框架新语法糖实现的所谓异步，其实都是用同步的方法去模拟的，牢牢把握住单线程这点非常重要。

(2) 事件循环Event Loop事件循环是js实现异步的一种方法，也是js的执行机制。

*参考资料*

*1、阮一峰老师的JavaScript 运行机制详解：再谈Event Loop：**http://www.ruanyifeng.com/blog/2014/10/event-loop.html*
*2、segmentfault 10分钟理解JS引擎的执行机制：https://segmentfault.com/a/1190000012806637*