# 模块化中 umd、cjs 和 esm 有何区别？

> [https://mp.weixin.qq.com/s/2F-M4CdiLiQ5slR42GsSBw](https://mp.weixin.qq.com/s/2F-M4CdiLiQ5slR42GsSBw)

## cjs (commonjs)

`commonjs` 是 Node 中的模块规范，通过 `require` 及 `exports` 进行导入导出 (进一步延伸的话，`module.exports` 属于 `commonjs2`)

同时，webpack 也对 `cjs` 模块得以解析，因此 `cjs` 模块可以运行在 node 环境及 webpack 环境下的 ，但不能在浏览器中*直接*使用。但如果你写前端项目在 webpack 中，也可以理解为它在浏览器和 Node 都支持。

比如，著名的全球下载量前十 10 的模块 **ms**[2] 只支持 `commonjs`，但并不影响它在前端项目中使用(通过 webpack)，但是你想通过 cdn 的方式直接在浏览器中引入，估计就会出问题了

```js
// sum.js
exports.sum = (x, y) => x + y

// index.js
const { sum } = require('./sum.js')
```

由于 `cjs` 为动态加载，可直接 `require` 一个变量

```js
require(`./${a}`)
```

## esm (es module)

`esm` 是 tc39 对于 js 模块的规范，**在 Node 及 浏览器中均会支持**，使用 `export/import` 进行模块导入导出

```js
// sum.js
export const sum = (x, y) => x + y

// index.js
import { sum } from './sum'
```

由于 `esm` 为静态导入，tc39 为动态加载模块定义了 API: `import(module)` 。

esm 是未来的趋势，目前一些 CDN 厂商，前端构建工具均致力于 cjs 模块向 esm 的转化，比如 `skypack`、 `snowpack`、`vite` 等

## umd

一种兼容 `cjs` 与 `amd` 的模块，既可以在 node/webpack 环境中被 `require`，也可以在浏览器中直接用 CDN 被 `script.src` 引入

```js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // 全局变量
    root.returnExports = factory(root.jQuery);
  }
}(this, function ($) {
  // ...
}))
```

### 参考资料

[1]DailyQuestion: *https://q.shanyue.tech*

[2]ms: *https://npm.devtool.tech/ms*