## 两天时间，实现自己的 Promise

> [https://mp.weixin.qq.com/s/-2vIKWRPzdXCZlPupw4XcA](https://mp.weixin.qq.com/s/-2vIKWRPzdXCZlPupw4XcA)

## 01. 目录

- **02.自下而上**[1]
- **03.如何实现**[2]
- **04.Promise/A+规范**[3]
- **05.更多优化**[4]
- **06.源码**[5]
- **07.小结**[6]
- **08.其他参考**[7]

## 02.自下而上

### 02.01 基本概念

- 首先我们来整理一些 `Promise` 基本的概念，包括私有状态，内部方法，静态方法等等。

#### 私有属性

- 私有属性包括状态和值 `PromisState` `PromiseResult`，这些属性外部无法访问。

- 状态属性有以下三种：

- - `pending` 初始化状态
  - `fulfilled` 兑现(完成)
  - `rejected` 拒绝

- 值属性，由 `resolve` 或 `reject` 处理来决定。

#### 实例方法

- **`then`**[8]
- **`catch`**[9]
- **`finally`**[10]

#### 静态方法

- **`Promise.reject`**[11]
- **`Promise.resolve`**[12]
- **`Promise.race`**[13]
- **`Promise.all`**[14]
- **`Promise.allSettled`**[15]
- **`Promise.any`**[16]

## 03.如何实现

### 03.01 基础类

- 在罗列所有的状态和方法之后，我们首先来实现一个最基础的 `Promise` 类。

- 最基础的类，包括以下核心几点：

  ```
  /**
   * Promise 内部状态的枚举
   */
  enum PROMISE_STATES {
    PENDING = 'pending',
    FULFILLED = 'fulfilled',
    REJECTED = 'rejected'
  }
  
  type PromiseStates = PROMISE_STATES.PENDING | PROMISE_STATES.FULFILLED | PROMISE_STATES.REJECTED;
  
  export const isFunction = (fn: any):boolean => typeof fn === 'function';
  export const isObject = (obj: any):boolean => typeof obj === 'object';
  
  class PromiseLike {
    protected PromiseState: PromiseStates;
    protected PromiseResult: any;
  
  constructor(executor) {
    this.PromiseState = PROMISE_STATES.PENDING;
    this.PromiseResult = undefined;
  
    executor(this._resolve, this._reject)
  }
  
  _resolve = (value?: any) => {
    if (this.PromiseState !== PROMISE_STATES.PENDING) {
      return;
    }
    this.PromiseState = PROMISE_STATES.FULFILLED;
    this.PromiseResult = value;
  }
  
  _reject = (value?: any) => {
    if (this.PromiseState !== PROMISE_STATES.PENDING) {
      return;
    }
    this.PromiseState = PROMISE_STATES.REJECTED;
    this.PromiseResult = value;
  }
  }
  复制代码
  ```

- - 拥有私有状态，也有着能够改变私有状态的私有方法。
  - 同时接收一个执行器函数作为参数，执行器函数内部则是预先定义好的私有方法。
  - 私有状态一旦改变（兑现或拒绝）后不可逆。

#### resolve 和 reject

- 上述代码比较好理解， 我们定义了状态，定义了执行器函数以及相关的两个参数，这两个参数对应的方法分别修改了对应的状态。

- 但是差点忘了， `Promise` 是异步的，意味着这两个函数处理也应当是异步的；这里可以使用 `setTimeout` 来模拟异步进程。这部分还可以优化，后面我们会提到。

  ```
  class PromiseLike {
  /**
    * 使状态变更为 fulfilled
    * 调用注册的事件，注意调用后进行清除
    * @param value
    * @returns
    */
  _resolve = (value?: any) => {
    const resolveCb = () => {
      if (this.PromiseState !== PROMISE_STATES.PENDING) {
        return;
      }
  
      this.PromiseState = FULFILLED;
      this.PromiseResult = value;
    }
  
    // 使任务变成异步的
    setTimeout(resolveCb, 0);
  }
  
  /**
   * 使状态变更为 rejected
    * @param value
    */
  _reject = (value?: any) => {
    const rejectCb = () => {
      if (this.PromiseState !== PROMISE_STATES.PENDING) {
        return;
      }
  
      this.PromiseState = REJECTED;
      this.PromiseResult = value;
    }
  
    setTimeout(rejectCb, 0);
  }
  }
  复制代码
  ```

- 我们可以接着实现相关的静态方法，因为它们所做的事很简单，就是修改当前的内部状态，于是完全可以直接调用当前类实例化来处理。

- 重复代码不再罗列，下面是新增的静态方法：

  ```
  class PromiseLike {
  // ...sth
  static resolve(value?: any) {
    return new PromiseLike((resolve) => resolve(value));
  }
  
  static reject(value?: any) {
    return new PromiseLike((resolve, reject) => reject(value));
  }
  }
  复制代码
  ```

- 一个简单的基础类就这样完成了。不过先不要着急，当前的实现显然有许多要完善的地方，甚至也许有错误，让我们进一步来梳理。

### 03.02 原型方法

#### `Promise.prototype.then`

- 相信对 `Promise` 有所了解的都知道 `Promise` 的 `then` 方法以及它的链式调用。本质上，**它是对 `Thenable` 接口的具体实现。**这句话很重要，后面会用到。

- 让我们先来回顾一下 `then` 的用法：

  ```
  Promise.resolve(29).then(function fulfilled(res) {
  console.info(res);
  return res;
  }, function rejected(err) {
  console.error(err);
  });
  复制代码
  ```

- `then` 方法接收两个参数，分别用来处理 `resolve` 和 `reject` 的结果，称之为完成回调和拒绝回调。默认情况下，同时注册这两个回调方法，一次只可能会调用到其中一个。即使在前一个函数中抛出了异常，第二个异常捕获函数也无法立即捕获。

- - 完成回调，接收先前 `promise` 的 `resolve` 值作为默认参数，处理对应数据，并返回一个值，作为下一个 `then` 内部函数调用的默认参数。
  - 让我们再仔细想想， `then` 注册事件的调用次数是否和注册次数相同？是的。假如使用 `then` 注册了多个回调函数，则它们会依次执行。这意味着我们得在原先的基础上加上相应的事件队列。
  - 另外别忘了， `then` 方法支持**链式调用**，我们这里先使用 `return this` 的方式来简单实现。

- 现在我们对上面的基础类进行改进和修复。

  ```
  export interface ICallbackFn {
  (value?: any): any;
  }
  
  type CallbackParams = ICallbackFn | null;
  
  export interface IExecutorFn {
  (resolve: ICallbackFn,  reject: ICallbackFn): any;
  }
  
  class PromiseLike {
  protected PromiseState: PromiseStates;
  protected PromiseResult: any;
  
  resolveCallbackQueues: Array<ICallbackFn>;
  rejectCallbackQueues: Array<ICallbackFn>;
  
  constructor(executor: IExecutorFn) {
    if (!isFunction(executor)) {
      throw new Error('Promise resolver undefined is not a function');
    }
    this.PromiseState = PENDING;
    this.PromiseResult = undefined;
  
    // 分别用于两个注册事件保存的数组
    this.resolveCallbackQueues = [];
    this.rejectCallbackQueues = [];
  
    executor(this._resolve, this._reject);
  }
  
  /**
   * 使状态变更为 fulfilled
  * 调用注册的事件，注意调用后进行清除
  * @param value
  * @returns
  */
  _resolve = (value: any) => {
    const resolveCb = () => {
      if (this.PromiseState !== PROMISE_STATES.PENDING) {
        return;
      }
      while (this.resolveCallbackQueues.length) {
        const fn = this.resolveCallbackQueues.shift();
        fn && fn(value);
      }
      this.PromiseState = FULFILLED;
      this.PromiseResult = value;
    }
  
    // 使任务变成异步的
    setTimeout(resolveCb, 0);
  }
  
  /**
   * 使状态变更为 rejected
  * @param value
  */
  _reject = (value: any) => {
    const rejectCb = () => {
      if (this.PromiseState !== PROMISE_STATES.PENDING) {
        return;
      }
      while (this.rejectCallbackQueues.length) {
        const fn = this.rejectCallbackQueues.shift();
        fn && fn(value);
      }
      this.PromiseState = REJECTED;
      this.PromiseResult = value;
    }
  
    setTimeout(rejectCb, 0);
  }
  
  /**
   * 根据当前不同状态来执行对应逻辑
  * 如果在默认状态就是注册对应事件
  * 如果状态变化则是执行对应事件
  * @param onFulfilled
  * @param onRejected
  * @returns
  */
  then = (onFulfilled, onRejected) => {
    switch (this.PromiseState) {
      case PENDING:
        isFunction(onFulfilled) && this.resolveCallbackQueues.push(onFulfilled);
        isFunction(onRejected) && this.rejectCallbackQueues.push(onRejected);
      case FULFILLED:
        isFunction(onFulfilled) && onFulfilled(this.PromiseResult);
        break;
      case REJECTED:
        isFunction(onRejected) && onRejected(this.PromiseResult);
        break;
    }
    return this;
  }
  }
  复制代码
  ```

- - 定义两个数组，分别用来保存完成回调和拒绝回调。
  - 下面罗列核心代码：

- 我们丰富了 `then` 方法。但是你我都知道，`return this` 看起来并不太可靠。

- 让我们来回顾一点，**`Promise` 的私有状态一旦改变后不可逆**。如果在这个 `then` 方法里抛出异常， `promise` 显然会变成拒绝状态，而同一实例的状态在改变后是不能够再次修改的。所以， `then` 的链式调用本质上是每次都会生成一个新的实例。

- 也许再贴一个使用 `then` 的例子会让我们有一些启发。

  ```
  const p = Promise.resolve(123);
  const p1 = p.then();
  const p2 = p1.then((val) => val + 123))
  const p3 = p2.then(console.info));
  const p4 = p3.then(() => {
  throw new Error('Oops!');
  });
  // 分别打印 p1 p2 p3 p4
  // Promise {<fulfilled>: 123}
  // Promise {<fulfilled>: 246}
  // Promise {<fulfilled>: undefined}
  // Promise {<rejected>: Error: Oops!
  复制代码
  ```

- 这段代码的输出，有助于让我们进一步理解 `then` 内部所做的事。

- - p1: 在没有传入回调函数的时候，它仅仅是将值传递，也就是内部会初始化一个默认的处理函数，这个处理函数只会乖乖地传递值。
  - p2: 存在完成回调时，可以获取值并进行处理，这个新的值通过**返回的形式**继续往后传递。
  - p3: 如果传入完成回调函数，但没有显式返回值，则最终的 `promise` 的值是 `undefined`.
  - p4: `promise` 状态已经变更成 `rejected`, 意味着是新的 `promise`. 符合我们的预期。

- 带着上述理解，我们来改进 `then` 方法。

- 首先，需要处理参数异常的情况，也就是传入参数不是函数，或者未传的情况，就给定默认处理函数。

  ```
  then = (onFulfilled?: CallbackParams, onRejected?: CallbackParams) => {
  ```

- - 完成回调负责传递参数。
  - 拒绝回调负责抛出异常。

// 默认处理！！！onFulfilled = isFunction(onFulfilled) ? onFulfilled : value => value; onRejected = isFunction(onRejected) ? onRejected : err => { throw err }; } 复制代码

```
- 我们把这两个兼容处理放在函数内的顶部，这样有助于理解，也可以简化后续的逻辑。

- 下面是具体的内容，其中核心改动已注释说明。

```ts
class PromiseLike {
/**
 * 根据当前不同状态来执行对应逻辑
* 如果在默认状态就是注册对应事件
* 如果状态变化则是执行对应事件
* @param onFulfilled
* @param onRejected
* @returns
*/
then = (onFulfilled: CallbackParams, onRejected: CallbackParams) => {
  // 默认处理！！！
  onFulfilled = isFunction(onFulfilled) ? onFulfilled : value => value;
  onRejected = isFunction(onRejected) ? onRejected : err => { throw err };
  return new PromiseLike((resolve, reject) => {
    /**
     * 封装完成回调函数
    * @param val
    */
    const handleFulfilled = (val: any) => {
      try {
        const res = onFulfilled(val);
        resolve(res);
      } catch (error) {
        // 如果当前执行逻辑内发生异常，则抛出异常
        reject(error);
      }
    };

    /**
     * 封装错误回调函数
    * @param val
    */
    const handleRejected = (val: any) => {
      try {
        const res = onRejected(val);
        reject(res);
      } catch (error) {
        reject(error);
      }
    }

    switch (this.PromiseState) {
      case PROMISE_STATES.PENDING:
        this.resolveCallbackQueues.push(handleFulfilled);
        this.rejectCallbackQueues.push(handleRejected);
        break;
      case PROMISE_STATES.FULFILLED:
        handleFulfilled(this.PromiseResult);
        break;
      case PROMISE_STATES.REJECTED:
        handleRejected(this.PromiseResult);
        break;
    }
  });
}
}
复制代码
```

- 这个 `then` 方法的处理已经接近完善，不过在 `Promise` 里有一点容易被人遗忘。

  ```
  Promise.resolve(41) === Promise.resolve(Promise.resolve(41)); // false
  复制代码
  ```

- - 在 `Promise` 中处理 `Promise`，内部处理会将其展开来获取其中的值。
  - 下面这个例子出来你就理解了。

- 不好意思，走错片场。js 中每个单独定义的引用类型都是不相等的。

  ```
  const p = Promise.resolve(41);
  Promise.resolve(p) === p; // true
  复制代码
  ```

- - 再来一次。

- 没错，如果我们给 `promise` 一个 `promise` 值，内部机制会将其展开。这个过程是递归的，这里我们先不展开探讨，但记住有这样的场景需要处理。

- 可以先定义一个静态方法判断是否是 `Promise` 实例，方便后续的判断。

  ```
  class PromiseLike {
  /**
   * 判断是否是当前类的实例
  * @param promise
  * @returns
  */
  static is(promise: PromiseType) {
    return promise instanceof PromiseLike;
  }
  }
  复制代码
  ```

- 有了这个方法，我们可以进一步完善上面的 `then` 方法。注意观察其中的变化，有注释说明。

- 为方便阅读，只展示核心方法（只有这里改动）。

  ```
  /**
  ```

- 封装完成回调函数
- @param val */ const handleFulfilled = (val) => { try { const res = onFulfilled(val); if (PromiseLike.is(res)) { // 如果参数是 Promise 实例，直接可以把 promise 实例进行传递 res.then(resolve, reject); } else  { resolve(res); } } catch (error) { // 如果当前执行逻辑内发生异常，则抛出异常 reject(error); } }; 复制代码

```
#### `Promise.prototype.catch`

- 在实现 `then` 方法之后，其实 `catch` 的实现是你想象不到的简单。

- 因为本质上 `catch` 方法是 `then` 第二个参数也就是错误回调函数的语法糖。照着这个理解，实现起来就比较容易。

```ts
class PromiseLike {
/**
 * 错误处理
* https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch
* @param rejectedCb
* @returns
*/
catch = (rejectedCb: CallbackParams) => {
  return this.then(null, rejectedCb);
}
}
复制代码
```

#### `Promise.prototype.finally`

- 实现 `finally` 需要我们理解几个点。

- - 前面的状态只要不是 `pending`, 则一定会进入执行。
  - 类似于 `then`, 它可以注册多个回调，每个回调函数会依次执行。
  - 回调函数内无法获取内部值。
  - 除非在回调函数内抛出异常会把状态变成 `rejected`，否则它所做的仅仅是把状态和值传递。

- 了解上述几点之后，我们可以复用 `then` 方法，并自定义回调函数传入来实现。

  ```
  class PromiseLike {
  /**
   * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally
  * @param finallyCb
  * @returns
  */
  finally = (finallyCb: CallbackParams) => {
    return this.then(
      // 完成回调时，执行注册函数，并且将原来的值传递下去
      // 封装 Promise 类，再调用 then 方法传递
      val => PromiseLike.resolve(finallyCb && finallyCb()).then(() => val),
      // 异常回调时，执行注册函数，并且抛出异常
      err => PromiseLike.resolve(finallyCb && finallyCb()).then(() => { throw err })
    );
  }
  }
  复制代码
  ```

- 写到这里，几个核心的原型方法我们就实现完毕了。

- 心急的伙伴可以直接实例化一个对象来尝试，不过 `Promise` 当然还不止于此，接下来我们来实现对应的静态方法。

### 03.03 静态方法

- 前面已经实现了一个自定义的 `Promise.is` 方法来判断实例。这个工具类函数简单实用，可以留着。
- 还有两个快速实例化 `Promise` 类的方法我们也进行了实现：`Promise.resolve` 和 `Promise.reject`. 下面来做一点改进。

#### `Promise.resolve`

- 既然我们定义好了 `Promise.is` 方法，加上对 `Promise` 的理解进一步加深，知道了如果传入的已经是 `Promise` 实例，则不必再进行处理。所以这个方法需要做一点兼容处理。

  ```
  class PromiseLike {
  /**
   * 直接实例化 proimse
  * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve
  * @param value
  * @returns
  */
  static resolve(value?: any) {
    if (PromiseLike.is(value)) {
      return value;
    }
    return new PromiseLike((resolve) => resolve(value));
  }
  }
  复制代码
  ```

- 现在我们可以尝试实现 `Promise` 提供的剩下两个类方法 `Promise.all`, `Promise.race`.

#### `Promise.all`

- 该方法是接收一个由 `Promise` 实例组成的数组，并返回 `Promise` 实例，其值是所有 `Promise` 实例的 `resolve` 的值组成的数组。

- - 当其中任意一个 `Promise` 有 `reject` 的值时，`Promise.all` 会返回最先 `rejected`的值。
  - 等到所有 `Promise` `resolve` 之后，`Promise`.all 才会返回结果。
  - `Promise.all` 也是支持链式调用的。

- 大白话也许有些晦涩，我们直接看案例。

  ```
  Promise.all([Promise.resolve(1), Promise.reject(2)]); // Promise {<rejected>: 2}
  Promise.all([Promise.resolve(1), Promise.resolve(2)]); // Promise {<fulfilled>: Array(2)} [1, 2]
  Promise.all([]); // Promise {<fulfilled>: Array(2)}
  复制代码
  ```

- 其中，第三个表达式的结果对理解 `Promise.race` 和 `Promise.all` 的区别很重要。这点后面会谈。除此之外，结果是显而易见的。

- `Promise.all` 返回的结果是传入数组的参数的顺序，也可以理解为顺序执行，并填入对应的位置。基于这几点，要实现它就有思路了。

  ```
  class PromiseLike {
  /**
   * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
  * @param promises 严格意义上来说，参数是可迭代对象，为了简化实现这里统一成数组
  * @returns
  */
  static all(promises: Array<ICallbackFn>) {
    // 支持链式调用
    return new PromiseLike((resolve, reject) => {
      const len = promises.length;
      let resolvedPromisesCount = 0;
      let resolvedPromisesResult = <any>[];
      for (let i = 0; i < len; i++) {
        const currentPromise = promises[i];
        // 如果不是 Promise 实例，则需要包装一份；
        // 但因为直接包装 Promise 类的效果是幂等的，所以这里不需要判断，直接处理即可
        PromiseLike.resolve(currentPromise)
        .then((res: any) => {
          resolvedPromisesCount++;
          resolvedPromisesResult[i] = res;
          // 当所有值都 resolve 之后， 返回对应数组
          if (resolvedPromisesCount === len) {
            resolve(resolvedPromisesResult);
          }
        })
        // 如果有任意一个异常，则直接推出
        .catch((err: any) => {
          reject(err);
        });
      }
    });
  }
  }
  复制代码
  ```

- - 顺序执行所有 `Promise`，并把结果保存到数组的对应位置，同时统计已执行的数量；当该数量等同于传入的数组长度时，返回由结果组成的数组。

- 如同在方法注释里说明的一样，其实 `Promise.all` 和 `Promise.race` 方法接收的参数都是可迭代对象，并不仅仅是数组。这里为了方便实现，使用数组替代。可迭代对象不在这篇文章的核心讨论范围之内，感兴趣的可以点进上面的链接继续了解。

#### `Promise.race`

- `Promise.race` 和 `Promise.all` 有些相似，至少就参数而言，都接收可迭代对象作为参数，也可以链式调用，意味着它也返回一个新的 `Promise` 实例。

- 不同的是，`Promise.race` 将会返回第一个 `Promise.resolve` 的值，或是第一个 reject 的值，而且这个值并不是数组。

- 了解到这两点之后，实现起来就有清晰的思路了。

  ```
  class PromiseLike {
  /**
   * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/race
  * @param promises
  * @returns
  */
  static race(promises: Array<ICallbackFn>) {
    return new PromiseLike((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        const currentPromise = promises[i];
        PromiseLike.resolve(currentPromise)
          .then((res: any) => {
            resolve(res);
          })
          .catch((err: any) => {
            reject(err);
          });
      }
    });
  }
  }
  复制代码
  ```

- - 遍历顺序执行所有 Promise 并取出第一个 resolve 的值。

- 再运行这样一段代码，得到的结果应该并不会让你意外。

  ```
  Promise.race([]); // Promise {<pending>} 与 Promise.all 的结果不同
  复制代码
  ```

- 至此，目前已广泛兼容的两个核心方法我们都已经实现了。这是不是意味着可以愉快的玩耍了呢，当然可以。不过，既然都走到这一步了，我们顺带可以实现更多的 `Promise` 方法，一来锻炼动手能力，二来证明学以致用。

### 03.04 其他静态方法

#### `Promise.allSettled`

- 这个方法和 `Promise.all` 非常相似，执行所有的 `Promise` 实例并返回所有的结果，不论结果如何，都在返回的数组里塞回一个对象。

- - 每个对象只有两个属性 `status` 和 `value` 或 `reason`；如果当前 `proimse` 是 `fulfilled` 则属性是 `status` 和 `value`, 如果当前是 `rejected` 则属性是 `status` 和 `reason`.

- 对 `Promise.all` 稍加改动就可以实现。

  ```
  /**
  ```

- - 判断计数的逻辑在两个回调函数中都进行，并且对返回值加一层包装。

- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled

- @param promises 严格意义上来说，参数是可迭代对象，为了简化实现这里统一成数组

- @returns */ static allSettled(promises: Array) { // 支持链式调用 return new PromiseLike((resolve, reject) => { const len = promises.length; const startTime = Date.now(); let resolvedPromisesCount = 0; let resolvedPromisesResult =[];

  for (let i = 0; i < len; i++) { const currentPromise = promises[i]; // 如果不是 Promise 实例，则需要包装一份；// 但因为直接包装 Promise 类的效果是幂等的，所以这里不需要判断，直接处理即可 PromiseLike.resolve(currentPromise) .then((res: any) => { resolvedPromisesCount++; resolvedPromisesResult[i] = { status: PROMISE_STATES.FULFILLED, value: res }; // 当所有 promises 完成后，返回数组；多封装了一个属性用于显示执行时间 if (resolvedPromisesCount === len) { resolvedPromisesResult.duringTime = Date.now() - startTime + 'ms'; resolve(resolvedPromisesResult); } }) // 如果有任意一个异常，则直接推出 .catch((err: any) => { resolvedPromisesCount++; resolvedPromisesResult[i] = { status: PROMISE_STATES.REJECTED, reason: err }; if (resolvedPromisesCount === len) { resolvedPromisesResult.duringTime = Date.now() - startTime + 'ms'; resolve(resolvedPromisesResult); } }); } }); } 复制代码

```
#### `Promise.any`

- 这是今年\(2021\)刚刚落定草案的新 API。定义和 `Promise.race` 很相似，接收可迭代对象作为参数，可以链式调用。

- 不同的是，它会返回第一个落定的，也就是 `resolve` 的值；如果传入的 `promise` 全都都进入拒绝状态，则它会等到所有拒绝状态都完成后，再返回一个由拒绝错误组成的对象。这个对象是新定义的类型 [AggregateError](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FAggregateError "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/AggregateError")，这里暂且先不展开，直接使用它。

- 从定义上来看，它和 `Promise.race` 相似，不过从实现上观察，却和 `Promise.all` 更加相似。

 -    只需要把计算数量的逻辑搬到错误回调中，并将其返回错误对象即可。

```javascript
class PromiseLike {
/**
 * 2021 年刚纳入规范的 any
* https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/any
* @param promises
* @returns
*/
static any(promises: Array<ICallbackFn>) {
  return new PromiseLike((resolve, reject) => {
    const len = promises.length;
    let rejectedPromisesCount = 0;
    let rejectedPromisesResult = <any>[];
    for (let i = 0; i < promises.length; i++) {
      const currentPromise = promises[i];
      PromiseLike.resolve(currentPromise)
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          rejectedPromisesCount++;
          rejectedPromisesResult[i] = err;
          if (rejectedPromisesCount === len) {
            // 如果浏览器支持，则直接抛出这个新对象，否则则直接抛出异常
            if (isFunction(AggregateError)) {
              throw new AggregateError(rejectedPromisesResult, 'All promises were rejected');
            } else {
              throw (rejectedPromisesResult);
            }
          }
        });
    }
  })
}
}
复制代码
```

## 04.Promise/A+规范

### 04.01 promises-aplus-tests 验证

- 这个库 **promises-aplus-tests**[17] 可以用来验证我们实现的 `Promise` 是否遵循 **Promise/A+规范**[18] 。

- 使用方式比较简单，注入一个方法即可，这个方法返回的对象包含 `Promise/resolve/reject`.

- 由于我们使用类的方式编写，所以直接新增一个静态函数即可。

  ```
  class PromiseLike {
  /**
   * 三方库验证
  * @returns
  */
  static deferred() {
    let defer: any = {};
    defer.promise = new PromiseLike((resolve, reject) => {
      defer.resolve = resolve;
      defer.reject = reject;
    });
    return defer;
  }
  }
  复制代码
  ```

- 需要注意的是，要用 `commonjs` 规范的方式来导出，否则会出现报错。

  ```
  module.exports = PromiseLike;
  复制代码
  ```

- 运行 `npx promises-aplus-tests 目录名` 进行验证。

### 04.02 并不完美（兼容修复）

- 运行结果显示，有部分 case 没有通过。糟透了！下面一一提取。

#### 'Chaining cycle detected for promise'

- 这个异常显示，我们不能在 `promise` 中使用自身，否则会造成死循环。

- 举个例子：

  ```
  const p = Promise.resolve(1).then(() => p);
  复制代码
  ```

- 运行这段代码，就会得到上述报错。

- 解决办法并不难，定义变量来保存 `then` 函数的返回值，同时在内部方法返回的位置进行兼容处理，如果相等就抛出异常。

  ```
  const res = onFulfilled(val);
  // 返回的 promise 不可以是当前的 promise 否则会造成死循环
  if (newPromise === res) {
   throw new TypeError('Chaining cycle detected for promise #<Promise>');
  }
  复制代码
  ```

#### `2.3.3: Otherwise, if` x `is an object or function`

- 再次执行，发现 `Promise` 规范对传入参数是对象和函数类型也有着特殊的处理。我们并没有处理，所以出现了上述报错。**规范里**[19] 有所定义，我们可以简单理解为如果传入的参数是 `Thenable` 的，则需要调用其中的 `then` 方法，也就是将其展开调用。上文中自己有提到，终究是逃不过。

- 之前我们仅仅对 `Promise` 的实例进行了特殊处理，现在意识到还需要处理 `Thenable` 接口的对象。但因为 `Promise` 实例本身就是实现 `Thenable` 接口的特殊对象。(`typeof Promise.resolve(1); // object`)，所以实现了对 `Thenable` 接口的处理，自然也能涵盖原有的逻辑。

- 新定义一个单独的方法来实现，以提高可读性。

  ```
  /**
  ```

- - 这个函数有些复杂，但每一条逻辑都可以在规范里追溯。

- 该实现遵循 Promise/A+ 规范

- https://github.com/promises-aplus/promises-spec

- @param promise

- @param x

- @param resolve

- @param reject

- @returns */ const resolvePromise = (promise: any, x: any, resolve: ICallbackFn, reject: ICallbackFn) =>// 返回的 promise 不可以是当前的 promise 否则会造成死循环 if (newPromise === x) { reject(new TypeError('Chaining cycle detected for promise #')); } // 对可能是 thenable 接口实现的对象判断 if (isObject(x)| isFunction(x)) { if (x === null) { return resolve(x);let thenCb; try { thenCb = x.then; } catch (error) { return reject(error); }

  // 如果是 thenable 的对象，则调用其 then 方法 // 这一步涵盖了 Promise 实例的可能性 if (isFunction(thenCb)) { let isCalled = false; try { thenCb.call( x, // 指向当前函数或对象 (y: any) => { // 如果 resolvePromise 和 rejectPromise 都可能被调用 // 则只需调用第一次（resolvePromise 或 rejectPromise），后续无需再执行 if (isCalled) return; isCalled = true; // 传入当前函数，以实现递归展开调用 resolvePromise(promise, y, resolve, reject); }, (r: any) => { // 对应前面任意的调用之后，就不再只需后续逻辑 if (isCalled) return; isCalled = true; reject(r); } ) } catch (error) { if (isCalled) return; reject(error); } } else { resolve(x); } } else { resolve(x); } } 复制代码

```
- 在原先处理数据的地方，换成 `resolvePromise` 函数就可以了。

- 这下是可算是完整通过测试了。

```shell
872 passing (14s)
复制代码
```

## 05.更多优化

### 05.01 queueMicrosoft[20]

- 学习过程中，意外发现 `queueMicrosoft` 这个方法，用于将任务转换成微任务。我们知道 `setTimeout` 虽然可以实现异步的效果，但它属于宏任务，与 `Promise` 所属的微任务不符。所以可以用 `queueMicrosoft` 来替换。
- 有关使用方式，可以**查看这里**[21]

### 05.02 typescript 完善

- 前面的例子里已经定义许多接口。这里举个例子完善一哈，更多详细内容可以查看下文的源码。

  ```
  export interface IPromiseType {
  then: IExecutorFn;
  catch: ICallbackFn;
  finally: ICallbackFn;
  }
  
  class PromiseLike implements IPromiseType {}
  复制代码
  ```

- 由于自己的 typescript 实践仍在学习中，可能源码中还存在许多值得改进和优化的地方，可以在评论或 issue 中指出，合理的改进建议一定会采纳并实践。

- 使用版本：`"typescript": "^4.3.5"`

### 05.03 花里胡哨的变种方法

#### `Promise.last`

- 定义一个函数，返回最后一个完成的 `promise`, 并且可以选择是否需要 `rejected` 的 `promise`.

  ```
  /**
  ```

- 返回最后一个完成的值，可以自行决定是否忽略异常

- 如果不忽略，异常优先抛出

- 如果忽略，返回完成值

- @param promises

- @param ignoreRejected

- @returns */ static last(promises: Array, ignoreRejected: boolean = false) { return new PromiseLike((resolve, reject) => { const len = promises.length; const startTime = Date.now(); let resolvedPromisesCount = 0;

  for (let i = 0; i < len; i++) { const currentPromise = promises[i]; PromiseLike.resolve(currentPromise) .then((res: any) => { resolvedPromisesCount++; // 当所有 promises 完成后，返回最后一个值；封装一个属性用于显示执行时间 if (resolvedPromisesCount === len) { isObject(res) && (res.duringTime = Date.now() - startTime + 'ms'); resolve(res); } }) // 如果有任意一个异常，则直接推出 .catch((err: any) => { if (ignoreRejected) { resolvedPromisesCount++; } else { reject(err) } }); } }); } 复制代码

```
- 还可以实现一个它的变种，即返回最后一个更新的值，不论是 `fulfilled` 或者 `rejected` 状态.源码有展示，这里不再赘述。

#### `Promise.wrap`

- 该方法可以将原来的普通异步请求包装成 `Promise` 实例，便于链式调用等。

- 假设有这样一个请求处理函数。

```ts
function fn(url, cb) {
ajax(url, cb);
}
复制代码
```

- 想让它变成可以使用链式调用，使用方式见注释。

  ```
  /**
  ```

- 把不是 promise 实例的函数包装成 promise 实例
- 例如 ajax 请求
- const request = Promise.wrap(ajax);
- request.then(callback);
- @param fn
- @returns */ static wrap(fn: any) { if (!isFunction(fn)) { return fn; } return function () { const args: any[] = Array.prototype.slice.call(arguments); return new PromiseLike((resolve) => { fn.apply(null, args.concat(function (res: any, err: any) { res && resolve(res); err && resolve(err); })); }) } } 复制代码

```
#### `Promise.sequence`

- 链式调用的能力可以结合数组的 `reduce` 完成串行操作，把函数传入组合成新的函数。

 -    这里的参数不涉及 `Promise` 实例，使用链式调用来实现。

```ts
/**
* 返回一个函数来执行
* @param fns
* @returns
*/
static sequence(fns: Array<ICallbackFn>) {
return (x: number) => fns.reduce((acc, fn: ICallbackFn) => {
  if (!isFunction(fn)) {
    fn = x => x;
  }
  return acc.then(fn).catch((err: any) => { throw err });
}, PromiseLike.resolve(x));
}
复制代码
```

- 假设有多个函数，我们可以通过这样的操作来将它们组合，组合的内容是处理函数。

  ```
  function addThree(x) {
  return x + 3;
  }
  function addFive(x) {
  return x + 5;
  }
  const addEight = ProimseLike.sequence([addThree, addFive]);
  addEight(2); // 10
  复制代码
  ```

- 上面的函数其实已经实现了串行；还可以做一些改动把每个值按顺序保存下来。

#### `Promise.sequenceByOrder`

- 该方法顺序执行函数，并返回按完成顺序排列的值。

  ```
  /**
  ```

- 串行执行所有 promises,并返回按返回顺序排列的数组
- 注意接收的参数是返回 promise 实例的函数组成的数组
- @param promises
- @returns */ static sequenceByOrder(promises: Array) { return new PromiseLike((resolve) => { let promiseResults: any = []; const reduceRes = promises.reduce((prevPromise, currentPromise: ICallbackFn, currentIndex: number) => { return prevPromise.then((val: any) => { promiseResults.push(val); const newVal = currentPromise(val); // 最后一次循环时保存，并剔除第一个值（默认 undefined) if (currentIndex === promises.length - 1) { promiseResults.unshift(); } return newVal; }); }, PromiseLike.resolve()); reduceRes.then((val: any) => { promiseResults.push(val); resolve(promiseResults); }); }); } 复制代码

```
#### `Promise.map`

- 定义一个可以处理所有 `promise` 值的函数，类似数组的 `map` 方法。

```ts
/**
* 对每个 promise 的值进行特定的处理
* Promise.map([p1, p2, p3], (val, resolve) => {
*   resolve(val + 1);
* })
* @param promises
* @param fn
* @returns
*/
static map(promises: Array<IPromiseType>, fn: any) {
return PromiseLike.all(promises.map((currentPromise) => {
  return new PromiseLike((resolve) => {
    if (!isFunction(fn)) {
      fn = (val:any, resolve: ICallbackFn) => resolve(val);
    }
    fn(currentPromise, resolve);
  })
}));
}
复制代码
```

#### `Promise.observe`

- 定义这样一个函数，用于清理 `promise` 相关的副作用，通常用在 `Promise.race` 中。假设我们使用 `Promise.race` 来设定超时，但仍然希望超时的场景里能够处理数据。

  ```
  /**
  ```

- Promise.race([Promise.observe(p, cleanup // 处理函数), timeoutFn // 超时函数])
- @param promise
- @param fn
- @returns */ static observe(promise: IPromiseType, fn: ICallbackFn) { promise .then((res: any) => { PromiseLike.resolve(res).then(fn); }, (err) => { PromiseLike.resolve(err).then(fn); }); return promise; } 复制代码

```
## 06.源码

### 06.01 部分源码

- 所有源码虽不多，全部张贴出来也比较占版面。下面是 `then` 的完整实现。

```ts
class PromiseLike {
/**
 * 根据当前不同状态来执行对应逻辑
* 如果在默认状态就是注册对应事件
* 如果状态变化则是执行对应事件
* @param onFulfilled
* @param onRejected
* @returns
*/
then = (onFulfilled?: CallbackParams, onRejected?: CallbackParams) => {
  // 默认处理！！！
  onFulfilled = isFunction(onFulfilled) ? onFulfilled : value => value;
  onRejected = isFunction(onRejected) ? onRejected : err => { throw err };

  /**
   * 该实现遵循 Promise/A+ 规范
  * https://github.com/promises-aplus/promises-spec
  * @param promise
  * @param x
  * @param resolve
  * @param reject
  * @returns
  */
  const resolvePromise = (promise: IPromiseType, x: any, resolve: ICallbackFn, reject: ICallbackFn) => {
    // 返回的 promise 不可以是当前的 promise 否则会造成死循环
    if (newPromise === x) {
      reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
    }
    // 对可能是 thenable 接口实现的对象判断
    if (isObject(x) || isFunction(x)) {
      if (x === null) {
        return resolve(x);
      }
      let thenCb;
      try {
        thenCb = x.then;
      } catch (error) {
        return reject(error);
      }

      // 如果是 thenable 的对象，则调用其 then 方法
      // 这一步涵盖了 Promise 实例的可能性
      if (isFunction(thenCb)) {
        let isCalled = false;
        try {
          thenCb.call(
            x, // 指向当前函数或对象
            (y: any) => {
              // 如果 resolvePromise 和 rejectPromise 都可能被调用
              // 则只需调用第一次（resolvePromise 或 rejectPromise），后续无需再执行
              if (isCalled) return;
              isCalled = true;
              // 传入当前函数，以实现递归展开调用
              resolvePromise(promise, y, resolve, reject);
            },
            (r: any) => {
              // 对应前面任意的调用之后，就不再只需后续逻辑
              if (isCalled) return;
              isCalled = true;
              reject(r);
            }
          )
        } catch (error) {
          if (isCalled) return;
          reject(error);
        }
      } else {
        resolve(x);
      }
    } else {
      resolve(x);
    }
  }

  // 定义变量，用于传参进行比较
  const newPromise = new PromiseLike((resolve, reject) => {
    /**
     * 封装完成回调函数
    * @param val
    */
    const handleFulfilled = (val: any) => {
      try {
        const x = onFulfilled && onFulfilled(val);
        resolvePromise(newPromise, x, resolve, reject);
      } catch (error) {
        // 如果当前执行逻辑内发生异常，则抛出异常
        reject(error);
      };
    };

    /**
     * 封装错误回调函数
    * @param val
    */
    const handleRejected = (val: any) => {
      try {
        const x = onRejected && onRejected(val);
        resolvePromise(newPromise, x, resolve, reject);
      } catch (error) {
        reject(error);
      }
    }

    switch (this.PromiseState) {
      case PROMISE_STATES.PENDING:
        this.resolveCallbackQueues.push(handleFulfilled);
        this.rejectCallbackQueues.push(handleRejected);
        break;
      case PROMISE_STATES.FULFILLED:
        handleFulfilled(this.PromiseResult);
        break;
      case PROMISE_STATES.REJECTED:
        handleRejected(this.PromiseResult);
        break;
    }
  });

  return newPromise;
}
}
复制代码
```

### 06.02 全部源码

- **Github 地址**[22]

## 07.小结

- 在这次尝试实现 `Promise` 的过程中，自己也在边写边学。这是我理解和实践的整个思路，并不一定适用其他人；希望它能作为一种参考，启发或者影响到他人。在写这篇文章之前，我没想到会投入了整整两天时间，却也只是弄懂了些皮毛。而 `Promise` 内部显然还有许多值得探讨的地方，涉及的微任务， `async/await` 相关，迭代器和生成器；只是目前精力所限，先止于此。后面也许会解析迭代器和生成器的内容。

- 整个实践，也是自己练习 `typescipt` 的过程，这里我使用类的方式编写，主要是便于自己理解；但它也完全可以用函数实现。`typescript` 编译后的代码就是函数的实现，而且是 js. 可以直接查看下面的地址了解。另外，其中内容的编译转换也是值得探索的。

- - **Github****：https://github.com/kyriejoshua/promise-like/blob/master/dist/index.js**



关于本文

# 作者：deadpool_ky

https://juejin.cn/post/6987674192166518821