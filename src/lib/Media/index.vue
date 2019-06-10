<template>
    <div style="display: inline">
        <div class="demo-upload-list" v-for="(item,index) in images">
            <img :src="item.url" @dragstart='drag($event,index)' @drop='drop($event,index)'
                 @dragover='allowDrop($event,index)' @click="handleDrop">
            <div class="demo-upload-list-cover" v-bind:class="{ 'demo-active': isActive }" @click="handleDrop">
                <Icon type="ios-eye-outline" @click.native.stop="handleReview(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native.stop="handleSlice(index)"></Icon>
            </div>
        </div>
        <div style="display: inline;" v-if="images.length<max">
            <div class="demo-upload-list"
                 :id="id"
                 @click="handleOpen"
                 style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <Icon type="ios-camera-outline" size="30"></Icon>
                </div>
            </div>
        </div>
        <Modal
                v-model="visible"
                width="1200"
                :transfer="true"
                title="媒体库"
                id="xayah">
            <p slot="close">
                <Icon type="ios-help-circle-outline"
                      style="font-size: 20px;color: #999;-webkit-transition: color .2s ease;transition: color .2s ease;position: relative;top: 1px;"
                      @click.stop="handleHelp">查看帮助
                </Icon>
                <Icon type="ios-close"></Icon>
            </p>

            <div @paste="handlePaste">
                <Row>
                    <Col span="24">
                        <Upload
                                v-if="urls.upload"
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
                            <Button type="success" icon="ios-cloud-upload-outline" id="upload">上传</Button>
                        </Upload>

                        <Button type="success" icon="ios-folder-outline" @click="handleUploadFolder"
                                v-if="config.folder">目录
                        </Button>

                        <input type='file' id="uploadFolder" webkitdirectory
                               style="display: none;"/>

                        <Button icon="ios-thunderstorm-outline" type="info" @click="handleUpload" v-if="urls.remote">
                            云上传
                        </Button>

                        <div v-if="urls.index" style="display: inline;">
                            <Button icon="ios-home-outline" @click="handleHome" :disabled="!parentFolder.pid">
                                Root
                            </Button>
                            <Button icon="ios-refresh" @click="handleReload">
                                刷新
                            </Button>
                            <Poptip
                                    v-if="urls.delete"
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

                            <Button icon="ios-copy" size="default" @click="handleCopy" v-if="urls.paste"
                                    :disabled="buttonStatus">
                                复制
                            </Button>

                            <Button icon="ios-cut" size="default" @click="handleCut" v-if="urls.paste"
                                    :disabled="buttonStatus">
                                移动
                            </Button>

                            <ButtonGroup v-if="visible6 && urls.paste">
                                <Button type="dashed" :disabled="pasteStatus" icon="ios-paper-outline"
                                        @click="handleStick">
                                    粘贴 ({{objectList.length}})
                                </Button>
                                <Button type="dashed" @click="handleCancel">
                                    取消
                                </Button>
                            </ButtonGroup>

                            <Input style="width: auto;" v-model.trim="query.keyword" search @on-search="handleSearch"
                                   placeholder="请输入关键词查找"></Input>
                        </div>

                        <span style="float: right;">
                        <i-switch v-model="isSmartSort" size="large" @on-change="handleSmartSortChange">
                            <span slot="open">智能</span>
                            <span slot="close">默认</span>
                        </i-switch>
                    </span>
                    </Col>
                </Row>
                <Divider/>
                <Row :gutter="24">
                    <Col span="18" style="min-height: 500px;">
                        <div class="demo-upload-list1" @click="handleAddFolder" v-if="urls.create"
                             style="overflow: visible ;">
                            <Icon type="ios-add" size="60" style="margin-top: 20%;"></Icon>
                        </div>
                        <div class="demo-upload-list1" v-for="(item,index) in fileList"
                             style="overflow:visible ;vertical-align:top;margin-bottom: 30px;">
                            <span v-if="item.size">
                                <Dropdown trigger="contextMenu">
                                    <span v-if="urls.visible">
                                        <Badge :type="!item.visible ?'success':'info'" :text="!item.visible ?'私有':'公开'">
                                            <img :src="formatImage(item.url)" width="98" style="height:98px;"
                                                 @click="handleSelect(index)"/>
                                        </Badge>
                                    </span>
                                    <span v-else>
                                        <img :src="formatImage(item.url)" width="98" style="height:98px;"
                                             @click="handleSelect(index)"/>
                                    </span>
                                    <p style="margin-top: -25% ;position:relative;z-index: 100;line-height: 20px">
                                        <span style="float: left ;">
                                            <Checkbox v-model="item.checked"></Checkbox>
                                        </span>
                                        <span style="float: left;max-width: 70px;text-overflow:ellipsis;overflow-x: hidden;background-color: white;">
                                            {{item.name}}
                                        </span>
                                    </p>
                                    <DropdownMenu slot="list" style="z-index: 2000 ;">
                                        <DropdownItem v-if="!item.visible && urls.visible"
                                                      @click.prevent.native="handleSetVisible(item,1)">设置公开
                                        </DropdownItem>
                                        <DropdownItem v-if="item.visible && urls.visible"
                                                      @click.prevent.native="handleSetVisible(item,0)">设置私有
                                        </DropdownItem>
                                        <DropdownItem v-if="urls.rename"
                                                      @click.prevent.native="handleRename(item)">重命名
                                        </DropdownItem>
                                        <DropdownItem @click.prevent.native="handleCopyLink(item)">复制链接</DropdownItem>
                                        <DropdownItem
                                                @click.prevent.native="handleCopyMDLink(item)">复制MarkDown链接
                                        </DropdownItem>
                                        <DropdownItem @click.prevent.native="handleDownload(item)">下载文件</DropdownItem>
                                        <DropdownItem v-if="urls.delete" @click.prevent.native="handleDestroy(item)"
                                                      style="color: #ed4014">删除
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </span>
                            <span v-else>
                                 <Dropdown trigger="contextMenu">
                                    <Icon type="ios-folder-open"
                                          @click="handleSelect(index)"
                                          @click.ctrl="handleOpenFolder(item)"
                                          @dblclick.native="handleOpenFolder(item)"
                                          size="60" style="margin-top: 30%;"></Icon>
                                    <DropdownMenu slot="list">
                                        <DropdownItem v-if="urls.rename"
                                                      @click.prevent.native="handleRename(item)">重命名</DropdownItem>
                                        <DropdownItem @click.prevent.native="handleDestroy(item)"
                                                      v-if="urls.delete" style="color: #ed4014;">删除</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                                <p style="margin-top: 1%;">
                                 <span style="float: left;margin-left: 10px;margin-bottom: 10px;">
                                    <Checkbox v-model="item.checked"
                                              @click.prevent.native="handleSelect(index)"></Checkbox>
                                    </span>
                                    <span style="float:left;">
                                        {{item.name}}
                                    </span>
                                </p>
                            </span>
                        </div>
                    </Col>
                    <Col span="6">
                        <Card v-if="!!currentFile.url">
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
            </div>
            <div slot="footer">
                <Button type="info" :disabled="insertStatus" @click="insertImages">插入图片</Button>
            </div>
        </Modal>

        <Modal
                title="图片预览"
                v-model="visible2"
                :transfer="false"
                :footerHide="true"
                @on-ok="handleCloseReview"
                @on-cancel="handleCloseReview">
            <div style="text-align: center;">
                <div style="height: 300px;width: 400px;margin: 0 auto;">
                    <img :src="currentImage.url" style="max-width: 100%;max-height: 100%;"/>
                </div>
                <ButtonGroup>
                    <Button type="default" @click="handleCutOver(true)">
                        <Icon type="ios-arrow-back"/>
                        上一张
                    </Button>
                    <Button type="default" @click="handleCutOver(false)">
                        上一张
                        <Icon type="ios-arrow-forward"/>
                    </Button>
                </ButtonGroup>
            </div>
        </Modal>

        <Modal
                title="创建目录"
                v-model="visible3"
                :transfer="true"
                @on-ok="handleCloseFolder"
                @on-cancel="handleCloseFolder">
            <Form :model="form" :rules="rules" ref="form" @keydown.native.enter.prevent="handleCreateFolder"
                  :label-width="80">
                <FormItem prop="name" label="目录名">
                    <Input type="text" v-model="form.name" autofocus clearable placeholder="请输入目录名称"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" :loading="loading2" @click="handleCreateFolder">
                    创建
                </Button>
            </div>
        </Modal>

        <Modal
                title="重命名"
                v-model="visible5"
                :transfer="true"
                @on-ok=""
                @on-cancel="">
            <Form :model="rename.form" :rules="rename.rules" ref="renameForm" :label-width="80"
                  @keydown.native.enter.prevent="handleRenameSubmit">
                <FormItem prop="name" label="重命名">
                    <Input type="text" v-model="rename.form.name" autofocus clearable
                           placeholder="请输入目录名称"/>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" :loading="loading1" @click="handleRenameSubmit">
                    确定
                </Button>
            </div>
        </Modal>

        <Modal
                width="1000"
                v-model="visible4"
                :transfer="true"
                @on-ok=""
                @on-cancel="">
            <p slot="header">
                异步上传
                <Tooltip content="远程异步上传图片,请确保文件唯一且有效" placement="right">
                    <Icon type="ios-help-circle-outline"></Icon>
                </Tooltip>
            </p>
            <Form :model="cloud.form" :rules="cloud.rules" ref="cloud"
                  @keydown.native.enter.prevent="handleSubmit">
                <div>
                    <Row>
                        <Col span="24">
                            <FormItem style="height: 10px;" label="图片列表">
                                <Row :gutter="10">　
                                    <Col span="6">
                                        地址
                                    </Col>
                                    <Col span="6">
                                        文件名
                                    </Col>
                                    <Col span="4">
                                        预览
                                    </Col>
                                    <Col span="2">
                                        操作
                                    </Col>
                                </Row>
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem
                            v-for="(item, index) in cloud.form.items"
                            :key="index"
                            :label="'图片 ' + (index+1) "
                            :prop="'items.' + index"
                            :rules="cloud.rules.item">
                        <Row :gutter="10">
                            <Col span="6">
                                <Poptip trigger="focus">
                                    <Input type="text" v-model="item.url" clearable
                                           placeholder="请输入地址"></Input>
                                    <div slot="content">{{ formatText(item.url) }}</div>
                                </Poptip>
                            </Col>
                            <Col span="6">
                                <Poptip trigger="focus">
                                    <Input type="text" v-model="item.name" clearable
                                           placeholder="请输入名称"></Input>
                                    <div slot="content">{{ formatText(item.name) }}</div>
                                </Poptip>
                            </Col>
                            <Col span="4">
                                <img :src="item.url" width="150" height="150"/>
                            </Col>
                            <Col span="2">
                                <Button :disabled="!index && cloud.form.items.length===1" @click="handleRemove(index)">
                                    删除
                                </Button>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem>
                        <Row>
                            <Col span="12">
                                <Button type="dashed" long @click="handleAdd" :disabled="addStatus" icon="plus-round">
                                    新增图片
                                </Button>
                            </Col>
                        </Row>
                    </FormItem>
                </div>

            </Form>
            <div slot="footer">
                <Button type="info" @click="handleSubmit" :disabled="uploadStatus">
                    获取
                </Button>
                <Button type="dashed" @click="handleCancel">
                    取消
                </Button>
            </div>
        </Modal>

        <Modal
                v-model="visible7"
                width="80%"
                title="帮助中心">
            <div style="width: 100%;">
                <vue-markdown :source="help"></vue-markdown>
            </div>
        </Modal>
    </div>
</template>
<script>
    let time = null;

    import Vue from 'vue';

    import _ from 'lodash';

    import help from '../../../HELP.md';

    import {Notice, LoadingBar} from 'iview';
    import VueClipboard from 'vue-clipboard2';
    import VueMarkdown from 'vue-markdown'

    Vue.use(VueClipboard);

    function oneOf(value, validList) {
        for (let i = 0; i < validList.length; i++) {
            if (value === validList[i]) {
                return true;
            }
        }
        return false;
    }

    import Emitter from '../../mixins/emitter';

    let moment = require("moment");

    export default {
        name: 'xayah',
        mixins: [Emitter],
        components: {
            Notice, VueMarkdown,
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
                    remote: '',   //远程下载地址
                    visible: '',//设置文件可见性
                    paste: '',     //复制剪切文件目录
                    rename: '',    //重命名文件
                },
            },
            config: {
                type: Object,
                default: {
                    random: false,  //是否启用随机文件名
                    size: 0,        //上传大小限制
                    format: [       //上传类型限制
                        'jpg', 'png', 'jpeg'
                    ],
                    style: '',
                    key: 'id',
                    gateway: 'oss',
                    folder: false,      //是否开启目录上传
                },
            },
            id: {       //dom ID
                type: String,
                default: '',
            },
            max: {      //插入图片限制
                type: Number,
                default: 1,
            },
            type: {
                type: String,
                validator(value) {
                    return oneOf(value, ['object', 'array', 'string']);
                },
                default: 'object'
            },
            simple: {   //简单上传模式
                type: Boolean,
                default: false,
            },
            value: {
                default: "",
            },
            formatImages: {
                type: Function,
                default: function () {
                    return this.formatValue();
                },
            },
            formatReturn: {
                type: Function,
                default: function (files) {
                    return this.formatCallback(files);
                }
            }
        },
        data() {
            return {
                visible: false,
                visible2: false,
                visible3: false,
                visible4: false,
                visible5: false,
                visible6: false,
                visible7: false,
                fileList: [],
                currentValue: this.value,
                query: {
                    pid: null,
                    page: 1,
                    per_page: 50,
                    total: 0,
                    keyword: null,
                },
                help: help,
                isActive: false,
                form: {
                    name: null,
                    pid: null,
                },
                cloud: {
                    form: {
                        pid: null,
                        items: [
                            {
                                name: null,
                                url: null,
                            },
                        ],
                    },
                    rules: {
                        item: {
                            required: true,
                            type: 'object',
                            fields: {
                                url: {
                                    type: 'url',
                                    required: true,
                                    pattern: new RegExp('/^https.?:\\/\\/(([a-zA-Z0-9_-])+(\\.)?)*(:\\d+)?(\\/((\\.)?(\\?)?=?&?[a-zA-Z0-9_-](\\?)?)*)*$/i'),
                                    message: '请输入正确的图片地址',
                                },
                                name: {
                                    type: 'string',
                                    pattern: /^[\u4E00-\u9FA5AA-Za-z0-9_-]+\.[A-Za-z0-9]+$/,
                                    required: true,
                                    message: '请输入正确的图片名称',
                                },
                            }
                        },
                    },
                },
                isSmartSort: false,
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
                    pid: null,
                    path: 'xayah',
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
                headers: {},
                uploadList: [],
                order: 0,
                startIndex: 0,
                loading1: false,
                loading2: false,
                objectList: [],
                actionType: 'copy',
                rename: {
                    form: {
                        id: null,
                        name: null,
                    },
                    rules: {
                        name: [
                            {
                                required: true,
                                message: '请输入文件名',
                            },
                        ],
                    },
                },
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

                return !res && !this.uploadList.length;
            },
            uploadStatus() {
                let res = _.filter(this.cloud.form.items, function (o) {
                    return o.url;
                }).length;

                return !res;
            },
            addStatus() {
                return !(this.cloud.form.items.length < 10);
            },
            images: {
                get: function () {
                    return this.formatValue();
                },
                set: function () {

                },
            },
            pasteStatus() {
                return !this.objectList.length;
            },
        },
        watch: {
            value(val) {
                this.currentValue = this.value;
            },
            objectList: function (newValue) {
                this.visible6 = !!newValue.length;
            },
            cloud: {
                deep: true,
                handler(newValue, oldValue) {
                    newValue.form.items.forEach(function (item) {
                        if (!item.name && item.url) {
                            item.name = item.url.replace(/(.*\/)*([^.]+).*/ig, "$2") + '.' + item.url.replace(/.+\./, "");
                        }
                    });
                }
            }
        },
        mounted() {
            if (this.urls.policy) {
                this.checkPolicy();
            }

            this.initUploadFolder();

            //检查浏览器是否支持目录上传
            if (this.config.folder) {
                this.config.folder = this.isInputDirSupported();
            }
        },
        methods: {
            isInputDirSupported() {
                let tmpInput = document.createElement('input');

                if ('webkitdirectory' in tmpInput
                    || 'mozdirectory' in tmpInput
                    || 'odirectory' in tmpInput
                    || 'msdirectory' in tmpInput
                    || 'directory' in tmpInput) return true;

                return false;
            },
            initUploadFolder() {
                let that = this;

                document.getElementById('uploadFolder').addEventListener('change', function (e) {
                    if (!this.files.length) return;

                    for (let i = 0; i < this.files.length; i++) {
                        if (that.checkFileSize(this.files[i].size) && that.checkFileType(this.files[i].name)) {
                            that.uploadFiles(new File([this.files[i]], that.getRandomName(this.files[i]), {type: this.files[i].type}));
                        }
                    }
                }, false);
            },
            checkFileType(type) {
                if (!oneOf(type.split('.')[1], this.config.format)) {
                    return false;
                }

                return true;
            },
            checkFileSize(size) {
                if (size < this.config.size) {
                    return false;
                }

                return true;
            },
            swapArr(arr, index1, index2) {
                arr[index1] = arr.splice(index2, 1, arr[index1])[0];
                return arr;
            },
            handleHelp() {
                this.visible7 = true;
            },
            handleDrop() {
                this.isActive = !this.isActive;
            },
            drag(event, index) {
                this.startIndex = index;
            },
            drop(event, index) {
                this.images = this.swapArr(this.images, this.startIndex, index);
            },
            allowDrop(event) {
                event.preventDefault()
            },
            handlePaste(e) {
                let files = Array.prototype.slice.call(e.clipboardData.files);

                if (!files.length) return;

                files.forEach(file => {
                    this.uploadFiles(new File([file], this.getRandomName(file), {type: file.type}));
                });
            },
            formatText(val) {
                if (!val) {
                    return 'Enter value';
                }
                return val;
            },
            formatUrl(url) {
                if (url.charAt(url.length - 1) === '/') {
                    return url.substr(0, url.length - 1);
                }

                return url;
            },
            formatCallback(files) {
                switch (this.type) {
                    default:
                    case 'object':
                        return files;
                    case 'array':
                        let temp = [];
                        for (let i = 0; i < files.length; i++) {
                            temp[i] = files[i].url;
                        }
                        return temp;
                    case 'string':
                        return files[0].url;
                }
            },
            formatValue() {
                let arr;

                switch (Object.prototype.toString.call(this.currentValue)) {
                    case '[object String]':
                        if (this.currentValue) {
                            arr = [{
                                url: this.currentValue
                            }];
                        } else {
                            arr = [];
                        }
                        break;
                    case '[object Array]':
                        let type = Object.prototype.toString.call(this.currentValue[0]);
                        switch (type) {
                            case '[object String]':
                                arr = [];
                                for (let i = 0; i < this.currentValue.length; i++) {
                                    arr[i] = {};
                                    arr[i].url = this.currentValue[i];
                                }

                                break;
                            case '[object Object]':
                                arr = this.currentValue;
                                break;
                            case '[object Undefined]':
                                arr = [];
                                break;
                            default:
                                console.error('暂不支持数组和对象以外的类型', type);
                                arr = [];
                                break;
                        }
                        break;
                    case '[object Null]':
                        arr = [];
                        break;
                    default:
                        console.error('未知格式', Object.prototype.toString.call(this.currentValue));
                        break;
                }

                return arr;
            },
            formatImage(url) {
                return url + this.config.style;
            },
            handleOpen() {
                if (this.simple) {
                    this.$refs.upload.fileList = [];

                    document.getElementById('upload').click();
                } else {
                    this.visible = true;

                    this.isSmartSort = Boolean(Number(localStorage.getItem('isSmartSort')));

                    this.uploadList = [];
                    this.getFiles();
                }
            },
            handleSmartSortChange(val) {
                localStorage.setItem('isSmartSort', val ? 1 : 0);
            },
            getFiles() {
                let that = this;

                this.clear();

                if (!this.urls.index) {
                    return false;
                }

                LoadingBar.start();

                axios.get(this.urls.index, {params: this.query}).then(function (res) {
                    that.fileList = res.data.children.data;
                    that.query.total = res.data.children.total;
                    that.parentFolder = res.data.parent;

                    that.currentFolder = res.data.parent;

                    that.form.pid = res.data.parent[that.config.key];

                    LoadingBar.finish();
                }).catch(function (error) {
                    console.error(error);

                    LoadingBar.error();
                });
            },
            handleOpenFolder(folder) {
                clearTimeout(time);

                this.query.page = 1;
                this.query.pid = folder[this.config.key];

                this.query.keyword = null;

                this.currentFolder = folder;
                this.getFiles();
            },
            handleSelect(index) {

                let that = this;

                clearTimeout(time);


                time = setTimeout(function () {
                    // this.fileList[index]['checked'] = true;

                    that.fileList[index]['checked'] = !that.fileList[index]['checked'];
                    that.fileList[index]['order'] = ++that.order;
                    that.currentFile = that.fileList[index];
                }, 300);
            },
            handleUnSelect(index) {
                this.fileList[index]['checked'] = false;
            },
            handleAdd() {
                this.cloud.form.items.push({
                    name: null,
                    url: null,
                });
            },
            handleRemove(index) {
                this.cloud.form.items.splice(index, 1);
            },
            handleSlice(index) {
                switch (Object.prototype.toString.call(this.currentValue)) {
                    case '[object String]':
                        this.currentValue = '';
                        break;
                    case '[object Array]':
                        let type = Object.prototype.toString.call(this.currentValue[0]);
                        switch (type) {
                            case '[object String]':
                                this.currentValue.splice(index, 1);
                                break;
                            case '[object Object]':
                                this.currentValue.splice(index, 1);
                                break;
                            case '[object Undefined]':
                                this.currentValue = '';
                                break;
                            default:
                                this.currentValue = '';
                                break;
                        }
                        break;
                    case '[object Null]':
                        this.currentValue = '';
                        break;
                    default:
                        this.currentValue = '';
                        break;
                }

                event.preventDefault()
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
                };

                this.cloud.form = {
                    pid: null,
                    items: [
                        {
                            name: null,
                            url: null,
                        },
                    ],
                };
            },
            handleSetVisible(item, visible) {
                let form = {
                    id: item[this.config.key],
                    visible: visible,
                };

                axios.patch(this.urls.visible, form).then(res => {
                    if (res.data.status === 200) {
                        this.$Notice.success({
                            title: '设置成功',
                        });

                        this.getFiles();
                    } else {
                        this.$Notice.error({
                            title: '设置失败',
                            desc: res.data.msg
                        });
                    }
                }).catch(error => {
                    console.error(error);
                });
            },
            handleRename(item) {
                this.visible5 = true;
                this.rename.form.id = item.id;
                this.rename.form.name = item.name;
            },

            handleCopyLink(item) {
                this.$copyText(item.url).then(res => {
                    this.$Notice.success({
                        title: '链接复制成功',
                    });
                });
            },
            handleCopyMDLink(item) {
                let mdUrl = '![' + item.url.substring(0, item.url.indexOf('?') === -1 ? item.url.length : item.url.indexOf('?')).substr(item.url.lastIndexOf('/') + 1) + ']' + '(' + item.url + ')';

                this.$copyText(mdUrl).then(res => {
                    this.$Notice.success({
                        title: 'MarkDown 链接复制成功',
                    });
                });
            },
            handleDownload(item) {
                window.open(item.url);
            },
            handleDestroy(item) {
                let res = _([item]).map().filter().flatMap(this.config.key).value();

                let form = {
                    ids: res,
                };

                axios.delete(this.urls.delete, {data: form}).then(res => {
                    if (res.data.status === 200) {
                        this.$Notice.success({
                            title: '删除成功',
                            desc: ' '
                        });
                        this.getFiles();
                    } else {
                        this.$Notice.error({
                            title: '删除失败',
                            desc: res.data.msg
                        });
                    }
                }).catch(error => {
                    console.error(error);
                });
            },
            handleReview(val) {
                this.visible2 = true;
                this.currentImage = val;

                event.preventDefault()
            },
            handleUploadFolder() {
                document.getElementById('uploadFolder').click();
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
                if (this.simple) {
                    this.uploadFiles(new File([file], this.getRandomName(file), {type: file.type}));

                    return false;
                }

                if (this.config.random) {
                    this.uploadFiles(new File([file], this.getRandomName(file), {type: file.type}));

                    return false;
                } else {
                    this.checkFile(file);

                    return false;
                }
            },
            handleUpload() {
                this.visible4 = true;
                this.cloud.form.pid = this.form.pid;
            },
            handleSubmit() {
                this.$refs.cloud.validate((valid) => {
                    if (valid) {
                        axios.post(this.urls.remote, this.cloud.form).then(res => {
                            if (res.data.status === 200) {
                                Notice.success({
                                    title: '文件上传成功',
                                    desc: '',
                                });

                                this.visible4 = false;
                                this.getFiles();
                            } else {
                                Notice.error({
                                    title: '文件上传失败',
                                    desc: res.data.msg,
                                });
                            }
                        }).catch(error => {
                            console.error(error);
                        });
                    } else {
                        Notice.warning({
                            title: '表单参数有误',
                            desc: '请检查'
                        });
                    }
                });
            },
            getRandomName(file) {
                return Math.random().toString(36).substr(2) + new Date().getTime() + '.' + file.name.split('.')[1];
            },
            handleCancel() {
                this.objectList = [];
                this.visible4 = false;
            },
            handleCutOver(val) {
                let that = this;

                if (val) {
                    let index = _.findIndex(that.images, function (o) {
                        return o.url === that.currentImage.url;
                    });

                    index = !index ? this.images.length : index;

                    this.currentImage = this.images[index - 1];
                } else {
                    let index = _.findIndex(that.images, function (o) {
                        return o.url === that.currentImage.url;
                    });

                    index = (index + 1) === this.images.length ? -1 : index;

                    this.currentImage = this.images[index + 1];
                }
            },
            handleCloseReview() {
                this.visible2 = false;
            },
            handleCloseFolder() {
                this.visible3 = false;
            },
            checkFile(file) {
                let reg = /^[\u4E00-\u9FA5A-Za-z0-9_-]+$/;

                if (!reg.test(file.name.replace(/\s+/g, '').replace('.', ''))) {
                    Notice.warning({
                        title: '文件名包含特殊字符',
                        desc: '请修改' + file.name + '文件名',
                    });

                    Notice.info({
                        title: '文件名仅支持以下字符',
                        desc: '中英文,数字,下划线减号空格【_，-， 】',
                        duration: 0,
                    });

                    return false;
                }

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
                if (this.simple) {
                    this.headers.key = file.name;
                } else {
                    this.headers.key = this.parentFolder.path + '/' + file.name;
                }

                this.$refs.upload.post(file);
            },
            checkPolicy() {
                let that = this;
                if (localStorage.getItem(that.config.gateway + '_policy')) {
                    let policy = JSON.parse(localStorage.getItem(that.config.gateway + '_policy'));

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
                    that.headers = res.data.data;

                    let policy = {};
                    policy.value = that.headers;
                    policy.expire_at = moment().add(res.data.expire, 's');

                    localStorage.setItem(that.config.gateway + '_policy', JSON.stringify(policy));
                }).catch(function (error) {
                    console.error(error);
                });
            },
            simpleInsertImages(fileList) {
                let that = this;
                let files = [];

                fileList.forEach(function (current, index) {
                    let obj = {};
                    obj.url = that.urls.upload + current.name;

                    files.push(obj);
                });

                let res = this.formatReturn(files);

                this.currentValue = res;
                this.$emit('input', res);
                this.$emit('callback', res);
                this.dispatch('FormItem', 'on-form-change', res);
            },
            success(res, file, fileList) {
                if (this.simple) {
                    this.simpleInsertImages(fileList);

                    return false;
                }

                this.uploadList.push({
                    type: 'file',
                    checked: true,
                    url: this.formatUrl(this.urls.upload) + '/' + this.formatUrl(this.parentFolder.path) + '/' + file.name,
                });

                if (!!this.urls.return) {
                    let form = {};
                    form.filename = this.parentFolder.path + '/' + file.name;
                    form.size = file.size;

                    axios.post(this.urls.return, form).then(res => {
                        if (res.data.status === 200) {
                            this.$Notice.success({
                                title: '回调成功',
                                desc: 'client'
                            });
                        } else {
                            this.$Notice.error({
                                title: '回调失败',
                                desc: 'client'
                            });
                        }

                        this.getFiles();
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

                this.uploadList.forEach(function (current, index) {
                    let obj = {};
                    obj.url = current.url;

                    files.push(obj);
                });

                items.forEach(function (current, index) {
                    let obj = {};
                    obj.url = items[index].url;

                    files.push(obj);
                });

                if (this.isSmartSort) {
                    files = _.sortBy(files, [function (o) {
                        return o.url;
                    }]);
                }

                if (files.length > this.max) {
                    let msg = '图片最多选择' + this.max + '张,多选部分将被舍弃';
                    Notice.info({
                        title: '提示',
                        desc: msg
                    });
                    files = files.slice(0, this.max);
                }

                let res = this.formatReturn(files);

                this.currentValue = res;
                this.$emit('input', res);
                this.$emit('callback', res);
                this.dispatch('FormItem', 'on-form-change', res);

                this.order = 0;
                this.visible = false;
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
            handleCopy() {
                this.actionType = 'copy';

                let res = _(this.fileList).map().filter(function (o) {
                    return o.checked;
                }).flatMap(this.config.key).value();

                this.objectList = res;
            },
            handleCut() {
                this.actionType = 'cut';

                let res = _(this.fileList).map().filter(function (o) {
                    return o.checked;
                }).flatMap(this.config.key).value();

                this.objectList = res;
            },
            handleStick() {
                let form = {
                    action: this.actionType,
                    ids: this.objectList,
                    folder_id: this.currentFolder[this.config.key],
                };

                axios.post(this.urls.paste, form).then(res => {
                    if (res.status === 200) {
                        this.$Notice.success({
                            title: '操作成功',
                            desc: ' ',
                        });

                        this.objectList = [];

                        this.getFiles();
                    } else {
                        this.$Notice.error({
                            title: '操作失败',
                            desc: res.msg,
                        });
                    }
                });
            },
            handleSearch() {
                this.query.pid = null;
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
            handleRenameSubmit() {
                this.loading1 = true;

                this.$refs.renameForm.validate((valid) => {
                    if (valid) {
                        axios.put(this.urls.rename, this.rename.form).then(res => {
                            if (res.status === 200) {
                                this.$Notice.success({
                                    title: '操作成功',
                                    desc: ' ',
                                });

                                this.loading1 = false;
                                this.visible5 = false;
                                this.getFiles();
                            } else {
                                this.$Notice.error({
                                    title: '操作失败',
                                    desc: res.msg,
                                });
                            }
                        }).catch(error => {
                            console.error(error);
                        });
                    } else {
                        this.$Notice.warning({
                            title: '表单参数有误',
                            desc: '请检查',
                        });
                    }
                });
            },
            handleCreateFolder() {
                let that = this;

                this.loading2 = true;

                this.$refs.form.validate((valid) => {
                    if (valid) {
                        axios.post(this.urls.create, this.form).then(function (res) {
                            if (res.data.status === 200) {
                                Notice.success({
                                    title: '目录创建成功',
                                    desc: ' '
                                });
                                that.clean();

                                this.loading2 = false;

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

    .demo-active {
        display: none !important;
    }
</style>