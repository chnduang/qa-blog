# [ZooTeam](https://www.zoo.team/)

# JS 图片压缩

> [https://www.zoo.team/article/image-compress](https://www.zoo.team/article/image-compress)

### 前言

说起图片压缩，大家想到的或者平时用到的很多工具都可以实现，例如，客户端类的有图片压缩工具 PPDuck3， JS 实现类的有插件 compression.js ，亦或是在线处理类的 OSS 上传，文件上传后，在访问文件时中也有图片的压缩配置选项，不过，能不能自己撸一套 JS 实现的图片压缩代码呢？当然可以，那我们先来理一下思路。

### 压缩思路

涉及到 JS 的图片压缩，我的想法是需要用到 Canvas 的绘图能力，通过调整图片的分辨率或者绘图质量来达到图片压缩的效果，实现思路如下：

- 获取上传 Input 中的图片对象 File
- 将图片转换成 base64 格式
- base64 编码的图片通过 Canvas 转换压缩，这里会用到的 Canvas 的 drawImage 以及 toDataURL 这两个 Api，一个调节图片的分辨率的，一个是调节图片压缩质量并且输出的，后续会有详细介绍
- 转换后的图片生成对应的新图片，然后输出

### 优缺点介绍

不过 Canvas 压缩的方式也有着自己的优缺点：

- 优点：实现简单，参数可以配置化，自定义图片的尺寸，指定区域裁剪等等。
- 缺点：只有 jpeg 、webp 支持原图尺寸下图片质量的调整来达到压缩图片的效果，其他图片格式，仅能通过调节尺寸来实现

### 代码实现

```html
<template>
  <div class="container">
    <input type="file" id="input-img" @change="compress" />
    <a :download="fileName" :href="compressImg" >普通下载</a>
    <button @click="downloadImg">兼容 IE 下载</button>
    <div>
      <img :src="compressImg" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'compress',
  data: function() {
    return {
      compressImg: null,
      fileName: null,
    };
  },
  components: {},
  methods: {
    compress() {
      // 获取文件对象
      const fileObj = document.querySelector('#input-img').files[0];
      // 获取文件名称，后续下载重命名
      this.fileName = `${new Date().getTime()}-${fileObj.name}`;
      // 获取文件后缀名
      const fileNames = fileObj.name.split('.');
      const type = fileNames[fileNames.length-1];
      // 压缩图片
      this.handleCompressImage(fileObj, type);
    },
    handleCompressImage(img, type) {
      const vm = this;
      let reader = new FileReader();
      // 读取文件
      reader.readAsDataURL(img);
      reader.onload = function(e) {
        let image = new Image(); //新建一个img标签
        image.src = e.target.result;
        image.onload = function() {
          let canvas = document.createElement('canvas');
          let context = canvas.getContext('2d');
          // 定义 canvas 大小，也就是压缩后下载的图片大小
          let imageWidth = image.width; //压缩后图片的大小
          let imageHeight = image.height;
          canvas.width = imageWidth;
          canvas.height = imageHeight;

          // 图片不压缩，全部加载展示
          context.drawImage(image, 0, 0);
          // 图片按压缩尺寸载入
          // let imageWidth = 500; //压缩后图片的大小
          // let imageHeight = 200;
          // context.drawImage(image, 0, 0, 500, 200);
          // 图片去截取指定位置载入
          // context.drawImage(image,100, 100, 100, 100, 0, 0, imageWidth, imageHeight);
          vm.compressImg = canvas.toDataURL(`image/${type}`);
        };
      };
    },
    // base64 图片转 blob 后下载
    downloadImg() {
      let parts = this.compressImg.split(';base64,');
      let contentType = parts[0].split(':')[1];
      let raw = window.atob(parts[1]);
      let rawLength = raw.length;
      let uInt8Array = new Uint8Array(rawLength);
      for(let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      const blob = new Blob([uInt8Array], {type: contentType});
      this.compressImg = URL.createObjectURL(blob);
      if (window.navigator.msSaveOrOpenBlob) {
        // 兼容 ie 的下载方式
        window.navigator.msSaveOrOpenBlob(blob, this.fileName);
      }else{
        const a = document.createElement('a');
        a.href = this.compressImg;
        a.setAttribute('download', this.fileName);
        a.click();
      }
    },
  }
};
</script>
```

上面的代码是可以直接拿来看效果的，不喜欢用 Vue 的也可以把代码稍微调整一下，下面开始具体分解一下代码的实现思路

### Input 上传 File 处理

将 File 对象通过 `FileReader` 的 `readAsDataURL` 方法转换为URL格式的字符串（base64编码）

```js
const fileObj = document.querySelector('#input-img').files[0];
let reader = new FileReader();
// 读取文件
reader.readAsDataURL(fileObj);
```

### Canvas 处理 File 对象

建立一个 `Image` 对象，一个 `canvas` 画布，设定自己想要下载的图片尺寸，调用 `drawImage` 方法在 canvas 中绘制上传的图片

```js
let image = new Image(); //新建一个img标签
image.src = e.target.result;
let canvas = document.createElement('canvas');
let context = canvas.getContext('2d');
context.drawImage(image, 0, 0);
```

### Api 解析：drawImage

```js
context.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
```

**img**

就是图片对象，可以是页面上获取的 DOM 对象，也可以是虚拟 DOM 中的图片对象。

![img](https://zcy-cdn.oss-cn-shanghai.aliyuncs.com/f2e-assets/5bb290a8-b8b0-43fb-9583-a28a8b179639.jpg)

**dx , dy , dWidth , dHeight**

表示在 `canvas` 画布上规划处一片区域用来放置图片，`dx, dy` 为绘图位置在 Canvas 元素的 X 轴、Y 轴坐标，`dWidth, dHeight` 指在 Canvas 元素上绘制图像的宽度和高度（如果不说明， 在绘制时图片的宽度和高度不会缩放）。

**sx , sy , swidth , sheight**

这 4 个参数是用来裁剪源图片的，表示图片在 `canvas` 画布上显示的大小和位置。`sx,sy` 表示在源图片上裁剪位置的 X 轴、Y 轴坐标，然后以 `swidth,sheight` 尺寸来选择一个区域范围，裁剪出来的图片作为最终在 Canvas 上显示的图片内容（ `swidth,sheight` 不说明的情况下，整个矩形（裁剪）从坐标的 `sx` 和 `sy` 开始，到图片的右下角结束）。

以下为图片绘制的实例：

```js
context.drawImage(image, 0, 0, 100, 100);
context.drawImage(image, 300, 300, 200, 200);
context.drawImage(image, 0, 100, 150, 150, 300, 0, 150, 150);
```

![img](https://zcy-cdn.oss-cn-shanghai.aliyuncs.com/f2e-assets/2e77179b-a301-4196-bfd1-84d4c966fe7b.jpg)

Api 中奇怪之处在于，sx,sy,swidth,sheight 为选填参数，但位置在 dx, dy, dWidth, dHeight 之前。

### Canvas 输出图片

调用 `canvas` 的 `toDataURL` 方法可以输出 base64 格式的图片。

```js
canvas.toDataURL(`image/${type}`);
```

### Api 解析：toDataURL

```js
canvas.toDataURL(type, encoderOptions);
```

**type 可选**

图片格式，默认为 image/png。

**encoderOptions 可选**

在指定图片格式为 image/jpeg 或 image/webp的情况下，可以从 0 到 1 的区间内选择图片的质量。如果超出取值范围，将会使用默认值 0.92。其他参数会被忽略。

### 

### a 标签的下载

调用 `<a>` 标签的 `download` 属性，即可完成图片的下载。

### Api 解析：download

```js
// href 下载必填
<a download="filename" href="href"> 下载 </a>
```

**filename**

选填，规定作为文件名来使用的文本。

**href**

文件的下载地址。

### 非主流浏览器下载处理

到此可以解决 Chroma 、 Firefox 和 Safari（自测支持） 浏览器的下载功能，因为 IE 等浏览器不支持 `download` 属性，所以需要进行其他方式的下载，也就有了代码中的后续内容

```js
// base64 图片转 blob 后下载
downloadImg() {
  let parts = this.compressImg.split(';base64,');
  let contentType = parts[0].split(':')[1];
  let raw = window.atob(parts[1]);
  let rawLength = raw.length;
  let uInt8Array = new Uint8Array(rawLength);
  for(let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  const blob = new Blob([uInt8Array], {type: contentType});
  this.compressImg = URL.createObjectURL(blob);
  if (window.navigator.msSaveOrOpenBlob) {
    // 兼容 ie 的下载方式
    window.navigator.msSaveOrOpenBlob(blob, this.fileName);
  }else{
    const a = document.createElement('a');
    a.href = this.compressImg;
    a.setAttribute('download', this.fileName);
    a.click();
  }
}
```

- 将之前 `canvas` 生成的 base64 数据拆分后，通过 `atob` 方法解码
- 将解码后的数据转换成 Uint8Array 格式的无符号整形数组
- 转换后的数组来生成一个 Blob 数据对象，通过 `URL.createObjectURL(blob)` 来生成一个临时的 DOM 对象
- 之后 IE 类浏览器可以调用 `window.navigator.msSaveOrOpenBlob` 方法来执行下载，其他浏览器也可以继续通过 `<a>` 标签的 `download` 属性来进行下载

### Api 解析：atob

base-64 解码使用方法是 atob()。

```js
window.atob(encodedStr)
```

**encodedStr**

必需，是一个通过 btoa() 方法编码的字符串，btoa()是 base64 编码的使用方法。

### Api 解析：Uint8Array

```js
new Uint8Array(length)
```

**length**

创建初始化为 0 的，包含 length 个元素的无符号整型数组。

### Api 解析： Blob

`Blob` 对象表示一个不可变、原始数据的类文件对象。

```js
// 构造函数允许通过其它对象创建 Blob 对象
new Blob([obj],{type:createType}) 
```

**obj**

字符串内容

**createType**

要构造的类型

兼容性 IE 10 以上

### Api 解析：createObjectURL

静态方法会创建一个 DOMString。

```js
objectURL = URL.createObjectURL(object);
```

**object**

用于创建 URL 的 File 对象、Blob 对象或者 MediaSource 对象。

### Api 解析： window.navigator

```js
// 官方已不建议使用的文件下载方式，仅针对 ie 且兼容性 10 以上
// msSaveBlob 仅提供下载
// msSaveOrOpenBlob 支持下载和打开
window.navigator.msSaveOrOpenBlob(blob, fileName);
```

**blob**

要下载的 blob 对象

**fileName**

下载后命名的文件名称。

### 总结

本文仅针对图片压缩介绍了一些思路，简单的使用场景可能如下介绍，当然也会引申出来更多的使用场景，这些还有待大家一起挖掘。

- 上传存储图片如果需要对文件大小格式有要求的，可以统一压缩处理图片
- 前台页面想要编辑图片，可以在 Canvas 处理图片的时候，加一些其他逻辑，例如添加文字，剪裁，拼图等等操作