## 如何使用JS实现一个发布订阅器？

> [https://mp.weixin.qq.com/s/XgY_9ZDxy78KzS3RtDS8aw](https://mp.weixin.qq.com/s/XgY_9ZDxy78KzS3RtDS8aw)

使用 JS 实现一个发布订阅器，`Event`，示例如下:

```
const e = new Event()

e.on('click', x => console.log(x.id))

e.once('click', x => console.log(id))

//=> 3
e.emit('click', { id: 3 })

//=> 4
e.emit('click', { id: 4 })
```

API 如下：

```
class Event {
  emit (type, ...args) {
  }

  on (type, listener) {
  }

  once (type, listener) {
  }

  off (type, listener) {
  }
}
```

------

------

一个简单的订阅发布模式实现如下，主要有两个核心 API

- `emit`: 发布一个事件
- `on`: 监听一个事件
- `off`: 取消一个事件监听

实现该模式，使用一个 events 维护发布的事件：

```
const events = {
  click: [{
    once: true,
    listener: callback,
  }, {
    listener: callback
  }]
}
```

具体实现代码如下所示

```
class Event {
  events = {}
 
  emit (type, ...args) {
    const listeners = this.events[type]
    for (const listener of listeners) {
      listener.listener(...args)
      if (listener.once) {
        this.off(type, listener.listener)
      }
    }
  }

  on (type, listener) {
    this.events[type] = this.events[type] || []
    this.events[type].push({ listener })
  }

  once (type, listener) {
    this.events[type] = this.events[type] || []
    this.events[type].push({ listener, once: true })
  }

  off (type, listener) {
    this.events[type] = this.events[type] || []
    this.events[type] = this.events[type].filter(listener => listener.listener !== listener)
  }
}
```

