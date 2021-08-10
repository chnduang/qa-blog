# Promise

> 首先，无法取消`Promise`，一旦新建它就会立即执行，无法中途取消。其次，如果不设置回调函数，`Promise`内部抛出的错误，不会反应到外部。第三，当处于`pending`状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）

### 含义

> 简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。

### 特点

- 对象的状态不受外界影响。`Promise`对象代表一个异步操作，有三种状态：`pending`（进行中）、`fulfilled`（已成功）和`rejected`（已失败）
- 一旦状态改变，就不会再变，任何时候都可以得到这个结果。`Promise`对象的状态改变，只有两种可能：从`pending`变为`fulfilled`和从`pending`变为`rejected`。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）

### 用法

> `Promise`对象是一个构造函数，用来生成`Promise`实例。

- Promise 新建后就会立即执行。

  ```javascript
  let promise = new Promise(function(resolve, reject) {
    console.log("Promise");
    resolve();
  });

  promise.then(function() {
    console.log("resolved.");
  });
  console.log("Hi!");
  // Promise
  // Hi!
  // resolved
  ```

- 一般来说，调用`resolve`或`reject`以后，Promise 的使命就完成了，后继操作应该放到`then`方法里面，而不应该直接写在`resolve`或`reject`的后面。所以，最好在它们前面加上`return`语句，这样就不会有意外。

  ```javascript
  new Promise((resolve, reject) => {
    return resolve(1);
    // 后面的语句不会执行
    console.log(2);
  });
  ```

### `Promise`挂载的方法

#### `Promise.prototype.then()`

> Promise 实例具有`then`方法，即其方法是定义再原型对象`Promise.prototype`上的

- **注意**

  > `then`方法返回的是一个新的`Promise`实例（注意，不是原来那个`Promise`实例）。因此可以采用链式写法，即`then`方法后面再调用另一个`then`方法。
  >
  > 第一个回调函数完成以后，会将返回结果作为参数，传入第二个回调函数。

- **作用**
  - 为 Promise 实例添加状态改变时的回调函数

#### `Promise.prototype.catch()`

> 方法是`.then(null, rejection)`或`.then(undefined, rejection)`的别名，用于指定发生错误时的回调函数。
>
> 如果异步操作抛出错误，状态就会变为`rejected`，就会调用`catch`方法指定的回调函数，处理这个错误。另外，`then`方法指定的回调函数，如果运行中抛出错误，也会被`catch`方法捕获。

#### `Promise.prototype.finally()`

> 用于指定不管 Promise 对象最后状态如何，都会执行的操作。该方法是 ES2018 引入标准的。

- **特性**
  - `finally`方法的回调函数不接受任何参数，这意味着没有办法知道，前面的 Promise 状态到底是`fulfilled`还是`rejected`。这表明，`finally`方法里面的操作，应该是与状态无关的，不依赖于 Promise 的执行结果。
- **本质**
  - `finally`本质上是`then`方法的特例。

#### `Promise.all()`

> 方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

- **特性**
  - `Promise.all`方法接受一个数组作为参数，`p1`、`p2`、`p3`都是 Promise 实例，如果不是，就会先调用下面讲到的`Promise.resolve`方法，将参数转为 Promise 实例，再进一步处理。（`Promise.all`方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例。）
- `p`的状态由`p1`、`p2`、`p3`决定，分成两种情况。
  - 只有`p1`、`p2`、`p3`的状态都变成`fulfilled`，`p`的状态才会变成`fulfilled`，此时`p1`、`p2`、`p3`的返回值组成一个数组，传递给`p`的回调函数。
  - 只要`p1`、`p2`、`p3`之中有一个被`rejected`，`p`的状态就变成`rejected`，此时第一个被`reject`的实例的返回值，会传递给`p`的回调函数。
- 注意
  - 如果作为参数的 Promise 实例，自己定义了`catch`方法，那么它一旦被`rejected`，并不会触发`Promise.all()`的`catch`方法。

#### `Promise.race()`

> 同样是将多个 Promise 实例，包装成一个新的 Promise 实例

```javascript
const p = Promise.race([p1, p2, p3]);
```

- 上面代码中，只要`p1`、`p2`、`p3`之中有一个实例率先改变状态，`p`的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给`p`的回调函数。
- `Promise.race`方法的参数与`Promise.all`方法一样，如果不是 Promise 实例，就会先调用下面讲到的`Promise.resolve`方法，将参数转为 Promise 实例，再进一步处理。

#### `Promise.resolve()`

> 将现有对象转为 Promise 对象

- 写法

  ```javascript
  Promise.resolve("foo");
  // 等价于
  new Promise((resolve) => resolve("foo"));
  ```

- `Promise.resolve`方法的参数分成四种情况。

  - **参数是一个 Promise 实例**

    > 如果参数是 Promise 实例，那么`Promise.resolve`将不做任何修改、原封不动地返回这个实例。

  - **参数是一个 thenable 对象**

  - **参数不是具有 then 方法的对象，或根本就不是对象**

  - **不带有任何参数**

    > 方法允许调用时不带参数，直接返回一个`resolved`状态的 Promise 对象。

#### `Promise.reject()`

> `Promise.reject(reason)`方法也会返回一个新的 Promise 实例，该实例的状态为`rejected`。

- 注意
  - `Promise.reject()`方法的参数，会原封不动地作为`reject`的理由，变成后续方法的参数。这一点与`Promise.resolve`方法不一致。
