# xayah

> 阿里云上传配套组件(iView)

<p align="center">
    <img src="https://img.shields.io/npm/v/xayah.svg?style=flat-square" alt="npm version" />
    <img src="https://img.shields.io/npm/l/xayah.svg?style=flat-square" alt="licence" />
    <img src="https://img.shields.io/npm/dt/xayah.svg?style=flat-square" alt="downloads" />
    <img src="https://img.shields.io/npm/dm/xayah.svg?style=flat-square" alt="downloads" />
    <img src="https://img.badgesize.io/https://unpkg.com/xayah/dist/xayah.min.js?compression=gzip&style=flat-square&label=JS%20gzip%20size" alt="JS Gzip Size" />
</p>

* [安装](#installation)
* [使用](#usage)
* [属性](#props)
* [事件](#events)
* [更新日志](#log)

<div id="installation"></div>

### [安装](#installation)
    npm install xayah

<div id="usage"></div>

### [使用](#usage)

    app.js

    import iView from 'iview';
    Vue.use(iView); //xayah 依赖iView 此代码必须
    import 'iview/dist/styles/iview.css';

    import xayah from 'xayah';
    vue.use(xayah);

    demo.vue

    <template>
        <div>
            <xayah
                v-model="images"
                :urls="urls"
                :id="id"
                :max="5"
                :config="config"
                @callback="callback"
            >
            </xayah>
        </div>
    </template>
    <script>
        export default {
            data() {
                return {
                    images: [
                        {
                            url: ''
                        }
                    ],
                    urls:{
                        index: '',    //获取文件地址
                        upload: '',   //上传地址
                        create: '',   //创建目录地址
                        check: '',    //检查文件唯一
                        policy: '',   //获取上传策略地址
                        delete: '',   //删除文件或目录地址
                        return: '',   //本地回调地址
                    },
                    id:'editorImage',
                    max:5,
                    config:{
                        random:false,
                        size:0,
                        format:[
                            'jpg','png','jpeg'
                        ],
                        style:'?x-oss-process=style/thumb',
                        key:'id',
                        gateway:'oss'
                    }
                }
            },
            methods: {
                callback(val){
                    console.log(val);
                }
            }
        }
    </script>


<div id="props"></div>

### [属性](#props)

 | name       | type   |required  |default|memo  |
 | -------    | ----   |--------  |------|-------|
 | value      | mixed | true    | []   | 可以使用 v-model 双向绑定数据|
 | urls.index      | string | true    | ''   | 获取文件|
 | urls.upload      | string | true    | ''   | 上传地址|
 | urls.alias      | string | false    | ''   | 文件显示地址 或 自定义域名 (七牛上传地址与显示地址不一致问题) |
 | urls.create      | string | true    | ''   | 创建目录|
 | urls.check      | string | true    | ''  | 检查文件唯一|
 | urls.policy      | string | true    | ''   | 获取上传策略|
 | urls.delete      | string | true    | ''   | 删除文件或目录|
 | urls.return      | string | true    | ''   | 本地回调地址|
 | id      | string | false    | null   | Dom ID|
 | max      | int | false    | 1   | 限制插入图片数量|
 | simple | string | false | '' | 简单上传模式 默认上传目录 填写即为启用|
 | type      | string | false    | 'object'   | 默认返回类型 |
 | config.random      | bool | false    | false   | 使用随机文件名|
 | config.size      | int | false    | 0   | 限制上传文件大小|
 | config.format      | array | false    | ['jpg','png','jpeg']   | 限制上传文件格式|
 | config.style      | string | false    | ''   | 图片格式化 示例: ?x-oss-process=style/thumb|
 | config.key      | string | false    | 'id'   |  兼容 MongoDB |
 | config.folder      | bool | false    | false   |  是否允许上传目录 |
 | config.gateway      | string | false    | 'oss'   | 多网关  |
 | config.resource      | bool | false    | false   | 是否隐藏源码链接  |
 | config.document      | bool | false    | false   | 是否隐藏文档链接  |
 | config.debug      | bool | false    | false   | 是否开启调试功能  |
 | config.strict      | bool | false    | false   | 是否开启严格模式  |
 | config.last      | bool | false    | false   | 是否显示最新版本  |
 | config.current      | bool | false    | false   | 是否显示当前版本  |
 | config.check      | bool | false    | false   | 是否检查图片宽高  |
 | config.formatValue      | function | false    |  详见代码   | 格式化 value 值 |
 | config.formatReturn      | function | false    |  详见代码   | 格式化返回值 |


<div id="events"></div>

### [事件](#events)

 | name       | return |memo  |
 | --- | ----- | ------|
 | callback   | 形如:\[\{url:'//demo.oss.com/demo.jpg'\}\]  | 返回选中的图片|

### 使用说明

配置ID说明
>用途:富文本编辑器插入图片
>示例:以quill富文本编辑器为例

        demo.vue

        <template>
               <div>
                   <xayah
                       style="display:none;"
                       v-model="[]"
                       :config="config"
                       :urls="urls"
                       :id="id"
                       :max="5"
                       @callback="callback"
                   >
                   </xayah>

                   <quill-editor
                       v-model="content"
                       ref="myQuillEditor">
                    </quill-editor>
               </div>
           </template>
           <script>
               export default {
                   data() {
                       return {
                           content:null,
                           images: [
                               {
                                   url: ''
                               }
                           ],
                           urls:{
                                index: '',    //获取文件地址
                                upload: '',   //上传地址
                                create: '',   //创建目录地址
                                check: '',    //检查文件唯一
                                policy: '',   //获取上传策略地址
                                delete: '',   //删除文件或目录地址
                                return: '',   //本地回调地址
                           },
                           id:'editorImage',
                           max:5,
                           config:{
                                random:false,
                                size:0,
                                format:[
                                    'jpg','png','jpeg'
                                ],
                                key:'id',
                                style:'',
                                gateway:'oss'
                           }
                       }
                   },
                   mounted(){
                        this.initEditor();
                   },
                   methods: {
                       callback(val){
                           console.log(val);
                           let that=this;
                            $.each(res, function (index, value, array) {
                               that.$refs.myQuillEditor.quill.insertEmbed(10, 'image', value.url);
                            });
                       },
                       imageHandler() {
                           document.getElementById('editorImage').click();
                       },
                       initEditor(){
                            this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', this.imageHandler);
                       }
                   }
               }
           </script>

### 配套后台

  https://github.com/TELstatic/rakan
  https://kodos.cn

### TODO
    1. 优化样式,去除内联样式


### Buy me a coffee

> Liked some of my work? Buy me a coffee (or more likely a beer)

<img src="https://cdn.telstatic.xyz/sponsors/alipay.jpg" width="200" height="300">
<img src="https://cdn.telstatic.xyz/sponsors/wechat.jpg" width="200" height="300">

### 代码贡献
    如果您有其它需求，或者发现本项目中需要改进的代码，欢迎 Fork 并提交 PR！
