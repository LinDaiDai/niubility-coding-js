## What do I want ?
Is this...
![效果1.png](https://upload-images.jianshu.io/upload_images/7190596-bec65f7bf96fc52d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![效果2](https://upload-images.jianshu.io/upload_images/7190596-e06534984fea3d57.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
**This is too cool !**🙊
### 1. 在vscode上安装自定义JS和CSS的插件
在vscode的扩展页面搜索下载以下插件
> Custom CSS and JS Loader

![ustom CSS and JS Loader](https://upload-images.jianshu.io/upload_images/7190596-d83bd0cee45ab246.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
### 2. 安装vscode发光主题
> SynthWave '84

![image.png](https://upload-images.jianshu.io/upload_images/7190596-b703d6832383bd16.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
### 3. 下载相关的vscode样式
完成上述两个步骤之后，我们可以自定义一些样式使我们的vscode看上去更加酷炫。
首先要在你电脑的本地上选择一个文件目录用来放你的自定义JS和CSS文件。
一般可以就放在vscode的安装文件夹下，或者自己找得到的文件夹下。
我这里为了配置方便，定义了一个config文件夹专门存放一些配置文件。
并在config中创建一个名为`vscode-transparent-theme`的文件夹，将以下配置文件放入其中。
配置文件直接要感谢`Jinkey`大神整理好的配置，下载地址:[https://github.com/Jinkeycode/vscode-transparent-glow](https://github.com/Jinkeycode/vscode-transparent-glow)
将下载下来的文件放入相应的文件夹下：
![image.png](https://upload-images.jianshu.io/upload_images/7190596-225709096e2e0641.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
各个文件的作用这里就不一一做介绍了，大概的作用就是能改变vscode本身的一些样式，以及代码文字的样式等等...
### 4. 修改vscode的相关配置
打开vscode的`setting.json`文件，这个文件可以在左下角的**设置**中找到，用来配置用户的自定义属性。
![setting.json](https://upload-images.jianshu.io/upload_images/7190596-9816377f8fa615a1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
打开之后，将以下内容全部复制到`setting.json`中：
```
{
   "vscode_custom_css.imports": [
        "file:///Users/lindaidai/config/vscode-transparent-theme/vscode-vibrancy-style.css",
        "file:///Users/lindaidai/config/vscode-transparent-theme/synthwave84-noglow.css",
        "file:///Users/lindaidai/config/vscode-transparent-theme/toolbar.css",
        "file:///Users/lindaidai/config/vscode-transparent-theme/terminal.css",
        "file:///Users/lindaidai/config/vscode-transparent-theme/enable-electron-vibrancy.js"
    ],
    "vscode_custom_css.policy": true,
    "terminal.integrated.rendererType": "dom",
    "workbench.colorTheme": "SynthWave '84",
}
```
`file:///Users/lindaidai/config/vscode-transparent-theme`就是你存放这些配置文件的绝对路径。
`MacOS` 上获取文件夹或者文件的路径快捷键：
```
Option+Command+C
```
选中你的文件夹然后使用上面的快捷键，文件夹的路径就复制到了你的粘贴板上了。
例如我这里就是`/Users/lindaidai/config/vscode-transparent-theme`
**file://  这个前缀记得加上。**

若是你的`setting.json`中原本就有配置内容的话，比如有设置vscode字体大小的配置：
```
{
  "editor.fontSize": 16
}
```
那就直接在它下面加上配置就行了，如下：
```
{
  "editor.fontSize": 16,
  "vscode_custom_css.imports": [...],
  ...
}
```
### 5. 重新加载vscode
配置保存好上面的`setting.json`之后，需要重新加载vscode才能看到效果。
按下 Ctrl + Shift + P(MacOS下为Shift+commoand+P)，运行 `"Reload Custom CSS and JS"`, 重启 vscode 即可。如果提示VSCode 已经损坏，选择右上角齿轮“不再提示”即可。
部分电脑提示 reload 失败的，请以管理员模式运动 vscode
```
sudo code --user-data-dir="~/.vscode-root"
```
最终看到的效果和配置就是这样：
![image.png](https://upload-images.jianshu.io/upload_images/7190596-4569aa22ce289820.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

`editor.tokenColorCustomizations`那个配置是我看成功之后注释的字体颜色太淡了，很难看清，所以加的配置。`comments`代表的就是配置注释的字体颜色，这个可以自己发挥。

### 6. 安装背景插件
完成上面的步骤就已经实现了你的vscode透明发光的效果了，要是还想再炫一点的话，要不给它加个背景图？
安装以下背景插件
> background

![background](https://upload-images.jianshu.io/upload_images/7190596-19dcfc6335b5628d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
安装成功之后重新加载vscode就可以看到右下角有一个默认的背景图片。
当然你也可以把vscode整体想象成一个`div`元素，然后给这个元素配置上背景图片的样式。
并且自定义背景图片，如我的`setting.json`配置：
```
{
    "editor.fontSize": 16,
    "editor.tokenColorCustomizations": {
        "comments": "#72777b"
    },
    "vscode_custom_css.imports": [
        "file:///Users/lindaidai/config/vscode-transparent-theme/vscode-vibrancy-style.css",
        "file:///Users/lindaidai/config/vscode-transparent-theme/synthwave84-noglow.css",
        "file:///Users/lindaidai/config/vscode-transparent-theme/toolbar.css",
        "file:///Users/lindaidai/config/vscode-transparent-theme/terminal.css",
        "file:///Users/lindaidai/config/vscode-transparent-theme/enable-electron-vibrancy.js"
    ],
    "vscode_custom_css.policy": true,
    "terminal.integrated.rendererType": "dom",
    "workbench.colorTheme": "SynthWave '84",
    "material-icon-theme.activeIconPack": "vue",
    "background.customImages": [
        "file:///Users/lindaidai/config/vscode-background-image/timg3.png"
    ],
    "background.style": {
        "content":"''",
        "pointer-events":"none",
        "position":"absolute",//图片位置
        "width":"100%",
        "height":"100%",
        "z-index":"99999",
        "background.repeat":"no-repeat",
        "background-size":"25%, 25%",//图片大小
        "opacity":0.2 //透明度
    },
    "background.useFront": true,
    "background.useDefault": false //是否使用默认图片
}
```
`background.customImages` 就是你自定义背景图片的绝对路径，它是一个数组，最多支持3张背景图片。
背景图片的样式可以在`background.style`中配置。
最终效果：
![效果1.png](https://upload-images.jianshu.io/upload_images/7190596-bec65f7bf96fc52d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 后记
参考资料：
[如何配置透明发光的骚气 vscode —— Jinkey 原创]([https://juejin.im/post/5cdbe78cf265da034d2a3910](https://juejin.im/post/5cdbe78cf265da034d2a3910)
)