# 基于js管理大文件上传以及断点续传

> [https://mp.weixin.qq.com/s/jWGbhXEV0KtJu2pGfN4Hsg](https://mp.weixin.qq.com/s/jWGbhXEV0KtJu2pGfN4Hsg)

## 前言

> 前端小伙伴们平常在开发过程中文件上传是经常遇到的一个问题，也许你能够实现相关的功能，但是做完后回想代码实现上是不是有点"力不从心"呢？你真的了解文件上传吗？如何做到大文件上传以及断电续传呢，前后端通讯常用的格式，文件上传进度管控，服务端是如何实现的？接下来让我们开启手摸手系列的学习吧！！！如有不足之处，望不吝指教，接下来按照下图进行学习探讨

![图片](https://mmbiz.qpic.cn/mmbiz_png/pfCCZhlbMQQz67vZFmU6qBFDwXicqIIKOk8gZNFfvnIqmpVxbVXsAn0W662McpNuhmE38v0F1pqBTeOxN1QGlrA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)一切就绪，开始吧！！！

## 前端结构

- 页面展示

![图片](https://mmbiz.qpic.cn/mmbiz_png/pfCCZhlbMQQz67vZFmU6qBFDwXicqIIKOP0hS0iayf0ISRQia06vPDRVG0NNcsm7CfxaeSUQicDWPPQJMSPjaUibr1A/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)image.png

- 项目依赖

![图片](https://mmbiz.qpic.cn/mmbiz_png/pfCCZhlbMQQz67vZFmU6qBFDwXicqIIKOuvDXcXKwY5Ln5VOKzziaFceKicTW2P57gmWMy9icnEHLlOpyOoIcy4olA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)依赖.png

## 后端结构(node + express)

- 目录结构

  ![图片](https://mmbiz.qpic.cn/mmbiz_png/pfCCZhlbMQQz67vZFmU6qBFDwXicqIIKOWIBicicW83Aicoavo1foT4pdhWnWUytN7kMUud228STQs4vShgUV2m8Gw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)后台代码.png

- Axios的简单封装

  ```
  let instance = axios.create();
  instance.defaults.baseURL = 'http://127.0.0.1:8888';
  instance.defaults.headers['Content-Type'] = 'multipart/form-data';
  instance.defaults.transformRequest = (data, headers) => {
    const contentType = headers['Content-Type'];
    if (contentType === "application/x-www-form-urlencoded") return Qs.stringify(data);
    return data;
  };
  instance.interceptors.response.use(response => {
    return response.data;
  });
  复制代码
  ```

**文件上传一般是基于两种方式，`FormData`以及`Base64`**

## 基于FormData实现文件上传

```
 //前端代码
    // 主要展示基于ForData实现上传的核心代码
    upload_button_upload.addEventListener('click', function () {
            if (upload_button_upload.classList.contains('disable') || upload_button_upload.classList.contains('loading')) return;
            if (!_file) {
                alert('请您先选择要上传的文件~~');
                return;
            }
            changeDisable(true);
            // 把文件传递给服务器：FormData
            let formData = new FormData();
            // 根据后台需要提供的字段进行添加
            formData.append('file', _file);
            formData.append('filename', _file.name);
            instance.post('/upload_single', formData).then(data => {
                if (+data.code === 0) {
                    alert(`文件已经上传成功~~,您可以基于 ${data.servicePath} 访问这个资源~~`);
                    return;
                }
                return Promise.reject(data.codeText);
            }).catch(reason => {
                alert('文件上传失败，请您稍后再试~~');
            }).finally(() => {
                clearHandle();
                changeDisable(false);
            });
        });
复制代码
```

## 基于BASE64实现文件上传

### BASE64具体方法

- 首先需要把文件流转为BASE64，这里可以封装一个方法

  ```
  export changeBASE64(file) => {
   return new Promise(resolve => {
    let fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = ev => {
        resolve(ev.target.result);
    };
  });
  };
  复制代码
  ```

- 具体实现

  ```
  upload_inp.addEventListener('change', async function () {
        let file = upload_inp.files[0],
            BASE64,
            data;
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert('上传的文件不能超过2MB~~');
            return;
        }
        upload_button_select.classList.add('loading');
        // 获取Base64
        BASE64 = await changeBASE64(file);
        try {
            data = await instance.post('/upload_single_base64', {
            // encodeURIComponent(BASE64) 防止传输过程中特殊字符乱码，同时后端需要用decodeURIComponent进行解码
                file: encodeURIComponent(BASE64),
                filename: file.name
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            if (+data.code === 0) {
                alert(`恭喜您，文件上传成功，您可以基于 ${data.servicePath} 地址去访问~~`);
                return;
            }
            throw data.codeText;
        } catch (err) {
            alert('很遗憾，文件上传失败，请您稍后再试~~');
        } finally {
            upload_button_select.classList.remove('loading');
        }
    **});**
  复制代码
  ```

**上面这个例子中后端收到前端传过来的文件会对它进行生成一个随机的名字，存下来，但是有些公司会将这一步放在前端进行，生成名字后一起发给后端，接下来我们来实现这个功能**

### 前端生成文件名传给后端

这里就需要用到上面提到的插件**SparkMD5**[1],具体怎么用就不做赘述了，请参考文档

- 封装读取文件流的方法

  ```
  const changeBuffer = file => {
    return new Promise(resolve => {
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = ev => {
            let buffer = ev.target.result,
                spark = new SparkMD5.ArrayBuffer(),
                HASH,
                suffix;
            spark.append(buffer);
            // 得到文件名
            HASH = spark.end();
            // 获取后缀名
            suffix = /\.([a-zA-Z0-9]+)$/.exec(file.name)[1];
            resolve({
                buffer,
                HASH,
                suffix,
                filename: `${HASH}.${suffix}`
            });
        };
    });
  };
  复制代码
  ```

- 上传服务器相关代码

  ```
  upload_button_upload.addEventListener('click', async function () {
        if (checkIsDisable(this)) return;
        if (!_file) {
            alert('请您先选择要上传的文件~~');
            return;
        }
        changeDisable(true);
        // 生成文件的HASH名字
        let {
            filename
        } = await changeBuffer(_file);
        let formData = new FormData();
        formData.append('file', _file);
        formData.append('filename', filename);
        instance.post('/upload_single_name', formData).then(data => {
            if (+data.code === 0) {
                alert(`文件已经上传成功~~,您可以基于 ${data.servicePath} 访问这个资源~~`);
                return;
            }
            return Promise.reject(data.codeText);
        }).catch(reason => {
            alert('文件上传失败，请您稍后再试~~');
        }).finally(() => {
            changeDisable(false);
            upload_abbre.style.display = 'none';
            upload_abbre_img.src = '';
            _file = null;
        });
    });
  复制代码
  ```

## 上传进度管控

这个功能相对来说比较简单，文中用到的请求库是axios,进度管控主要基于axios提供的onUploadProgress函数进行实现，这里一起看下这个函数的实现原理

- 监听xhr.upload.onprogress

  ![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)监听.png

- 文件上传后得到的对象

  ![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)xhr.png

- 具体实现

  ```
  (function () {
    let upload = document.querySelector('#upload4'),
        upload_inp = upload.querySelector('.upload_inp'),
        upload_button_select = upload.querySelector('.upload_button.select'),
        upload_progress = upload.querySelector('.upload_progress'),
        upload_progress_value = upload_progress.querySelector('.value');
  
    // 验证是否处于可操作性状态
    const checkIsDisable = element => {
        let classList = element.classList;
        return classList.contains('disable') || classList.contains('loading');
    };
  
    upload_inp.addEventListener('change', async function () {
        let file = upload_inp.files[0],
            data;
        if (!file) return;
        upload_button_select.classList.add('loading');
        try {
            let formData = new FormData();
            formData.append('file', file);
            formData.append('filename', file.name);
            data = await instance.post('/upload_single', formData, {
                // 文件上传中的回调函数 xhr.upload.onprogress
                onUploadProgress(ev) {
                    let {
                        loaded,
                        total
                    } = ev;
                    upload_progress.style.display = 'block';
                    upload_progress_value.style.width = `${loaded/total*100}%`;
                }
            });
            if (+data.code === 0) {
                upload_progress_value.style.width = `100%`;
                alert(`恭喜您，文件上传成功，您可以基于 ${data.servicePath} 访问该文件~~`);
                return;
            }
            throw data.codeText;
        } catch (err) {
            alert('很遗憾，文件上传失败，请您稍后再试~~');
        } finally {
            upload_button_select.classList.remove('loading');
            upload_progress.style.display = 'none';
            upload_progress_value.style.width = `0%`;
        }
    });
  
    upload_button_select.addEventListener('click', function () {
        if (checkIsDisable(this)) return;
        upload_inp.click();
    });
  })();
  复制代码
  ```

## 大文件上传

大文件上传一般采用切片上传的方式，这样可以提高文件上传的速度，前端拿到文件流后进行切片，然后与后端进行通讯传输，一般还会结合断点继传，这时后端一般提供三个接口，第一个接口获取已经上传的切片信息，第二个接口将前端切片文件进行传输，第三个接口是将所有切片上传完成后告诉后端进行文件合并![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

- 进行切片，切片的方式分为固定数量以及固定大小，我们这里两者结合一下

  ```
  // 实现文件切片处理 「固定数量 & 固定大小」
  let max = 1024 * 100,
    count = Math.ceil(file.size / max),
    index = 0,
    chunks = [];
  if (count > 100) {
    max = file.size / 100;
    count = 100;
  }
  while (index < count) {
    chunks.push({
    // file文件本身就具有slice方法，见下图
        file: file.slice(index * max, (index + 1) * max),
        filename: `${HASH}_${index+1}.${suffix}`
    });
    index++;
  }
  复制代码
  ```

- 发送至服务端

  ```
  chunks.forEach(chunk => {
    let fm = new FormData;
    fm.append('file', chunk.file);
    fm.append('filename', chunk.filename);
    instance.post('/upload_chunk', fm).then(data => {
        if (+data.code === 0) {
            complate();
            return;
        }
        return Promise.reject(data.codeText);
    }).catch(() => {
        alert('当前切片上传失败，请您稍后再试~~');
        clear();
    });
   });
  复制代码
  ```

- 文件上传 + 断电续传 + 进度管控

  ```
    upload_inp.addEventListener('change', async function () {
        let file = upload_inp.files[0];
        if (!file) return;
        upload_button_select.classList.add('loading');
        upload_progress.style.display = 'block';
  
        // 获取文件的HASH
        let already = [],
            data = null,
            {
                HASH,
                suffix
            } = await changeBuffer(file);
  
        // 获取已经上传的切片信息
        try {
            data = await instance.get('/upload_already', {
                params: {
                    HASH
                }
            });
            if (+data.code === 0) {
                already = data.fileList;
            }
        } catch (err) {}
  
        // 实现文件切片处理 「固定数量 & 固定大小」
        let max = 1024 * 100,
            count = Math.ceil(file.size / max),
            index = 0,
            chunks = [];
        if (count > 100) {
            max = file.size / 100;
            count = 100;
        }
        while (index < count) {
            chunks.push({
                file: file.slice(index * max, (index + 1) * max),
                filename: `${HASH}_${index+1}.${suffix}`
            });
            index++;
        }
  
        // 上传成功的处理
        index = 0;
        const clear = () => {
            upload_button_select.classList.remove('loading');
            upload_progress.style.display = 'none';
            upload_progress_value.style.width = '0%';
        };
        const complate = async () => {
            // 管控进度条
            index++;
            upload_progress_value.style.width = `${index/count*100}%`;
  
            // 当所有切片都上传成功，我们合并切片
            if (index < count) return;
            upload_progress_value.style.width = `100%`;
            try {
                data = await instance.post('/upload_merge', {
                    HASH,
                    count
                }, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
                if (+data.code === 0) {
                    alert(`恭喜您，文件上传成功，您可以基于 ${data.servicePath} 访问该文件~~`);
                    clear();
                    return;
                }
                throw data.codeText;
            } catch (err) {
                alert('切片合并失败，请您稍后再试~~');
                clear();
            }
        };
  
        // 把每一个切片都上传到服务器上
        chunks.forEach(chunk => {
            // 已经上传的无需在上传
            if (already.length > 0 && already.includes(chunk.filename)) {
                complate();
                return;
            }
            let fm = new FormData;
            fm.append('file', chunk.file);
            fm.append('filename', chunk.filename);
            instance.post('/upload_chunk', fm).then(data => {
                if (+data.code === 0) {
                    complate();
                    return;
                }
                return Promise.reject(data.codeText);
            }).catch(() => {
                alert('当前切片上传失败，请您稍后再试~~');
                clear();
            });
        });
    });
  复制代码
  ```

## 服务端代码(大文件上传+断点续传)

```
 // 大文件切片上传 & 合并切片
    const merge = function merge(HASH, count) {
        return new Promise(async (resolve, reject) => {
            let path = `${uploadDir}/${HASH}`,
                fileList = [],
                suffix,
                isExists;
            isExists = await exists(path);
            if (!isExists) {
                reject('HASH path is not found!');
                return;
            }
            fileList = fs.readdirSync(path);
            if (fileList.length < count) {
                reject('the slice has not been uploaded!');
                return;
            }
            fileList.sort((a, b) => {
                let reg = /_(\d+)/;
                return reg.exec(a)[1] - reg.exec(b)[1];
            }).forEach(item => {
                !suffix ? suffix = /\.([0-9a-zA-Z]+)$/.exec(item)[1] : null;
                fs.appendFileSync(`${uploadDir}/${HASH}.${suffix}`, fs.readFileSync(`${path}/${item}`));
                fs.unlinkSync(`${path}/${item}`);
            });
            fs.rmdirSync(path);
            resolve({
                path: `${uploadDir}/${HASH}.${suffix}`,
                filename: `${HASH}.${suffix}`
            });
        });
    };
    app.post('/upload_chunk', async (req, res) => {
        try {
            let {
                fields,
                files
            } = await multiparty_upload(req);
            let file = (files.file && files.file[0]) || {},
                filename = (fields.filename && fields.filename[0]) || "",
                path = '',
                isExists = false;
            // 创建存放切片的临时目录
            let [, HASH] = /^([^_]+)_(\d+)/.exec(filename);
            path = `${uploadDir}/${HASH}`;
            !fs.existsSync(path) ? fs.mkdirSync(path) : null;
            // 把切片存储到临时目录中
            path = `${uploadDir}/${HASH}/${filename}`;
            isExists = await exists(path);
            if (isExists) {
                res.send({
                    code: 0,
                    codeText: 'file is exists',
                    originalFilename: filename,
                    servicePath: path.replace(__dirname, HOSTNAME)
                });
                return;
            }
            writeFile(res, path, file, filename, true);
        } catch (err) {
            res.send({
                code: 1,
                codeText: err
            });
        }
    });
    app.post('/upload_merge', async (req, res) => {
        let {
            HASH,
            count
        } = req.body;
        try {
            let {
                filename,
                path
            } = await merge(HASH, count);
            res.send({
                code: 0,
                codeText: 'merge success',
                originalFilename: filename,
                servicePath: path.replace(__dirname, HOSTNAME)
            });
        } catch (err) {
            res.send({
                code: 1,
                codeText: err
            });
        }
    });
    app.get('/upload_already', async (req, res) => {
        let {
            HASH
        } = req.query;
        let path = `${uploadDir}/${HASH}`,
            fileList = [];
        try {
            fileList = fs.readdirSync(path);
            fileList = fileList.sort((a, b) => {
                let reg = /_(\d+)/;
                return reg.exec(a)[1] - reg.exec(b)[1];
            });
            res.send({
                code: 0,
                codeText: '',
                fileList: fileList
            });
        } catch (err) {
            res.send({
                code: 0,
                codeText: '',
                fileList: fileList
            });
        }
    });
复制代码
```

## 总结

**综上是我对文件上传的总结，能力有限，如有错误，望不吝指教，最后送上一句话：**

> 夫学须静也，才须学也，非学无以广才，非志无以成学。淫慢则不能励精，险躁则不能治性。年与时驰，意与日去，遂成枯落



关于本文

# 来源：麦忙

https://juejin.cn/post/7000654161297539079