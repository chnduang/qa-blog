## 地址栏输入 URL 敲下回车后发生了什么?

> [https://mp.weixin.qq.com/s/Ql1tD-YJSVXb-wK5t2iIWw](https://mp.weixin.qq.com/s/Ql1tD-YJSVXb-wK5t2iIWw)



![图片](https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibSTR1KCaM1nUSzrQoUicIrAjsOdwicw15gcp1gFz9bYEweYnz7PTK1xLbLBwktx8YZKDwkogpJxN4og/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## 一、简单分析

简单的分析，从输入 `URL`到回车后发生的行为如下：

- URL解析
- DNS 查询
- TCP 连接
- HTTP 请求
- 响应请求
- 页面渲染

## 二、详细分析

### URL解析

首先判断你输入的是一个合法的`URL` 还是一个待搜索的关键词，并且根据你输入的内容进行对应操作

一个`url`的结构解析如下：

![图片](https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibSTR1KCaM1nUSzrQoUicIrAjrSWeIvqlBob4lo58oNAAUjJ2PR8E50jHLHcV3a7GknibcDTsLrsSicQQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

### DNS查询

在之前[文章](http://mp.weixin.qq.com/s?__biz=MzU1OTgxNDQ1Nw==&mid=2247487550&idx=2&sn=97dc4d681907edae054b0842c07aaf6e&chksm=fc10d268cb675b7e2d269b684cb3395b61d8bc2bac377734e50b43d55e7323a57fbfd889bbf3&scene=21#wechat_redirect)中讲过`DNS`的查询，这里就不再讲述了

整个查询过程如下图所示：

![图片](https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibSTR1KCaM1nUSzrQoUicIrAjHnGoiavvm9RkUnMvn3vz2byeB4Mcfu5mC6buNicyXL9gSZMQRjBH6AUg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

最终，获取到了域名对应的目标服务器`IP`地址

### TCP连接

在之前[文章](http://mp.weixin.qq.com/s?__biz=MzU1OTgxNDQ1Nw==&mid=2247487527&idx=2&sn=3be899f39102e058cdf2cde028bf6c0c&chksm=fc10d271cb675b678d5fc4b8b8267352b6c3ddbb2130d26527a61374bf72277d7f046ea9597d&scene=21#wechat_redirect)中，了解到`tcp`是一种面向有连接的传输层协议

在确定目标服务器服务器的`IP`地址后，则经历三次握手建立`TCP`连接，流程如下：

![图片](https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibSTR1KCaM1nUSzrQoUicIrAjGlGlHqcMp4juMQc8c8MoZ5tLgljaSe0Bd4mjMkHTxN9ibFAOw806yVQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

### 发送 http 请求

当建立`tcp`连接之后，就可以在这基础上进行通信，浏览器发送 `http` 请求到目标服务器

请求的内容包括：

- 请求行
- 请求头
- 请求主体

![图片](https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibSTR1KCaM1nUSzrQoUicIrAjkPb9aRmAepzo58S35eGgicygI6tUuPprnPHicbQeicEvSvG6ystCTgKTw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

### 响应请求

当服务器接收到浏览器的请求之后，就会进行逻辑操作，处理完成之后返回一个`HTTP`响应消息，包括：

- 状态行
- 响应头
- 响应正文

![图片](https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibSTR1KCaM1nUSzrQoUicIrAjtMMht7CxGUQFnw3glRdFicEaDargeFwo0iaWqdoIauNpylhWLb4NBHiaQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

在服务器响应之后，由于现在`http`默认开始长连接`keep-alive`，当页面关闭之后，`tcp`链接则会经过四次挥手完成断开

### 页面渲染

当浏览器接收到服务器响应的资源后，首先会对资源进行解析：

- 查看响应头的信息，根据不同的指示做对应处理，比如重定向，存储cookie，解压gzip，缓存资源等等
- 查看响应头的 Content-Type的值，根据不同的资源类型采用不同的解析方式

关于页面的渲染过程如下：

- 解析HTML，构建 DOM 树
- 解析 CSS ，生成 CSS 规则树
- 合并 DOM 树和 CSS 规则，生成 render 树
- 布局 render 树（ Layout / reflow ），负责各元素尺寸、位置的计算
- 绘制 render 树（ paint ），绘制页面像素信息
- 浏览器会将各层的信息发送给 GPU，GPU 会将各层合成（ composite ），显示在屏幕上

![图片](https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibSTR1KCaM1nUSzrQoUicIrAjccXNpFMPG2eFLNwgxZ5d5OdZ6LExktwAB8R6azTSicbq9V3I7HQ1QSQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## 参考文献

- https://github.com/febobo/web-interview/issues/141
- https://zhuanlan.zhihu.com/p/80551769