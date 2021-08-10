## 头条面试题：如何使用异步 add 来实现一个 sum 函数

> [https://mp.weixin.qq.com/s/F4r6vzm9Mp36fJoV7nBtLg](https://mp.weixin.qq.com/s/F4r6vzm9Mp36fJoV7nBtLg)

> 这是一道字节跳动的面试题目，见面经 **某银行前端一年半经验进字节面经**[1]。山月认为这也是一道水平较高的题目，promise 串行，并行，二分，并发控制，层层递进。

请实现以下 sum 函数，只能调用 add 进行实现

```
/*
  请实现一个 sum 函数，接收一个数组 arr 进行累加，并且只能使用add异步方法

  add 函数已实现，模拟异步请求后端返回一个相加后的值
*/
function add(a, b) {
  return Promise.resolve(a + b);
}

function sum(arr) {

}
```

**「追加问题：如何控制 add 异步请求的并发次数」**

相关问题：

- **【Q088】如何实现 promise.map，限制 promise 并发数**[2]
- **【Q643】如何实现 chunk 函数，数组进行分组**[3]

------

------

------

以下为答案：

先来一个串行的写法：

```
function sum(arr) {
  if (arr.length === 1) return arr[0]
  return arr.reduce((x, y) => Promise.resolve(x).then(x => x + y))
}
```

接下来是并行的写法：

```
function add (x, y) {
  return Promise.resolve(x + y)
}

function chunk (list, size) {
  const l = []
  for (let i = 0; i < list.length; i++ ) {
    const index = Math.floor(i / size)
    l[index] ??= [];
    l[index].push(list[i])
  }
  return l
}

async function sum(arr) {
  if (arr.length === 1) return arr[0]
  const promises = chunk(arr, 2).map(([x, y]) => y === undefined ? x : add(x, y))
  return Promise.all(promises).then(list => sum(list))
}
```

如果需要控制并发数，则可以先实现一个 `pMap` 用以控制并发

```
function pMap(list, mapper, concurrency = Infinity) {
  return new Promise((resolve, reject) => {
    let currentIndex = 0
    let result = []
    let resolveCount = 0
    let len = list.length
    function next() {
      const index = currentIndex++
      Promise.resolve(list[index]).then(o => mapper(o, index)).then(o => {
        result[index] = o
        if (++resolveCount === len) { resolve(result) }
        if (currentIndex < len) { next() }
      })
    }
    for (let i = 0; i < concurrency && i < len; i ++) {
      next()
    }
  })
}

async function sum(arr, concurrency) {
  if (arr.length === 1) return arr[0]
  return pMap(chunk(arr, 2), ([x, y]) => {
    return y === undefined ? x : add(x, y)
  }, concurrency).then(list => sum(list, concurrency))
}
```

### 参考资料

[1]某银行前端一年半经验进字节面经: https://juejin.cn/post/6959364219162607630

[2]【Q088】如何实现 promise.map，限制 promise 并发数: https://github.com/shfshanyue/Daily-Question/issues/89

[3]【Q643】如何实现 chunk 函数，数组进行分组: https://github.com/shfshanyue/Daily-Question/issues/661