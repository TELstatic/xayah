# xayah

> 阿里云上传配套组件

* [安装](#installation)
* [使用](#usage)
* [属性](#props)
* [事件](#events)

### [安装](#installation)
    
    npm install xayah

### [使用](#usage)
    
    app.js
    
    import xayah from 'xayah';
    vue.use(xayah);
 
    demo.vue
     
    <template>
        <div>
            <xayah
                v-model="images"
                max="5"
                url=""
                policyUrl=""
                createDir=""
                deleteDir=""
                deleteFile=""
                getFile=""
                checkFile=""
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
 
 
 
### [属性](#props)

 | name       | type   |required  |default|memo  |
 | -------    | ----   |--------  |------|-------|
 | value      | string | false    | []   | 可以使用 v-model 双向绑定数据|
 | max        | int    | false    | 1    | 最大选择数|
 | id         | string | false    | null | 文档DOM ID(隐藏上传组件)|
 | url        | string | true     | null | 上传地址|
 | policyUrl  | string | true     | null | 获取上传策略地址|
 | createDir  | string | true     | null | 创建目录地址|
 | deleteDir  | string | true     | null | 删除目录地址|
 | deleteFile | string | true     | null | 删除文件地址|
 | checkFile  | string | true     | null | 检查文件唯一性地址|
 | getFile    | string | true     | null | 获取文件及目录  |
 
 
 ### [事件](#events)
 
 | name       | return |memo  |   
 | --- | -----| ------|
 | callback   | 形如:\[{url:'//demo.oss.com/demo.jpg'}]  | 返回选中的图片| 
 
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
                       max="5"
                       id="editorImage"
                       url=""
                       policyUrl=""
                       createDir=""
                       deleteDir=""
                       deleteFile=""
                       checkFile=""
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
                                   url: '//al8lshop.oss-cn-shanghai.aliyuncs.com/Images/Shop/lejRej/default/8.jpg'
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
    
    配套后台 

### 开发进度

- [ ] 目录
    - [x] 显示目录及文件
    - [x] 创建目录
    - [ ] 更新目录
    - [ ] 删除目录
- [ ] 文件
    - [x] 上传文件
    - [x] 删除文件
    - [ ] 检查文件唯一
    - [x] 插入文件
 
 
 