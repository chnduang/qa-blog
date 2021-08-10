## 几张动图带你回顾event loop

> [https://mp.weixin.qq.com/s/wdx-DIjURNLMREBHlY_sqw](https://mp.weixin.qq.com/s/wdx-DIjURNLMREBHlY_sqw)

## 为什么需要它

JavaScript是单线程的：一次只能运行一个任务。通常，这没什么大不了的，但是现在想象一下您正在运行一个耗时30秒的任务。在此任务中，我们等待30秒才能进行其他任何操作（默认情况下，JavaScript在浏览器的主线程上运行，因此整个用户界面都被卡住了）。

这样子的体验是不能接受的，你不能把时间花在这么一个迟钝的网站。

幸运的是，浏览器为我们提供了JavaScript引擎本身不提供的一些功能：Web API。这包括DOM API，setTimeout，HTTP请求等。这可以帮助我们创建一些异步的，非阻塞的行为。

------

## 初次见面

当我们调用一个函数时，它会被添加到一个叫做调用栈的东西中。调用堆栈是JS引擎的一部分，这与浏览器无关。它是一个堆栈，意味着它是先入后出的（想想一堆薄饼）。当一个函数返回一个值时，它被从堆栈中弹出。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_gif/Voibl9R35rqqwtVgvfFmEWaj9821j4Q2jpkRRhrDA7Vzj8oJtCnZDnlHucG4lwMCUDO6qbF3daytotVxZedpCcA/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)流程图1

响应函数返回一个setTimeout函数。setTimeout是由Web API提供给我们的：它让我们在不阻塞主线程的情况下延迟任务。我们传递给setTimeout函数的回调函数，箭头函数（）=> { return 'Hey' }被添加到Web API中。同时，setTimeout函数和response函数被从堆栈中弹出，它们都返回了它们的值!

![图片](https://mmbiz.qpic.cn/sz_mmbiz_gif/Voibl9R35rqqwtVgvfFmEWaj9821j4Q2jGSLL90NSUR677zyEicibjtIWYia1dUicUts79127szR7DZ6MHlftB2tgTQ/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)流程图2

在Web API中，定时器的运行时间与我们传递给它的第二个参数一样长，即1000ms。回调并不立即被添加到调用栈中，而是被传递到一个叫做队列的东西中。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_gif/Voibl9R35rqqwtVgvfFmEWaj9821j4Q2jA9mYKhS3KBzmUoWBicCzFJvUs4gQt0sOWa1Srhvtw6OCSAnCN3iaVvhw/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)流程图3

这可能是一个令人困惑的部分：这并不意味着回调函数在1000ms后被添加到callstack（从而返回一个值）！它只是在1000ms后被添加到队列中。但这是一个队列，该函数必须等待轮到它!

------

## 揭开面纱

现在是我们一直在等待的部分，是时候让事件循环完成它唯一的任务了：将队列和调用栈连接起来。如果调用栈是空的，那么如果所有先前调用的函数都已经返回了它们的值，并且已经从栈中弹出，那么队列中的第一个项目就会被添加到调用栈中。在这种情况下，没有其他函数被调用，也就是说，当回调函数成为队列中的第一项时，调用栈是空的。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_gif/Voibl9R35rqqwtVgvfFmEWaj9821j4Q2junKXxScSZkhG1whLEocRsgRnEdAkBicPnaHbpqGAMrcrichKwp51ibydA/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)流程图4

回调被添加到调用堆栈，被调用，并返回一个值，然后被从堆栈中弹出，如图:

![图片](https://mmbiz.qpic.cn/sz_mmbiz_gif/Voibl9R35rqqwtVgvfFmEWaj9821j4Q2j7XqdSK3z9dWb4IkAWmLbSDbNibYJvuf3eLrbnz2M6JntlV7pWutxzfw/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)流程图5

------

## 跑个demo

其实我看完这些动图后，是很能理解作者思路滴，不过，我还是建议初学者，可以跑个例子看看，下面是一个不错的例子:

```
const foo = () => console.log("First");
const bar = () => setTimeout(() => console.log("Second"), 500);
const baz = () => console.log("Third");

bar();
foo();
baz();
```

虽然看起来很简单，嗯，可以尝试搞一下:

打开我们的浏览器，跑一下上面的代码，让我们快速看一下在浏览器中运行此代码时发生的情况：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_gif/Voibl9R35rqqwtVgvfFmEWaj9821j4Q2jpmicXuMLZc7nAeO9y6ZtAc9E2JU5V1PJ8FgwMT7ia1Vh17vSRQibiaPI2Q/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)流程图6

## 