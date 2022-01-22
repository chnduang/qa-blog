# BFC

> [[10 分钟理解 BFC 原理 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/25321647)]

## 1.什么是BFC

BFC（Block Formatting Context）块级格式化上下文，是Web页面中盒模型布局的CSS渲染模式，指一个独立的渲染区域或者说是一个隔离的独立容器。

## 2.形成BFC的条件

1. 根元素；
2. float为除none以外的值；
3. overflow为除了visiable以外的值，包括hidden、scroll和auto；
4. position值为absolute或fixed；
5. display值为inline-block；
6. display值以table-开头的表格单元格元素和值为table-caption的元素；
7. display值为flow-root的元素；
8. 此外还有flex元素、grid元素等等

## 3.BFC的特性

### 3.1 外边距折叠

在BFC中，BOX在垂直方向上的margin会发生重叠。

### 3.2 不会被浮动元素遮挡

BFC元素不会被浮动元素所遮挡住。

### 3.3 可以容纳浮动元素

在BFC中，计算高度时，浮动元素也会参与计算