(window.webpackJsonp=window.webpackJsonp||[]).push([[121],{413:function(e,t,a){"use strict";a.r(t);var r=a(4),n=Object(r.a)({},(function(){var e=this,t=e._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"说说对redux中间件的理解-常用的中间件有哪些-实现原理"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#说说对redux中间件的理解-常用的中间件有哪些-实现原理"}},[e._v("#")]),e._v(" 说说对Redux中间件的理解？常用的中间件有哪些？实现原理？")]),e._v(" "),t("p",[t("img",{attrs:{src:"https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibQYGXgDw2QnnSMTibekVtGcCluV1NEOJDxFCgegte8x8Dq1A5mahfZmdyru29taHxVjbMfWmiceYtcw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1",alt:"图片"}})]),e._v(" "),t("h2",{attrs:{id:"一、是什么"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#一、是什么"}},[e._v("#")]),e._v(" 一、是什么")]),e._v(" "),t("p",[e._v("中间件（Middleware）在计算机中，是介于应用系统和系统软件之间的一类软件，它使用系统软件所提供的基础服务（功能），衔接网络上应用系统的各个部分或不同的应用，能够达到资源共享、功能共享的目的")]),e._v(" "),t("p",[e._v("在"),t("a",{attrs:{href:"http://mp.weixin.qq.com/s?__biz=MzU1OTgxNDQ1Nw==&mid=2247488588&idx=2&sn=44a851337e9ba82201231decbb41782a&chksm=fc10d61acb675f0cc3b72c42222eda1c34c5a00e6e2a3834bcbba74adce16e9937700198fbc9&scene=21#wechat_redirect",target:"_blank",rel:"noopener noreferrer"}},[e._v("这篇文章中"),t("OutboundLink")],1),e._v("，了解到了"),t("code",[e._v("Redux")]),e._v("整个工作流程，当"),t("code",[e._v("action")]),e._v("发出之后，"),t("code",[e._v("reducer")]),e._v("立即算出"),t("code",[e._v("state")]),e._v("，整个过程是一个同步的操作")]),e._v(" "),t("p",[e._v("那么如果需要支持异步操作，或者支持错误处理、日志监控，这个过程就可以用上中间件")]),e._v(" "),t("p",[t("code",[e._v("Redux")]),e._v("中，中间件就是放在就是在"),t("code",[e._v("dispatch")]),e._v("过程，在分发"),t("code",[e._v("action")]),e._v("进行拦截处理，如下图：")]),e._v(" "),t("p",[t("img",{attrs:{src:"https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibQYGXgDw2QnnSMTibekVtGcCseCazvdFELNkc1R8NDaAoYXiaQyjdpaYMJ0k7zESUdjfP65vuC7RiaaA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1",alt:"图片"}})]),e._v(" "),t("p",[e._v("其本质上一个函数，对"),t("code",[e._v("store.dispatch")]),e._v("方法进行了改造，在发出 "),t("code",[e._v("Action")]),e._v("和执行 "),t("code",[e._v("Reducer")]),e._v("这两步之间，添加了其他功能")]),e._v(" "),t("h2",{attrs:{id:"二、常用的中间件"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#二、常用的中间件"}},[e._v("#")]),e._v(" 二、常用的中间件")]),e._v(" "),t("p",[e._v("有很多优秀的"),t("code",[e._v("redux")]),e._v("中间件，这里我们例举两个：")]),e._v(" "),t("ul",[t("li",[e._v("redux-thunk：用于异步操作")]),e._v(" "),t("li",[e._v("redux-logger：用于日志记录")])]),e._v(" "),t("p",[e._v("上述的中间件都需要通过"),t("code",[e._v("applyMiddlewares")]),e._v("进行注册，作用是将所有的中间件组成一个数组，依次执行")]),e._v(" "),t("p",[e._v("然后作为第二个参数传入到"),t("code",[e._v("createStore")]),e._v("中")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("const store = createStore(\n  reducer,\n  applyMiddleware(thunk, logger)\n);\n")])])]),t("h3",{attrs:{id:"redux-thunk"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#redux-thunk"}},[e._v("#")]),e._v(" redux-thunk")]),e._v(" "),t("p",[t("code",[e._v("redux-thunk")]),e._v("是官网推荐的异步处理中间件")]),e._v(" "),t("p",[e._v("默认情况下的"),t("code",[e._v("dispatch(action)")]),e._v("，"),t("code",[e._v("action")]),e._v("需要是一个"),t("code",[e._v("JavaScript")]),e._v("的对象")]),e._v(" "),t("p",[t("code",[e._v("redux-thunk")]),e._v("中间件会判断你当前传进来的数据类型，如果是一个函数，将会给函数传入参数值（dispatch，getState）")]),e._v(" "),t("ul",[t("li",[e._v("dispatch函数用于我们之后再次派发action")]),e._v(" "),t("li",[e._v("getState函数考虑到我们之后的一些操作需要依赖原来的状态，用于让我们可以获取之前的一些状态")])]),e._v(" "),t("p",[e._v("所以"),t("code",[e._v("dispatch")]),e._v("可以写成下述函数的形式：")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v('const getHomeMultidataAction = () => {\n  return (dispatch) => {\n    axios.get("http://xxx.xx.xx.xx/test").then(res => {\n      const data = res.data.data;\n      dispatch(changeBannersAction(data.banner.list));\n      dispatch(changeRecommendsAction(data.recommend.list));\n    })\n  }\n}\n')])])]),t("h3",{attrs:{id:"redux-logger"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#redux-logger"}},[e._v("#")]),e._v(" redux-logger")]),e._v(" "),t("p",[e._v("如果想要实现一个日志功能，则可以使用现成的"),t("code",[e._v("redux-logger")])]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("import { applyMiddleware, createStore } from 'redux';\nimport createLogger from 'redux-logger';\nconst logger = createLogger();\n\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n);\n")])])]),t("p",[e._v("这样我们就能简单通过中间件函数实现日志记录的信息")]),e._v(" "),t("h2",{attrs:{id:"三、实现原理"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#三、实现原理"}},[e._v("#")]),e._v(" 三、实现原理")]),e._v(" "),t("p",[e._v("首先看看"),t("code",[e._v("applyMiddlewares")]),e._v("的源码")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("export default function applyMiddleware(...middlewares) {\n  return (createStore) => (reducer, preloadedState, enhancer) => {\n    var store = createStore(reducer, preloadedState, enhancer);\n    var dispatch = store.dispatch;\n    var chain = [];\n\n    var middlewareAPI = {\n      getState: store.getState,\n      dispatch: (action) => dispatch(action)\n    };\n    chain = middlewares.map(middleware => middleware(middlewareAPI));\n    dispatch = compose(...chain)(store.dispatch);\n\n    return {...store, dispatch}\n  }\n}\n")])])]),t("p",[e._v("所有中间件被放进了一个数组"),t("code",[e._v("chain")]),e._v("，然后嵌套执行，最后执行"),t("code",[e._v("store.dispatch")]),e._v("。可以看到，中间件内部（"),t("code",[e._v("middlewareAPI")]),e._v("）可以拿到"),t("code",[e._v("getState")]),e._v("和"),t("code",[e._v("dispatch")]),e._v("这两个方法")]),e._v(" "),t("p",[e._v("在上面的学习中，我们了解到了"),t("code",[e._v("redux-thunk")]),e._v("的基本使用")]),e._v(" "),t("p",[e._v("内部会将"),t("code",[e._v("dispatch")]),e._v("进行一个判断，然后执行对应操作，原理如下：")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v('function patchThunk(store) {\n    let next = store.dispatch;\n\n    function dispatchAndThunk(action) {\n        if (typeof action === "function") {\n            action(store.dispatch, store.getState);\n        } else {\n            next(action);\n        }\n    }\n\n    store.dispatch = dispatchAndThunk;\n}\n')])])]),t("p",[e._v("实现一个日志输出的原理也非常简单，如下：")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v('let next = store.dispatch;\n\nfunction dispatchAndLog(action) {\n  console.log("dispatching:", addAction(10));\n  next(addAction(5));\n  console.log("新的state:", store.getState());\n}\n\nstore.dispatch = dispatchAndLog;\n')])])]),t("h2",{attrs:{id:"参考文献"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#参考文献"}},[e._v("#")]),e._v(" 参考文献")]),e._v(" "),t("ul",[t("li",[e._v("http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_two_async_operations.html")]),e._v(" "),t("li",[e._v("http://cn.redux.js.org/")])])])}),[],!1,null,null,null);t.default=n.exports}}]);