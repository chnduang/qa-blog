## CSS常见问题汇总

> [https://mp.weixin.qq.com/s/c5PyoDxwOUX5TzdL-QPpoA](https://mp.weixin.qq.com/s/c5PyoDxwOUX5TzdL-QPpoA)

### **1、介绍一下标准的css的盒子模型？与低版本IE的盒子模型有什么不同的？**

标准盒子模型：宽度=内容的宽度（content）+ border + padding + margin

低版本IE盒子模型：宽度=内容宽度（content+border+padding）+ margin

### **2、box-sizing属性？**

用来控制元素的盒子模型的解析模式，默认为content-box

context-box：W3C的标准盒子模型，设置元素的 height/width 属性指的是content部分的高/宽

border-box：IE传统盒子模型。设置元素的height/width属性指的是border + padding + content部分的高/宽

### **3、CSS选择器有哪些？哪些属性可以继承？**

CSS选择符：id选择器(#myid)、类选择器(.myclassname)、标签选择器(div, h1, p)、相邻选择器(h1 + p)、子选择器（ul > li）、后代选择器（li a）、通配符选择器（*）、属性选择器（a[rel=”external”]）、伪类选择器（a:hover, li:nth-child）

可继承的属性：font-size, font-family, color

不可继承的样式：border, padding, margin, width, height

优先级（就近原则）：!important > [ id > class > tag ]

!important 比内联优先级高

### **4、CSS优先级算法如何计算？**

元素选择符：1
class选择符：10
id选择符：100
元素标签：1000

!important声明的样式优先级最高，如果冲突再进行计算。

如果优先级相同，则选择最后出现的样式。

继承得到的样式的优先级最低。

不同级别：!important > 行内样式>ID选择器 > 类选择器 > 标签 > 通配符 > 继承 > 浏览器默认属性
同一级别：后写的会覆盖先写的

### **5、CSS3新增伪类有那些?**

p:first-of-type 选择属于其父元素的首个元素

p:last-of-type 选择属于其父元素的最后元素

p:only-of-type 选择属于其父元素唯一的元素

p:only-child 选择属于其父元素的唯一子元素

p:nth-child(2) 选择属于其父元素的第二个子元素

:enabled :disabled 表单控件的禁用状态。

:checked 单选框或复选框被选中。

### **6、display有哪些值？说明他们的作用?**

inline（默认）–内联

none–隐藏

block–块显示

table–表格显示

list-item–项目列表

inline-block

### **7、position的值？**

static（默认）：按照正常文档流进行排列；

relative（相对定位）：不脱离文档流，参考自身静态位置通过 top, bottom, left, right 定位；

absolute(绝对定位)：参考距其最近一个不为static的父级元素通过top, bottom, left, right 定位；

fixed(固定定位)：所固定的参照对像是可视窗口。

### **8、什么是z-index？**

z-index 属性设置元素的堆叠顺序。拥有更高堆叠顺序的元素总是会处于堆叠顺序较低的元素的前面。

注释：z-index 仅能在定位元素上奏效！

可能到值：

auto——默认。堆叠顺序与父元素相等。
number——设置元素的堆叠顺序。
inherit——规定应该从父元素继承 z-index 属性的值。

### **9、CSS3有哪些新特性？**

RGBA和透明度

background-image background-origin(content-box/padding-box/border-box) background-size background-repeat

word-wrap（对长的不可分割单词换行）word-wrap：break-word

文字阴影：text-shadow：5px 5px 5px #FF0000;（水平阴影，垂直阴影，模糊距离，阴影颜色）

font-face属性：定义自己的字体

圆角（边框半径）：border-radius 属性用于创建圆角

边框图片：border-image: url(border.png) 30 30 round

盒阴影：box-shadow: 10px 10px 5px #888888

媒体查询：定义两套css，当浏览器的尺寸变化时会采用不同的属性。

### **10、请解释一下CSS3的flexbox（弹性盒布局模型）,以及适用场景？**

该布局模型的目的是提供一种更加高效的方式来对容器中的条目进行布局、对齐和分配空间。

在传统的布局方式中，block 布局是把块在垂直方向从上到下依次排列的；而 inline 布局则是在水平方向来排列。

弹性盒布局并没有这样内在的方向限制，可以由开发人员自由操作。

试用场景：弹性布局适合于移动前端开发，在Android和ios上也完美支持。

### **11、用纯CSS创建一个三角形的原理是什么？**

采用的是均分原理,把矩形分为4等份,这4等份其实都是边框。核心就是给块级元素设置宽高为0,设置边框的宽度,不需要显示的边框使用透明色;例如：

- 
- 
- 
- 
- 
- 
- 

```
.square{       width:0;       height:0;       margin:0 auto;       border:6px solid transparent;       border-top: 6px solid red;   }
```

### **12、为什么要初始化CSS样式**

因为浏览器的兼容问题，不同浏览器对有些标签的默认值是不同的，如果没对CSS初始化往往会出现浏览器之间的页面显示差异。

### **13、display:none与visibility：hidden的区别？**

display：none 不显示对应的元素，在文档布局中不再分配空间（回流+重绘）

visibility：hidden 隐藏对应元素，在文档布局中仍保留原来的空间（重绘）

### **14、position跟display、overflow、float这些特性相互叠加后会怎么样？**

display属性规定元素应该生成的框的类型；position属性规定元素的定位类型；float属性是一种布局方式，定义元素在哪个方向浮动。

类似于优先级机制：position：absolute/fixed优先级最高，有他们在时，float不起作用，display值需要调整。float 或者absolute定位的元素，只能是块元素或表格。

### **15、对BFC规范(块级格式化上下文：block formatting context)的理解？**

BFC规定了内部的Block Box如何布局。

定位方案：

1. 内部的Box会在垂直方向上一个接一个放置。
2. Box垂直方向的距离由margin决定，属于同一个BFC的两个相邻Box的margin会发生重叠。
3. 每个元素的margin box 的左边，与包含块border box的左边相接触。
4. BFC的区域不会与float box重叠。
5. BFC是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。
6. 计算BFC的高度时，浮动元素也会参与计算。

**满足下列条件之一就可触发BFC**

1. 根元素，即html
2. float的值不为none（默认）
3. overflow的值不为visible（默认）
4. display的值为inline-block、table-cell、table-caption
5. position的值为absolute或fixed

### **16、为什么会出现浮动和什么时候需要清除浮动？清除浮动的方式？**

浮动元素碰到包含它的边框或者浮动元素的边框停留。由于浮动元素不在文档流中，所以文档流的块框表现得就像浮动框不存在一样。浮动元素会漂浮在文档流的块框上。

浮动带来的问题：

1. 父元素的高度无法被撑开，影响与父元素同级的元素
2. 与浮动元素同级的非浮动元素（内联元素）会跟随其后
3. 若非第一个元素浮动，则该元素之前的元素也需要浮动，否则会影响页面显示的结构。

**清除浮动的方式**：

1. 父级div定义height
2. 最后一个浮动元素后加空div标签 并添加样式clear:both。
3. 包含浮动元素的父标签添加样式overflow为hidden或auto。
4. 父级div定义zoom

### **17、设置元素浮动后，该元素的display值是多少？**

自动变成display:block

### **18、使用 CSS 预处理器吗？**

CSS预处理器定义了一种新的语言，其基本思想是，用一种专门的编程语言，为CSS增加了一些编程的特性，将CSS作为目标生成文件，然后开发者就只要使用这种语言进行编码工作。

可以让你的CSS更加简洁、适应性更强、可读性更佳，更易于代码的维护等诸多好处。

比如说：Sass（ 基于Ruby写的 ）、LESS（基于Node写的）、Stylus、Turbine、Swithch CSS、CSS Cacheer、DT CSS等。

**预处理器能力**

1.嵌套 反映层级和约束 

2.变量和计算 减少重复代码 

3.Extend和Mixin 代码片段复用 

4.循环 适用于复杂有规律的样式 

5.import CSS文件模块化

### **19、CSS优化、提高性能的方法有哪些？**

1. 避免过度约束
2. 避免后代选择符
3. 避免链式选择符
4. 使用紧凑的语法
5. 避免不必要的命名空间
6. 避免不必要的重复
7. 最好使用表示语义的名字。一个好的类名应该是描述他是什么而不是像什么
8. 避免！important，可以选择其他选择器
9. 尽可能的精简规则，你可以合并不同类里的重复规则

### **20、浏览器是怎样解析CSS选择器的？**

CSS选择器的解析是从右向左解析的。若从左向右的匹配，发现不符合规则，需要进行回溯，会损失很多性能。

若从右向左匹配，先找到所有的最右节点，对于每一个节点，向上寻找其父节点直到找到根元素或满足条件的匹配规则，则结束这个分支的遍历。

两种匹配规则的性能差别很大，是因为从右向左的匹配在第一步就筛选掉了大量的不符合条件的最右节点（叶子节点），而从左向右的匹配规则的性能都浪费在了失败的查找上面。

而在 CSS 解析完毕后，需要将解析的结果与 DOM Tree 的内容一起进行分析建立一棵 Render Tree，最终用来进行绘图。

在建立 Render Tree 时（WebKit 中的「Attachment」过程），浏览器就要为每个 DOM Tree 中的元素根据 CSS 的解析结果（Style Rules）来确定生成怎样的 Render Tree。

### **21、在网页中的应该使用奇数还是偶数的字体？为什么呢？**

使用偶数字体。偶数字号相对更容易和 web 设计的其他部分构成比例关系。Windows 自带的点阵宋体（中易宋体）从 Vista 开始只提供 12、14、16 px 这三个大小的点阵，而 13、15、17 px时用的是小一号的点。（即每个字占的空间大了 1 px，但点阵没变），于是略显稀疏。

### **22、margin和padding分别适合什么场景使用？**

**何时使用margin：**

1. 需要在border外侧添加空白
2. 空白处不需要背景色
3. 上下相连的两个盒子之间的空白，需要相互抵消时。

**何时使用padding：**

1. 需要在border内侧添加空白
2. 空白处需要背景颜色
3. 上下相连的两个盒子的空白，希望为两者之和。

兼容性的问题：在IE5 IE6中，为float的盒子指定margin时，左侧的margin可能会变成两倍的宽度。通过改变padding或者指定盒子的display：inline解决。

### **23、元素竖向的百分比设定是相对于容器的高度吗？**

当按百分比设定一个元素的宽度时，它是相对于父容器的宽度计算的，但是，对于一些表示竖向距离的属性，例如 padding-top , padding-bottom , margin-top , margin-bottom 等，当按百分比设定它们时，依据的也是父容器的宽度，而不是高度。

### **24、全屏滚动的原理是什么？用到了CSS的哪些属性？**

原理：有点类似于轮播，整体的元素一直排列下去，假设有5个需要展示的全屏页面，那么高度是500%，只是展示100%，剩下的可以通过transform进行y轴定位，也可以通过margin-top实现
overflow：hidden；transition：all 1000ms ease；

### **25、什么是响应式设计？响应式设计的基本原理是什么？**

响应式网站设计(Responsive Web design)是一个网站能够兼容多个终端，而不是为每一个终端做一个特定的版本。

基本原理是通过媒体查询检测不同的设备屏幕尺寸做处理。

页面头部必须有meta声明的viewport。

### **26、 ::before 和 :after中双冒号和单冒号有什么区别？解释一下这2个伪元素的作用**

单冒号(:)用于CSS3伪类，双冒号(::)用于CSS3伪元素。

::before就是以一个子元素的存在，定义在元素主体内容之前的一个伪元素。并不存在于dom之中，只存在在页面之中。

:before 和 :after 这两个伪元素，是在CSS2.1里新出现的。起初，伪元素的前缀使用的是单冒号语法，但随着Web的进化，在CSS3的规范里，伪元素的语法被修改成使用双冒号，成为::before ::after。

### **27、你对line-height是如何理解的？**

行高是指一行文字的高度，具体说是两行文字间基线的距离。CSS中起高度作用的是height和line-height，没有定义height属性，最终其表现作用一定是line-height。

> 单行文本垂直居中：把line-height值设置为height一样大小的值可以实现单行文字的垂直居中，其实也可以把height删除。
> 多行文本垂直居中：需要设置display属性为inline-block。

### **28、怎么让Chrome支持小于12px 的文字？**

这个我们在做移动端的时候，设计师图片上的文字假如是10px，我们实现在网页上之后。往往设计师回来找我们，这个字体能小一些吗？我设计的是10px？

为啥是12px?其实我们都知道，谷歌Chrome最小字体是12px，不管你设置成8px还是10px，在浏览器中只会显示12px，那么如何解决这个坑爹的问题呢？

针对谷歌浏览器内核，加webkit前缀，用transform:scale()这个属性进行缩放！

- 
- 
- 
- 
- 
- 
- 

```
<style>p span{    font-size:10px;    -webkit-transform:scale(0.8);    display:block;}</style>
```

### **29、让页面里的字体变清晰，变细用CSS怎么做？**

-webkit-font-smoothing在window系统下没有起作用，但是在IOS设备上起作用-webkit-font-smoothing：antialiased是最佳的，灰度平滑。

### **30、如果需要手动写动画，你认为最小时间间隔是多久，为什么？**

多数显示器默认频率是60Hz，即1秒刷新60次，所以理论上最小间隔为1/60＊1000ms ＝ 16.7ms。

### **31、li与li之间有看不见的空白间隔是什么原因引起的？有什么解决办法？**

行框的排列会受到中间空白（回车空格）等的影响，因为空格也属于字符,这些空白也会被应用样式，占据空间，所以会有间隔，把字符大小设为0，就没有空格了。

解决方法：

1. 可以将<li>代码全部写在一排
2. 浮动li中float：left
3. 在ul中用font-size：0（谷歌不支持）；可以使用letter-space：-3px

### **32、display:inline-block 什么时候会显示间隙？**

元素被当成行内元素排版的时候，原来html代码中的回车换行被转成一个空白符，在字体不为0的情况下，空白符占据一定宽度，所以inline-block的元素之间就出现了空隙。这些元素之间的间距会随着字体的大小而变化，当行内元素font-size:16px时，间距为8px。
解决：
1、font-size
2、改变书写方式
3、使用margin负值
4、使用word-spacing或letter-spacing

### **33、有一个高度自适应的div，里面有两个div，一个高度100px，希望另一个填满剩下的高度**

外层div使用position：relative；高度要求自适应的div使用position: absolute; top: 100px; bottom: 0; left: 0

### **34、png、jpg、gif 这些图片格式解释一下，分别什么时候用。有没有了解过webp？**

png是便携式网络图片（Portable Network Graphics）是一种无损数据压缩位图文件格式.优点是：压缩比高，色彩好。大多数地方都可以用。

jpg是一种针对相片使用的一种失真压缩方法，是一种破坏性的压缩，在色调及颜色平滑变化做的不错。在www上，被用来储存和传输照片的格式。

gif是一种位图文件格式，以8位色重现真色彩的图像。可以实现动画效果.

webp格式是谷歌在2010年推出的图片格式，压缩率只有jpg的2/3，大小比png小了45%。缺点是压缩的时间更久了，兼容性不好，目前谷歌和opera支持。

### **35、style标签写在body后与body前有什么区别？**

页面加载自上而下 当然是先加载样式。

写在body标签后由于浏览器以逐行方式对HTML文档进行解析，当解析到写在尾部的样式表（外联或写在style标签）会导致浏览器停止之前的渲染，等待加载且解析样式表完成之后重新渲染，在windows的IE下可能会出现FOUC现象（即样式失效导致的页面闪烁问题）。

### **36、CSS属性overflow属性定义溢出元素内容区的内容会如何处理?**

参数是scroll时候，必会出现滚动条。

参数是auto时候，子元素内容大于父元素时出现滚动条。

参数是visible时候，溢出的内容出现在父元素之外。

参数是hidden时候，溢出隐藏。

### **37、阐述一下CSS Sprites**

将一个页面涉及到的所有图片都包含到一张大图中去，然后利用CSS的 background-image，background- repeat，background-position 的组合进行背景定位。利用CSS Sprites能很好地减少网页的http请求，从而大大的提高页面的性能；CSS Sprites能减少图片的字节。

### **38、css可继承属性不可继承属性**

可 font-size, font-family, color

不可 border, padding, margin, width, height

### **39、flex布局**

先给父元素添加上display:flex形成一个flex容器

**flex-direction:控制主轴的方向**

1. row 水平从左到右（默认）
2. row-reverse 水平从右到左
3. column垂直从上到下
4. column-reverse垂直从下到上

**justify-content:控制子元素在子元素在主轴的对齐方式**

1. flex-start 从主轴起点到主轴终点
2. flex-end 从主轴终点到起点
3. center 居中
4. space-between 两端分布
5. space-around 环绕分布
6. space-evenly 均衡分布

**align-items 控制子元素在侧轴的对齐方式**

1. flex-start 从侧轴起点到终点
2. flex-end 从侧轴终点到起点
3. center 居中
4. stretch 拉伸对齐，想要拉伸效果得子元素设置高度

**flex-wrap 控制子元素是否换行**

1. nowrap 默认，不换行
2. wrap 换行

**align-content 控制子元素在侧轴的对齐方式（多行）**

1. flex-start 从主轴起点到主轴终点
2. flex-end: 从主轴的终点到起点
3. center: 居中对齐
4. space-between 两端分布
5. space-around 环绕分布
6. space-evenly 均衡分布
7. stretch: 拉伸分布 要拉伸效果 子元素不要设置高度

### **40、移动端的布局用过媒体查询吗？**

`<head>`

- 

```
<link rel="stylesheet" type="text/css" href="xxx.css" media="only screen and (max-device-width:480px)">
```

CSS : 

- 

```
@media only screen and (max-device-width:480px) {/css样式/}
```

### **41、文字溢出时显示点点点**

单行

- 
- 
- 

```
overflow: hidden;text-overflow: ellipsis;white-space: nowrap;
```

多行

- 
- 
- 
- 

```
display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 3;  //这里是在第二行有省略号overflow: hidden;
```

### **42、CSS有哪些布局**

float布局的兼容性比较好。解决办法：给橙色块添加overflow: hidden（生成了一个BFC）。浮动元素父元素还存在高度塌陷问题，解决方法：父元素生成一个BFC。

absolute布局的有点是简单直接，兼容性好。缺点，脱离了文档流。

flex布局的优点，布局简单、灵活，移动端友好；缺点是ie8以下不兼容。

table布局的优点是兼容性好，有时候布局相对简单。缺点是它是对TABLE标签的不正规使用，一直以来被大家所诟病。当需要内容高度不一致时并不适应。

grid布局优点，是第一个基于二维方向的布局模块。它是第一个基于网格的原生布局系统。缺点是对低版本浏览器兼容性不好。

### **43、CSS3文本属性**

text-shadow:2px 2px 8px #000;参数1为向右的偏移量，参数2为向左的偏移量，参数3为渐变的像素，参数4为渐变的颜色

text-overflow:规定当文本溢出包含元素时发生的事情 text-overflow:ellipsis(省略)

text-wrap:规定文本换行的规则

word-break 规定非中日韩文本的换行规则

word-wrap 对长的不可分割的单词进行分割并换行到下一行

white-space: 规定如何处理元素中的空白 white-space:nowrap 规定段落中的文本不进行换行

### **44、CSS3渐变**

CSS3 定义了两种类型的渐变（gradients）：

1. 线性渐变（Linear Gradients）- 向下/向上/向左/向右/对角方向
2. 径向渐变（Radial Gradients）- 由它们的中心定义

**线性渐变**

- 

```
background-image: linear-gradient(direction || angle, color-stop1, color-stop2, ...);
```

第一个参数：渐变方向（可选，默认从上到下），取值：（to bottom、to top、to right、to left、to bottom right等等）

**径向渐变**

- 

```
background-image: radial-gradient(position, shape size, start-color, stop-color);
```

**position：定义圆心位置；**

shape size：由2个参数组成，前者shape定义圆形或椭圆形，后者size定义大小；

1. shape它可以是值 circle 或 ellipse。其中，circle 表示圆形，ellipse 表示椭圆形。默认值是 ellipse。
2. size 参数定义了渐变的大小。它可以是以下四个值：closest-side、farthest-side、closest-corner、farthest-corner

start-color：设置开始的颜色；

stop-color：设置结束的颜色；

position、shape size可选可不选，如果没有进行设置，表示该参数采用默认值。

start-color和stop-color为必须设置的参数，并且径向渐变同线性渐变一样可以设置多种颜色。

### **45、CSS3中box-shadow**

box-shadow 向框添加一个或多个阴影。该属性是由逗号分隔的阴影列表，每个阴影由 2-4 个长度值、可选的颜色值以及可选的 inset 关键词来规定。省略长度的值是 0。

- 

```
box-shadow: h-shadow v-shadow blur spread color inset;
```

| 值       | 描述                                     |
| -------- | ---------------------------------------- |
| h-shadow | 必需。水平阴影的位置。允许负值。         |
| v-shadow | 必需。垂直阴影的位置。允许负值。         |
| blur     | 可选。模糊距离。                         |
| spread   | 可选。阴影的尺寸。                       |
| color    | 可选。阴影的颜色。请参阅 CSS 颜色值。    |
| inset    | 可选。将外部阴影 (outset) 改为内部阴影。 |

例如：

- 
- 
- 

```
div{   box-shadow: 10px 10px 5px #888888;}
```

### **46、CSS3 过渡**

CSS3的transition允许CSS的属性值在一定的时间区间内平滑地过渡。这种效果可以在鼠标单击，获得焦点，被点击或对元素任何改变中触发，并平滑地以动画效果改变CSS的属性值。

- 

```
transition:[<transition-property> || <transition-duration> || <transition-timing-function> || <transition-delay>]
```

**transition-property：指定过渡的CSS属性。**

1. none：没有指定任何样式。

2. all：默认值，表示指定元素所有支持transition-property属性的样式。

3. ```
   <single-transition-property>
   ```

   ：指定一个或多个样式。并不是所有样式都能应用transition-property进行过渡，只有具有一个中点值的样式才能具备过渡效果，如颜色，长度，渐变等。

**transition-duration：指定完成过渡所需的时间。**

1. `<time>`为数值，单位为s(秒)或ms(毫秒)，默认值是0。当有多个过渡属性时，可以设置多个过渡时间分别应用过渡属性，也可以设置一个过渡时间应用所有过渡属性。

**transition-timing-function：指定过渡调速函数。**

1. ease：默认值，元素样式从初始状态过渡到终止状态时速度由快到慢，逐渐变慢。
2. linear：元素样式从初始状态过渡到终止状态速度是恒速。
3. ease-in：元素样式从初始状态过渡到终止状态时，速度越来越快，呈一种加速状态。这种效果称为渐显效果。
4. ease-out：元素样式从初始状态过渡到终止状态时，速度越来越慢，呈一种减速状态。这种效果称为渐隐效果。
5. ease-in-out：元素样式从初始状态到终止状态时，先加速再减速。这种效果称为渐显渐隐效果。

**transition-delay：指定过渡开始出现的延迟时间。**

1. 用来指定一个动画开始执行的时间，也就是说当改变元素属性值后多长时间开始执行过渡效果，它可以是正整数，负整数和0，非零的时候必须将单位设置为s(秒)或ms(毫秒)。

### **47、css3中的变形（transform）**

Transform字面上就是变形，改变的意思。在CSS3中transform主要包括以下几种：旋转rotate、扭曲skew、缩放scale和移动translate以及矩阵变形matrix。

- 

```
transform: rotate | scale | skew | translate |matrix;
```

**一、旋转rotate**

rotate() ：通过指定的角度参数对原元素指定一个2D rotation（2D 旋转），需先有transform-origin属性的定义。

transform-origin定义的是旋转的基点，其中angle是指旋转角度，如果设置的值为正数表示顺时针旋转，如果设置的值为负数，则表示逆时针旋转。如：transform:rotate(30deg):

**二、移动translate**

移动translate我们分为三种情况：translate(x,y)水平方向和垂直方向同时移动（也就是X轴和Y轴同时移动）；translateX(x)仅水平方向移动（X轴移动）；translateY(Y)仅垂直方向移动（Y轴移动）。

具体使用方法如下：
1、translate([, ]) ：通过矢量[tx, ty]指定一个2D translation，tx 是第一个过渡值参数，ty 是第二个过渡值参数选项。如果未被提供，则ty以 0 作为其值。也就是translate(x,y),它表示对象进行平移，按照设定的x,y参数值,当值为负数时，反方向移动物体，其基点默认为元素 中心点，也可以根据transform-origin进行改变基点。如transform:translate(100px,20px):

2、translateX() ：通过给定一个X方向上的数目指定一个translation。只向x轴进行移动元素，同样其基点是元素中心点，也可以根据transform-origin改变基点位置。如：transform:translateX(100px):

3、translateY() ：通过给定Y方向的数目指定一个translation。只向Y轴进行移动，基点在元素心点，可以通过transform-origin改变基点位置。如：transform:translateY(20px):

**三、缩放scale**

缩放scale和移动translate是极其相似，他也具有三种情况：scale(x,y)使元素水平方向和垂直方向同时缩放（也就是X轴和Y轴同时缩放）；scaleX(x)元素仅水平方向缩放（X轴缩放）；scaleY(y)元素仅垂直方向缩放（Y轴缩放），但它们具有相同的缩放中心点和基数，其中心点就是元素的中心位置，缩放基数为1，如果其值大于1元素就放大，反之其值小于1，元素缩小。

下面我们具体来看看这三种情况具体使用方法：

1、scale([, ])：提供执行[sx,sy]缩放矢量的两个参数指定一个2D scale（2D缩放）。

如果第二个参数未提供，则取与第一个参数一样的值。scale(X,Y)是用于对元素进行缩放，可以通过transform-origin对元素的基点进行设置，同样基点在元素中心位置；基中X表示水平方向缩放的倍数，Y表示垂直方向的缩放倍数，而Y是一个可选参数，如果没有设置Y值，则表示X，Y两个方向的缩放倍数是一样的。并以X为准。如：transform:scale(2,1.5):

2、scaleX() ：使用 [sx,1] 缩放矢量执行缩放操作，sx为所需参数。scaleX表示元素只在X轴(水平方向)缩放元素，他的默认值是(1,1)，其基点一样是在元素的中心位置，我们同样是通过transform-origin来改变元素的基点。如：transform:scaleX(2):

3、scaleY() ：使用 [1,sy] 缩放矢量执行缩放操作，sy为所需参数。scaleY表示元素只在Y轴（垂直方向）缩放元素，其基点同样是在元素中心位置，可以通过transform-origin来改变元素的基点。如transform:scaleY(2):

**四、扭曲skew**

扭曲skew和translate、scale一样同样具有三种情况：skew(x,y)使元素在水平和垂直方向同时扭曲（X轴和Y轴同时按一定的角度值进行扭曲变形）；skewX(x)仅使元素在水平方向扭曲变形（X轴扭曲变形）；skewY(y)仅使元素在垂直方向扭曲变形（Y轴扭曲变形）。

具体使用如下：

1、skew( [, ]) ：X轴Y轴上的skew transformation（斜切变换）。第一个参数对应X轴，第二个参数对应Y轴。如果第二个参数未提供，则值为0，也就是Y轴方向上无斜切。

skew是用来对元素进行扭曲变行，第一个参数是水平方向扭曲角度，第二个参数是垂直方向扭曲角度。

其中第二个参数是可选参数，如果没有设置第二个参数，那么Y轴为0deg。同样是以元素中心为基点，我们也可以通过transform-origin来改变元素的基点位置。如：transform:skew(30deg,10deg):

2、skewX() ：按给定的角度沿X轴指定一个skew transformation（斜切变换）。skewX是使元素以其中心为基点，并在水平方向（X轴）进行扭曲变行，同样可以通过transform-origin来改变元素的基点。如：transform:skewX(30deg)

3、skewY() ：按给定的角度沿Y轴指定一个skew transformation（斜切变换）。skewY是用来设置元素以其中心为基点并按给定的角度在垂直方向（Y轴）扭曲变形。同样我们可以通过transform-origin来改变元素的基点。如：transform:skewY（10deg）

**五、矩阵matrix**

matrix(, , , , , ) ：以一个含六值的(a,b,c,d,e,f)变换矩阵的形式指定一个2D变换，相当于直接应用一个[a b c d e f]变换矩阵。就是基于水平方向（X轴）和垂直方向（Y轴）重新定位元素,此属性值使用涉及到数学中的矩阵。

### **48、css3 动画(animation)**

CSS3 时代，动画不再必须依赖 js，变得更加简单、高效。语法：

- 

```
animation: name duration timing-function delay iteration-count direction;
```

animation 属性是一个简写属性，用于设置六个动画属性：animation-name、animation-duration、animation-timing-function、animation-delay、animation-iteration-count、animation-direction。

注释：请始终规定 animation-duration 属性，否则时长为 0，就不会播放动画了。

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

示例:

- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 

```
@keyframes myFadeIn {  from {    opacity: 0;  }  to {    opacity: 1;  }}.target{  background: #f0f;  width: 100px;  height: 100px;  animation: myFadeIn 1s;}
```

@keyframes 用来定义一个动画，其后的第一个单词，就是动画的名字（上面代码中的 myFadeIn）,最外层括号里的内容，就是动画的效果

from 和 to 分别定义两个状态，表示动画是由 0%变成 100%

### **viewport的理解**

手机浏览器会把页面放入到一个虚拟的“视口”（viewpoint）中，但viewport又不局限于浏览器可视区域的大小，它可能比浏览器的可视区域大，也可能比浏览器的可视区域小。通常这个虚拟的“视口”（viewport）比屏幕宽，会把网页挤到一个很小的窗口。

如果不显示地设置viewport，那么浏览器就会把width默认设置为980。但后果是浏览器出现横向滚动条，因为浏览器可视区域的宽度比默认的viewport的宽度小。 

然后浏览器引进了 viewport 这个 meta tag，让网页开发者来控制 viewport 的大小和缩放。

- 

```
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### **49、CSS实现宽度自适应100%，宽高16:9的比例的矩形**

第一步先计算高度，假设宽100%，那么高为h=9/16=56.25%

第二步利用之前所说设置padding-bottom方法实现矩形

- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 

```
<div class="box">  <div class="scale">这是一个16：9的矩形</div></div><style>.box {  width: 80%;}.scale {  width: 100%;  padding-bottom: 56.25%;  height: 0;  position: relative;}</style>
```

### **50、rem布局的优缺点**

优点：能让我们在手机各个机型的适配方面；大大减少我们代码的重复性，是我们的代码更兼容。

缺点：目前ie不支持 对pc页面来讲使用次数不多；

数据量大：所有的图片，盒子都需要我们去给一个准确的值；才能保证不同机型的适配；

px转换成rem需要手动，计算方式：量的大小除以100，就等于rem，例如：量的设计稿元素宽度是120，那么就写成{width: 1.2rem}。实现代码如下：

- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 

```
<script>        function resetFontSize() {var baseFontSize = 100var designWidth = 750            var width = window.innerWidth            var currentFontSize = (width / designWidth) * baseFontSize            document.getElementsByTagName('html')[0].style.fontSize = currentFontSize + 'px'        }        window.onresize = function () {            resetFontSize()        };        resetFontSize()</script>
```

### **51、如何解决1px问题（1像素边框问题）**

移动端web开发中，UI设计稿中设置边框为1像素，前端在开发过程中如果出现border:1px，测试会发现在某些机型上，1px会比较粗，即是较经典的 移动端1px像素问题。

**1.transform: scale(0.5)** 

a、设置height: 1px，根据媒体查询结合transform缩放为相应尺寸。

- 
- 
- 
- 
- 
- 
- 

```
div {    height:1px;    background:#000;    -webkit-transform: scaleY(0.5);    -webkit-transform-origin:0 0;    overflow: hidden;}
```

b、用::after和::befor,设置border-bottom：1px solid #000,然后在缩放-webkit-transform: scaleY(0.5);可以实现两根边线的需求

- 
- 
- 
- 
- 
- 

```
div::after{    content:'';    width:100%;    border-bottom:1px solid #000;    transform: scaleY(0.5);}
```

2.媒体查询利用设备像素比缩放，设置小数像素；

优点：简单，好理解
缺点：兼容性差，目前之余IOS8+才支持，在IOS7及其以下、安卓系统都是显示0px。

- 1.）css可以写成这样：

- 
- 
- 
- 
- 
- 
- 

```
.border { border: 1px solid #999 }@media screen and (-webkit-min-device-pixel-ratio: 2) {    .border { border: 0.5px solid #999 }}@media screen and (-webkit-min-device-pixel-ratio: 3) {    .border { border: 0.333333px solid #999 }}
```

- 2.）js 可以写成这样：

- 
- 
- 
- 
- 
- 
- 

```
<body><div id="main" style="border: 1px solid #000000;"></div></body><script type="text/JavaScript">    if (window.devicePixelRatio && devicePixelRatio >= 2) {        var main = document.getElementById('main');        main.style.border = '.5px solid #000000';    }</script>
```

二者任选其一；

3.媒体查询 + transfrom

- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 

```
/* 2倍屏 */@media only screen and (-webkit-min-device-pixel-ratio: 2.0) {    .border-bottom::after {        -webkit-transform: scaleY(0.5);        transform: scaleY(0.5);    }}/* 3倍屏 */@media only screen and (-webkit-min-device-pixel-ratio: 3.0) {    .border-bottom::after {        -webkit-transform: scaleY(0.33);        transform: scaleY(0.33);    }}
```

4.box-shadow 方案

利用阴影也可以实现，优点是没有圆角问题，缺点是颜色不好控制

- 
- 
- 

```
div {    -webkit-box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.5);}
```

### **52、CSS允许使用哪些不同的媒介类型？**

@media属性主要有四种类型（包括screen）：

all—适用于所有设备。

print—打印预览模式/打印页面。

speech——适用于“朗读”页面的屏幕阅读器

screen——计算机屏幕（默认）

### **53、CSS有哪些单位?**

CSS 有两种类型的长度单位：相对和绝对。设置 CSS 长度的属性有 width, margin, padding, font-size, border-width, 等。

相对长度：

| 单位 | 描述                                                         |
| ---- | ------------------------------------------------------------ |
| em   | 它是描述相对于应用在当前元素的字体尺寸，所以它也是相对长度单位。一般浏览器字体大小默认为16px，则2em == 32px； |
| rem  | 是根 em（root em）的缩写，rem作用于非根元素时，相对于根元素字体大小；rem作用于根元素字体大小时，相对于其出初始字体大小。 |
| vh   | viewpoint height，视窗高度，1vh=视窗高度的1%                 |
| vw   | viewpoint width，视窗宽度，1vw=视窗宽度的1%                  |
| vmin | vw和vh中较小的那个。                                         |
| vmax | vw和vh中较大的那个。                                         |
| %    | 相对父元素                                                   |

提示: rem与em有什么区别呢？区别在于使用rem为元素设定字体大小时，仍然是相对大小，但相对的只是HTML根元素。

**绝对长度：**

| 单位 | 描述                                |
| ---- | ----------------------------------- |
| cm   | 厘米                                |
| mm   | 毫米                                |
| in   | 英寸 (1in = 96px = 2.54cm)          |
| px * | 像素 (1px = 1/96th of 1in)          |
| pt   | point，大约1/72英寸；(1pt = 1/72in) |

像素或许被认为是最好的"设备像素"，而这种像素长度和你在显示器上看到的文字屏幕像素无关。px实际上是一个按角度度量的单位。

### **54、用于控制背景图像滚动的属性是什么？**

background-attachment：该属性设置背景图像是随页面其余部分滚动还是固定滚动。

- 
- 
- 
- 
- 

```
body {  background-image: url("img_tree.gif");  background-repeat: no-repeat;  background-attachment: fixed;}
```

### **55、什么是供应商前缀？**

浏览器供应商有时会在实验性或非标准CSS属性和JavaScript API中添加前缀，因此，从理论上讲，开发人员可以尝试新的想法，同时从理论上防止在标准化过程中依赖他们的实验，然后破坏Web开发人员的代码。

开发人员应等待包括未添加前缀的属性，直到浏览器行为标准化为止。

主流浏览器使用以下前缀：

> -webkit- （Chrome，Safari，Opera的较新版本，几乎所有的iOS浏览器（包括Firefox for iOS）；基本上是任何基于WebKit的浏览器）
> -moz- （Firefox）
> -o- （旧的，WebKit之前的Opera版本）
> -ms- （Internet Explorer和Microsoft Edge）

### **56、CSS中 link 和@import 的区别是？**

link属于HTML标签，而@import是CSS提供的，页面被加载时，link会同时被加载，而@import引用的CSS会等到页面被加载完再加载
import只在IE5以上才能识别，而link是HTML标签，无兼容问题
link方式的样式的权重 高于@import的权重.

### **57、使元素消失的方法有哪些？**

opacity：0，该元素隐藏起来了，但不会改变页面布局，并且，如果该元素已经绑定一些事件，如click事件，那么点击该区域，也能触发点击事件的

visibility：hidden，该元素隐藏起来了，但不会改变页面布局，但是不会触发该元素已经绑定的事件

display：none，把元素隐藏起来，并且会改变页面布局，可以理解成在页面中把该元素删除掉。

感谢你的阅读。