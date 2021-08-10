## 介绍一下 tree shaking 及其工作原理

> [https://mp.weixin.qq.com/s/ry7pkoPZ10w2rfEZ-NSEfw](https://mp.weixin.qq.com/s/ry7pkoPZ10w2rfEZ-NSEfw)

## 写在前面

今天这道题目是在和小红书的一位面试官聊的时候：

我：如果要你选择一道题目来考察面试者，你最有可能选择哪一道？

面试官：那应该就是介绍一下`tree shaking`及其工作原理？

我：为什么？

面试官：是因为最近面了好多同学，大家都说熟悉`webpack`，在项目中如何去使用、如何去优化，也都或多或少会提到`tree shaking`，但是每当我深入去问其工作机制或者原理时，却少有人能回答上来。（小声 bb：并不是我想内卷，确实是工程师的基本素养啊，哈哈 😄）

面试官：那你来回答一下这个问题？

我：我也用过`tree shaking`，只是知道它的别名叫`树摇`，最早是由`Rollup`实现，是一种采用`删除不需要的额外代码的方式优化代码体积`的技术。但是关于它的原理，我还真的不知道，额，，，，

![图片](https://mmbiz.qpic.cn/mmbiz_png/LNrWl4n5XIJLTpM8MaxFeoDqVU7D7pS9o9hQrUcxYcJ9fsqqC4uSmMFb3zXSLscAx9BWYYWtcxDyNB19zrsicOw/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

> “
>
> 我们平时更多时候是停留在应用层面，这种只是能满足基础的业务诉求，对于后期的技术深挖以及个人的职业发展都是受限的。还是那句老话：知其然，更要知其所以然～

话不多说，下面我就带大家一起来深入探究这个问题。

## 什么是`Tree shaking`

> “
>
> ```
> Tree shaking` 是一种通过清除多余代码方式来优化项目打包体积的技术，专业术语叫 `Dead code elimination
> ```

这个概念，我相信大多数同学都是了解的。什么，你不懂？

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/LNrWl4n5XIJLTpM8MaxFeoDqVU7D7pS99xhyPYPAvVSyjyeYyicXeP2xiciclqcpfgrLrfdddVj2EDiaMZnjjrxia2g/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

不懂没关系，我可以教你啊（不过那是另外的价钱，哈哈 🙈）

走远了，兄弟，让我们言归正传：`tree shaking`如何工作的呢?

## `tree shaking`如何工作的呢?

虽然 `tree shaking` 的概念在 1990 就提出了，但直到 `ES6` 的 `ES6-style` 模块出现后才真正被利用起来。

在`ES6`以前，我们可以使用`CommonJS`引入模块：`require()`，这种引入是动态的，也意味着我们可以基于条件来导入需要的代码：

```
let dynamicModule;
// 动态导入
if (condition) {
  myDynamicModule = require("foo");
} else {
  myDynamicModule = require("bar");
}
```

但是`CommonJS`规范无法确定在实际运行前需要或者不需要某些模块，所以`CommonJS`不适合`tree-shaking`机制。在 `ES6` 中，引入了完全静态的导入语法：`import`。这也意味着下面的导入是不可行的：

```
// 不可行，ES6 的import是完全静态的
if (condition) {
  myDynamicModule = require("foo");
} else {
  myDynamicModule = require("bar");
}
```

我们只能通过导入所有的包后再进行条件获取。如下：

```
import foo from "foo";
import bar from "bar";

if (condition) {
  // foo.xxxx
} else {
  // bar.xxx
}
```

`ES6`的`import`语法可以完美使用`tree shaking`，因为可以在代码不运行的情况下就能分析出不需要的代码。

看完上面的分析，你可能还是有点懵，这里我简单做下总结：因为`tree shaking`只能在静态`modules`下工作。`ECMAScript 6` 模块加载是静态的,因此整个依赖树可以被静态地推导出解析语法树。所以在 `ES6` 中使用 `tree shaking` 是非常容易的。

## `tree shaking`的原理是什么?

看完上面的分析，相信这里你可以很容易的得出题目的答案了：

- `ES6 Module`引入进行静态分析，故而编译的时候正确判断到底加载了那些模块
- 静态分析程序流，判断那些模块和变量未被使用或者引用，进而删除对应代码

## common.js 和 es6 中模块引入的区别？

但到这里，本篇文章还没结束。从这道题目我们可以很容易的引申出来另外一道“明星”面试题：`common.js 和 es6 中模块引入的区别？`

这道题目来自`冴羽`大佬的**阿里前端攻城狮们写了一份前端面试题答案，请查收**[1]

这里就直接贴下他给出的答案了：

`CommonJS` 是一种模块规范，最初被应用于 `Nodejs`，成为 `Nodejs` 的模块规范。运行在浏览器端的 `JavaScript` 由于也缺少类似的规范，在 `ES6` 出来之前，前端也实现了一套相同的模块规范 (例如: `AMD`)，用来对前端模块进行管理。自 `ES6` 起，引入了一套新的 `ES6 Module` 规范，在语言标准的层面上实现了模块功能，而且实现得相当简单，有望成为浏览器和服务器通用的模块解决方案。但目前浏览器对 `ES6 Module` 兼容还不太好，我们平时在 `Webpack` 中使用的 `export` 和 `import`，会经过 `Babel` 转换为 `CommonJS` 规范。在使用上的差别主要有：

1、`CommonJS` 模块输出的是一个值的拷贝，`ES6` 模块输出的是值的引用。

2、`CommonJS` 模块是运行时加载，`ES6` 模块是编译时输出接口。

3、`CommonJs` 是单个值导出，`ES6 Module`可以导出多个

4、`CommonJs` 是动态语法可以写在判断里，`ES6 Module` 静态语法只能写在顶层

5、`CommonJs` 的 `this` 是当前模块，`ES6 Module`的 `this` 是 `undefined`

`冴羽`大佬的文章质量都非常高，也欢迎大家多去支持`冴羽`大佬，相信看完一定会对你有所收获。