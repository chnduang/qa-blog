(window.webpackJsonp=window.webpackJsonp||[]).push([[44],{336:function(t,e,n){"use strict";n.r(e);var v=n(4),_=Object(v.a)({},(function(){var t=this,e=t._self._c;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h1",{attrs:{id:"接口如何防刷"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#接口如何防刷"}},[t._v("#")]),t._v(" 接口如何防刷")]),t._v(" "),e("p",[t._v("1：网关控制流量洪峰，对在一个时间段内出现流量异常，可以拒绝请求（参考个人博客文章 https://mp.csdn.net/postedit/81672222）\n2：源"),e("code",[t._v("ip")]),t._v("请求个数限制。对请求来源的"),e("code",[t._v("ip")]),t._v("请求个数做限制\n3："),e("code",[t._v("http")]),t._v("请求头信息校验；（例如"),e("code",[t._v("host")]),t._v("，"),e("code",[t._v("User-Agent")]),t._v("，"),e("code",[t._v("Referer")]),t._v("）\n4：对用户唯一身份uid进行限制和校验。例如基本的长度，组合方式，甚至有效性进行判断。或者uid具有一定的时效性\n5：前后端协议采用二进制方式进行交互或者协议采用签名机制\n6：人机验证，验证码，短信验证码，滑动图片形式，12306形式")]),t._v(" "),e("p",[t._v("防刷一般分两种：")]),t._v(" "),e("ul",[e("li",[t._v("总调用次数受限制。这个一般是在后端做限制，单位时间内最多可调用次数。")]),t._v(" "),e("li",[t._v("同一客户端次数限制。这个前端的一般使用是给接口调用加锁，在返回结果或者一定时间之后解锁")])])])}),[],!1,null,null,null);e.default=_.exports}}]);