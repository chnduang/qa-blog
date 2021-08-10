## javascript中的类的构造

javascript中有对象的概念，却没有类的概念。对于基础不牢的同学，很难在类和对象之间加以区分，这里简单的将它们的关系概况为：类是一种抽象的概念，例如瓶子、人、笨蛋；而对象，则是指这种概念中的实体，比如“那个美女手中的那只瓶子”“村长是一个地道的农民”“她的男朋友是个笨蛋”；实例化，就是指以类为基础构建一个实体。类所拥有的特征，其实例化对象，也一定拥有这些特征，而且实例化后可能拥有更多特征。

javascript在用到对象时，完全没有类的概念，但是编程的世界里，无奇不有，我们却可以通过function构造出一种假想的类，从而实现javascript中类的构造。

比如，我们通过下面的方法来构造一个类：

```js
//java
class Book {
    private String name;
    private double price;
    public Book(name,price) {this.name=name;this.price=price;}
    public void setName(String name) { this.name = name;}
    public void setPrice(double price) {this.price = price;}
    public String getInfo() {...} 
}
Book book1 = new Book('java',13.3);

//javascript
function Book(name,price) {
    this.name = name;
    this.price = price;
    this.setName = function(name) {this.name = name;};
    this.setPrice = function(price) {this.price = price};
    this.getInfo = function() {return this.name + '  ' + this.price;};
}
var book1 = new Book('java',13.3);
```

这是很好玩儿的一种尝试。这也是本文要讨论的所有问题的起源。

### function(){}()让变量快速初始化结果

在《javascript立即执行某个函数：插件中function(){}()再思考》一文中，我详细阐述了function(){}()的作用及理解思路。这里不再赘述，现在，我们面临的新问题是，知道了它的作用，我们如何使用它？

让我们来看一段代码：

```
var timestamp = function(){
    var timestamp = Date.parse(new Date());
    return timestamp/1000;
}();
```

当我们要使用一个变量时，我们希望这个变量在一个环节完成我们的赋值，使用上面的这种方法，可以减少代码上下文执行逻辑，如果按照我们以前的方法，代码可能会写成：

```
var timestamp = Date.parse(new Data());
timestamp = timestamp/1000;
```

看上去好像比上面的操作简洁多了，只需要两行代码。但是我们仔细去观察，就会发现第一段代码其实本身仅是一个赋值操作，在function中完成的所有动作将会在function执行完后全部释放，整个代码看上去好像只执行了一条语句一样。

而实际上更重要的意义在于它可以让一个变量在初始化时，就具备了运算结果的效果。

### 使用new function初始化一个可操作对象

第一部分讲到了javascript中的类，而使用new function就可以实例化这个类。但是我们实际上有的时候在为一个变量赋值的时候，希望直接将它初始化为一个可操作的对象，比如像这样：

```js
// 这里的数据库操作是我虚拟出来的一种数据库操作形式
var $db = new function(){
    var $db = db_connect('127.0.0.1','root','');
    $db.use('database');
    this.select = function(table,where) {
        var result = $db.query('select from ' + table + ' where ' + where);
        return $db.fetchAll(result);
    }
};
```

而当我们要对数据库database进行查询时，只需要通过`var list = $db.select('table','1=1');`进行操作即可，数据库的初始化结果已经在$db这个变量中了。

### Function是由function关键字定义的函数对象的原型

在javascript中，多出了一个原型的概念。所谓原型，其实就是一个对象的本质，但复杂就复杂在，原型本身也是对象，因此，任何一个对象又可以作为其他对象的原型。Function就相当于一个系统原型，可以把它理解为一种“基本对象类型”，是“对象”这个概念范畴类的基本数据类型。除了Function之外，其实还有很多类似的首字母大写的对象原型，例如Object, Array, Image等等。有一种说法是：javascript中所有的一切都是对象（除了基本数据类型，其他的一切全是对象），所有的对象都是Object衍生出来的。（按照这种说法，我们应该返回去再思考，上面说的类的假设是否成立。）

### 极其重要的prototype概念

prototype的概念在javascript中极其重要，它是javascript中完成上面说的“一切皆对象”的关键。有了prototype，才有了原型，有了原型，才有了javascript五彩缤纷的世界（当然，也有人说是杂乱的）。我们可以这样去理解prototype：世界上本没有javascript，上帝说要有Object，于是有了Object，可是要有Function怎么办？只需要对Object进行扩展，可是如何扩展？只需要用prototype……当然，这是乱扯的，不过在javascript中，只要是function，就一定会有一个prototype属性。实际上确实是这样

```js
Function.prototype.show = function() {...}
```

在原型的基础上通过prototype新增属性或方法，则以该对象为原型的实例化对象中，必然存在新增的属性或方法，而且它的内容是静态不可重载的。原型之所以被称为原型，可能正是因为这种不可重载的特质。

比如上面的这段代码，会导致每一个实例化的function，都会具备一个show方法。而如果我们自己创建了一个类，则可以通过prototype将之转化为原型：

```js
function Cat() {...}
Cat.prototype.run = function() {};
var cat1 = new Cat();
```

这时，对于cat1而言，Cat就是原型，而该原型拥有一个run的原始方法，所以无论实例化多少个Cat，每一个实例化对象都有run方法，而且该方法是不能被重载的，通过cat1.run = function(){}是无效的。

为了和其他语言的类的定义方法统一，我们可以将这种原型属性在定义类的时候，写在类的构造里面：

```js
function Cat() {
    ....
    Cat.prototype.run = function() {};
}
```

### new Function()是函数原型的一个实例化

在理解了Function原型的概念之后，再来看new Function()就显得很容易了。首先来看下我们是怎么使用这种奇特的写法的：

```js
var message = new Function('msg','alert(msg)');
// 等价于：
function message(msg) {
    alert(msg);
}
```

new Function(参数1,参数2,...,参数n,函数体)，它的本意其实是通过实例化一个Function原型，得到一个数据类型为function的对象，也就是一个函数，而该变量就是函数名。

### this在这类function中的指向

this在javascript中真的是无法让我们捉摸透彻。但是有一个小窍门，就是：一般情况下，this指向的是当前实例化对象，如果没有找到该对象，则是指向window。从使用上来讲，我们应该排除new Function的讨论，因为它和我们常用的函数声明是一致的。

**普通的函数中this的指向**

函数声明的时候，如果使用了this，那么就要看是把该函数当做一个对象加以返回，还是以仅执行函数体。普通函数执行时，我们完全没有引入对象、类这些概念，因此，this指向window。通过代码来看下：

```js
var msg;
function message(msg) {
    this.msg = msg;
}
message('ok');
alert(msg);
```

首先是声明一个函数message，在函数中this.msg实际上就是window.msg，也实际上就是代码开头的msg。因此，当执行完message('ok')的时候，开头的全局变量msg也被赋值为ok。

**通过function构造类时this的指向**

如果function被构造为一个类，那么必然存在该类被实例化的一个过程，如果没有实例化，那么该类实际上并没有在程序中被使用。而一旦实例化，那么this将指向实例化的对象。

```js
var age = 3;
var cat1 = new function() {
    this.name = 'Tom';
    this.age = 2;
    this.weight = function(age) {
        var age = age * 2;
        var _age = this.age * 2;
        return 'weight by age:' + age + '; weight by this.age:' + _age;
    }(this.age);
    this.eye = new function() {
        this.size = '1.5cm';
        this.color = 'red';
    };
    this.catching = function(mouse) {
        return this.name + ' is catching ' + mouse;
    };
};
alert(cat1.weight);
alert(cat1.eye.color);
alert(cat1.catching('Jerry'));
```

上面代码中标记了4处红色的this的使用。根据我们的原则，this指向实例化对象，我们来对每一个this进行分解。

首先是cat1.weight，我使用了function(){}()，直接利用猫咪的年龄进行计算得出体重返回给weight属性。

第一个this.age出现在function(){}(this.age)，这个this.age实际上是一个传值过程，如果你对我之前分析function(){}()比较了解的话，应该知道，this.age实际上是和前面this.age = 2指同一个，这里的this.age的this，首先要去找它所在的function，然后看这个function是否被实例化，最后确认，确实被实例化为cat1，因此this=cat1。

第二个this.age出现在function(){this.age}()。同样，你先需要对function(){}()再次深入了解，实际上，function(){}()就是执行一个函数而已，我们前面提到了，普通函数执行中this=window，所以，这里的this.age实际上是var age = 3。

第三个this.color出现在new function(){this.color}，这里就比较好玩，由于有一个new，实际上也被实例化了，只不过是对匿名类的实例化，没有类名，而且实例化仅可能出现这一次。因此，this.color的this要去找new function的主人，也就是this.eye，而this.eye的this=cat1，所以cat1.eye.color='red'。

第四个this.name出现在function(){this.name}，它出现在cacthing方法中，它既不是普通的函数执行，也不是实例化为对象，而是正常的类中的方法的声明，因此this指向要去找它所在的function被实例化的对象，也就是cat1。