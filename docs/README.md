# xayah

> WEB 通用文件管理器

<p align="center">
    <img src="https://img.shields.io/npm/v/xayah.svg?style=flat-square" alt="npm version" />
    <img src="https://img.shields.io/npm/l/xayah.svg?style=flat-square" alt="licence" />
    <img src="https://img.shields.io/npm/dt/xayah.svg?style=flat-square" alt="downloads" />
    <img src="https://img.shields.io/npm/dm/xayah.svg?style=flat-square" alt="downloads" />
    <img src="https://img.badgesize.io/https://unpkg.com/xayah/dist/xayah.min.js?compression=gzip&style=flat-square&label=JS%20gzip%20size" alt="JS Gzip Size" />    
</p>

### 功能清单

* 文件上传
* 目录上传
* 粘贴上传
* 简单上传
* 云上传
* 创建目录
* 删除目录
* 复制移动文件
* 重命名文件
* 关键词查询文件
* 删除文件
* 伪智能插入
* 文件拖拽排序
* 预览文件
* 重置文件
* 移除目标文件
* 下载文件
* 编辑图片

### 页面预览

![](https://delii.oss-cn-shanghai.aliyuncs.com/rakan/default/pebygwldkw/p4zda5o02lg1560132919442.png)
图(1)
![](https://delii.oss-cn-shanghai.aliyuncs.com/rakan/default/pebygwldkw/ifhgoq16axs1560133657835.png)
图(2)

### 功能详解

#### 文件上传
> 图(1)中上传按钮，支持多文件上传，可自定义文件格式大小，文件上传成功后，无须再次选择即可插入。最新版可右键图片点击插入文件菜单实现快速插入。

#### 目录上传
> 图(1)中目录按钮，可直接上传目录，后续操作同文件上传。

#### 粘贴上传
> 复制网页图片或截图，点击图(1)中展示区空白区域，键盘输入 `ctrl + v` 即可上传图片，后续操作同文件上传。

#### 简单上传
> 用于不需要选择图片的场景，隐藏媒体库功能，直接调用文件上传并插入文件。

#### 云上传
> 需配合后台程序使用，用户在表单内输入想要获取的图片，由后台程序抓取并保存，由于是异步操作，所以不能直接使用文件插入。

#### 创建目录
> 图(1)中展示区加号图片

#### 删除目录
> 先选中目录，再点击删除按钮或直接右键删除。区别：前者为批量删除，可删除多个目录，后者仅能删除自身。

#### 复制移动文件
> 先选中目标文件，点击复制或移动按钮，然后进入到目标目录，点击粘贴即可实现文件的复制移动。

#### 重命名文件
> 右键文件重命名菜单即可。

#### 关键词查询文件
> 图(1)中输入框输入需要查询的关键词，点击放大镜按钮或 `enter` 键即可查询。

#### 删除文件
> 同删除目录

#### 伪智能插入
> 图(1)中开关按钮，开启时文件插入顺序按照文件名排序，适用于富文本多个商品详情页按次序插入。

示例： 
    选择顺序为 
    
    `${domain}/rakan/default/Skgsh/2.jpg` 
    `${domain}/rakan/default/Skgsh/3.jpg` 
    `${domain}/rakan/default/Skgsh/1.jpg`
    
开启后插入顺序变更为
 
    `${domain}/rakan/default/Skgsh/1.jpg` 
    `${domain}/rakan/default/Skgsh/2.jpg` 
    `${domain}/rakan/default/Skgsh/3.jpg`

#### 文件拖拽排序
> 图(2)中默认拖拽功能关闭，点击图(2)中空白区域即可开启，开启后，使用鼠标拖拽文件来实现排序。

#### 预览文件
> 图(2)中眼睛按钮，点击后可预览本次插入的所有图片。

#### 重置文件
> 图(2)中刷新按钮，点击后可删除本次插入的所有文件。

#### 移除目标文件
> 图(2)中删除按钮，点击后可删除当前文件。

#### 下载文件
> 图(2)中下载按钮，点击后可下载当前文件。

#### 编辑图片
> 图(1)中右键菜单编辑图片，点击后可对本地上传图片进行简单编辑后上传，暂不支持对已上传图片进行编辑。

