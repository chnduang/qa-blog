## axios 是如何封装 HTTP 请求的

> [https://mp.weixin.qq.com/s/Wbcjp3Lh44nrInFc3IX85w](https://mp.weixin.qq.com/s/Wbcjp3Lh44nrInFc3IX85w)

Axios 毋庸多说大家在前端开发中常用的一个发送 HTTP 请求的库，用过的都知道。本文用来整理项目中常用的 Axios 的封装使用。同时学习源码，手写实现 Axios 的核心代码。

### Axios 常用封装

#### 是什么

Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中。它的特性：

- 从浏览器中创建 `XMLHttpRequests`
- 从 node.js 创建 `http` 请求
- 支持 `Promise` API
- 拦截请求和响应
- 转换请求数据和响应数据
- 取消请求
- 自动转换 JSON 数据
- 客户端支持防御 XSRF官网地址：http://www.axios-js.com/zh-cn/docs/#axios-config

Axios 使用方式有两种：一种是直接使用全局的 Axios 对象；另外一种是通过 `axios.create(config)` 方法创建一个实例对象，使用该对象。两种方式的区别是通过第二种方式创建的实例对象更清爽一些；全局的 Axios 对象其实也是创建的实例对象导出的，它本身上加载了很多默认属性。后面源码学习的时候会再详细说明。

#### 请求

Axios 这个 HTTP 的库比较灵活，给用户多种发送请求的方式，以至于有些混乱。细心整理会发现，全局的 Axios（或者 `axios.create(config)`创建的对象） 既可以当作对象使用，也可以当作函数使用：

```
// axios 当作对象使用
axios.request(config)
axios.get(url[, config])
axios.post(url[, data[, config]])
// axios() 当作函数使用。 发送 POST 请求
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
});
```

后面源码学习的时候会再详细说明为什么 Axios 可以实现两种方式的使用。

#### 取消请求

可以使用 `CancelToken.source` 工厂方法创建 cancel token：

```
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/user/12345', {
  cancelToken: source.token
}).catch(function(thrown) {
  if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
     // 处理错误
  }
});

// 取消请求（message 参数是可选的）
source.cancel('Operation canceled by the user.');
```

source 有两个属性：一个是 `source.token` 标识请求；另一个是 `source.cancel()` 方法，该方法调用后，可以让 CancelToken 实例的 promise 状态变为 `resolved`，从而触发 xhr 对象的 abort() 方法，取消请求。

#### 拦截

Axios 还有一个奇妙的功能点，可以在发送请求前对请求进行拦截，对相应结果进行拦截。结合业务场景的话，在中台系统中完成登录后，获取到后端返回的 token，可以将 token 添加到 header 中，以后所有的请求自然都会加上这个自定义 header。

```
//拦截1 请求拦截
instance.interceptors.request.use(function(config){
    //在发送请求之前做些什么
    const token = sessionStorage.getItem('token');
    if(token){
        const newConfig = {
            ...config,
            headers: {
                token: token
            }
        }
        return newConfig;
    }else{
        return config;
    }
}, function(error){
    //对请求错误做些什么
    return Promise.reject(error);
});
```

我们还可以利用请求拦截功能实现 **取消重复请求**，也就是在前一个请求还没有返回之前，用户重新发送了请求，需要先取消前一次请求，再发送新的请求。比如搜索框自动查询，当用户修改了内容重新发送请求的时候需要取消前一次请求，避免请求和响应混乱。再比如表单提交按钮，用户多次点击提交按钮，那么我们就需要取消掉之前的请求，保证只有一次请求的发送和响应。

实现原理是使用一个对象记录已经发出去的请求，在请求拦截函数中先判断这个对象中是否记录了本次请求信息，如果已经存在，则取消之前的请求，将本次请求添加进去对象中；如果没有记录过本次请求，则将本次请求信息添加进对象中。最后请求完成后，在响应拦截函数中执行删除本次请求信息的逻辑。

```
// 拦截2   重复请求，取消前一个请求
const promiseArr = {};
instance.interceptors.request.use(function(config){
    console.log(Object.keys(promiseArr).length)
    //在发送请求之前做些什么
    let source=null;
    if(config.cancelToken){
        // config 配置中带了 source 信息
        source = config.source;
    }else{
        const CancelToken = axios.CancelToken;
        source = CancelToken.source();
        config.cancelToken = source.token;
    }
    const currentKey = getRequestSymbol(config);
    if(promiseArr[currentKey]){
        const tmp = promiseArr[currentKey];
        tmp.cancel("取消前一个请求");
        delete promiseArr[currentKey];
        promiseArr[currentKey] = source;
    }else{
        promiseArr[currentKey] = source;
    }
    return config;

}, function(error){
    //对请求错误做些什么
    return Promise.reject(error);
});
// 根据 url、method、params 生成唯一标识，大家可以自定义自己的生成规则
function getRequestSymbol(config){
    const arr = [];
    if(config.params){
        const data = config.params;
        for(let key of Object.keys(data)){
            arr.push(key+"&"+data[key]);
        }
        arr.sort();
    }
    return config.url+config.method+arr.join("");
}

instance.interceptors.response.use(function(response){
    const currentKey = getRequestSymbol(response.config);
    delete promiseArr[currentKey];
    return response;
}, function(error){
    //对请求错误做些什么
    return Promise.reject(error);
});
```

最后，我们可以在响应拦截函数中统一处理返回码的逻辑：

```
// 响应拦截
instance.interceptors.response.use(function(response){
    // 401 没有登录跳转到登录页面
    if(response.data.code===401){
        window.location.href = "http://127.0.0.1:8080/#/login";
    }else if(response.data.code===403){
        // 403 无权限跳转到无权限页面
        window.location.href = "http://127.0.0.1:8080/#/noAuth";
    }
    return response;
}, function(error){
    //对请求错误做些什么
    return Promise.reject(error);
})
```

#### 文件下载

通常文件下载有两种方式：一种是通过文件在服务器上的对外地址直接下载；还有一种是通过接口将文件以二进制流的形式下载。

第一种：**同域名** 下使用 `a` 标签下载：

```
// httpServer.js
const express = require("express");
const path = require('path');
const app = express();

//静态文件地址
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, '../')));
app.listen(8081, () => {
  console.log("服务器启动成功！")
});
// index.html
<a href="test.txt" download="test.txt">下载</a>
```

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

第二种：二进制文件流的形式传递，我们直接访问该接口并不能下载文件，一定程度保证了数据的安全性。比较多的场景是：后端接收到查询参数，查询数据库然后通过插件动态生成 excel 文件，以文件流的方式让前端下载。

这时候，我们可以将请求文件下载的逻辑进行封装。将二进制文件流存在 `Blob` 对象中，再将其转为 url 对象，最后通过 a 标签下载。

```
//封装下载
export function downLoadFetch(url, params = {}, config={}) {
    //取消
    const downSource = axios.CancelToken.source();
    document.getElementById('downAnimate').style.display = 'block';
    document.getElementById('cancelBtn').addEventListener('click', function(){
        downSource.cancel("用户取消下载");
        document.getElementById('downAnimate').style.display = 'none';
    }, false);
    //参数
    config.params = params;
    //超时时间
    config.timeout = config.timeout ? config.timeout : defaultDownConfig.timeout;
    //类型
    config.responseType = defaultDownConfig.responseType;
    //取消下载
    config.cancelToken = downSource.token;
    return instance.get(url, config).then(response=>{
        const content = response.data;
        const url = window.URL.createObjectURL(new Blob([content]));
        //创建 a 标签
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        //文件名  Content-Disposition: attachment; filename=download.txt
        const filename = response.headers['content-disposition'].split(";")[1].split("=")[1];
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return {
            status: 200,
            success: true
        }
    })
}
```

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

https://juejin.cn/post/6878912072780873742



### 手写 Axios 核心代码

写了这么多用法终于到正题了，手写 Axios 核心代码。Axios 这个库源码不难阅读，没有特别复杂的逻辑，大家可以放心阅读 😂 。

源码入口是这样查找：在项目 `node_modules` 目录下，找到 `axios` 模块的 `package.json` 文件，其中 `"main": "index.js",` 就是文件入口。一步步我们可以看到源码是怎么串起来的。

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

模仿上面的目录结构，我们创建自己的目录结构：

```
axios-js
│  index.html
│  
└─lib
        adapter.js
        Axios.js
        axiosInstance.js
        CancelToken.js
        InterceptorManager.js
```

#### Axios 是什么

上面有提到我们使用的全局 Axios 对象其实也是构造出来的 axios，既可以当对象使用调用 get、post 等方法，也可以直接当作函数使用。这是因为全局的 Axios 其实是函数对象 `instance` 。源码位置在 axios/lib/axios.js 中。具体代码如下：

```
// axios/lib/axios.js
//创建 axios 实例
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  //instance 对象是 bind 返回的函数
  var instance = bind(Axios.prototype.request, context);
  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);
  // Copy context to instance
  utils.extend(instance, context);
  return instance;
}

// 实例一个 axios
var axios = createInstance(defaults);

// 向这个实例添加 Axios 属性
axios.Axios = Axios;

// 向这个实例添加 create 方法
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};
// 向这个实例添加 CancelToken 方法
axios.CancelToken = require('./cancel/CancelToken');
// 导出实例 axios
module.exports.default = axios;
```

根据上面的源码，我们可以简写一下自己实现 Axios.js 和 axiosInstance.js：

```
// Axios.js
//Axios 主体
function Axios(config){
}

// 核心方法，发送请求
Axios.prototype.request = function(config){
}

Axios.prototype.get = function(url, config={}){
    return this.request({url: url, method: 'GET', ...config});
}

Axios.prototype.post = function(url, data, config={}){
    return this.request({url: url, method: 'POST', data: data, ...config})
}
export default Axios;
```

在 axiosInstance.js 文件中，实例化一个 Axios 得到 context，再将原型对象上的方法绑定到 instance 对象上，同时将 context 的属性添加到 instance 上。这样 instance 就成为了一个函数对象。既可以当作对象使用，也可以当作函数使用。

```
// axiosInstance.js
//创建实例
function createInstance(config){
    const context = new Axios(config);
    var instance = Axios.prototype.request.bind(context);
    //将 Axios.prototype 属性扩展到 instance 上
    for(let k of Object.keys(Axios.prototype)){
        instance[k] = Axios.prototype[k].bind(context);
    }
    //将 context 属性扩展到 instance 上
    for(let k of Object.keys(context)){
        instance[k] = context[k]
    }
    return instance;
}

const axios = createInstance({});
axios.create = function(config){
    return createInstance(config);
}
export default axios;
```

也就是说 axios.js 中导出的 axios 对象并不是 `new Axios()` 方法返回的对象 context，而是 `Axios.prototype.request.bind(context)` 执行返回的 `instance`，通过遍历 `Axios.prototype` 并改变其 this 指向到 context；遍历 context 对象让 instance 对象具有 context 的所有属性。这样 instance 对象就无敌了，😎 既拥有了 `Axios.prototype` 上的所有方法，又具有了 context 的所有属性。

#### 请求实现

我们知道 Axios 在浏览器中会创建 XMLHttpRequest 对象，在 node.js 环境中创建 http 发送请求。`Axios.prototype.request()` 是发送请求的核心方法，这个方法其实调用的是 `dispatchRequest` 方法，而 `dispatchRequest` 方法调用的是 `config.adapter || defaults.adapter` 也就是自定义的 adapter 或者默认的 `defaults.adapter`，默认`defaults.adapter` 调用的是 getDefaultAdapter 方法，源码：

```
function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}
```

哈哈哈，getDefaultAdapter 方法最终根据当前的环境返回不同的实现方法，这里用到了 **适配器模式**。我们只用实现 xhr 发送请求即可：

```
//适配器 adapter.js
function getDefaultAdapter(){
    var adapter;
    if(typeof XMLHttpRequest !== 'undefined'){
        //导入 XHR 对象请求
        adapter = (config)=>{
            return xhrAdapter(config);
        }
    }
    return adapter;
}
function xhrAdapter(config){
    return new Promise((resolve, reject)=>{
        var xhr = new XMLHttpRequest();
        xhr.open(config.method, config.url, true);
        xhr.send();
        xhr.onreadystatechange = ()=>{
            if(xhr.readyState===4){
                if(xhr.status>=200&&xhr.status<300){
                    resolve({
                        data: {},
                        status: xhr.status,
                        statusText: xhr.statusText,
                        xhr: xhr
                    })
                }else{
                    reject({
                        status: xhr.status
                    })
                }
            }
        };
    })
}
export default getDefaultAdapter;
```

这样就理顺了，getDefaultAdapter 方法每次执行会返回一个 Promise 对象，这样 Axios.prototype.request 方法可以得到执行 xhr 发送请求的 Promise 对象。

给我们的 Axios.js 添加发送请求的方法：

```
//Axios.js
import getDefaultAdapter from './adapter.js';
Axios.prototype.request = function(config){
    const adapter = getDefaultAdapter(config);
    var promise = Promise.resolve(config);
    var chain = [adapter, undefined];
    while(chain.length){
        promise = promise.then(chain.shift(), chain.shift());
    }
    return promise;
}
```

#### 拦截器实现

拦截器的原理在于 `Axios.prototype.request` 方法中的 `chain` 数组，把请求拦截函数添加到 `chain` 数组前面，把响应拦截函数添加到数组后面。这样就可以实现发送前拦截和响应后拦截的效果。![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)创建 InterceptorManager.js

```
//InterceptorManager.js 
//拦截器
function InterceptorManager(){
    this.handlers = [];
}
InterceptorManager.prototype.use = function(fulfilled, rejected){
    this.handlers.push({
        fulfilled: fulfilled,
        rejected: rejected
    });
    return this.handlers.length -1;
}

export default InterceptorManager;
```

在 Axios.js 文件中，构造函数有 `interceptors`属性：

```
//Axios.js
function Axios(config){
    this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
    }
}
```

这样我们在 Axios.prototype.request 方法中对拦截器添加处理：

```
//Axios.js
Axios.prototype.request = function(config){
    const adapter = getDefaultAdapter(config);
    var promise = Promise.resolve(config);
    var chain = [adapter, undefined];
    //请求拦截
    this.interceptors.request.handlers.forEach(item=>{
        chain.unshift(item.rejected);
        chain.unshift(item.fulfilled);
        
    });
    //响应拦截
    this.interceptors.response.handlers.forEach(item=>{
        chain.push(item.fulfilled);
        chain.push(item.rejected)
    });
    console.dir(chain);
    while(chain.length){
        promise = promise.then(chain.shift(), chain.shift());
    }
    return promise;
}
```

所以拦截器的执行顺序是：`请求拦截2 -> 请求拦截1 -> 发送请求 -> 响应拦截1 -> 响应拦截2`

#### 取消请求

来到 Axios 最精彩的部分了，取消请求。我们知道 xhr 的 `xhr.abort();` 函数可以取消请求。那么什么时候执行这个取消请求的操作呢？得有一个信号告诉 xhr 对象什么时候执行取消操作。取消请求就是未来某个时候要做的事情，你能想到什么呢？对，就是 Promise。Promise 的 `then`方法只有 Promise 对象的状态变为 resolved 的时候才会执行。我们可以利用这个特点，在 Promise 对象的 then 方法中执行取消请求的操作。看代码：

```
//CancelToken.js
// 取消请求
function CancelToken(executor){
    if(typeof executor !== 'function'){
        throw new TypeError('executor must be a function.')
    }
    var resolvePromise;
    this.promise = new Promise((resolve)=>{
        resolvePromise = resolve;
    });
    executor(resolvePromise)
}
CancelToken.source = function(){
    var cancel;
    var token = new CancelToken((c)=>{
        cancel = c;
    })
    return {
        token,
        cancel
    };
}
export default CancelToken;
```

当我们执行 `const source = CancelToken.source()`的时候，source 对象有两个字段，一个是 token 对象，另一个是 cancel 函数。在 xhr 请求中：

```
//适配器
// adapter.js
function xhrAdapter(config){
    return new Promise((resolve, reject)=>{
        ...
        //取消请求
        if(config.cancelToken){
            // 只有 resolved 的时候才会执行取消操作
            config.cancelToken.promise.then(function onCanceled(cancel){
                if(!xhr){
                    return;
                }
                xhr.abort();
                reject("请求已取消");
                // clean up xhr
                xhr = null;
            })
        }
    })
}
```

CancelToken 的构造函数中需要传入一个函数，而这个函数的作用其实是为了将能控制内部 Promise 的 resolve 函数暴露出去，暴露给 source 的 cancel 函数。这样内部的 Promise 状态就可以通过 `source.cancel()` 方法来控制啦，秒啊~ 👍

### node 后端接口

node 后端简单的接口代码：

```
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
//文件下载
const fs = require("fs");
// get 请求
router.get("/getCount", (req, res)=>{
  setTimeout(()=>{
    res.json({
      success: true,
      code: 200,
      data: 100
    })
  }, 1000)
})


// 二进制文件流
router.get('/downFile', (req, res, next) => {
  var name = 'download.txt';
  var path = './' + name;
  var size = fs.statSync(path).size;
  var f = fs.createReadStream(path);
  res.writeHead(200, {
    'Content-Type': 'application/force-download',
    'Content-Disposition': 'attachment; filename=' + name,
    'Content-Length': size
  });
  f.pipe(res);
})

// 设置跨域访问
app.all("*", function (request, response, next) {
  // 设置跨域的域名，* 代表允许任意域名跨域；http://localhost:8080 表示前端请求的 Origin 地址
  response.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  //设置请求头 header 可以加那些属性
  response.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
  //暴露给 axios https://blog.csdn.net/w345731923/article/details/114067074
  response.header("Access-Control-Expose-Headers", "Content-Disposition");
  // 设置跨域可以携带 Cookie 信息
  response.header('Access-Control-Allow-Credentials', "true");
  //设置请求头哪些方法是合法的
  response.header(
    "Access-Control-Allow-Methods",
    "PUT,POST,GET,DELETE,OPTIONS"
  );
  response.header("Content-Type", "application/json;charset=utf-8");
  next();
});

// 接口数据解析
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use('/api', router) // 路由注册

app.listen(8081, () => {
  console.log("服务器启动成功！")
});
```

### git 地址

如果大家能够跟着源码敲一遍，相信一定会有很多收获。

手写 Axios 核心代码 github 地址：https://github.com/YY88Xu/axios-js
Axios 封装：https://github.com/YY88Xu/vue2-component



\- EOF -

推荐阅读 点击标题可跳转

1、[vue 中 Axios 的封装和 API 接口的管理](http://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=2651578212&idx=2&sn=3a4bdc17b0c1808f2b5649d84eff93a1&chksm=802508a5b75281b366dca8441c3ab2dc63b93adcd139ec5bb002dc8b10fef80efa49d49d92c2&scene=21#wechat_redirect)

2、[Axios 如何取消重复请求？](http://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=2651576212&idx=2&sn=b1c3fac9534f01f4d7c68f7b88800d5c&chksm=80250055b75289430570c54ba104675cbc6e5cf15cd35154a63f1d89b9f7211fb2f88f232e0f&scene=21#wechat_redirect)

3、[经得住拷问的 HTTPS 原理解析](http://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=2651576184&idx=2&sn=58e01488d9c22b3de224e88df91ca93e&chksm=802500b9b75289afb55f9a448c6e3d3767fa5d0fba526696dea07e0f9bf167a4cd32791f373d&scene=21#wechat_redirect)