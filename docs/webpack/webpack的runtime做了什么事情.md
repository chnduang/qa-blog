# webpack的runtime做了什么事情

可点击此处查看[示例或实践代码(opens new window)](https://github.com/shfshanyue/node-examples/blob/master/engineering/webpack/cjs/example/main.js)

<iframe src="https://player.bilibili.com/player.html?bvid=BV1o44y1Y7Zs" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="allowfullscreen" style="width: 684px; aspect-ratio: 4 / 3; margin: 1rem 0px;"></iframe>

`webpack` 的 runtime，也就是 webpack 最后生成的代码，做了以下三件事:

1. `__webpack_modules__`: 维护一个所有模块的数组。将入口模块解析为 AST，根据 AST 深度优先搜索所有的模块，并构建出这个模块数组。每个模块都由一个包裹函数 `(module, module.exports, __webpack_require__)` 对模块进行包裹构成。
2. `__webpack_require__(moduleId)`: 手动实现加载一个模块。对已加载过的模块进行缓存，对胃加载过的模块，执行 id 定位到 `__webpack_modules__` 中的包裹函数，执行并返回 `module.exports`，并缓存
3. `__webpack_require__(0)`: 运行第一个模块，即运行入口模块

另外，当涉及到多个 chunk 的打包方式中，比如 `code spliting`，webpack 中会有 `jsonp` 加载 chunk 的运行时代码。

以下是 `webpack runtime` 的最简代码，配置示例可见 [node-examples(opens new window)](https://github.com/shfshanyue/node-examples/blob/master/engineering/webpack/cjs/example/main.js)

```js
/******/ var __webpack_modules__ = [
  ,
  /* 0 */ /* 1 */
  /***/ (module) => {
    module.exports = (...args) => args.reduce((x, y) => x + y, 0);

    /***/
  },
  /******/
]; // The module cache
/************************************************************************/
/******/ /******/ var __webpack_module_cache__ = {}; // The require function
/******/
/******/ /******/ function __webpack_require__(moduleId) {
  /******/ // Check if module is in cache
  /******/ var cachedModule = __webpack_module_cache__[moduleId];
  /******/ if (cachedModule !== undefined) {
    /******/ return cachedModule.exports;
    /******/
  } // Create a new module (and put it into the cache)
  /******/ /******/ var module = (__webpack_module_cache__[moduleId] = {
    /******/ // no module.id needed
    /******/ // no module.loaded needed
    /******/ exports: {},
    /******/
  }); // Execute the module function
  /******/
  /******/ /******/ __webpack_modules__[moduleId](
    module,
    module.exports,
    __webpack_require__
  ); // Return the exports of the module
  /******/
  /******/ /******/ return module.exports;
  /******/
}
/******/
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
  const sum = __webpack_require__(1);

  sum(3, 8);
})();
```

对 `webpack runtime` 做进一步的精简，代码如下

```js
const __webpack_modules__ = [() => {}];
const __webpack_require = (id) => {
  const module = { exports: {} };
  const m = __webpack_modules__[id](module);
  return module.exports;
};

__webpack_require__(0);
```
