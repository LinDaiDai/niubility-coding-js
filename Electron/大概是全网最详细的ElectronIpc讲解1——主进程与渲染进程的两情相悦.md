## 前言

你盼世界，我盼望你无 `bug` 。Hello 大家好！我是霖呆呆。

距离上一次我们相遇，似乎间隔的太久了...应该还是去年了...

对于之前文章的搁置，在此说一声抱歉，今年会慢慢补上来(*╹▽╹*)。（不过还是那句话，那么靓的你肯定会原谅我的啦）

OKK，谈谈文章吧。由于近期的工作内容主要是以桌面端开发为主，所以会多出一些 `electron` 相关的文章。这不，这个系列主要就是讲解 `electron` 中 `ipc` 模块的内容。文章质量和内容这一块大家可以放心，呆呆还是会以通俗易懂的方式，并结合实际案例去讲好每一块知识点，再对各个部分加以总结。

但由于是系列文章，所以肯定也会有很多相对基础的内容，大佬请略过，如果是 `electron` 初学者的话，相信你会有所收获(*￣︶￣)。

本系列共有以下几个章节：

- **主进程与渲染进程的两情相悦**
- 渲染进程与渲染进程的搭桥牵线
- 定情信物传声筒`port`

您此次阅读的是第一章节：**主进程与渲染进程的两情相悦**。

注：以上所有文章都被归档到： <https://github.com/LinDaiDai/niubility-coding-js> 中 ，案例都上传至：<https://github.com/LinDaiDai/electron-ipc-example> ，欢迎 Start，感谢 Start。

案例版本信息：
- `electron: v13.6.7`
- `Nodejs: v16.13.2`

## 大纲

谈到 `electron` 中进程的通信，就不得不谈到官方提供的 `ipc` 模块。这种方式的通信主要是依赖 `electron` 提供的 `ipcMain` 和 `ipcRenderer` 两个模块。

关于通信分为以下几部分：
-   渲染进程发送同步/异步消息给主进程
-   主进程发送同步/异步消息给渲染进程

## 1. 渲染进程发送同步/异步消息给主进程

渲染进程依赖 `ipcRenderer` 模块给主进程发送消息，官方提供了三个方法：

-   **`ipcRenderer.send(channel, ...args)`**
-   **`ipcRenderer.invoke(channel, ...args)`**
-   **`ipcRenderer.sendSync(channel, ...args)`**

`channel` 表示的就是事件名(消息名称)， `args` 好理解，也就是参数。

这三种方法都可以给主进程发送消息，同时还可以等待主进程的答应，真所谓是 `两情相悦，互相来电` ，只是答应的方式不同。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9e8616ad29e4294bed9f9234c6c2f2e~tplv-k3u1fbpfcp-watermark.image?)

### 1.1 **`ipcRender.send 案例`**

渲染进程 `render.js`：

```javascript
// render.js
const { ipcRenderer } = require('electron');

function sendMessageToMain() {
  ipcRenderer.send('render-send-to-main', '我是渲染进程通过 send 发送的消息');
}
```

主进程 `main.js`：

```javascript
// main.js
const { ipcMain } = require('electron');

ipcMain.on('render-send-to-main', (event, message) => {
  console.log(`receive message from render: ${message}`)
})
```

1、主进程通过 `ipcMain.on` 来监听渲染进程的消息；

2、主进程接收到消息后，可以回复消息，也可以不回复。如果回复的话，通过 `event.reply` 发送另一个事件，渲染进程监听这个事件得到回复结果。如果不回复消息的话，渲染进程将接着执行 `ipcRenderer.send` 之后的代码。

上面提到过了, `send` 这样的方式，主进程可以给回复，也可以不给回复，但是得通过 `event.replay`。如果此时你试图用 `return` 的方式传递返回值的话，结果并不能达到你的预期。

```javascript
// render.js
const { ipcRenderer } = require('electron');

function sendMessageToMain() {
  const replyMessage = ipcRenderer.send('render-send-to-main', '我是渲染进程通过 send 发送的消息');
  console.log(replayMessage); // undefined
}

// main.js
const { ipcMain } = require('electron');

ipcMain.on('render-send-to-main', (event, message) => {
  console.log(`receive message from render: ${message}`)
  return '主进程试图传递消息给渲染进程';
})
```

`send` 方法的返回值是 `undefined` ，即使在 `ipcMain.on` 中试图 `return` 返回值也是不是行的。

正确的做法是通过 `event.reply` 发送另一个事件，渲染进程监听这个事件得到回复结果：

渲染进程 `render.js`：

```javascript
// render.js
const { ipcRenderer } = require('electron');

// send 方法发送，并绑定另一个事件接收返回值
function sendMessageToMain() {
  ipcRenderer.send('render-send-to-main', '我是渲染进程通过 send 发送的消息');
}
ipcRenderer.on('main-reply-to-render', (event, message) => {
  console.log('replyMessage', message); // 'replyMessage 主进程通过 reply 回复给渲染进程的消息'
})
```

主进程 `main.js`：

```javascript
// main.js
const { ipcMain } = require('electron');

ipcMain.on('render-send-to-main', (event, message) => {
  console.log(`receive message from render: ${message}`)
  event.reply('main-reply-to-render', '主进程通过 reply 回复给渲染进程的消息')
})
```


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2246fbc1c5284a79930bebf917855e7e~tplv-k3u1fbpfcp-watermark.image?)

### 1.2 **`ipcRender.invoke 案例`**

渲染进程 `render.js`：

```javascript
// render.js
const { ipcRenderer } = require('electron');

async function invokeMessageToMain() {
  const replyMessage = await ipcRenderer.invoke('render-invoke-to-main', '我是渲染进程通过 invoke 发送的消息');
  console.log('replyMessage', replyMessage);
}
```

主进程 `main.js`：

```javascript
// main.js
const { ipcMain } = require('electron');

ipcMain.handle('render-invoke-to-main', async (event, message) => {
  console.log(`receive message from render: ${message}`)
  const result = await asyncWork();
  return result;
})

const asyncWork = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('延迟 2 秒获取到主进程的返回结果')
    }, 2000)
  })
}
```

1、主进程通过 `ipcMain.handle` 来处理渲染进程发送的消息；

2、主进程接收到消息后，可以回复消息，也可以不回复。如果回复消息的话，可以通过 `return` 给渲染进程回复消息；如果不回复消息的话，渲染进程将接着执行 `ipcRenderer.invoke` 之后的代码。

3、渲染进程异步等待主进程的回应， `invoke` 的返回值是一个 `Promise<pending>` 。

为了验证第三点，我们可以不使用 `await` 来接收 `invoke` 的返回结果，看看会是什么样：

```javascript
// render.js
const { ipcRenderer } = require('electron');

function invokeMessageToMain() {
  const replyMessage = ipcRenderer.invoke('render-invoke-to-main', '我是渲染进程通过 invoke 发送的消息');
  console.log('replyMessage', replyMessage); // Promise<pending>
}
```

打印的结果符合我们的预期，是一个 `Promise<pending>`。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84c7dba4147d4e098f926174e212d5e5~tplv-k3u1fbpfcp-watermark.image?)

这里有小伙伴可能会有疑问了，会不会是因为 `ipc.Main` 那边是一个异步执行函数才会造成这种情况呢？好的，我们将 `main.js` 也来改造一下：

```javascript
// render.js
const { ipcRenderer } = require('electron');

function invokeMessageToMain() {
  const replyMessage = ipcRenderer.invoke('render-invoke-to-main', '我是渲染进程通过 invoke 发送的消息');
  console.log('replyMessage', replyMessage); // Promise<pending>
}

// main.js
ipcMain.handle('render-invoke-to-main', (event, message) => {
  console.log(`receive message from render: ${message}`)
  const result = '我是主进程同步的返回结果';
  return result;
})
```

我们把 `ipcMain.handle` 的返回值变为了一个普通的字符串，发现 `ipcRender.invoke` 那边返回的还是一个 `Promise<pending>`。 这也就验证了我们上面的结论。

### 1.3 **`ipcRender.sendSync 案例`**

渲染进程 `render.js`：

```javascript
// render.js
const { ipcRenderer } = require('electron');

function sendSyncMessageToMain() {
  const replyMessage = ipcRenderer.sendSync('render-send-sync-to-main', '我是渲染进程通过 syncSend 发送给主进程的消息');
  console.log('replyMessage', replyMessage); // '主进程回复的消息'
}
```

主进程 `main.js`：

```javascript
// main.js
const { ipcMain } = require('electron');

ipcMain.on('render-send-sync-to-main', (event, message) => {
  console.log(`receive message from render: ${message}`)
  event.returnValue = '主进程回复的消息';
})
```

1、主进程通过 `ipcMain.on` 来处理渲染进程发送的消息；

2、主进程通过 `event.returnValue` 回复渲染进程消息；

3、如果 `event.returnValue` 不为 `undefined` 的话，渲染进程会等待 `sendSync` 的返回值才执行后面的代码；

4、请保证 `event.returnValue`是有值的，否则会造成非预期的影响。

前面两点都好理解，关于第三点，会有点绕，这边我们来再写两个例子帮助你理解。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb177b38cf154f1284ecb02a6e8374ca~tplv-k3u1fbpfcp-watermark.image?)

上面的案例，主进程绑定的处理函数是一个同步的，我们将它换为异步的来看看：

```javascript
// main.js
const { ipcMain } = require('electron');

ipcMain.on('render-send-sync-to-main', async (event, message) => {
  console.log(`receive message from render: ${message}`)
  const result = await asyncWork();
  event.returnValue = result;
})

const asyncWork = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('延迟 2 秒获取到主进程的返回结果')
    }, 2000)
  })
}
```

这次我们在执行完一个异步函数 `asyncWork` 之后再给 `event.returnValue` 赋值。

结果发现渲染进程那边会在 2 秒之后才打印：

```
"replyMessage 延迟 2 秒获取到主进程的返回结果"
```

而且对于渲染进程，以下两种写法，结果都是一样的：

```javascript
// render.js
const { ipcRenderer } = require('electron');

function sendSyncMessageToMain() {
  const replyMessage = ipcRenderer.sendSync('render-send-sync-to-main', '我是渲染进程通过 syncSend 发送给主进程的消息');
  console.log('replyMessage', replyMessage); // 'replyMessage 延迟 2 秒获取到主进程的返回结果''
}

// 或者改用 async 函数
async function sendSyncMessageToMain() {
  const replyMessage = await ipcRenderer.sendSync('render-send-sync-to-main', '我是渲染进程发送给主进程的同步消息');
  console.log('replyMessage', replyMessage); // 'replyMessage 延迟 2 秒获取到主进程的返回结果'
}
```

也就是说，不论渲染进程在接收 `sendSync` 结果的时候，是不是用 `await` 等待，都会等待结果返回后才向下执行。但如果你已经确定你的请求是一个异步的话，建议还是使用 `invoke` 去发送消息，这里出于两点原因考虑：

1、方法名 `sendSync` 就很符合语义，发送同步消息；

2、请求执行的明明是异步代码，但是如果你用 `const replyMessage = ipcRenderer.sendSync('xxx')` 方式来获取响应信息，会很奇怪。

OKK，上面的第四点谈到了，请保证 `event.returnValue` 是有值的，否则会造成非预期的影响。让我们也来写个例子：

```javascript
// render.js
const { ipcRenderer } = require('electron');

function sendSyncMessageToMain() {
  const replyMessage = ipcRenderer.sendSync('render-send-sync-to-main', '我是渲染进程通过 syncSend 发送给主进程的消息');
  console.log('replyMessage', replyMessage); // replyMessage {error: "reply was never sent"}
  console.log('next'); // 这里也会执行
}

// main.js
ipcMain.on('render-send-sync-to-main', async (event, message) => {
  console.log(`receive message from render: ${message}`)
})
```

在上面的例子中，主进程那边不对 `event.returnValue` 做处理，在渲染进程这边将会得到一个错误：

```javascript
{error: "reply was never sent"}
```

虽然 `next` 也会打印，但是如果你再想去发送一次 `render-send-sync-to-main` 你会发现页面已经卡了...

好的，文章阅读到现在，其实也差不多了。后面的主进程给渲染进程发送消息的方式，其实在介绍渲染进程发送消息的时候，算是已经介绍过了，不过还是让我们来看看吧。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7ebdb848add4e6393dd52df97d2934e~tplv-k3u1fbpfcp-watermark.image?)

## 2. 主进程发送同步/异步消息给渲染进程

与 `ipcRenderer` 模块对应的就是 `ipcMain` 了。主进程依赖 `ipcMain` 模块给渲染进程发送消息，主要有以下几种方式：

-   `event.reply`：主进程通过 `on` 监听消息，如果渲染进程用 `send` 发送消息时，可以在 `on` 的回调函数里获取到事件对象并通过 `event.reply` 发送另一个事件；
-   `return` ：主进程通过 `handle` 监听处理消息，如果渲染进程用 `invoke` 发送消息时，可以在 `on` 的回调函数里通过 `return` 回复消息；
-   `event.returnValue` ：主进程通过 `on` 监听消息，如果渲染进程用 `sendSync` 发送消息时，可以在 `on` 的回调函数里通过设置 `event.returnValue` 回复消息；
-   `window.webContents.send` ：主进程通过窗口实例的 `webContents` 给本窗口内的渲染进程发送消息。

前面三种在渲染进程发送消息那一部分已经介绍过了，接下来让我们来看一下 `window.webContents` 这种方式吧。

### 2.1 **`window.webContents.send 案例` :**

这种方式依赖于 `webContents` 对象，它是我们在项目中新建窗口时，产生的窗口对象上的一个属性。

例如我们在一个窗口完成加载时，发送消息：

```javascript
// main.js
const { app, BrowserWindow } = require('electron')

function createWindow() {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  })

  window.loadFile('src/index.html')

  // 窗口在完成加载时，通过 webContents.send 给渲染进程发送消息
  window.webContents.on('did-finish-load', () => {
    window.webContents.send('main-send-to-render', '启动完成了')
  })
}

app.whenReady().then(createWindow)
```

渲染进程 `render.js` ：

```javascript
// render.js
const { ipcRenderer } = require('electron');

ipcRenderer.on('main-send-to-render', (event, message) => {
  console.log(`receive message from main: ${message}`)
})
```

通过以上操作，也可以达到主进程主动给渲染进程发送消息的效果(*￣︶￣)。

## 3. 总结

OKK，介绍完了功能，分析完了案例，让我们来加以总结一下吧。

- 如果通过 `ipcMain` 和 `ipcRenderer` ，渲染进程有三种方式给主进程发送消息，即:
  -   **`ipcRenderer.send(channel, ...args)`**
  -   **`ipcRenderer.invoke(channel, ...args)`**
  -   **`ipcRenderer.sendSync(channel, ...args)`**
- 通过上面三种方式，主进程都可以有相应的方法给予渲染进程答应，只是答应的方法不同；
- 同步请求建议用 `sendSync`，异步请求建议用 `invoke`；
- 主进程中还可以获取到某个渲染进程的 `window.webContents` ，然后通过 `window.webContents.send` 给这个渲染进程发送消息；

温馨提示：

案例都上传至：<https://github.com/LinDaiDai/electron-ipc-example> ，欢迎 Start，感谢 Start。

## 后语

这篇文章就介绍到这里。可以发现，这篇文章要讲解的知识点其实还是蛮基础的，但呆呆在刚开始学的时候，也没有发现有特别好的教材讲解，所以这不是`"自己动手，丰衣足食"`整了一篇吗？

哈哈哈，不过放心，这个系列还是会继续下去的，毕竟 `ipc` 也还有好些东西要讲，让我们一起期待一下下篇文章：渲染进程与渲染进程的搭桥牵线吧。

喜欢「霖呆呆」的小伙还希望可以关注霖呆呆的公众号 `LinDaiDai`。

我会不定时的更新一些前端方面的知识内容以及自己的原创文章🎉

你的鼓励就是我持续创作的主要动力 😊.