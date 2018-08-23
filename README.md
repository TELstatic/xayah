# xayah

> 阿里云上传配套组件

* [安装](#installation)
* [使用](#usage)
* [属性](#props)
* [事件](#events)

<div id="installation"></div>
### [安装](#installation)
    npm install xayah

<div id="usage"></div>
### [使用](#usage)
    
    app.js
    
    import xMedia from 'xayah';
    vue.use(xMedia);
 
    demo.vue
     
    <template>
        <div>
            <x-media
                v-model="images"
                max="5"
                ...
            >
            </x-media>
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
                    ]
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
 | value      | string | false    | []   | 可以使用 v-model 双向绑定数据|
 | max        | int    | false    | 1    | 最大选择数|
 | id         | string | false    | null | 文档DOM ID(隐藏上传组件)|
 | upload        | string | true     | null | 启用上传功能|
 | home  | string | true     | null | 启用返回首页功能|
 | back  | string | true     | null | 启用返回上一层功能|
 | insert | string | true     | null | 启用插入文件功能|
 | create  | string | true     | null | 启用创建目录功能|
 | readonly    | string | true     | null | 只读,不可选中  |
 | random    | bool | true     | null | 文件名随机生成  |
 | size    | bool | true     | null | 文件限制大小(kb)  |
 | list_url    | bool | true     | null | 获取文件列表地址  |
 | create_url    | bool | true     | null | 创建目录地址  |
 | policy_url    | bool | true     | null | 获取上传策略地址  |
 | upload_url    | bool | true     | null | 上传地址  |
 | check_url    | bool | true     | null | 检查文件唯一性地址  |
 | delete_url    | bool | true     | null | 删除文件地址  |

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
                   <x-media
                       style="display:none;"
                       v-model="[]"
                       max="5"
                       id="editorImage"
                       ...
                       @callback="callback"
                   >
                   </x-media>
                   
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
                           ]
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

### 开发进度

- [ ] 目录
    - [x] 显示目录及文件
    - [x] 创建目录
    - [ ] 更新目录
    - [x] 删除目录
- [x] 文件
    - [x] 上传文件
    - [x] 删除文件
    - [x] 检查文件唯一
    - [x] 插入文件
 
 
 