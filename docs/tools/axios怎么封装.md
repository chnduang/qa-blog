## axios怎么封装，才能提升效率？

> [https://mp.weixin.qq.com/s/8qbSVehFyiVSpBURZYkiNA](https://mp.weixin.qq.com/s/8qbSVehFyiVSpBURZYkiNA)
>

------

作为前端开发者，每个项目基本都需要和后台交互，目前比较流行的ajax库就是axios了，当然也有同学选择request插件，这个萝卜白菜，各有所爱了。目前虽然axios有config、interceptor和各个请求方式，但是针对一个大型的项目，我们还是需要做二次封装才能快速提升开发效率！

今天我们针对axios库做二次封装，看看是否有简化我们的开发工作。![图片](https://mmbiz.qpic.cn/mmbiz_jpg/YItGPcJZoxlZdVzngA3gY7PzKHFouWzjkUx3Z7koW3LfopGf9JfbBxmwYvUibCT6PO47sQH80qnnNlQ3zIhEiaCQ/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## **创建项目**

```
  vue create axios-demo
```

## **创建目录**

```
  // 进入到项目空间中
  cd axios-demo
  // 在src下创建api目录
```

## **创建三个文件(index.js/interceptor.js/request.js)**

```
/**
 * index.js
 * api地址管理
 */
export default {
    login:'/user/login',
    getInfo:'/user/getInfo'
}
```

index.js实际上和axios封装没有关系，因为它也属于API这一层，所以我一起创建了，我个人习惯把项目所有url抽取到这里集中管理。

## **封装interceptor**

interceptor作用就是拦截，可以针对请求参数和响应结果进行拦截处理，一般在项目当中，我们主要会针对接口常规报错、网络报错、系统超时、权限认证等做拦截处理。

此处我们对通过create创建实例，设置baseUrl，timeout，然后在设置request和response的拦截。

```
/**
 * 生成基础axios对象，并对请求和响应做处理
 * 前后端约定接口返回解构规范
 * {
 *    code:0,
 *    data:"成功",
 *    message:""
 * }
 */
import axios from 'axios'
import { Message } from 'element-ui'

// 创建一个独立的axios实例
const service = axios.create({ 
    // 设置baseUr地址,如果通过proxy跨域可直接填写base地址
    baseURL: '/api',
    // 定义统一的请求头部
    headers: {
        post: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        }
    },
    // 配置请求超时时间
    timeout: 10000, 
    // 如果用的JSONP，可以配置此参数带上cookie凭证，如果是代理和CORS不用设置
    withCredentials: true
});
// 请求拦截
service.interceptors.request.use(config => {
    // 自定义header，可添加项目token
    config.headers.token = 'token';
    return config;
});
// 返回拦截
service.interceptors.response.use((response)=>{
    // 获取接口返回结果
    const res = response.data;
    // code为0，直接把结果返回回去，这样前端代码就不用在获取一次data.
    if(res.code === 0){
        return res;
    }else if(res.code === 10000){
        // 10000假设是未登录状态码
        Message.warning(res.message);
        // 也可使用router进行跳转
        window.location.href = '/#/login';
        return res;
    }else{
        // 错误显示可在service中控制，因为某些场景我们不想要展示错误
        // Message.error(res.message);
        return res;
    }
},()=>{
    Message.error('网络请求异常，请稍后重试!');
});
export default service;
```

如果是CORS/JSONP需要区分环境，可通过`process.env.NODE_ENV`来选择使用哪个地址。如果使用的是代理，则Vue项目需要在vue.config.js中的proxy里面增加环境判断。

```
process.env.NODE_ENV=== "production" ? "http://www.prod.com/api" : "http://localhost/:3000/api"
```

以上是针对interceptor做的二次封装，上面我们没有把常规错误放进去，是因为我们想要在后期控制错误是否显示，所以我们会在request中处理。

## **封装axios**

创建request文件，针对axios做适合业务发展的封装，很多时候架构师做公共机制都是为了迎合自身项目需要，而并非一味求大做全，所以这个大家要适当调整，比如我们只用get/post请求。

```
/**
 * request.js
 * 通过promise对axios做二次封装，针对用户端参数，做灵活配置
 */
import { Message,Loading } from 'element-ui';
import instance from './interceptor'

/**
 * 核心函数，可通过它处理一切请求数据，并做横向扩展
 * @param {url} 请求地址
 * @param {params} 请求参数
 * @param {options} 请求配置，针对当前本次请求；
 * @param loading 是否显示loading
 * @param mock 本次是否请求mock而非线上
 * @param error 本次是否显示错误
 */
function request(url,params,options={loading:true,mock:false,error:true},method){
    let loadingInstance;
    // 请求前loading
    if(options.loading)loadingInstance=Loading.service();
    return new Promise((resolve,reject)=>{
        let data = {}
        // get请求使用params字段
        if(method =='get')data = {params}
        // post请求使用data字段
        if(method =='post')data = {data:params}
        // 通过mock平台可对局部接口进行mock设置
        if(options.mock)url='http://www.mock.com/mock/xxxx/api';
        instance({
            url,
            method,
            ...data
        }).then((res)=>{
            // 此处作用很大，可以扩展很多功能。
            // 比如对接多个后台，数据结构不一致，可做接口适配器
            // 也可对返回日期/金额/数字等统一做集中处理
            if(res.status === 0){
                resolve(res.data);
            }else{
                // 通过配置可关闭错误提示
                if(options.error)Message.error(res.message);
                reject(res);
            }
        }).catch((error)=>{
            Message.error(error.message)
        }).finally(()=>{
            loadingInstance.close();
        })
    })
}
// 封装GET请求
function get(url,params,options){
    return request(url,params,options,'get')
}
// 封装POST请求
function post(url,params,options){
    return request(url,params,options,'post')
}
export default {
    get,post
}
```

request.js主要针对axios做二次封装，目的同样是为了拦截所有前端请求，这样可以做前端loading效果、mock、错误拦截、错误弹框显示、数据适配、参数适配、环境适配等工作。

> 
>
> 接下来，我们看下如何使用
>
> ”

- **打开main.js**

```
// 导入插件
import request from './api/request'
// 在原型上扩展,这样不用在每个页面都导入request
Vue.prototype.request = request;
```

- **请求调用**

```
  this.request.get('/login',{userName:'admin',userPwd:'admin'}).then((res={})=>{
        // 此处只接收成功数据，失败数据不返回
  }).catch(()=>{
      // catch 可以不要，如果想要捕获异常，就加上去
  })
```

如果不做二次封装，我们很难实现以上功能点，这是在公司做了很多个中型后台系统后，总结出来的一些个人经验，我相信您看了之后，会有一些启发和帮助，如果有疑问或者不够完善可以留言或联系我，我进行修订。
