# CSS相关

> [https://frontendinterviewhandbook.com/zh/css-questions/#%E8%AF%B7%E9%98%90%E8%BF%B0float%E5%AE%9A%E4%BD%8D%E7%9A%84%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86](https://frontendinterviewhandbook.com/zh/css-questions/#%E8%AF%B7%E9%98%90%E8%BF%B0float%E5%AE%9A%E4%BD%8D%E7%9A%84%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86)

## 有什么不同的方式可以隐藏内容-使其仅适用于屏幕阅读器

这些方法与可访问性（a11y）有关。

- `width: 0; height: 0`：使元素不占用屏幕上的任何空间，导致不显示它。
- `position: absolute; left: -99999px`： 将它置于屏幕之外。
- `text-indent: -9999px`：这只适用于`block`元素中的文本。
- Metadata： 例如通过使用 Schema.org，RDF 和 JSON-LD。
- WAI-ARIA：如何增加网页可访问性的 W3C 技术规范。

即使 WAI-ARIA 是理想的解决方案，我也会采用绝对定位方法，因为它具有最少的注意事项，适用于大多数元素，而且使用起来非常简单。

###### 参考[](https://frontendinterviewhandbook.com/zh/css-questions/#参考-6)

- https://www.w3.org/TR/wai-aria-1.1/
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA
- http://a11yproject.com/

## 常用的定位以及区别

### `relative`、`fixed`、`absolute`和`static`四种定位有什么区别

经过定位的元素，其`position`属性值必然是`relative`、`absolute`、`fixed`或`sticky`。

- `static`：默认定位属性值。该关键字指定元素使用正常的布局行为，即元素在文档常规流中当前的布局位置。此时 top, right, bottom, left 和 z-index 属性无效。
- `relative`：该关键字下，元素先放置在未添加定位时的位置，再在不改变页面布局的前提下调整元素位置（因此会在此元素未添加定位时所在位置留下空白）。
- `absolute`：不为元素预留空间，通过指定元素相对于最近的非 static 定位祖先元素的偏移，来确定元素位置。绝对定位的元素可以设置外边距（margins），且不会与其他边距合并。
- `fixed`：不为元素预留空间，而是通过指定元素相对于屏幕视口（viewport）的位置来指定元素位置。元素的位置在屏幕滚动时不会改变。打印时，元素会出现在的每页的固定位置。fixed 属性会创建新的层叠上下文。当元素祖先的 transform 属性非 none 时，容器由视口改为该祖先。
- `sticky`：盒位置根据正常流计算(这称为正常流动中的位置)，然后相对于该元素在流中的 flow root（BFC）和 containing block（最近的块级祖先元素）定位。在所有情况下（即便被定位元素为 `table` 时），该元素定位均不对后续元素造成影响。当元素 B 被粘性定位时，后续元素的位置仍按照 B 未定位时的位置来确定。`position: sticky` 对 `table` 元素的效果与 `position: relative` 相同。

- https://developer.mozilla.org/en/docs/Web/CSS/position

## 你有没有使用过视网膜分辨率的图形

我倾向于使用更高分辨率的图形（显示尺寸的两倍）来处理视网膜显示。

更好的方法是使用媒体查询，像

`@media only screen and (min-device-pixel-ratio: 2) { ... }`，

然后改变`background-image`。

对于图标类的图形，我会尽可能使用 svg 和图标字体，因为它们在任何分辨率下，都能被渲染得十分清晰。

还有一种方法是，在检查了`window.devicePixelRatio`的值后，利用 JavaScript 将`<img>`的`src`属性修改，用更高分辨率的版本进行替换。

- https://www.sitepoint.com/css-techniques-for-retina-displays/

## 什么情况下，用`translate()`而不用绝对定位,什么时候，情况相反

`translate()`是`transform`的一个值。改变`transform`或`opacity`不会触发浏览器重新布局（reflow）或重绘（repaint），只会触发复合（compositions）。而改变绝对定位会触发重新布局，进而触发重绘和复合。`transform`使浏览器为元素创建一个 GPU 图层，但改变绝对定位会使用到 CPU。 因此`translate()`更高效，可以缩短平滑动画的绘制时间。

当使用`translate()`时，元素仍然占据其原始空间（有点像`position：relative`），这与改变绝对定位不同。

- https://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/

### 其他答案

- https://neal.codes/blog/front-end-interview-css-questions
- https://quizlet.com/28293152/front-end-interview-questions-css-flash-cards/
- http://peterdoes.it/2015/12/03/a-personal-exercise-front-end-job-interview-questions-and-my-answers-all/

## 重置（resetting）CSS 和 标准化（normalizing）CSS 的区别是什么

- **重置（Resetting）**： 重置意味着除去所有的浏览器默认样式。对于页面所有的元素，像`margin`、`padding`、`font-size`这些样式全部置成一样。你将必须重新定义各种元素的样式。
- **标准化（Normalizing）**： 标准化没有去掉所有的默认样式，而是保留了有用的一部分，同时还纠正了一些常见错误。

当需要实现非常个性化的网页设计时，我会选择重置的方式，因为我要写很多自定义的样式以满足设计需求，这时候就不再需要标准化的默认样式了。

- https://stackoverflow.com/questions/6887336/what-is-the-difference-between-normalize-css-and-reset-css