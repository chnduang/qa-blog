## webpack

+ 前端代码为何要进行构建和打包？

+ Module chunk bundle分别是什么意思，有何区别？

  ```
  Module
  各个源码文件
  chunk
  多模块合并成的
  bundle
  最终的输出文件
  ```

+ Webpack loader和plugin的区别

+ ebpack如何实现懒加载

+ Webpack常见性能优化

  + 优化打包构建速度

    + 优化`babel-loader`

      ```js
      {
      	test: /\.js$/,
      	use: ['babel-loader?cacheDierectory']， // 开启缓存
      	include: path.resolve(__dirname, src),
      	// exclude: path.resolve(__dirname, 'node_modules')
      }
      ```

    + IgnorePlugin （避免引用无用模块）

      ```js
      new webpack.IgnorePlugin(/\.\/locale/, /moment/)
      ```

    + noParse

    + happyPack

    + ParallelUglifyPlugin

    + 自动刷新

    + 热更新

    + DllPlugin  

  + 优化产出代码

  

+ `Babel-runtime` 和`babel-polyfill`的区别

