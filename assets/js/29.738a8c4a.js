(window.webpackJsonp=window.webpackJsonp||[]).push([[29],{321:function(t,e,_){"use strict";_.r(e);var v=_(4),o=Object(v.a)({},(function(){var t=this,e=t._self._c;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h1",{attrs:{id:"html汇总"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#html汇总"}},[t._v("#")]),t._v(" HTML汇总")]),t._v(" "),e("h2",{attrs:{id:"请描述cookie、sessionstorage和localstorage的区别"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#请描述cookie、sessionstorage和localstorage的区别"}},[t._v("#")]),t._v(" 请描述"),e("code",[t._v("cookie")]),t._v("、"),e("code",[t._v("sessionStorage")]),t._v("和"),e("code",[t._v("localStorage")]),t._v("的区别")]),t._v(" "),e("p",[t._v("上面提到的技术名词，都是在客户端以键值对存储的存储机制，并且只能将值存储为字符串。")]),t._v(" "),e("table",[e("thead",[e("tr",[e("th"),t._v(" "),e("th",[e("code",[t._v("cookie")])]),t._v(" "),e("th",[e("code",[t._v("localStorage")])]),t._v(" "),e("th",[e("code",[t._v("sessionStorage")])])])]),t._v(" "),e("tbody",[e("tr",[e("td",[t._v("由谁初始化")]),t._v(" "),e("td",[t._v("客户端或服务器，服务器可以使用"),e("code",[t._v("Set-Cookie")]),t._v("请求头。")]),t._v(" "),e("td",[t._v("客户端")]),t._v(" "),e("td",[t._v("客户端")])]),t._v(" "),e("tr",[e("td",[t._v("过期时间")]),t._v(" "),e("td",[t._v("手动设置")]),t._v(" "),e("td",[t._v("永不过期")]),t._v(" "),e("td",[t._v("当前页面关闭时")])]),t._v(" "),e("tr",[e("td",[t._v("在当前浏览器会话（browser sessions）中是否保持不变")]),t._v(" "),e("td",[t._v("取决于是否设置了过期时间")]),t._v(" "),e("td",[t._v("是")]),t._v(" "),e("td",[t._v("否")])]),t._v(" "),e("tr",[e("td",[t._v("是否随着每个 HTTP 请求发送给服务器")]),t._v(" "),e("td",[t._v("是，Cookies 会通过"),e("code",[t._v("Cookie")]),t._v("请求头，自动发送给服务器")]),t._v(" "),e("td",[t._v("否")]),t._v(" "),e("td",[t._v("否")])]),t._v(" "),e("tr",[e("td",[t._v("容量（每个域名）")]),t._v(" "),e("td",[t._v("4kb")]),t._v(" "),e("td",[t._v("5MB")]),t._v(" "),e("td",[t._v("5MB")])]),t._v(" "),e("tr",[e("td",[t._v("访问权限")]),t._v(" "),e("td",[t._v("任意窗口")]),t._v(" "),e("td",[t._v("任意窗口")]),t._v(" "),e("td",[t._v("当前页面窗口")])])])]),t._v(" "),e("ul",[e("li",[e("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies"),e("OutboundLink")],1)]),t._v(" "),e("li",[e("a",{attrs:{href:"http://tutorial.techaltum.com/local-and-session-storage.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("http://tutorial.techaltum.com/local-and-session-storage.html"),e("OutboundLink")],1)])]),t._v(" "),e("h2",{attrs:{id:"为什么在-img-标签中使用srcset属性-请描述浏览器遇到该属性后的处理过程"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#为什么在-img-标签中使用srcset属性-请描述浏览器遇到该属性后的处理过程"}},[t._v("#")]),t._v(" 为什么在"),e("code",[t._v("<img>")]),t._v("标签中使用"),e("code",[t._v("srcset")]),t._v("属性？请描述浏览器遇到该属性后的处理过程")]),t._v(" "),e("p",[t._v("因为需要设计响应式图片。我们可以使用两个新的属性——"),e("code",[t._v("srcset")]),t._v(" 和 "),e("code",[t._v("sizes")]),t._v("——来提供更多额外的资源图像和提示，帮助浏览器选择正确的一个资源。")]),t._v(" "),e("p",[e("strong",[t._v("srcset")]),t._v(" 定义了我们允许浏览器选择的图像集，以及每个图像的大小。")]),t._v(" "),e("p",[e("strong",[t._v("sizes")]),t._v(" 定义了一组媒体条件（例如屏幕宽度）并且指明当某些媒体条件为真时，什么样的图片尺寸是最佳选择。")]),t._v(" "),e("p",[t._v("所以，有了这些属性，浏览器会：")]),t._v(" "),e("ol",[e("li",[t._v("查看设备宽度")]),t._v(" "),e("li",[t._v("检查 sizes 列表中哪个媒体条件是第一个为真")]),t._v(" "),e("li",[t._v("查看给予该媒体查询的槽大小")]),t._v(" "),e("li",[t._v("加载 srcset 列表中引用的最接近所选的槽大小的图像")])]),t._v(" "),e("ul",[e("li",[e("a",{attrs:{href:"https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images"),e("OutboundLink")],1)])])])}),[],!1,null,null,null);e.default=o.exports}}]);