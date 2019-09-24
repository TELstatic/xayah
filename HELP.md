# xayah

> 通用媒体库操作手册



## 预览

##### 1.媒体库

![](https://delii.oss-cn-shanghai.aliyuncs.com/rakan/default/pebygwldkw/p4zda5o02lg1560132919442.png)





##### 2.上传组件

![](https://delii.oss-cn-shanghai.aliyuncs.com/rakan/default/pebygwldkw/ifhgoq16axs1560133657835.png)

## 功能列表

[TOC]

#### 普通文件上传

> 媒体库功能区**上传**按钮，支持多文件上传，可自定义文件格式大小，文件上传成功后，无须选择即可插入。



#### 目录上传

> 媒体库功能区**目录**按钮，支持目录上传，不保留原有目录结构及文件名，可自定义文件格式大小，文件上传成功后，无须选择即可插入。

​	仅支持 Chrome，Firefox 等少数浏览器，更多信息请参考 <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory" target="_blank">HTMLInputElement.webkitdirectory</a> 。

​	目录上传时不保留原有目录结构，原文件名也将被修改。示例：原文件路径 /path1/path2/avatar.jpg ，当前上传目录路径 /rakan/default ，则上传后文件路径为 /rakan/default/{randomString}.jpg 。修改文件名是为了防止同名文件被覆盖。



#### 粘贴上传

> 媒体库展示区，右键粘贴即可。此功能仅可用于图片上传，不支持其他格式文件。粘贴对象可为截图，或网页图片右键复制对象。



#### 云上传

> 媒体库功能区**云上传**按钮，需配合后台使用，最多上传 10 张图片，支持预览，可自定义文件名。



#### 简单上传

> 隐藏媒体库界面，自定义文件格式大小，用于快速上传文件和插入文件。此功能不保留原有文件名，原因同目录上传。

​	已知 BUG ，单页面仅支持单个简单上传组件，存在多个相同组件时，会导致 v-model 值混乱。



#### 文件目录删除

> 媒体库功能区**删除**按钮或文件目录右键功能区**删除**按钮，需配合后台使用，默认禁用状态，选中文件或目录即可解禁。



#### 文件目录复制移动

> 媒体库功能区**复制移动**按钮，需配合后台使用，选中文件或目录即可解禁。点击复制或移动按钮，将解禁粘贴取消按钮，此时可变更当前目录，再次点击粘贴按钮，即可将文件或目录粘贴到当前目录。点击取消按钮，则置空待复制或待移动的目录及文件。



#### 关键词查询

> 媒体库功能区**搜索框**，需配合后台使用，根据关键词模糊查询目录及文件列表。



#### 文件插入排序

> 媒体库功能区**开关**按钮，默认排序为鼠标选中文件顺序，智能排序为文件名排序。

​	示例：已知文件列表 /rakan/file2.jpg ，/rakan/file3.jpg ，/rakan/file1.jpg，默认排序则文件顺序不变，智能排序文件列表将变更如下：/rakan/file1.jpg ，/rakan/file2.jpg ，/rakan/file3.jpg 。

​	已知 BUG，智能排序算法为 字符串数字默认 a-z，0-9 排序，如存在文件名 file10.jpg，则上述文件列表变更如下：/rakan/file1.jpg ，/rakan/file10.jpg ，/rakan/file2.jpg ，/rakan/file3.jpg 。



#### 创建目录

> 媒体库展示区**加号**按钮，需配合后台使用，点击后可创建目录。



#### 进入目录

> CTRL键 + 单击目录或双击目录可进入目标目录。



#### 文件目录重命名

> 媒体库展示区文件或目录右键功能区，需配合后台使用，点击后可修改文件或目录名。



#### 设置文件权限

> 媒体库展示区文件或目录右键功能区，需配合后台使用，可修改文件可见性。



#### 复制文件链接

> 媒体库展示区文件或目录右键功能区，可复制文件链接或生成 markdown 链接。



#### 附件预览

> 媒体库展示区附件预览区，点击文件即可，可展示文件预览图，名称，日期等信息。



#### 文件目录列表

> 媒体库展示区，展示文件目录结构，附带多种查询条件，如分页信息，关键词等。



#### 插入图片

> 媒体库功能区**插入图片**按钮，默认禁用，上传文件或选择文件解禁，不支持插入目录。



#### 图片预览

> 上传组件功能区**眼睛**按钮，点击后可预览图片，支持上下图片切换。



#### 图片快速移除

> 上传组件功能区**垃圾桶**按钮，点击后可移除图片。



#### 图片拖拽排序

> 点击上传组件非功能区后开启拖拽排序，使用鼠标拖拽图片可重新排列已插入图片顺序，再次点击非功能区则关闭拖拽排序。



#### 本地回调

> 本插件为阿里云OSS，七牛云等云存储前端配套设施，顾默认采用了 web 直传技术，生产环境下，服务器可接收到回调数据，开发环境下却不能，为方便本地开发调试，加入此功能。在本地开发环境下，文件上传成功后将主动上报文件路径大小等信息至本地后台。