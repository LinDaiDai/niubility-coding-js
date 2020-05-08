## position: fixed什么时候会失效？
我们知道，设置了`position: fixed`固定定位属性的元素会脱离文档流，达到“超然脱俗”的境界。
也就是说此时给这种元素设置`top, left, right, bottom`等属性是根据**浏览器窗口**定位的，与其上级元素的位置无关。

但是有一种情况例外：

若是设置了`position: fixed`属性的元素，它的上级元素设置了`transform`属性则会导致固定定位属性失效。
无论你的`transform`设置的是什么属性都会影响到`position: fixed`。

注意，这个特性表现，目前只在Chrome浏览器/FireFox浏览器下有，IE浏览器，包括IE11, `fixed`还是`fixed`的表现。

看下面的案例1：

```html
<style>
    .father {
        width: 300px;
        height: 300px;
        background: yellow;
        transform: translate(100px); 
        /* transform: scale(0.5); */
        /* transform: rotate(-45deg); */
    }
    .son {
        width: 100px;
        height: 100px;
        background: red;
        position: fixed;
        top: 400px;
    }
</style>
<body>
<div class="father">
   <div class="son"></div>
</div>
</body>
```
给父级加上了`transform`属性之后就会影响子级的固定定位了。如下图：
![没加transform.png](https://upload-images.jianshu.io/upload_images/7190596-38462e3ec67bd654.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![加了transform.png](https://upload-images.jianshu.io/upload_images/7190596-5bcc360baa0d652b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**其实不仅仅是给父级加`transform`属性会失效，只要上级存在`transform`属性都会导致`position: fixed`失效。**

案例2：
```html
<style>
    .content{
        transform: translate(100px);
    }
    .father {
        width: 300px;
        height: 300px;
        background: yellow;
    }
    .son {
        width: 100px;
        height: 100px;
        background: red;
        position: fixed;
        top: 400px;
    }
</style>
<body>
    <div class="content">
        <div class="father">
            <div class="son"></div>
        </div>
    </div>
</body>
```
上面的案例也会影响`position: fixed`属性。

具体原理可以看一下张大大的这篇文章：https://www.zhangxinxu.com/wordpress/2015/05/css3-transform-affect/