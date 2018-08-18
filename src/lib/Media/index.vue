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
                :transfer="false"
                title="媒体库"
                @on-ok="visable =false"
                @on-cancel="visable =false">
            <p slot="header">
                媒体库
            </p>
            <Row>
                <Col span="2">
                    <Upload
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
                            :action="url">
                        <Button type="success" size="default" icon="ios-cloud-upload-outline">上传</Button>
                    </Upload>
                </Col>

                <Col span="2">
                    <Button icon="ios-home-outline" size="default" @click="handleHome">
                        Root
                    </Button>
                </Col>
                <Col span="2">
                    <Button icon="ios-refresh" size="default" @click="handleReload">
                        刷新
                    </Button>
                </Col>
                <Col span="2">
                    <Button :disabled="deleteStatus" size="default" icon="ios-trash-outline" @click="handleDelete">
                        删除
                    </Button>
                </Col>
                <Col span="2">
                    <Button :disabled="deleteStatus" size="default" icon="ios-redo-outline" @click="handleReset">
                        重置
                    </Button>
                </Col>
                <Col span="2">
                    <Button icon="ios-arrow-round-back" size="default" @click="handleBack">
                        返回
                    </Button>
                </Col>
            </Row>
            <Divider/>
            <Row>
                <Col span="18">
                    <div class="demo-upload-list1">
                        <Icon type="ios-add" size="50" style="margin-top: 20%" @click="handleAddFolder"/>
                    </div>
                    <div class="demo-upload-list1" v-for="(item,index) in fileList">
                        <img :src="url +item.path" @click="handleSelect(index)" v-if="item.size">
                        <span v-else>
                            <Icon type="ios-folder-open" size="50" style="margin-top: 20%"
                                  @click="handleOpenFolder(item)"/>
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
                    <Card style="width:300px" v-if="currentFile.path != null">
                        <p slot="title">
                            <Icon type="ios-film-outline"></Icon>
                            附件信息
                        </p>
                        <ul>
                            <li>
                                <span>
                                    <img :src="url +currentFile.path" style="width: 200px;height: 200px;"/>
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
                    :transfer="false"
                    :page-size="50"
                    @on-change="pageChange"
            ></Page>
            <div slot="footer">
                <Button type="info" :disabled="insertStatus" size="default" @click="insertImages">插入图片</Button>
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
    export default {
        name: 'xMedia',
        props: {
            url: {
                type: String
            },
            value: {
                type: Array,
                default: []
            },
            max: {
                type: Number,
                default: 1
            },
            policyUrl: {
                type: String
            },
            createDir: {
                type: String
            },
            deleteDir: {
                type: String
            },
            deleteFile: {
                type: String
            },
            checkFile: {
                type: String
            },
            getFile: {
                type: String
            },
            random: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
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
                config: {
                    size: 5120,
                    format: [
                        'jpg', 'jpeg', 'png'
                    ],
                },
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
                }
            }
        },
        computed: {
            insertStatus() {
                let res = _.filter(this.fileList, function (o) {
                    return o.checked;
                }).length;

                return !res;
            },
            deleteStatus() {
                let res = _.filter(this.fileList, function (o) {
                    return o.checked;
                }).length;

                return !res;
            }
        },
        mounted() {
            this.checkPolicy();
        },
        methods: {
            openModal() {
                this.visable = true;
                this.getFiles();
            },
            getFiles() {
                let that = this;

                this.clear();

                axios.get(this.getFile, {
                    params: this.query
                }).then(function (res) {
                    that.fileList = res.data.children.data;
                    that.query.total = res.data.children.total;
                    that.parentFolder = res.data.parent;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            handleSelect(index) {
                this.currentFile = this.fileList[index];
                this.fileList[index]['checked'] = true;
            },
            handleRemove(index) {
                this.fileList[index]['checked'] = false;
            },
            handleSlice(index) {
                this.value.splice(index, 1);
            },
            handleOpenFolder(folder) {
                this.query.pid = folder._id;
                this.form.pid = folder._id;
                this.currentFolder = folder;
                this.getFiles();
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
                    desc: '请上传 ' + this.config.size / 1024 + 'M 内文件'
                });
            },
            beforeUpload(file) {
                if (this.random) {
                    this.headers.key = this.parentFolder.path + '/' + Math.random().toString(36).substr(2) + new Date().getTime() + '.' + file.name.split('.')[1];
                } else {
                    this.headers.key = this.parentFolder.path + '/' + file.name;
                }
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
                axios.get(this.policyUrl).then(function (res) {
                    that.headers.OSSAccessKeyId = res.data.accessid;
                    that.headers.Policy = res.data.policy;
                    that.headers.Signature = res.data.signature;
                    that.headers.callback = res.data.callback;

                    let policy = {};
                    policy.value = that.headers;
                    policy.expire_at = moment().add(res.data.expire, 's');

                    localStorage.setItem('policy', JSON.stringify(policy));
                }).catch(function (error) {
                    console.log(error);
                });
            },
            remove() {

            },
            success(res) {
                if (res.code === 200) {
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
            error(err) {
                this.$Notice.error({
                    title: '上传失败',
                    desc: '请联系管理员'
                });
            },
            insertImages() {
                let that = this;

                let items = _.filter(this.fileList, function (o) {
                    return o.checked;
                });

                let files = [];

                items.forEach(function (current, index) {
                    let obj = {};
                    obj.url = that.url + items[index]['path'];

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

                this.debugthis.debug('选中图片列表:', files)

                this.$emit('input', files);
                this.$emit('callback', files);


                this.visable = false;
            },
            pageChange(val) {
                this.query.page = val;
                this.getFiles();
            },
            handleBack() {
                if (this.parentFolder.pid === 0) {
                    return false;
                }

                this.query.pid = this.parentFolder.pid;

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
                axios.delete(this.deleteFile, {
                    form
                }).then(res => {
                    if (res.data.code === 200) {
                        that.$Notice.success({
                            title: '删除成功',
                            desc: ' '
                        });
                        that.getFiles();
                    } else {
                        that.$Notice.error({
                            title: '删除失败',
                            desc: '请重试'
                        });
                    }
                }).catch(error => {
                    console.log(error);
                });
            },
            handleReset() {
                _.map(this.fileList, function (o) {
                    o.checked = false;
                });
            },
            addFolder() {
                let that = this;

                axios.post(this.createDir, this.form).then(function (res) {
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
                    console.log(error);
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