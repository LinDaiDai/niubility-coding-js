## Shutdown HTTP系列介绍

之前，有一位大佬和我说过这么一句话："网络知识在一定程度上决定了你的上限"。

对HTTP一知半解的我，上限真的这么低吗...就不能花点时间好好整理整理吗 🤔️？

这次请给霖呆呆一个机会，跟着我的脚步👣从1开始学习它。另外我整理的HTTP系列基本都会附有一个面试时的浅答与深答的的配套答案，浅答是为了让你们更好的记住，深答保证你确实理解了浅答中的知识点。

整个系列下来，让我们彻底 Shutdown HTTP ！！！💪

系列思维导图：

![](./resource/ShutdownHTTP.png)

系列目录：

- [《🐲【1】Shutdown HTTP系列-基础篇》](./ShutdownHTTP系列-基础篇(1).md)
- 《🐲【2】Shutdown HTTP系列-HTTP报文篇》「本文」
- [《🐲【3】Shutdown HTTP系列-Cookie篇》]()
- [《🐲【4】Shutdown HTTP系列-HTTPS篇》]()
- [《🐲【5】Shutdown HTTP系列-CCPG篇》]()
- [《🐲【6】Shutdown HTTP面试系列》]()



## 本篇目录

通过阅读本篇文章你可以学习到：

- HTTP报文概念
- HTTP报文整体结构
- HTTP首部字段
- 编码提升传输速率
- 多部分对象集合
- 获取部分内容的范围请求
- 内容协商



## 1. HTTP报文概念

概念：是HTTP通信中的基本单位，由8位组字节流组成。



## 2. HTTP报文整体结构

整体结构：报文首部 + 空行 + 报文实体

有些地方会写为(这样也可以)：起始行 + 首部字段 + 空行 + 报文实体

（首部也就是头部）

另外对于**请求报文**和**响应报文**，它们主要是报文首部不同：

**请求报文：**

![](./resource/shutdownHTTP/21.png)

真实例子：

![](./resource/shutdownHTTP/22.png)

**响应报文：**

![](./resource/shutdownHTTP/23.png)

真实例子：

![](./resource/shutdownHTTP/24.png)



## 3. HTTP报文组成

上面👆介绍了一下HTTP报文的整体结构，这里主要是做一下细分。

HTTP报文的整体是：报文首部 + 空行 + 报文实体

不过因为：报文首部 = 起始行 + 首部字段，其实起始行也挺重要的，所以我就分为两部分说了。

大家记住这张图就可以了：

![](./resource/shutdownHTTP/25.png)



### 3.1 起始行

请求报文中叫：**请求行**

由：`方法 + URI + 版本号` 组成

例：`GET index.html HTTP/1.1`

真实例子可以看上面👆HTTP整体报文那张图。



响应报文中叫：**状态行**

由：`版本号 + 状态码 + 原因短语`

例：`HTTP/1.1 200 OK`

(这个原因短语就是之前学习**HTTP状态码**每个状态码对应的英文单词，比如`404 Not Found`)



### 3.2 首部字段

在第四节中细讲。



### 3.3 空行

空行：也就是CR(回车符) 或 LF(换行符)，它的作用就是用来**区分头部和实体**。

例如下面这个实例：

![](./resource/shutdownHTTP/26.png)

在`Connection: keep-alive`下面就有一个换行符。

**注意点：**

如果在头部中故意加一个空行，空行后面的内容会被全部当成实体



### 3.4 报文实体

报文实体也就是具体请求和响应的数据了，就是我们俗说的`body`。

请求报文中叫：**请求体**

响应报文中叫：**响应体**



## 4. HTTP首部字段

（HTTP报文中最繁琐的就是首部字段了，也就是我们经常在`network`上看到的那么一大串的配置）

![](./resource/shutdownHTTP/27.png)



HTTP首部字段我会从这几个方面来讲解：

- HTTP首部字段结构
- 四种HTTP首部字段类型
- 非标准的首部字段
- Accept相关字段



### 4.1 HTTP首部字段结构

1. 首先基本结构是：

由：`key: value`

例子：`Content-Type: text/html`



2. 多个字段值用`,`号连接：
   由：`key: value1, value2`

例：`Keep-Alive: timeout=15, max=100`



3. 若是字段值又可选参数且是多个则用`;`号连接：

由：`key: value1, q=1;value2, q=0.8`

例：`Accept: text/html, q=1; application/xml, q=0.8`



4. 若是首部字段重复不同的浏览器有不同的处理结果，有些浏览器会优先处理第一次出现的首部字段，而有些则先处理最后出现的首部字段



### 4.2 四种HTTP首部字段类型

首部字段从类型上来说，有四种：

- 通用首部字段(General Header Fields)：请求和响应报文都会用的字段
- 请求首部字段(Request Header Fields)：请求报文时用的字段
- 响应首部字段(Response Header Fields)：响应报文时用的字段
- 实体首部字段(Entity Header Fields)：请求和响应报文的实体部分用的字段

而每一种类型下面又有很多字段，可能一下要记这么多也比较难，所以面试时能尽量把自己知道的说出来就可以了，让面试官知道对于一些重要的字段你还是有了解的。

以下我列举了一些，不过标了星号的可是重点哦。



#### 通用首部字段

![](./resource/shutdownHTTP/通用首部字段.png)

#### 请求首部字段

![](./resource/shutdownHTTP/请求首部字段.png)

#### 响应首部字段

![](./resource/shutdownHTTP/响应首部字段.png)

#### 实体首部字段

![](./resource/shutdownHTTP/实体首部字段.png)

### 4.3 非标准的首部字段

因为HTTP首部字段是可以自行扩展的，所以在Web服务器和浏览器的应用上，出现了一些非标准的首部字段。

有这么一些：

![](./resource/shutdownHTTP/非标准首部字段.png)



### 4.4 Accept相关字段

还有一个比较重要的点就是几种`Accept`相关的首部字段。



#### 权重

当有多个字段值的时候，可以指定字段 q 来作为权重，权重范围 0～1。

例如：

```http
Accept: text/html, q=1; application/xml, q=0.8
```



#### 五种类别

（图中的序号并无优先级的意思，只是单纯的作为标记）

![](./resource/shutdownHTTP/Accept相关字段.png)

需要注意的是：

`If-Range` 和 `Range`以及 `Accept-Ranges` 和 `Content-Range`

这四个字段只有`Accept-Ranges`是有`s`的。



## 5. 编码提升传输速率

