## Shutdown HTTP系列介绍

之前，有一位大佬和我说过这么一句话："网络知识在一定程度上决定了你的上限"。

对HTTP一知半解的我，上限真的这么低吗...就不能花点时间好好整理整理吗 🤔️？

这次请给霖呆呆一个机会，跟着我的脚步👣从1开始学习它。另外我整理的HTTP系列基本都会附有一个面试时的浅答与深答的配套答案，浅答是为了让你们更好的记住，深答保证你确实理解了浅答中的知识点。

整个系列下来，让我们彻底 Shutdown HTTP ！！！💪

系列思维导图：

![img](https://user-gold-cdn.xitu.io/2020/5/25/1724c6b309d10fbf?w=2688&h=1718&f=png&s=438444)

系列目录：

- [《🐲【1】Shutdown HTTP系列-基础篇》](https://juejin.im/post/5e955817f265da47c06ecf77)
- [《🐲【2】Shutdown HTTP系列-HTTP报文篇》](https://juejin.im/post/6844904168549777422)
- 《🐲【3】Shutdown HTTP系列-Cookie篇》「本文」
- 《🐲【4】Shutdown HTTP系列-HTTPS篇》
- 《🐲【5】Shutdown HTTP系列-CCPG篇》
- 《🐲【6】Shutdown HTTP面试系列》

所有文章内容都已整理至 [LinDaiDai/niubility-coding-js](https://github.com/LinDaiDai/niubility-coding-js) 快来给我Star呀😊~

## 本篇目录

通过阅读本篇文章你可以学习到：

- Cookie概念
- 产生原因
- 关于Cookie的首部字段
- 交互流程
- 生命周期
- 作用域
- 安全性
- 实际的用处
- 缺点



## 1. Cookie概念

概念：通过在请求和响应报文中写入Cookie信息来控制客户端的状态，解决HTTP无状态的问题，本质就是存储在浏览器上一个很小的文本文件(也可能存在本地文件里)



## 2. 产生原因

HTTP是一种无状态协议，没法保存之前请求响应的上下文信息，但是对于一些场景来说需要用到之前的状态，所以为了解决这个问题产生了Cookie。但是它并不是为了解决通讯协议无状态的问题，而是为了解决客户端与服务端会话状态的问题，这个状态是指后段服务的状态而不是通讯协议的状态。



## 3. 关于Cookie的首部字段

关于Cookie的首部字段其实不太多，主要为：

- `Set-Cookie`
- `Cookie`



### 3.1 Set-Cookie

作用：在响应报文首部设置要传递给客户端的Cookie信息

例如：

```
Set-Cookie: name=xxx; HttpOnly
```



### 3.2 Cookie

作用：客户端传递给服务端的Cookie信息

例如：

```
Cookie: name=xxx
```



## 4. 交互流程

### 4.1 主要流程

客户端和服务器关于`Cookie`的交互流程如下：

1. 客户端请求服务端
2. 服务端生成Cookie信息使用 Set-Cookie 添加到响应报文头部上
3. 客户端在拿到之后保存Cookie
4. 在下次请求的时候通过把信息写入请求报文头部Cookie字段中传给服务端



### 4.2  设置Cookie的实际案例

光看上面👆说的可能有点迷糊，让我们结合一个实际的案例看看。

这里就以`koa`来模拟一个后台的登录接口，下面的代码主要做了四件事：

- 设置响应的一些公共首部字段
- 对每个请求做一些处理，例如登录接口则不验证token
- 定义了一个名为`/api/corsname`的接口，用来获取名字
- 定义了一个名为`/api/login`的接口，用来用户登录，并设置`Cookie`

*./server.js*:

```javascript
const Koa = require("koa");
const router = require("koa-router")();
const koaBody = require("koa-body");
const app = new Koa();
const TOKEN = "112233"; // 模拟写死一个token

// 这里设置一些公共的首部字段
app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", ctx.header.origin);
  ctx.set("Access-Control-Request-Method", "PUT,POST,GET,DELETE,OPTIONS");
  ctx.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Access"
  );
  await next();
});

app.use(async (ctx, next) => {
  // 若是登录接口则跳过后面的token验证
  if (ctx.path === "/api/login") {
    await next();
    return;
  }
  // 对所有非登录的请求验证token
  const cookies = ctx.cookies.get("token");
  console.log(cookies);
  if (cookies && cookies === TOKEN) {
    await next();
    return;
  }
  ctx.body = {
    code: 401,
    msg: "权限错误",
  };
  return;
});
// 如果不加multipart：true ctx.request.body会获取不到值
app.use(koaBody({ multipart: true }));

router.get("/api/corsname", async (ctx) => {
  ctx.body = {
    data: "LinDaiDai",
  };
});

router.post("/api/login", async (ctx) => {
  ctx.cookies.set("token", TOKEN, { // 在此处设置 token
    expires: new Date(+new Date() + 1000 * 60 * 60 * 24 * 7),
  });
  ctx.body = {
    msg: "成功",
    code: 0,
  };
});

app.use(router.routes());
console.log("server 8080...");
app.listen(8080);
```

OK👌，来看看客户端(浏览器端)调用这两个接口的代码：

*./index.html*:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CORS</title>
</head>
<body>
  <button id="getName">获取name</button>
  <button id="login">登录</button>
  <script src="https://cdn.bootcss.com/axios/0.19.2/axios.min.js"></script>
  <script>
    axios.defaults.baseURL = 'http://xxx.com'
    login.onclick = () => {
      axios.post('/api/login')
    }
    getName.onclick = () => {
      axios.get('/api/corsname').then(res => console.log(res.data))
    }
  </script>
</body>
</html>
```

此时，点击「登录」按钮，可以在`/login`这个接口的响应体中看到`Set-Cookie`这个首部字段：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee1d79ab2c0d411b8d0de765d3bddb38~tplv-k3u1fbpfcp-zoom-1.image)

(图里红色圈中的`Access-Control-Allow-Credentials: true`请忽略它，因为这张图是另一篇文章中拿来的，所以重点是`Set-Cookie`)

登录成功之后，点击「获取name」按钮，可以在`/corsname`这个接口的请求体中看到`Cookie`这个首部字段：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d027b7afb79e4bb68a0f0468b17775b2~tplv-k3u1fbpfcp-zoom-1.image)

再来看看在浏览器中，我们可以如何查看`Cookie`：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a8e88f3d1d543089cae17471f425bc3~tplv-k3u1fbpfcp-zoom-1.image)



## 5. 生命周期

在上面有介绍到关于`Cookie`的首部字段主要是`Set-Cookie`和`Cookie`，那有关于`Cookie`生命周期的首部字段的属性有哪些呢？也就是可以用什么来控制`Cookie`的生命周期。

(其实有点类似于[《霖呆呆你来说说浏览器缓存吧》](https://juejin.im/post/6844904053223358471)中提到的强缓存)

- 默认情况下`Cookie`是暂时存在的，也就是它们的存储只在浏览器会话期间存在，当用户在关闭浏览器时失效
- 可以使用`expires`和`max-age`来设置`Cookie`的过期时间



### 5.1 expires=DATE

作用：给`Cookie` 设置过期时间，一个具体的时间。

默认值：默认为设置的`expires`的当前时间。

案例：

例如后端代码中：

```javascript
ctx.cookies.set("token", '112233', {
	expires: new Date(+new Date() + 1000 * 60 * 60 * 24 * 7),
});
```

此时接口请求的响应体的首部字段带有：

```
Set-Cookie: token=112233; expires=Wed Aug 12 2020 21:55:03 GMT
```



### 5.2 max-age=TIME

作用：给`Cookie`设置过期时间，一段时间，单位是秒，从客户端收到报文开始计算。

默认值：`-1`。

使用方式与`expires`一样：

例如后端代码中：

```javascript
ctx.cookies.set("token", '112233', {
	max-age: 36000,
});
```

此时接口请求的响应体的首部字段带有：

```
Set-Cookie: token=112233; max-age=36000	
```

另外，属性值分为以下三种，方便记忆：

- 0：立即删除这个`Cookie`
- 正数：浏览器将其持久化写入`Cookie`中
- 负数：会话性`Cookie`

针对于上面👆的三种情况，面试时可能会碰到的问题：

#### Q1: cookie的max-age属性设置为0会怎样？

A：如果`max-age`为0，则表示删除该`cookie`。`cookie`机制没有提供删除`cookie`的方法，因此通过设置该`cookie`即时失效实现删除`cookie`的效果。失效的`Cookie`会被浏览器从`cookie`文件或者内存中删除。



#### Q2：设置了cookie的max-age属性为正数，关闭浏览器会怎样？

A：如果`max-age`属性为正数，则表示该`cookie`会在`max-age`秒之后自动失效。浏览器会将`max-age`为正数的`cookie`持久化，即写到对应的`cookie`文件中。无论客户关闭了浏览器还是电脑，只要还在`max-age`秒之前，登录网站时该`cookie`仍然有效。



#### Q3：设置了cookie的max-age属性为负数，会怎样？

A：如果`max-age`为负数，则表示该`cookie`仅在本浏览器窗口以及本窗口打开的子窗口内有效，关闭窗口后该`cookie`即失效。`max-age`为负数的`Cookie`，为临时性`cookie`，不会被持久化，不会被写到`cookie`文件中。`cookie`信息保存在浏览器内存中，因此关闭浏览器该`cookie`就消失了。`cookie`默认的`max-age`值为`-1`。



## 6. 作用域

作用域概念：对于`Cookie`的作用域，表示的是给`Cookie`绑定域名和路径，在发送请求之前若是发现域名或者路径这两个属性不匹配则不会携带`Cookie`，通俗来说就是在哪些情况下携带`Cookie`。

有关于`Cookie`作用域的首部字段有哪些呢？

- `domain=域名`
- `path=PATH`



### 6.1 domain=域名

作用：指定`Cookie`可以送达的主机名。

例如：

```
Set-Cookie: domain=.example.com
```



### 6.2 path=PATH

作用：指定一个`URL`路径，`Cookie`首部只会被添加到这个指定`URL`路径的请求报文首部上。

默认值为：`/`，也就是所有`URL`路径都会携带`Cookie`。

例如设置了：

```
Set-Cookie: name=xxx; path=/docs
```

那么只有`/docs` 下的资源才会带有`Cookie`，而另一个名为`/test` 的目录下就没有。



## 7. 安全性

`Cookie`的安全性也是一个常问的点，这方面涉及到的首部字段的属性主要有：

- `Secure`
- `HttpOnly`
- `SameSite`



### 7.1 Secure

作用：设置了`secure`属性，表示`Cookie`只在`HTTPS`下传输。

例如：

```
Set-Cookie: name=xxx; secure
```

让我们来看一个实际的运用场景。

前提条件：https://lindaidai.com 对`cookie`设置了`secure=true`属性。

1. 访问 https://lindaidai.com

2. 输入用户名、密码，用`Chrome`的`developer tool`会看到`response`的`header`里，`set-cookie`的值里有`secure`属性

3. 登录后，继续访问https://lindaidai.com/#user ，可以正常看到内容

4. 修改url，访问http://lindaidai.com/#domain ，会跳转到登录页面，因为`cookie`在`http`协议下不发送给服务器，服务器要求用户重新登录



### 7.2 HttpOnly

作用：带上`HttpOnly`的`Cookie`只能通过HTTP协议传输，不能通过`JS`脚本文件访问(`document.cookie`)。

例如：

```
Set-Cookie: name=xxx; HttpOnly
```

由于设置了`HttpOnly`标志的`Cookie`只能使用在`HTTP`请求过程中，而无法用`JS`脚本来读取；又因为很多的`XSS`攻击都是通过盗用`Cookie`的，所以设置`HttpOnly`属性也能保护我们`Cookie`的安全，是一种预防`XSS`攻击的重要手段吧。



### 7.3 SameSite

作用：用来限制第三方`Cookie`，一般用来防止`CSRF`攻击。

默认值：`Chrome80`之前一直是`None`，在`Chrome80`之后为` Lax`。

例如：

```
Set-Cookie: name=xxx; SameSite=Lax
```



对于第一方`Cookie`和第三方`Cookie`我在这里推荐一篇比较好的文章，值得静下心来好好看：

[《关于第一方Cookie和第三方Cookie你需要知道的》](https://www.jianshu.com/p/7e7d41cd2bac)



#### Q1：什么是第一方Cookie和第三方Cookie

两种类型的`Cookie`：

- 第一方`Cookie`：由主机域(用户正在访问的域)，这些类型的Cookie通常被认为是不错的。它们有助于提供更好的用户体验，并使会话保持打开状态。基本上，这意味着浏览器能够记住关键信息，例如您添加到购物车中的项目，用户名和密码以及语言首选项。
- 第三方`Cookie`：由用户当时所访问的域以外的域创建的Cookie，主要用于跟踪和在线广告目的。它们还允许网站所有者提供某些服务，例如实时聊天。



#### Q2：两者有何不同？

第一方`Cookie`和第三方`Cookie`，都是网站在客户端上存放的一小块数据。他们都由某个域存放，只能被这个域访问。他们的区别其实并不是技术上的区别，而是使用方式上的区别。

一个例子：

> 比如，访问A这个网站，这个网站设置了一个Cookie，这个Cookie也只能被A这个域下的网页读取，这就是第一方Cookie。如果还是访问A这个网站，网页里有用到B网站（和A网站的域名是不同的）的一张图片，浏览器在B请求图片的时候，B设置了一个Cookie，那这个Cookie只能被B这个域访问，反而不能被A这个域访问，因为对我们来说，我们实际是在访问A网站时，被设置了一个B这个域下的Cookie，所以叫第三方Cookie。
>
> （你我他；你：A网站，我：浏览器，他：B网站；‘他’ 就是第三方，所以B网站下的cookie是第三方cookie。）

像上面的这个案例，在A网站中用到B网站的`Cookie`，如果这两个网站不同站的话，就属于`第三方Cookie跨站点使用`。



#### Q3：对同站和跨站的理解

同站：只要两个URL的` eTLD+1`相同即为同站

```
eTLD + 1 = 顶级域名 + 二级域名
类似于 example.com
```

其它例子：

- 同站：

  ```
  www.a.example.com
  www.b.example.com
  ```

- 跨站：

  ```
  www.a.example.com
  www.a.example2.com
  ```

- 特殊的(下面这种情况是跨站)：

  ```
  a.github.com
  b.github.com
  ```



#### Q4：SameSite有哪些属性值？

在上面👆已经介绍了有关于`SameSite`的作用，那么具体是如何来控制第三方`Cookie`的呢？

实际上就是通过给`SameSite`设置不同的属性值来控制的。

主要分为三种：

- `Strict`
- `Lax`
- `None`

来看看具体的作用：

*Strict*：

最为严格，完全禁止第三方Cookie跨站点使用
也就是只有网页的URL和请求目标的URL一致才会携带Cookie

*Lax*：

允许部分第三方请求携带`Cookie`。

也就是只能允许 链接、预加载、GET表单 发送`Cookie`。

```html
<a href="..."></a>
```

```html
<link ref="prerender" href="..." />
```

```html
<form method="GET" action="..."></form>
```

*None*：

无论是否跨站都会发送`Cookie`。



#### Q5：SameSite在使用时需要注意什么？

- 对于默认值，`Chrome80`之前一直是`None`，在`Chrome80`之后为` Lax`。
- `HTTP`接口不支持`SameSite=None`，必须配合`Secure`属性，表示只有在`HTTPS`协议下才发送`Cookie`；
- 需要进行`UA`检测，部分浏览器不能加`SameSite=None`，`IOS12`的`Safari`以及老的`Chrome`浏览器会把`SameSite=None`当成`Same=Strict`，所以需要用`User-Agent`获取浏览器信息对一些浏览器不下发`Cookie`



## 8. 实际的用处

`Cookie`实际的用处其实非常多，主要有：

- 会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）
- 个性化设置（如用户自定义设置、主题等）
- 浏览器行为跟踪（如跟踪分析用户行为等）



## 9. 缺点

- 容量缺陷。Cookie 的体积上限只有4KB，只能用来存储少量的信息。
- 性能缺陷。Cookie 紧跟域名，不管域名下面的某一个地址需不需要这个 Cookie ，请求都会携带上完整的 Cookie，使得请求会携带不必要的参数。但是可以通过Domain和Path指定作用域来解决
- 安全缺陷。由于 Cookie 以纯文本的形式在浏览器和服务器中传递，很容易被非法用户截获。在HttpOnly为false的情况下可以通过JS脚本获取到。
- 

## 直接拿吧

最后，千言万语汇成一张图...

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c460f248d9e247c9b94654aa2111bc45~tplv-k3u1fbpfcp-zoom-1.image)



## 参考文章

- 《极客时间-跨站脚本攻击（XSS）：为什么Cookie中有HttpOnly属性？》
- [《关于第一方Cookie和第三方Cookie你需要知道的》](https://www.jianshu.com/p/7e7d41cd2bac)
- [《10种跨域解决方案（附终极大招）》](https://juejin.im/post/6844904126246027278)



## 后语

你盼世界，我盼望你无`bug`。这篇文章就介绍到这里。

这个系列文章的最后我都会送给大家一段情话来表达我对大家的感谢：

`"甜有100种方式"`

`"一种是吃糖"`

`"一种是吃蛋糕"`

`"剩下98种是看到你的赞"`

...

喜欢**霖呆呆**的小伙伴还希望可以关注霖呆呆的公众号 `LinDaiDai` 

我会不定时的更新一些前端方面的知识内容以及自己的原创文章🎉。

你的鼓励就是我持续创作的主要动力 😊。

相关推荐:

[《全网最详bpmn.js教材》](https://juejin.im/post/5def372af265da33c84a4818)

[《【建议改成】读完这篇你还不懂Babel我给你寄口罩》](https://juejin.im/post/5e477139f265da574c566dda)

[《【建议星星】要就来45道Promise面试题一次爽到底(1.1w字用心整理)》](https://juejin.im/post/5e58c618e51d4526ed66b5cf)

[《【建议👍】再来40道this面试题酸爽继续(1.2w字用手整理)》](https://juejin.im/post/5e6358256fb9a07cd80f2e70)

[《【何不三连】比继承家业还要简单的JS继承题-封装篇(牛刀小试)》](https://juejin.im/post/5e707417e51d45272054d5d3)

[《【何不三连】做完这48道题彻底弄懂JS继承(1.7w字含辛整理-返璞归真)》](https://juejin.im/post/5e75e22951882549027687f9)

[《霖呆呆的近期面试128题汇总(含超详细答案) | 掘金技术征文》](https://juejin.im/post/5eb55ceb6fb9a0436748297d)


