# new操作符都做了什么

1、创建一个空对象，并且 this 变量引用该对象。

```js
let target = {};
```

2、继承了函数的原型。

```js
target.proto = func.prototype;
```

3、属性和方法被加入到 this 引用的对象中。并执行了该函数func。

```js
func.call(target);
```

4、新创建的对象由 this 所引用，并且最后隐式的返回 this。

```js
如果func.call(target)返回的res是个对象或者function 就返回它
```

```js
function new(func) {
	lat target = {};
	target.__proto__ = func.prototype;
	let res = func.call(target);
	if (typeof(res) == "object" || typeof(res) == "function") {
		return res;
	}
	return target;
}

```

