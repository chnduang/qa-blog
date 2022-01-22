# HTML汇总

## 请描述`cookie`、`sessionStorage`和`localStorage`的区别

上面提到的技术名词，都是在客户端以键值对存储的存储机制，并且只能将值存储为字符串。

|                                                    | `cookie`                                           | `localStorage` | `sessionStorage` |
| -------------------------------------------------- | -------------------------------------------------- | -------------- | ---------------- |
| 由谁初始化                                         | 客户端或服务器，服务器可以使用`Set-Cookie`请求头。 | 客户端         | 客户端           |
| 过期时间                                           | 手动设置                                           | 永不过期       | 当前页面关闭时   |
| 在当前浏览器会话（browser sessions）中是否保持不变 | 取决于是否设置了过期时间                           | 是             | 否               |
| 是否随着每个 HTTP 请求发送给服务器                 | 是，Cookies 会通过`Cookie`请求头，自动发送给服务器 | 否             | 否               |
| 容量（每个域名）                                   | 4kb                                                | 5MB            | 5MB              |
| 访问权限                                           | 任意窗口                                           | 任意窗口       | 当前页面窗口     |

- [https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [http://tutorial.techaltum.com/local-and-session-storage.html](http://tutorial.techaltum.com/local-and-session-storage.html)



## 为什么在`<img>`标签中使用`srcset`属性？请描述浏览器遇到该属性后的处理过程

因为需要设计响应式图片。我们可以使用两个新的属性——`srcset` 和 `sizes`——来提供更多额外的资源图像和提示，帮助浏览器选择正确的一个资源。

**srcset** 定义了我们允许浏览器选择的图像集，以及每个图像的大小。

**sizes** 定义了一组媒体条件（例如屏幕宽度）并且指明当某些媒体条件为真时，什么样的图片尺寸是最佳选择。

所以，有了这些属性，浏览器会：

1. 查看设备宽度
2. 检查 sizes 列表中哪个媒体条件是第一个为真
3. 查看给予该媒体查询的槽大小
4. 加载 srcset 列表中引用的最接近所选的槽大小的图像

- [https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)