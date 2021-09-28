## Promise面试实战指北

> [https://mp.weixin.qq.com/s/hz0P_brF8uCu2DDtW_vgVQ](https://mp.weixin.qq.com/s/hz0P_brF8uCu2DDtW_vgVQ)

## 超时控制

### **背景**

1. 众所周知，fetch请求是无法设置超时时间的，因此我们需要自己去模拟一个超时控制。
2. 转盘问题，一个抽奖转盘动画效果有5秒，但是一般来说向后端请求转盘结果只需要不到一秒，因此请求结果至少得等5秒才能展现给用户。

### **问题分析**

首先，超时控制比较简单，和Promise.race()的思想是类似，或者可以直接使用这个函数去解决。

然后，转盘问题如果要答好，需要考虑两种情况。

1. 转盘动画还未完成，请求结果已经拿到了，此时要等到动画完成再展示结果给用户。
2. 转盘动画完成了，请求结果还未拿到，此时需要等待结果返回（可以设置请求超时时间）。

所以，转盘问题更适合用Promise.all()来解决。

### **实战版源码**

代码分为多个版本，从上自下，记忆难度递增但面试成绩更优，请按需选择。

一、基于`Promise.race()`的超时控制。

```
/**
 * 超时控制版本一
 */

/**
 * 辅助函数，封装一个延时promise
 * @param {number} delay 延迟时间
 * @returns {Promise<any>}
 */
function sleep(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error("timeout")), delay);
  });
}

/**
 * 将原promise包装成一个带超时控制的promise
 * @param {()=>Promise<any>} requestFn 请求函数
 * @param {number} timeout 最大超时时间
 * @returns {Promise<any>}
 */
function timeoutPromise(requestFn, timeout) {
  return Promise.race([requestFn(), sleep(timeout)]);
}

// ----------下面是测试用例------------

// 模拟一个异步请求函数
function createRequest(delay) {
  return () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve("done");
      }, delay);
    });
}

// 超时的例子
timeoutPromise(createRequest(2000), 1000).catch((error) =>
  console.error(error)
);
// 不超时的例子
timeoutPromise(createRequest(2000), 3000).then((res) => console.log(res));

复制代码
```

二、将`promise.race()`干掉。

```
/**
 * 超时控制版本二
 */

/**
 * 辅助函数，封装一个延时promise
 * @param {number} delay 延迟时间
 * @returns {Promise<any>}
 */
function sleep(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error("timeout")), delay);
  });
}

/**
 * 将原promise包装成一个带超时控制的promise
 * @param {()=>Promise<any>} requestFn 请求函数
 * @param {number} timeout 最大超时时间
 * @returns {Promise<any>}
 */
function timeoutPromise(requestFn, timeout) {
  const promises = [requestFn(), sleep(timeout)];
  return new Promise((resolve, reject) => {
    for (const p of promises) {
      p.then((res) => resolve(res)).catch((error) => reject(error));
    }
  });
}

// ----------下面是测试用例------------

// 模拟一个异步请求函数
function createRequest(delay) {
  return () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve("done");
      }, delay);
    });
}

// 超时的例子
timeoutPromise(createRequest(2000), 1000).catch((error) =>
  console.error(error)
);
// 不超时的例子
timeoutPromise(createRequest(2000), 3000).then((res) => console.log(res));

复制代码
```

三、基于`Promise.all()`的转盘问题（不考虑请求超时），和上面略有不同的是`sleep`函数超时后`Promise`从`pending`态转到`fulfilled`态而不是`rejected`态。

```
/**
 * 转盘问题不考虑超时
 */

/**
 * 辅助函数，封装一个延时promise
 * @param {number} delay 延迟时间
 * @returns {Promise<any>}
 */
function sleep(delay) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(delay), delay);
  });
}

/**
 * 将原promise包装成一个转盘promise
 * @param {()=>Promise<any>} requestFn 请求函数
 * @param {number} animationDuration 动画持续时间
 * @returns {Promise<any>}
 */
function turntablePromise(requestFn, animationDuration) {
  return Promise.all([requestFn(), sleep(animationDuration)]);
}

// ----------下面是测试用例------------

// 模拟一个异步请求函数
function createRequest(delay) {
  return () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve("done");
      }, delay);
    });
}

// 请求比转盘动画快
turntablePromise(createRequest(2000), 5000).then((res) => console.log(res));

// 请求比转盘动画慢
turntablePromise(createRequest(2000), 1000).then((res) => console.error(res));

复制代码
```

四：基于`Promise.all()`的转盘问题（考虑请求超时），无非就是拼刀刀没什么亮点。

```
/**
 * 转盘问题考虑超时
 */

/**
 * 将原promise包装成一个带超时控制的promise
 * @param {Promise<any>} request 你的请求
 * @param {number} timeout 最大超时时间
 * @returns {Promise<any>}
 */
function timeoutPromise(request, timeout) {
  function sleep(delay) {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error("timeout")), delay);
    });
  }
  const promises = [request, sleep(timeout)];
  return new Promise((resolve, reject) => {
    for (const p of promises) {
      p.then((res) => resolve(res)).catch((error) => reject(error));
    }
  });
}

/**
 * 将原promise包装成一个转盘promise
 * @param {()=>Promise<any>} requestFn 请求函数
 * @param {number} timeout 超时时间
 * @param {number} animationDuration 动画持续时间
 * @returns {Promise<any>}
 */
function turntablePromise(requestFn, timeout, animationDuration) {
  function sleep(delay) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(delay), delay);
    });
  }
  return Promise.all([timeoutPromise(requestFn(), timeout), sleep(animationDuration)]);
}

// ----------下面是测试用例------------

// 模拟一个异步请求函数
function createRequest(delay) {
  return () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve("done");
      }, delay);
    });
}

// 请求比转盘动画慢且超时
turntablePromise(createRequest(2000), 1500, 1000).catch((error) =>
  console.error(error)
);

复制代码
```

五：干掉`Promise.all()`，这版代码没有加什么核心的东西，无非就是手写一下这个api，所以留给大家自测。

## 取消重复请求

### **背景**

当用户频繁点击一个搜索Button时，会在短时间内发出大量的搜索请求，给服务器造成一定的压力，同时也会因请求响应的先后次序不同而导致渲染的数据与预期不符。这里，我们可以使用防抖来减小服务器压力，但是却没法很好地解决后面的问题。

### **问题分析**

这个问题的本质在于，同一类请求是有序发出的（根据按钮点击的次序），但是响应顺序却是无法预测的，我们通常只希望渲染最后一次发出请求响应的数据，而其他数据则丢弃。因此，我们需要丢弃（或不处理）除最后一次请求外的其他请求的响应数据。

### **实战版源码**

其实axios已经有了很好的实践，大家可以配合阿宝哥的文章来食用。此处取消`promise`的实现借助了上一章节的技巧，而在`axios`中因为所有异步都是由xhr发出的，所以`axios`的实现中还借助了xhr.abort()来取消一个请求。

```
/**
 * 取消请求
 */

function CancelablePromise() {
  this.pendingPromise = null;
}

// 包装一个请求并取消重复请求
CancelablePromise.prototype.request = function (requestFn) {
  if (this.pendingPromise) {
    this.cancel("取消重复请求");
  }
  const _promise = new Promise((resolve, reject) => (this.reject = reject));
  this.pendingPromise = Promise.race([requestFn(), _promise]);
  return this.pendingPromise;
};

// 取消当前请求
CancelablePromise.prototype.cancel = function (reason) {
  this.reject(new Error(reason));
  this.pendingPromise = null;
};

// ----------下面是测试用例------------

// 模拟一个异步请求函数
function createRequest(delay) {
  return () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve("done");
      }, delay);
    });
}


const cancelPromise = new CancelablePromise();

// 前四个请求将被自动取消
for (let i = 0; i < 5; i++) {
  cancelPromise
    .request(createRequest(1000))
    .then((res) => console.log(res)) // 最后一个 done
    .catch((err) => console.error(err)); // 前四个 error: 取消重复请求
}

// 设置一个定时器等3s，让前面的请求都处理完再继续测试
setTimeout(() => {
  // 手动取消最后一个请求
  cancelPromise
    .request(createRequest(1000))
    .then((res) => console.log(res))
    .catch((err) => console.error(err)); // error:手动取消
  cancelPromise.cancel("手动取消");
}, 3000);

// 设置一个定时器等4s，让前面的请求都处理完再继续测试
setTimeout(() => {
  cancelPromise
    .request(createRequest(1000))
    .then((res) => console.log(res)) // done
    .catch((err) => console.error(err));
}, 4000);

复制代码
```

## 限制并发请求数

### **背景**

一般来说，我们不会刻意去控制请求的并发。只有在一些场景下可能会用到，比如，收集用户的批量操作（每个操作对应一次请求），待用户操作完成后一次性发出。另外，为了减小服务器的压力，我们还会**限制并发数**。

### **问题分析**

看上去，Promise.allSettled很适合应对这样的场景，但是稍微想一下就能发现，它能控制的粒度还是太粗了。首先，它必须等待所有`Promise`都`resolve`或`reject`，其次，如果有并发限制的话用它来做还需要分批请求，实际效率也会比较低，短木板效应很明显。

### **实战版源码**

```
/**
 * 限制并发请求数
 */

/**
 * 并发请求限制并发数
 * @param {()=>Promise<any> []} requestFns 并发请求函数数组
 * @param {numer} limit 限制最大并发数
 */
function concurrentRequest(requestFns, limit) {
  // 递归函数
  function recursion(requestFn) {
    requestFn().finally(() => {
      if (_requestFns.length > 0) {
        recursion(_requestFns.pop());
      }
    });
  }
  const _requestFns = [...requestFns];
  // 限制最大并发量
  for (let i = 0; i < limit && _requestFns.length > 0; i++) {
    recursion(_requestFns.pop());
  }
}

// ----------下面是测试用例------------

// 模拟一个异步请求函数
function createRequest(delay) {
  return () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve("done");
      }, delay);
    }).then((res) => {
      console.log(res);
    });
}

const requestFns = [];
for (let i = 0; i < 10; i++) {
  requestFns.push(createRequest(1000));
}

concurrentRequest(requestFns, 3);

复制代码
```

## 管理全局loading态

### **背景**

当我们一个页面或组件涉及到多个请求时，可能会对应多个loading态的管理。在某些场景下，我们只希望用一个loading态去管理所有异步请求，当任一存在pending态的请求时，展示全局loading组件，当所有请求都fulfilled或rejected时，隐藏全局loading组件。

### **问题分析**

这个问题的关键就是在于我们需要管理所有pending态的请求，并适时更新loading态。

### **实战版源码**

```
/**
 * 管理全局loading态
 */

function PromiseManager() {
  this.pendingPromise = new Set();
  this.loading = false;
}

// 给每个pending态的promise生成一个身份标志
PromiseManager.prototype.generateKey = function () {
  return `${new Date().getTime()}-${parseInt(Math.random() * 1000)}`;
};

PromiseManager.prototype.push = function (...requestFns) {
  for (const requestFn of requestFns) {
    const key = this.generateKey();
    this.pendingPromise.add(key);
    requestFn().finally(() => {
      this.pendingPromise.delete(key);
      this.loading = this.pendingPromise.size !== 0;
    });
  }
};

// ----------下面是测试用例------------

// 模拟一个异步请求函数
function createRequest(delay) {
  return () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve("done");
      }, delay);
    }).then((res) => console.log(res));
}

const manager = new PromiseManager();

// 增加多个请求
manager.push(createRequest(1000), createRequest(2000), createRequest(3000));
manager.push(createRequest(1500));

// 每秒轮询loading态，直到loading为false
const id = setInterval(() => {
  console.log(manager.loading);
  if (!manager.loading) clearInterval(id);
}, 1000);

// 增加多个请求
manager.push(createRequest(2500));
复制代码
```

## 加餐

### **串行化的三种实现方式**

使用串行化的常见场景，请求之间有依赖关系或时序关系，如红绿灯。

```
/**
 * 串行化的三种实现
 **/

// 法一，递归法
function runPromiseInSeq1(requestFns) {
  function recursion(requestFns) {
    if (requestFns.length === 0) return;
    requestFns
      .shift()()
      .finally(() => recursion(requestFns));
  }
  const _requestFns = [...requestFns];
  recursion(_requestFns);
}
// 法二：迭代法
async function runPromiseInSeq2(requestFns) {
  for (const requestFn of requestFns) {
    await requestFn();
  }
}
// 法三：reduce
function runPromiseInSeq3(requestFns) {
  requestFns.reduce((pre, cur) => pre.finally(() => cur()), Promise.resolve());
}

// 模拟一个异步请求函数
function createRequest(delay) {
  return () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(delay);
      }, delay);
    }).then((res) => {
      console.log(res);
    });
}
// 执行顺序从左至右
const requestFns = [
  createRequest(3000),
  createRequest(2000),
  createRequest(1000),
];
// 串行调用
runPromiseInSeq1(requestFns);
// runPromiseInSeq2(requestFns);
// runPromiseInSeq3(requestFns);

复制代码
```

### **20行最简异步链式调用**

这里模拟了Promise的异步链式调用，代码出处见文章。

```
function Promise(fn) {
  this.cbs = [];

  const resolve = (value) => {
    setTimeout(() => {
      this.data = value;
      this.cbs.forEach((cb) => cb(value));
    });
  }

  fn(resolve);
}

Promise.prototype.then = function (onResolved) {
  return new Promise((resolve) => {
    this.cbs.push(() => {
      const res = onResolved(this.data);
      if (res instanceof Promise) {
        res.then(resolve);
      } else {
        resolve(res);
      }
    });
  });
};
```

## 写在后面

这位笔名`鼠子`，是22届的学弟。想要找他交流的话，可以加我微信，我拉你进群，他长期在群里。

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)个人微信

往期推荐

[TypeScript 4.4beat版本发布](http://mp.weixin.qq.com/s?__biz=Mzg5MDY1MjIxMA==&mid=2247497006&idx=2&sn=bcd167d3f9ec511e863b18808d31e75e&chksm=cfdbe673f8ac6f650c65b9f9306aa0fe95fd0322e58b23cd023d5eaebefb095ee36b1c42ea48&scene=21#wechat_redirect)

[进腾讯了](http://mp.weixin.qq.com/s?__biz=Mzg5MDY1MjIxMA==&mid=2247496983&idx=1&sn=0f6d70881803b6f97a501915e318501d&chksm=cfdbe64af8ac6f5cd04f60f3291676e3165c7b4da4187dee695d492ba64ffca05b177db1fbd0&scene=21#wechat_redirect)

[张一鸣先生的四年收获与工作感悟](http://mp.weixin.qq.com/s?__biz=Mzg5MDY1MjIxMA==&mid=2247497139&idx=1&sn=c9e5ca74d903aeccd0862bb3aa44e40f&chksm=cfdbe6eef8ac6ff8d86547accd41d2fe4bc36ff486baab04695ff86d861f23c418aae85c818c&scene=21#wechat_redirect)

收录于话题 #前端面试

14个

下一篇21 道关于性能优化的面试题（附答案）