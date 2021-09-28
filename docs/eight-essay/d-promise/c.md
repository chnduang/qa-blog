# 面试官问：Promise.all 使用、原理实现及错误处理

> [https://mp.weixin.qq.com/s/bkM4AzVqIyPxrMIFAVKzVQ](https://mp.weixin.qq.com/s/bkM4AzVqIyPxrMIFAVKzVQ)

[面试官也在看的前端面试资料](https://mp.weixin.qq.com/s?__biz=MzUzNjk5MTE1OQ==&mid=2247508949&idx=2&sn=c4f8376efba9f9fb624faf81427c1763&chksm=faef270dcd98ae1b54a343576dfb922a98fe681bcaf0ad9e1d440f82ddd972f9aa69eb926344&mpshare=1&scene=1&srcid=0827FfourWtedHTwZZOJLRhF&sharer_sharetime=1630048605160&sharer_shareid=127a669cda28f5e879b4b19ecc7309ed&key=63127eb904e6c8346b0384b791521a36cd66b5626bf0a6c8a8f9ee8f1d6890b78240e5d9e74faecd491688931b02fba2e87946f53ec4053022a48f0b0aaf3be80ad32efe23c8b1274afc14c43a0793be0489ef7714a7390e64de6809e277eb57c4748f18556a53333293442040fa2e1faf500418d7ed9e32582491241e27528a&ascene=1&uin=MTE5NzkwMDQyOA%3D%3D&devicetype=iMac+MacBookPro16%2C1+OSX+OSX+10.16+build(20G95)&version=13010510&nettype=WIFI&lang=zh_CN&fontScale=100&exportkey=AbWgl66Uj5%2FvBRjeEqh5XWE%3D&pass_ticket=WBzXf28aipdMjfPE6buIUmjRRENnEUZJc7Clv3wlndM8%2FMSnIYgRZleYZs6kueJz&wx_header=0&fontgear=3.000000)

## 一、Promise概念

Promise是JS异步编程中的重要概念，异步抽象处理对象，是目前比较流行Javascript异步编程解决方案之一。Promise.all()接受一个由promise任务组成的数组，可以同时处理多个promise任务，当所有的任务都执行完成时，Promise.all()返回resolve，但当有一个失败(reject)，则返回失败的信息，即使其他promise执行成功，也会返回失败。和后台的事务类似。和rxjs中的forkJoin方法类似，合并多个 Observable 对象 ，等到所有的 Observable 都完成后，才一次性返回值。

## 二、Promise.all如何使用

对于 Promise.all(arr) 来说，在参数数组中所有元素都变为决定态后，然后才返回新的 promise。

```
// 以下 demo，请求两个 url，当两个异步请求返还结果后，再请求第三个 url
const p1 = request(`http://some.url.1`)
const p2 = request(`http://some.url.2`)
Promise.all([p1, p2])
  .then((datas) => { // 此处 datas 为调用 p1, p2 后的结果的数组
    return request(`http://some.url.3?a=${datas[0]}&b=${datas[1]}`)
  })
  .then((data) => {
    console.log(msg)
  })
```

## 三、Promise.all原理实现

```
function promiseAll(promises){
     return new Promise(function(resolve,reject){
            if(!Array.isArray(promises)){
             return reject(new TypeError("argument must be anarray"))
           }
    var countNum=0;
    var promiseNum=promises.length;
    var resolvedvalue=new Array(promiseNum);
    for(var i=0;i<promiseNum;i++){
      (function(i){
         Promise.resolve(promises[i]).then(function(value){
            countNum++;
           resolvedvalue[i]=value;
          if(countNum===promiseNum){
              return resolve(resolvedvalue)
          }
       },function(reason){
        return reject(reason)
      )
     })(i)
    }
})
}
var p1=Promise.resolve(1),
p2=Promise.resolve(2),
p3=Promise.resolve(3);
promiseAll([p1,p2,p3]).then(function(value){
console.log(value)
})
```

## 四、Promise.all错误处理

有时候我们使用Promise.all()执行很多个网络请求，可能有一个请求出错，但我们并不希望其他的网络请求也返回reject，要错都错，这样显然是不合理的。如何做才能做到promise.all中即使一个promise程序reject，promise.all依然能把其他数据正确返回呢?

### 1、全部改为串行调用（失去了node 并发优势）

### 2、当promise捕获到error 的时候，代码吃掉这个异常，返回resolve，约定特殊格式表示这个调用成功了

```
var p1 =new Promise(function(resolve,reject){
    setTimeout(function(){
        resolve(1);
    },0)
});
var p2 = new Promise(function(resolve,reject){
        setTimeout(function(){
            resolve(2);
        },200)
 });
 var p3 = new Promise(function(resolve,reject){
        setTimeout(function(){
            try{
            console.log(XX.BBB);
            }
            catch(exp){
                resolve("error");
            }
        },100)
});
Promise.all([p1, p2, p3]).then(function (results) {
    console.log("success")
     console.log(results);
}).catch(function(r){
    console.log("err");
    console.log(r);
});
```

来自：https://muyiy.cn/question/

