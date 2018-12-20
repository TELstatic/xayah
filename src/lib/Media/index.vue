<template>
    <div style="display: inline">
        <div class="demo-upload-list" v-for="(item,index) in value">
            <img :src="item.url">
            <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleReview(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleSlice(index)"></Icon>
            </div>
        </div>
        <div style="display: inline;">
            <div class="demo-upload-list"
                 :id="config.id"
                 @click="handleOpen"
                 style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <Icon type="ios-camera-outline" size="30"></Icon>
                </div>
            </div>
        </div>
        <Modal
                v-model="visable"
                width="1200"
                :transfer="true"
                title="媒体库"
                @on-ok=""
                @on-cancel="">
            <p slot="header">
                媒体库
                <Tooltip content="目录双击进入或按住 Ctrl 单击进入" placement="right">
                    <Icon type="ios-help-circle-outline"></Icon>
                </Tooltip>
            </p>
            <Row>
                <Col span="24">
                    <Upload
                            ref="upload"
                            style="display: inline;"
                            :format="config.format"
                            :max-size="config.size"
                            :data="headers"
                            multiple
                            :on-format-error="handleFormatError"
                            :on-exceeded-size="handleMaxSize"
                            :before-upload="beforeUpload"
                            :show-upload-list="false"
                            :on-success="success"
                            :on-remove="remove"
                            :on-error="error"
                            :action="urls.upload">
                        <Button type="success" icon="ios-cloud-upload-outline">上传</Button>
                    </Upload>
                    <Button icon="ios-home-outline" @click="handleHome" :disabled="!parentFolder.pid">
                        Root
                    </Button>
                    <Button icon="ios-refresh" @click="handleReload">
                        刷新
                    </Button>
                    <Poptip
                            confirm
                            title="此操作将删除所选文件和目录,确定继续?"
                            @on-ok="handleDelete"
                            @on-cancel="">
                        <Button :disabled="buttonStatus" icon="ios-trash-outline">删除</Button>
                    </Poptip>
                    <Button :disabled="buttonStatus" icon="ios-redo-outline" @click="handleReset">
                        重置
                    </Button>
                    <Button icon="ios-arrow-round-back" size="default" @click="handleBack"
                            :disabled="!parentFolder.pid">
                        返回
                    </Button>
                </Col>
            </Row>
            <Divider/>
            <Row>
                <Col span="18" style="min-height: 500px;">
                    <div class="demo-upload-list1" @click="handleAddFolder">
                        <Icon type="ios-add" size="60" style="margin-top: 20%"></Icon>
                    </div>
                    <div class="demo-upload-list1" v-for="(item,index) in fileList">
                        <span v-if="item.size">
                            <img :src="formatImage(item.url)"
                                 @click="handleSelect(index)"/>
                            <p style="margin-top: -50%">
                                {{item.name}}
                            </p>
                        </span>
                        <span v-else
                              @click="handleSelect(index)"
                              @click.ctrl="handleOpenFolder(item)"
                              @dblclick="handleOpenFolder(item)">
                            <Icon type="ios-folder-open"
                                  size="60" style="margin-top: 10%"
                            ></Icon>
                            <p style="margin-top: -10%">
                                {{item.name}}
                            </p>
                        </span>
                        <div class="demo-upload-list-cover2" v-if="item.checked">
                            <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                        </div>
                    </div>
                </Col>
                <Col span="6">
                    <Card style="width:300px;" v-if="!!currentFile.url">
                        <p slot="title">
                            <Icon type="ios-film-outline"></Icon>
                            附件信息
                        </p>
                        <ul>
                            <li>
                                <span>
                                    <img :src="currentFile.url" style="width: 200px;height: 200px;"/>
                                </span>
                            </li>
                            <li>
                                <a href="javascript:;">名称</a>
                                <span style="white-space:nowrap;overflow: hidden;text-overflow:ellipsis;word-break: break-all">
                                    {{currentFile.name}}
                                </span>
                            </li>
                            <li>
                                <a href="javascript:;">日期</a>
                                <span>
                                    {{currentFile.created_at}}
                                </span>
                            </li>
                            <li>
                                <a href="javascript:;">大小</a>
                                <span>
                                    {{currentFile.size}} KB
                                </span>
                            </li>
                            <li>
                                <a href="javascript:;">尺寸</a>
                                <span>
                                   {{currentFile.width}} × {{currentFile.height}}
                                </span>
                            </li>
                        </ul>
                    </Card>
                </Col>
            </Row>
            <Page
                    :total="query.total"
                    show-total
                    show-elevator
                    show-sizer
                    :transfer="false"
                    :page-size="50"
                    :page-size-opts="pageSizeOpts"
                    @on-change="pageChange"
                    @on-page-size-change="pageSizeChange"
            ></Page>
            <div slot="footer">
                <Button type="info" :disabled="insertStatus" @click="insertImages">插入图片</Button>
            </div>
        </Modal>

        <Modal
                title="图片预览"
                v-model="visible2"
                :transfer="false"
                @on-ok="handleCloseReview"
                @on-cancel="handleCloseReview">
            <img :src="currentImage.url" style="width: 100%"/>
        </Modal>

        <Modal
                title="创建目录"
                v-model="visible3"
                :transfer="true"
                @on-ok="handleCloseFolder"
                @on-cancel="handleCloseFolder">
            <Form :model="form" :rules="rules" ref="form">
                <FormItem prop="name">
                    <Input type="text" v-model="form.name" autofocus clearable placeholder="请输入目录名称"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="handleCreateFolder">
                    创建
                </Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    let time = null;

    import {Notice, Icon, Modal, Tooltip, Row, Upload, Divider, Page, FormItem} from 'iview';

    let moment = require("moment");

    export default {
        name: 'xayah',
        components: {
            Notice, Icon, Modal, Tooltip, Row, Upload, Divider, Page, FormItem
        },
        props: {
            urls: {
                type: Object,
                default: {
                    index: '',    //获取文件地址
                    upload: '',   //上传地址
                    create: '',   //创建目录地址
                    check: '',    //检查文件唯一
                    policy: '',   //获取上传策略地址
                    delete: '',   //删除文件或目录地址
                    return: '',   //本地回调地址
                }
            },
            config: {
                type: Object,
                default: {
                    id: null,       //dom ID
                    random: false,  //是否启用随机文件名
                    size: 0,        //上传大小限制
                    max: 1,         //插入图片限制
                    format: [       //上传类型限制
                        'jpg', 'png', 'jpeg'
                    ],
                    style: '',
                    key: 'id',
                }
            },
            value: {
                type: Array,
                default: []
            }
        },
        data() {
            return {
                visable: false,
                visible2: false,
                visible3: false,
                fileList: [],
                query: {
                    pid: null,
                    page: 1,
                    per_page: 50,
                    total: 0
                },
                form: {
                    name: null,
                    pid: null
                },
                rules: {
                    name: [
                        {
                            required: true,
                            trigger: 'blur',
                            type: 'string',
                            message: '目录名必须',
                        },
                        {
                            type: 'string',
                            pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/,
                            message: '目录名非法',
                        },
                    ]
                },
                pageSizeOpts: [
                    50, 100, 150
                ],
                currentFolder: null,
                parentFolder: {
                    pid: null
                },
                currentFile: {
                    path: null,
                    name: null,
                    size: 0,
                    width: 0,
                    height: 0,
                    created_at: null
                },
                currentImage: {
                    url: null
                },
                headers: {
                    OSSAccessKeyId: null,
                    Policy: null,
                    Signature: null,
                    success_action_status: 200,
                    key: null,
                },
                uploadFile: [],
                order: 0
            }
        },
        computed: {
            buttonStatus() {
                let res = _.filter(this.fileList, function (o) {
                    return o.checked;
                }).length;
                return !res;
            },
            insertStatus() {
                let res = _.filter(this.fileList, function (o) {
                    return o.checked && o.type === "file";
                }).length;
                return !res;
            }
        },
        mounted() {
            if (this.urls.policy) {
                this.checkPolicy();
            }
        },
        methods: {
            formatImage(url) {
                return url + this.config.style;
            },
            handleOpen() {
                this.visable = true;
                this.getFiles();
            },
            getFiles() {
                let that = this;

                this.clear();

                axios.get(this.urls.index, {params: this.query}).then(function (res) {
                    that.fileList = res.data.children.data;
                    that.query.total = res.data.children.total;
                    that.parentFolder = res.data.parent;
                    that.form.pid = res.data.parent[that.config.key];
                }).catch(function (error) {
                    console.error(error);
                });
            },
            handleOpenFolder(folder) {
                clearTimeout(time);
                this.query.pid = folder[this.config.key];
                this.currentFolder = folder;
                this.getFiles();
            },
            handleSelect(index) {
                clearTimeout(time);
                time = setTimeout(() => {
                    this.fileList[index]['checked'] = true;
                    this.fileList[index]['order'] = ++this.order;
                    this.currentFile = this.fileList[index];
                }, 300);
            },
            handleRemove(index) {
                this.fileList[index]['checked'] = false;
            },
            handleSlice(index) {
                this.value.splice(index, 1);
            },
            handleAddFolder() {
                let that = this;
                that.visible3 = true;

                try {
                    this.$refs.form.resetFileds();
                } catch (e) {

                }
            },
            clear() {
                this.form.name = null;
                this.currentFile = {
                    path: null,
                    name: null,
                    size: 0,
                    width: 0,
                    height: 0,
                    created_at: null
                }
            },
            handleReview(val) {
                this.visible2 = true;
                this.currentImage = val;
            },
            handleFormatError() {
                Notice.warning({
                    title: '文件格式错误',
                    desc: '请上传以下格式文件 ' + this.config.format.join('|')
                });
            },
            handleMaxSize() {
                Notice.warning({
                    title: '文件大小错误',
                    desc: '请上传 ' + Math.ceil(this.config.size / 1024) + 'M 内文件'
                });
            },
            beforeUpload(file) {
                if (this.config.random) {
                    this.headers.key = this.parentFolder.path + '/' + Math.random().toString(36).substr(2) + new Date().getTime() + '.' + file.name.split('.')[1];
                } else {
                    this.checkFile(file);
                    return false;
                }
            },
            handleCloseReview() {
                this.visible2 = false;
            },
            handleCloseFolder() {
                this.visible3 = false;
            },
            checkFile(file) {
                let form = {};
                form.path = this.parentFolder.path + '/' + file.name;

                axios.post(this.urls.check, form).then(res => {
                    if (res.data.status === 200) {
                        this.uploadFiles(file);
                    } else {
                        Notice.warning({
                            title: res.data.msg,
                            desc: '请修改' + file.name + '文件名'
                        });
                    }
                }).catch(error => {
                    console.error(error);
                });
            },
            uploadFiles(file) {
                this.headers.key = this.parentFolder.path + '/' + file.name;

                if (!this.headers.callback) {
                    delete this.headers.callback;
                }

                this.$refs.upload.post(file);
            },
            checkPolicy() {
                let that = this;
                if (localStorage.getItem('policy')) {
                    let policy = JSON.parse(localStorage.getItem('policy'));

                    if (moment().isBefore(moment(policy.expire_at))) {
                        that.headers = policy.value;
                    } else {
                        this.getPolicy();
                    }
                } else {
                    this.getPolicy();
                }
            },
            getPolicy() {
                let that = this;
                axios.get(this.urls.policy).then(function (res) {
                    that.headers.OSSAccessKeyId = res.data.accessid;
                    that.headers.Policy = res.data.policy;
                    that.headers.Signature = res.data.signature;
                    try {
                        that.headers.callback = res.data.callback;
                    } catch (e) {

                    }

                    let policy = {};
                    policy.value = that.headers;
                    policy.expire_at = moment().add(res.data.expire, 's');

                    localStorage.setItem('policy', JSON.stringify(policy));
                }).catch(function (error) {
                    console.error(error);
                });
            },
            success(res, file, fileList) {
                console.info(fileList);

                let that = this;
                if (!!this.urls.return) {
                    let form = {};
                    form.filename = this.parentFolder.path + '/' + file.name;
                    form.size = file.size;

                    axios.post(this.urls.return, form).then(res => {
                        if (res.data.status === 200) {
                            that.$Notice.success({
                                title: '回调成功',
                                desc: 'client'
                            });
                        } else {
                            that.$Notice.error({
                                title: '回调失败',
                                desc: 'client'
                            });
                        }
                        that.getFiles();
                    }).catch(error => {
                        console.error(error);
                    });
                } else {
                    if (res.status === 200) {
                        Notice.success({
                            title: '上传成功',
                            desc: 'server'
                        });
                        this.getFiles();
                    } else {
                        Notice.error({
                            title: '回调失败',
                            desc: '请联系管理员'
                        });
                    }
                }
            },
            remove() {

            },
            error(err) {
                console.error(err);

                Notice.error({
                    title: '上传失败',
                    desc: '请联系管理员'
                });
            },
            insertImages() {
                //过滤目录
                let items = _.filter(this.fileList, function (o) {
                    return o.checked && o.type === "file";
                });

                items = _.orderBy(items, ['order'], ['asc']);

                let files = [];

                items.forEach(function (current, index) {
                    let obj = {};
                    obj.url = items[index].url;

                    files.push(obj)
                });

                if (files.length > this.config.max) {
                    let msg = '图片最多选择' + this.config.max + '张,多选部分将被舍弃';
                    Notice.info({
                        title: '提示',
                        desc: msg
                    });
                    files = files.slice(0, this.config.max);
                }

                this.$emit('input', files);
                this.$emit('callback', files);
                this.order = 0;
                this.visable = false;
                this.handleReset();
            },
            pageChange(val) {
                this.query.page = val;
                this.getFiles();
            },
            pageSizeChange(val) {
                this.query.page = 1;
                this.query.per_page = val;
                this.getFiles();
            },
            handleBack() {
                this.query.pid = this.parentFolder.pid;
                this.query.page = 1;
                this.getFiles();
            },
            handleHome() {
                this.query.pid = null;
                this.query.page = 1;
                this.getFiles();
            },
            handleReload() {
                this.getFiles();
                Notice.success({
                    title: '刷新成功',
                    desc: ' '
                });
            },
            handleDelete() {
                let that = this;
                let res = _(this.fileList).map().filter(function (o) {
                    return o.checked;
                }).flatMap(that.config.key).value();

                let form = {
                    ids: res
                };

                axios.delete(this.urls.delete, {data: form}).then(res => {
                    if (res.data.status === 200) {
                        Notice.success({
                            title: '删除成功',
                            desc: ' '
                        });
                        that.getFiles();
                    } else {
                        Notice.error({
                            title: '删除失败',
                            desc: res.data.msg
                        });
                    }
                }).catch(error => {
                    console.error(error);
                });
            },
            handleReset() {
                _.map(this.fileList, function (o) {
                    o.checked = false;
                    o.order = 0;
                });
            },
            clean() {
                this.visible3 = false;
                this.form.name = null;
            },
            handleCreateFolder() {
                let that = this;
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        axios.post(this.urls.create, this.form).then(function (res) {
                            if (res.data.status === 200) {
                                Notice.success({
                                    title: '目录创建成功',
                                    desc: ' '
                                });
                                that.clean();
                                that.getFiles();
                            } else {
                                Notice.error({
                                    title: '目录创建失败',
                                    desc: res.data.msg
                                });
                            }
                        }).catch(function (error) {
                            console.error(error);
                        });
                    } else {
                        Notice.warning({
                            title: '表单输入有误',
                            desc: '请检查'
                        });
                    }
                });
            }
        }
    }
</script>

<style scoped>
    li {
        list-style: none
    }

    .demo-upload-list {
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
        margin-right: 4px;
    }

    .demo-upload-list1 {
        display: inline-block;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
        margin-right: 4px;
    }

    .demo-upload-list img {
        width: 100%;
        height: 100%;
    }

    .demo-upload-list1 img {
        width: 100%;
        height: 100%;
    }

    .demo-upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
    }

    .demo-upload-list-cover2 {
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
    }

    .demo-upload-list:hover .demo-upload-list-cover {
        display: block;
    }

    .demo-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }

    .demo-upload-list-cover2 i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }

    .demo-upload-list-cover1 i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 5px;
    }
</style>