<template>
    <div style="display: inline">
        <div class="demo-upload-list" v-for="(item,index) in value">
            <img :src="item.url">
            <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleSlice(index)"></Icon>
            </div>
        </div>
        <div style="display: inline;">
            <div class="demo-upload-list"
                 :id="id"
                 @click="openModal"
                 style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <Icon type="ios-camera-outline" size="30"/>
                </div>
            </div>
        </div>
        <Modal
                v-model="visable"
                width="1200"
                :transfer="true"
                title="媒体库"
                @on-ok="visable =false"
                @on-cancel="visable =false">
            <p slot="header">
                媒体库
                <Tooltip content="目录双击进入" placement="right">
                    <Icon type="ios-help-circle-outline"/>
                </Tooltip>
            </p>
            <Row>
                <Col span="24">
                    <Upload
                            ref="upload"
                            v-if="upload"
                            style="display: inline;"
                            :format="['jpg','png','jpeg']"
                            :max-size="size"
                            :data="headers"
                            multiple
                            :on-format-error="handleFormatError"
                            :on-exceeded-size="handleMaxSize"
                            :before-upload="beforeUpload"
                            :show-upload-list="false"
                            :on-success="success"
                            :on-remove="remove"
                            :on-error="error"
                            :action="upload_url">
                        <Button type="success" icon="ios-cloud-upload-outline">上传</Button>
                    </Upload>
                    <Button icon="ios-home-outline" @click="handleHome" v-if="home">
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
                        <Button :disabled="buttonStatus" icon="ios-trash-outline" v-if="!readonly">删除</Button>
                    </Poptip>
                    <Button :disabled="buttonStatus" icon="ios-redo-outline" @click="handleReset" v-if="!readonly">
                        重置
                    </Button>
                    <Button icon="ios-arrow-round-back" size="default" @click="handleBack" v-if="back">
                        返回
                    </Button>
                </Col>
            </Row>
            <Divider/>
            <Row>
                <Col span="18">
                    <div class="demo-upload-list1" @click="handleAddFolder" v-if="create">
                        <Icon type="ios-add" size="60" style="margin-top: 20%"/>
                    </div>
                    <div class="demo-upload-list1" v-for="(item,index) in fileList">
                        <span v-if="item.size">
                            <img :src="formarImage(item.url)" @click="handleSelect(index)">
                            <p style="margin-top: -50%">
                                {{item.name}}
                            </p>
                        </span>
                        <span v-else
                              @click="handleSelect(index)"
                              @dblclick="handleOpenFolder(item)">
                            <Icon type="ios-folder-open"
                                  size="60" style="margin-top: 10%"
                            />
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
                    <Card style="width:300px" v-if="currentFile.url != null">
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
            <div slot="footer" v-if="!readonly">
                <Button type="info" :disabled="insertStatus" @click="insertImages">插入图片</Button>
            </div>
        </Modal>

        <Modal
                title="图片预览"
                v-model="visible2"
                :transfer="false"
                @on-ok="visible2 = false"
                @on-cancel="visible2 = false"
        >
            <img :src="currentImage.url" v-if="visible2" style="width: 100%">
        </Modal>
    </div>
</template>
<script>
    let time = null;

    export default {
        name: 'xMedia',
        props: {
            upload: {
                type: Boolean,
                default: true     //上传功能
            },
            home: {
                type: Boolean,
                default: true     //回首页功能
            },
            back: {
                type: Boolean,
                default: true     //返回上一级
            },
            insert: {
                type: Boolean,
                default: true     //插入功能
            },
            create: {
                type: Boolean,
                default: true     //创建目录功能
            },
            readonly: {
                type: Boolean,
                default: false     //只读功能
            },
            id: {
                type: String,
                default: null     //dom id
            },
            size: {
                type: Number,
                default: 5120     //文件大小限制
            },
            list_url: {
                type: String,
                required: true     //获取文件列表
            },
            create_url: {
                type: String,
                required: true     //创建目录
            },
            policy_url: {
                type: String,
                required: true    //获取上传策略地址
            },
            upload_url: {
                type: String,
                required: true    //上传地址
            },
            check_url: {
                type: String,
                required: true    //检查文件唯一性
            },
            delete_url: {
                type: String,
                required: true   //删除文件地址
            },
            value: {
                type: Array,
                default: []
            },
            max: {
                type: Number,
                default: 1
            },
            random: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                fullscreen: false,
                visable: false,
                visible2: false,
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
                pageSizeOpts: [
                    50, 100, 150
                ],
                currentFolder: null,
                parentFolder: null,
                currentFile: {
                    path: null,
                    name: null,
                    size: 0,
                    width: 0,
                    height: 0,
                    created_at: ''
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
                    callback: null
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
            if (this.policy_url) {
                this.checkPolicy();
            }
        },
        methods: {
            formarImage(url) {
                return url + '?x-oss-process=style/thumb';
            },
            openModal() {
                this.visable = true;
                this.getFiles();
            },
            getFiles() {
                let that = this;

                this.clear();

                axios.get(this.list_url, {
                    params: this.query
                }).then(function (res) {
                    that.fileList = res.data.children.data;
                    that.query.total = res.data.children.total;
                    that.parentFolder = res.data.parent;
                    that.form.pid = res.data.parent._id;
                }).catch(function (error) {
                    console.error(error);
                });
            },
            handleOpenFolder(folder) {
                clearTimeout(time);
                this.query.pid = folder._id;
                this.form.pid = folder._id;
                this.currentFolder = folder;
                this.getFiles();
            },
            handleSelect(index) {
                clearTimeout(time);
                time = setTimeout(() => {
                    if (!this.readonly) {
                        this.fileList[index]['checked'] = true;
                        this.fileList[index]['order'] = ++this.order
                    }
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

                this.$Modal.confirm({
                    onOk() {
                        that.addFolder();
                    },
                    render: (h) => {
                        return h('Input', {
                            props: {
                                value: this.form.name,
                                autofocus: true,
                                placeholder: '请输入目录名称'
                            },
                            on: {
                                input: (val) => {
                                    this.form.name = val;
                                }
                            }
                        })
                    }
                });
            },
            clear() {
                this.form.name = null;
                this.currentFile = {
                    path: null,
                    name: null,
                    size: 0,
                    width: 0,
                    height: 0,
                    created_at: ''
                }
            },
            handleView(val) {
                this.visible2 = true;
                this.currentImage = val;
            },
            handleFormatError() {
                this.$Notice.warnings({
                    title: '文件格式错误',
                    desc: '请上传以下格式文件 ' + this.config.format.join('|')
                });
            },
            handleMaxSize() {
                this.$Notice.warnings({
                    title: '文件大小错误',
                    desc: '请上传 ' + Math.ceil(this.config.size / 1024) + 'M 内文件'
                });
            },
            beforeUpload(file) {
                if (this.random) {
                    this.headers.key = this.parentFolder.path + '/' + Math.random().toString(36).substr(2) + new Date().getTime() + '.' + file.name.split('.')[1];
                } else {
                    this.checkFile(file);
                    return false;
                }
            },
            clean() {
                this.uploadFile = [];
            },
            checkFile(file) {
                let form = {};
                form.path = this.parentFolder.path + '/' + file.name;

                axios.post(this.check_url, form).then(res => {
                    if (res.data.status === 200) {
                        this.uploadFiles(file);
                    } else {
                        this.$Notice.warning({
                            title: res.data.msg,
                            desc: '请修改' + file.name + '文件名'
                        });
                    }
                }).catch(error => {
                    console.error(error)
                });
            },
            uploadFiles(file) {
                this.headers.key = this.parentFolder.path + '/' + file.name;
                this.$refs.upload.post(file);
            },
            checkPolicy() {
                if (localStorage.getItem('policy')) {
                    let policy = JSON.parse(localStorage.getItem('policy'));

                    if (moment().isBefore(moment(policy.expire_at))) {
                        this.headers = policy.value;
                    } else {
                        this.getPolicy();
                    }
                } else {
                    this.getPolicy();
                }
            },
            getPolicy() {
                let that = this;
                axios.get(this.policy_url).then(function (res) {
                    that.headers.OSSAccessKeyId = res.data.accessid;
                    that.headers.Policy = res.data.policy;
                    that.headers.Signature = res.data.signature;
                    that.headers.callback = res.data.callback;

                    let policy = {};
                    policy.value = that.headers;
                    policy.expire_at = moment().add(res.data.expire, 's');

                    localStorage.setItem('policy', JSON.stringify(policy));
                }).catch(function (error) {
                    console.error(error);
                });
            },
            success(res) {
                console.info(res);
                if (res.status === 200) {
                    this.$Notice.success({
                        title: '上传成功',
                        desc: ' '
                    });
                    this.getFiles();
                } else {
                    this.$Notice.error({
                        title: '回调失败',
                        desc: '请联系管理员'
                    });
                }
            },
            remove() {

            },
            error(err) {
                console.error(err);

                this.$Notice.error({
                    title: '上传失败',
                    desc: '请联系管理员'
                });
            },
            insertImages() {
                let that = this;

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

                if (files.length > this.max) {
                    let msg = '图片最多选择' + this.max + '张,多选部分将被舍弃';
                    this.$Notice.info({
                        title: '提示',
                        desc: msg
                    });
                    files = files.slice(0, this.max);
                }

                this.$emit('input', files);
                this.$emit('callback', files);
                this.order = 0;
                this.visable = false;
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
                if (this.parentFolder.pid === 0) {
                    return false;
                }

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
                this.$Notice.success({
                    title: '刷新成功',
                    desc: ' '
                });
            },
            handleDelete() {
                let res = _(this.fileList).map().filter(function (o) {
                    return o.checked;
                }).flatMap('_id').value();

                let that = this;
                let form = {};
                form.ids = res;

                axios.delete(this.delete_url, {data: form}).then(res => {
                    if (res.data.status === 200) {
                        that.$Notice.success({
                            title: '删除成功',
                            desc: ' '
                        });
                        that.getFiles();
                    } else {
                        that.$Notice.error({
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
            addFolder() {
                let that = this;

                axios.post(this.create_url, this.form).then(function (res) {
                    switch (res.data.code) {
                        case 200:
                            that.$Notice.success({
                                title: '创建成功',
                                desc: ' '
                            });
                            that.getFiles();
                            break;
                        case 201:
                            that.$Notice.warning({
                                title: '创建失败',
                                desc: '目录已存在'
                            });
                            break;
                        case 202:
                            that.$Notice.warning({
                                title: '创建失败',
                                desc: '同一目录最多创建10个子目录'
                            });
                            break;
                        case 500:
                        default:
                            that.$Notice.error({
                                title: '创建失败',
                                desc: '请重试'
                            });
                            break;
                    }
                }).catch(function (error) {
                    console.error(error);
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

    .demo-badge {
        width: 42px;
        height: 42px;
        background: #eee;
        border-radius: 6px;
        display: inline-block;
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

    .demo-upload-list-cover1 {
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

    .demo-upload-list1:hover .demo-upload-list-cover1 {
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