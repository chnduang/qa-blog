## JavaScript运算符使用技巧

#### 一、可选链接运算符【？.】

**可选链接运算符（Optional Chaining Operator）** 处于ES2020提案的第4阶段，因此应将其添加到规范中。它改变了访问对象内部属性的方式，尤其是深层嵌套的属性。它也可以作为TypeScript 3.7+中的功能使用。

相信大部分开发前端的的小伙伴们都会遇到null和未定义的属性。JS语言的动态特性使其无法不碰到它们。特别是在处理嵌套对象时，以下代码很常见：

```
if (data && data.children && data.children[0] && data.children[0].title) {
    // I have a title!
} 
```

上面的代码用于API响应，我必须解析JSON以确保名称存在。但是，当对象具有可选属性或某些配置对象具有某些值的动态映射时，可能会遇到类似情况，需要检查很多边界条件。

这时候，如果我们使用可选链接运算符，一切就变得更加轻松了。它为我们检查嵌套属性，而不必显式搜索梯形图。我们所要做的就是使用“？” 要检查空值的属性之后的运算符。我们可以随意在表达式中多次使用该运算符，并且如果未定义任何项，它将尽早返回。

**对于静态属性**用法是：

```
object?.property
```

**对于动态属性**将其更改为：

```
object?.[expression] 
```

上面的代码可以简化为：

```
let title = data?.children?.[0]?.title;
```

然后，如果我们有:

```
 let data;
console.log(data?.children?.[0]?.title) // undefined

data  = {children: [{title:'codercao'}]}
console.log(data?.children?.[0]?.title) // codercao
```

这样写是不是更加简单了呢？由于操作符一旦为空值就会终止，因此也可以使用它来有条件地调用方法或应用条件逻辑

```
 const conditionalProperty = null;
let index = 0;

console.log(conditionalProperty?.[index++]); // undefined
console.log(index);  // 0
```

**对于方法**的调用你可以这样写

```
object.runsOnlyIfMethodExists?.()
```

例如下面的`parent`对象，如果我们直接调用`parent.getTitle()`,则会报`Uncaught TypeError: parent.getTitle is not a function`错误，`parent.getTitle?.()`则会终止不会执行

```
let parent = {
    name: "parent",
    friends: ["p1", "p2", "p3"],
    getName: function() {
      console.log(this.name)
    }
  };
  
  parent.getName?.()   // parent
  parent.getTitle?.()  //不会执行 
```

**与无效合并一起使用**

提供了一种方法来处理未定义或为空值和表达提供默认值。我们可以使用`??`运算符，为表达式提供默认值

```
console.log(undefined ?? 'codercao'); // codercao
```

因此，如果属性不存在，则可以将无效的合并运算符与可选链接运算符结合使用以提供默认值。

```
let title = data?.children?.[0]?.title ?? 'codercao';
console.log(title); // codercao
```

#### 二、逻辑空分配（?? =）

```
expr1 ??= expr2
```

逻辑空值运算符仅在空值（ `null` 或者 `undefined`）时才将值分配给expr1，表达方式：

```
x ??= y
```

可能看起来等效于：

```
x = x ?? y;
```

但事实并非如此！有细微的差别。

空的合并运算符（??）从左到右操作，如果x不为空，则短路。因此，如果x不为 `null` 或者 `undefined`，则永远不会对表达式`y`进行求值。因此，如果`y`是一个函数，它将根本不会被调用。因此，此逻辑赋值运算符等效于

```
x ?? (x = y);
```

#### 三、逻辑或分配（|| =）

此逻辑赋值运算符仅在左侧表达式为 **falsy值**时才赋值。Falsy值与null有所不同，因为falsy值可以是任何一种值：undefined，null，空字符串(双引号""、单引号’’、反引号``)，NaN，0。IE浏览器中的 document.all，也算是一个。

语法

```
x ||= y
```

等同于

```
x || (x = y)
```

在我们想要保留现有值（如果不存在）的情况下，这很有用，否则我们想为其分配默认值。例如，如果搜索请求中没有数据，我们希望将元素的内部HTML设置为默认值。否则，我们要显示现有列表。这样，我们避免了不必要的更新和任何副作用，例如解析，重新渲染，失去焦点等。我们可以简单地使用此运算符来使用JavaScript更新HTML：

```
document.getElementById('search').innerHTML ||= '<i>No posts found matching this search.</i>'
```

#### 四、逻辑与分配（&& =）

可能你已经猜到了，此逻辑赋值运算符仅在左侧为真时才赋值。因此：

```
x &&= y
```

等同于

```
x && (x = y)
```