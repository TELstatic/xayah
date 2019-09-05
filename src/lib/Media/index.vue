<template>
    <div class="xayah-display-inline">
        <div class="xayah-upload-list" v-for="(item,index) in images">
            <img :src="item.url" @dragstart='handleDragStart($event,index)' @drop='handleDrop($event,index)'
                 @dragover='handleDragOver($event,index)' @click="handleDropActive">
            <div class="xayah-upload-list-cover" v-bind:class="{ 'xayah-drag-active': isActive }"
                 @click="handleDropActive">
                <Icon type="ios-eye-outline" @click.native.stop="handleReview(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native.stop="handleSlice(index)"></Icon>
            </div>
        </div>
        <div class="xayah-display-inline" v-if="images.length<max">
            <div class="xayah-upload-list"
                 :id="id"
                 @click="handleChoose">
                <Icon type="ios-camera-outline" size="30"></Icon>
            </div>
        </div>
        <Modal
                v-model="visible"
                width="1300"
                :transfer="true"
                title="媒体库"
                id="xayah">
            <div slot="close">
                <Icon type="ios-help-circle-outline" class="xayah-help-icon" @click.stop="handleHelp">查看帮助</Icon>
                <Icon type="ios-close"></Icon>
            </div>

            <div @paste="handlePaste">
                <Row>
                    <Col span="24">
                        <Upload
                                v-if="urls.upload"
                                ref="upload"
                                class="xayah-display-inline"
                                :format="config.format"
                                :max-size="config.size"
                                :data="headers"
                                multiple
                                :on-format-error="handleFormatError"
                                :on-exceeded-size="handleExceededSize"
                                :before-upload="handleBeforeUpload"
                                :show-upload-list="false"
                                :on-success="handleSuccess"
                                :on-error="handleError"
                                :action="urls.upload">
                            <Button type="success" icon="ios-cloud-upload-outline" id="upload">上传</Button>
                        </Upload>

                        <Button type="success" icon="ios-folder-outline" @click="handleUploadFolder"
                                v-if="config.folder">目录
                        </Button>

                        <input type='file' id="uploadFolder" webkitdirectory
                               class="xayah-display-none"/>

                        <Button icon="ios-thunderstorm-outline" type="info" @click="handleUpload" v-if="urls.remote">
                            云上传
                        </Button>

                        <div v-if="urls.index" class="xayah-display-inline">
                            <Button icon="ios-home-outline" @click="handleHome" :disabled="!parentFolder.pid">
                                Root
                            </Button>
                            <Button icon="ios-refresh" @click="handleRefresh">
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

                            <ButtonGroup v-if="objectList.length && urls.paste">
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

                        <i-switch v-model="isSmartSort" size="large" @on-change="handleSmartSortChange"
                                  style="float: right;">
                            <span slot="open">智能</span>
                            <span slot="close">默认</span>
                        </i-switch>
                    </Col>
                </Row>
                <Divider/>
                <Row :gutter="24">
                    <Col span="18" style="min-height: 500px;">
                        <div class="xayah-object-list" @click="handleAddFolder" v-if="urls.create"
                             style="overflow:visible;">
                            <Icon type="ios-add" size="60" class="xayah-create-folder"></Icon>
                        </div>
                        <div class="xayah-object-list xayah-file-list" v-for="(item,index) in fileList">
                            <span v-if="item.size">
                                <Dropdown trigger="contextMenu">
                                    <span v-if="urls.visible" style="display: block;height: 98px;">
                                        <Badge :type="!item.visible ?'success':'info'" :text="!item.visible ?'私有':'公开'">
                                            <img :src="formatImage(item)" @click="handleSelect(index)"/>
                                        </Badge>
                                    </span>
                                    <span v-else style="display: block;height: 98px">
                                        <img :src="formatImage(item)" @click="handleSelect(index)"/>
                                    </span>
                                    <p style="position:relative;line-height: 20px">
                                        <span style="float: left;">
                                            <Checkbox v-model="item.checked"></Checkbox>
                                        </span>
                                        <span style="float: left;max-width: 70px;text-overflow:ellipsis;overflow-x:hidden;white-space: nowrap;">
                                            {{item.name}}
                                        </span>
                                    </p>
                                    <DropdownMenu slot="list">
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
                                          size="60" class="xayah-create-folder"></Icon>
                                    <DropdownMenu slot="list" v-if="urls.rename || urls.delete">
                                        <DropdownItem v-if="urls.rename"
                                                      @click.prevent.native="handleRename(item)">重命名</DropdownItem>
                                        <DropdownItem @click.prevent.native="handleDestroy(item)"
                                                      v-if="urls.delete" style="color: #ed4014;">删除</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                                <p>
                                 <span style="float: left;">
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
                <ButtonGroup style="float: left" v-if="config.resource">
                    <Button icon="logo-github" type="text" to="//github.com/telstatic/xayah" target="_blank">源码</Button>
                </ButtonGroup>

                <Button type="info" :disabled="insertStatus" @click="insertImages">
                    <slot>
                        插入图片
                    </slot>
                </Button>
            </div>
        </Modal>

        <Modal
                title="图片预览"
                v-model="imageReview.visible"
                width="60%"
                :transfer="false"
                :footerHide="true">
            <div style="text-align: center;width: 100%">
                <div style="height: 500px;width: 100%;margin: 0 auto;">
                    <img :src="imageReview.currentImage.url" style="max-width: 100%;max-height: 100%;"/>
                </div>

                <pre>{{getFilename(imageReview.currentImage.url)}}</pre>

                <ButtonGroup>
                    <Button type="default" @click="handleChangeImage(true)">
                        <Icon type="ios-arrow-back"/>
                        上一张
                    </Button>
                    <Button type="default" @click="handleChangeImage(false)">
                        上一张
                        <Icon type="ios-arrow-forward"/>
                    </Button>
                </ButtonGroup>
            </div>
        </Modal>

        <Modal
                title="创建目录"
                v-model="createFolder.visible"
                :transfer="true">
            <Form :model="createFolder.form" :rules="createFolder.rules" ref="createFolderForm"
                  @keydown.native.enter.prevent="handleSubmitFolder"
                  :label-width="80">
                <FormItem prop="name" label="目录名">
                    <Input type="text" v-model="createFolder.form.name" autofocus clearable
                           placeholder="请输入目录名称"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" :loading="createFolder.loading" @click="handleSubmitFolder">
                    创建
                </Button>
            </div>
        </Modal>

        <Modal
                title="重命名"
                v-model="rename.visible"
                :transfer="true">
            <Form :model="rename.form" :rules="rename.rules" ref="renameForm" :label-width="80"
                  @keydown.native.enter.prevent="handleRenameSubmit">
                <FormItem prop="name" label="重命名">
                    <Input type="text" v-model="rename.form.name" autofocus clearable placeholder="请输入目录名称"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" :loading="rename.loading" @click="handleRenameSubmit">
                    确定
                </Button>
            </div>
        </Modal>

        <Modal
                width="1000"
                v-model="cloud.visible"
                :transfer="true"
                @on-ok=""
                @on-cancel="">
            <p slot="header">
                异步上传
                <Tooltip content="远程异步上传图片,请确保文件唯一且有效" placement="right">
                    <Icon type="ios-help-circle-outline"></Icon>
                </Tooltip>
            </p>
            <Form :model="cloud.form" :rules="cloud.rules" ref="cloudForm"
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
                                <Button type="dashed" long @click="handleAdd" v-if="this.cloud.form.items.length < 10"
                                        icon="plus-round">
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
            </div>
        </Modal>

        <Modal
                v-model="help.visible"
                width="80%"
                title="帮助中心">
            <div style="width: 100%;">
                <vue-markdown :source="help.source"></vue-markdown>
            </div>
        </Modal>
    </div>
</template>
<script>
    let time = null;

    import {sortBy} from 'lodash';
    import help from '../../../HELP.md';
    import {Notice, LoadingBar} from 'iview';
    import VueMarkdown from 'vue-markdown'
    import API from '../../utils/api';

    function oneOf(value, validList) {
        for (let i = 0; i < validList.length; i++) {
            if (value === validList[i]) {
                return true;
            }
        }
        return false;
    }

    import Emitter from '../../mixins/emitter';

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
                    resource: false,    //是否显示源码链接
                    debug: false,       //是否开启调试功能
                    strict: false,      //是否开启严格模式 默认上传不检查 headers.key 前缀 开启后检查
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
                default: 'object',
            },
            simple: {   //简单上传模式
                type: String,
                default: '',
            },
            value: {
                default: '',
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
                },
            },
        },
        data() {
            return {
                visible: false,
                fileList: [],
                currentValue: this.value,
                query: {
                    pid: null,
                    page: 1,
                    per_page: 50,
                    total: 0,
                    keyword: null,
                },
                help: {
                    visible: false,
                    source: help,
                },
                isActive: false,
                isSmartSort: false,
                pageSizeOpts: [
                    50, 100, 150,
                ],
                currentFolder: {
                    path: null,
                },
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
                headers: {},
                uploadList: [],
                order: 0,
                startIndex: 0,
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
                imageReview: {
                    visible: false,
                    currentImage: {
                        url: null
                    }
                },
                cloud: {
                    visible: false,
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
                createFolder: {
                    visible: false,
                    loading: false,
                    form: {
                        name: null,
                        pid: null,
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
                },
            }
        },
        computed: {
            buttonStatus() {
                return !this.fileList.filter(this.filterChecked).length;
            },
            insertStatus() {
                let res = this.fileList.filter(this.filterFileChecked).length;

                return !res && !this.uploadList.length;
            },
            uploadStatus() {
                return !this.cloud.form.items.filter(this.filterUrl).length;
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
            value() {
                this.currentValue = this.value;
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
        beforeCreate() {
            localStorage.setItem('debug_mode', this.$options.propsData.config.debug);
        },
        mounted() {
            this.checkPolicy();

            this.initUploadFolder();

            //检查浏览器是否支持目录上传
            if (this.config.folder) {
                this.config.folder = this.isInputDirSupported();
            }
        },
        methods: {
            isInputDirSupported() {
                let tmpInput = document.createElement('input');

                if ('webkitdirectory' in tmpInput ||
                    'mozdirectory' in tmpInput ||
                    'odirectory' in tmpInput ||
                    'msdirectory' in tmpInput ||
                    'directory' in tmpInput) {
                    this.initUploadFolder();

                    return true;
                }

                return false;
            },
            initUploadFolder() {
                let that = this;

                document.getElementById('uploadFolder').addEventListener('change', function () {
                    if (!this.files.length) return;

                    for (let i = 0; i < this.files.length; i++) {
                        if (that.checkFileSize(this.files[i].size) && that.checkFileType(this.files[i].name)) {
                            that.uploadFiles(new File([this.files[i]], that.getRandomFilename(this.files[i]), {type: this.files[i].type}));
                        }
                    }
                }, false);
            },
            checkFileType(filename) {
                return oneOf(filename.split('.')[1], this.config.format);
            },
            checkFileSize(size) {
                return size > this.config.size;
            },
            swapArr(arr, start, end) {
                arr[start] = arr.splice(end, 1, arr[start])[0];

                return arr;
            },
            handleHelp() {
                this.help.visible = true;
            },
            handleDropActive() {
                this.isActive = !this.isActive;
            },
            handleDragStart(event, index) {
                this.startIndex = index;
            },
            handleDrop(event, index) {
                this.images = this.swapArr(this.images, this.startIndex, index);
                event.preventDefault();
            },
            handleDragOver(event) {
                event.preventDefault();
            },
            handlePaste(e) {
                let files = Array.prototype.slice.call(e.clipboardData.files);

                if (!files.length) return;

                files.forEach(file => {
                    this.uploadFiles(new File([file], this.getRandomFilename(file), {type: file.type}));
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
            formatImage(item) {
                if (item.url) {
                    return item.url + this.config.style;
                }

                return this.formatUrl(item.host) + "/" + item.path + this.config.style;
            },
            handleChoose() {
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
                this.clean();

                if (!this.urls.index) {
                    return false;
                }

                if (this.simple) {
                    return false;
                }

                API.getFiles(this.urls.index, this.query).then(res => {
                    this.fileList = res.children.data;
                    this.query.total = res.children.total;
                    this.parentFolder = res.parent;

                    this.currentFolder = res.parent;

                    this.createFolder.form.pid = res.parent[this.config.key];

                    if (this.config.strict) {
                        this.checkPolicy();
                    }
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
                    that.fileList[index]['checked'] = !that.fileList[index]['checked'];
                    that.fileList[index]['order'] = ++that.order;
                    that.currentFile = that.fileList[index];
                }, 300);
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
                    case '[object Array]':
                        let type = Object.prototype.toString.call(this.currentValue[0]);
                        switch (type) {
                            case '[object String]':
                            case '[object Object]':
                                this.currentValue.splice(index, 1);
                                break;
                            default:
                                this.currentValue = '';
                                break;
                        }
                        break;
                    default:
                        this.currentValue = '';
                        break;
                }

                event.preventDefault()
            },
            handleAddFolder() {
                this.$refs.createFolderForm.resetFields();

                this.createFolder.visible = true;
            },
            clean() {
                this.createFolder.visible = false;
                this.rename.visible = false;
                this.cloud.visible = false;

                this.createFolder.form.name = null;

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

                API.patchFileVisible(this.urls.visible, form).then(res => {
                    if (res.status === 200) {
                        this.$Notice.success({
                            title: '设置成功',
                        });

                        this.getFiles();
                    } else {
                        this.$Notice.error({
                            title: '设置失败',
                            desc: res.msg
                        });
                    }
                }).catch(error => {
                    console.error(error);
                });
            },
            handleRename(item) {
                this.rename.visible = true;
                this.rename.form.id = item.id;
                this.rename.form.name = item.name;
            },
            handleCopyLink(item) {
                let url;

                if (item.url) {
                    url = item.url;
                } else {
                    url = this.formatUrl(item.host) + "/" + item.path;
                }

                this.copy(url, '链接复制成功');
            },
            copy(val, msg) {
                const input = document.createElement('input');
                input.setAttribute('readonly', 'readonly');
                input.setAttribute('value', val);
                document.body.appendChild(input);
                input.setSelectionRange(0, 9999);
                input.select();

                if (document.execCommand('copy')) {
                    this.$Notice.success({
                        title: msg,
                    });
                }

                document.body.removeChild(input);
            },
            getFilename(filename) {
                if (filename) {
                    return filename.substring(0, filename.indexOf('?') === -1 ? filename.length : filename.indexOf('?')).substr(filename.lastIndexOf('/') + 1);
                }

                return null;
            },
            handleCopyMDLink(item) {
                let url;

                if (item.url) {
                    url = item.url;
                } else {
                    url = this.formatUrl(item.host) + "/" + item.path;
                }

                let mdUrl = '![' + url.substring(0, url.indexOf('?') === -1 ? url.length : url.indexOf('?')).substr(url.lastIndexOf('/') + 1) + ']' + '(' + url + ')';

                this.copy(mdUrl, 'MarkDown 链接复制成功');
            },
            handleDownload(item) {
                let url;

                if (item.url) {
                    url = item.url;
                } else {
                    url = this.formatUrl(item.host) + "/" + item.path;
                }

                window.open(url);
            },
            handleDestroy(item) {
                let form = {
                    ids: [item[this.config.key]],
                };

                API.delFiles(this.urls.delete, form).then(res => {
                    if (res.status === 200) {
                        this.$Notice.success({
                            title: '删除成功',
                            desc: ' '
                        });
                        this.getFiles();
                    } else {
                        this.$Notice.error({
                            title: '删除失败',
                            desc: res.msg,
                        });
                    }
                }).catch(error => {
                    console.error(error);
                });
            },
            handleReview(val) {
                this.imageReview.visible = true;
                this.imageReview.currentImage = val;

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
            handleExceededSize() {
                Notice.warning({
                    title: '文件大小错误',
                    desc: '请上传 ' + Math.ceil(this.config.size / 1024) + 'M 内文件'
                });
            },
            handleBeforeUpload(file) {
                let key;

                if (this.simple) {
                    key = this.config.gateway + '_' + this.simple + '_policy';
                } else {
                    if (this.config.strict) {
                        key = this.config.gateway + '_' + this.currentFolder.path + '_policy';
                        let policy = JSON.parse(localStorage.getItem(key));

                        this.headers = policy.value;
                    } else {
                        key = this.config.gateway + '_policy';
                    }
                }

                let that = this;
                let policy = JSON.parse(localStorage.getItem(key));

                this.headers = policy.value;

                if (this.simple) {
                    setTimeout(function () {
                        that.uploadFiles(new File([file], that.getRandomFilename(file), {type: file.type}));
                    }, 1000);

                    return false;
                }

                if (this.config.random) {
                    this.uploadFiles(new File([file], this.getRandomFilename(file), {type: file.type}));

                    return false;
                } else {
                    this.checkFile(file);

                    return false;
                }
            },
            handleUpload() {
                this.cloud.visible = true;
                this.cloud.form.pid = this.createFolder.form.pid;
            },
            handleSubmit() {
                this.$refs.cloudForm.validate((valid) => {
                    if (valid) {
                        API.getFilesByServer(this.urls.remote, this.cloud.form).then(res => {
                            if (res.status === 200) {
                                Notice.success({
                                    title: '文件上传成功',
                                    desc: '',
                                });

                                this.getFiles();
                            } else {
                                Notice.error({
                                    title: '文件上传失败',
                                    desc: res.msg,
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
            getRandomFilename(file) {
                return Math.random().toString(36).substr(2) + new Date().getTime() + '.' + file.name.split('.')[1];
            },
            handleCancel() {
                this.objectList = [];
            },
            handleChangeImage(flag) {
                let index = this.images.findIndex((o) => {
                    return o.url === this.imageReview.currentImage.url
                });

                if (flag) {
                    index = !index ? this.images.length : index;

                    this.imageReview.currentImage = this.images[index - 1];
                } else {
                    index = (index + 1) === this.images.length ? -1 : index;

                    this.imageReview.currentImage = this.images[index + 1];
                }
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

                let form = {
                    path: this.parentFolder.path + '/' + file.name,
                };

                if (this.urls.check) {
                    API.checkFile(this.urls.check, form).then(res => {
                        console.log(res.status)
                        if (res.status == 200) {
                            this.uploadFiles(file);
                        } else {
                            Notice.warning({
                                title: res.msg,
                                desc: '请修改【' + file.name + '】文件名',
                            });
                        }
                    });
                } else {
                    API.headFile(this.formatUrl(this.urls.upload) + '/' + form.path).then(res => {
                        Notice.warning({
                            title: '文件已存在',
                            desc: '请修改【' + file.name + '】文件名'
                        });
                    }).catch(error => {
                        this.uploadFiles(file);
                    });
                }
            },
            uploadFiles(file) {
                if (this.simple) {
                    this.headers.key = this.formatUrl(this.simple) + '/' + file.name;
                } else {
                    this.headers.key = this.parentFolder.path + '/' + file.name;
                }

                this.$refs.upload.post(file);
            },
            checkPolicy() {
                let key;

                if (this.config.strict) {
                    key = this.config.gateway + '_' + this.currentFolder.path + '_policy';
                } else {
                    key = this.config.gateway + '_policy';
                }

                if (localStorage.getItem(key)) {
                    let policy = JSON.parse(localStorage.getItem(key));

                    if (new Date() > new Date(policy.expire_at)) {
                        this.getPolicy();
                    }
                } else {
                    this.getPolicy();
                }
            },
            getPolicy() {
                if (!this.urls.policy) {
                    this.$Notice.info({
                        title: '请填写获取策略地址',
                    });

                    return false;
                }

                let form = {
                    path: this.currentFolder.path,
                };

                if (this.simple) {
                    form.path = this.simple;
                }

                API.getPolicy(this.urls.policy, form).then(res => {
                    let policy = {};
                    policy.value = res.data;
                    policy.expire_at = new Date(new Date().getTime() + res.expire * 1000);

                    if (this.simple) {
                        localStorage.setItem(this.config.gateway + '_' + this.simple + '_policy', JSON.stringify(policy));
                    } else {
                        if (this.config.strict) {
                            localStorage.setItem(this.config.gateway + '_' + this.currentFolder.path + '_policy', JSON.stringify(policy));
                        } else {
                            localStorage.setItem(this.config.gateway + '_policy', JSON.stringify(policy));
                        }
                    }
                }).catch(error => {
                    console.error(error);
                });
            },
            simpleInsertImages(fileList) {
                let that = this;
                let files = [];

                fileList.forEach(function (current) {
                    let obj = {};
                    obj.url = that.formatUrl(that.urls.upload) + '/' + that.formatUrl(that.simple) +'/'+ current.name;

                    files.push(obj);
                });

                let res = this.formatReturn(files);

                this.currentValue = res;
                this.$emit('input', res);
                this.$emit('callback', res);
                this.dispatch('FormItem', 'on-form-change', res);
            },
            handleSuccess(res, file, fileList) {
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
                    let form = {
                        filename: this.parentFolder.path + '/' + file.name,
                        size: file.size,
                    };

                    API.postFile(this.urls.return, form).then(res => {
                        if (res.status === 200) {
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
                    if (res.status == 200) {
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
            handleError(err) {
                console.error(err);

                Notice.error({
                    title: '上传失败',
                    desc: '请联系管理员'
                });
            },
            orderBy(field) {
                return function (a, b) {
                    return a[field] - b[field];
                }
            },
            insertImages() {
                let that = this;
                //过滤目录
                let items = this.fileList.filter(this.filterFileChecked).sort(this.orderBy('order'));

                let files = [];

                this.uploadList.forEach(function (current) {
                    let obj = {};

                    if (current.url) {
                        obj.url = current.url;
                    } else {
                        obj.url = that.formatUrl(current.host) + '/' + current.path;
                    }

                    files.push(obj);
                });

                items.forEach(function (current) {
                    let obj = {};

                    if (current.url) {
                        obj.url = current.url;
                    } else {
                        obj.url = that.formatUrl(current.host) + '/' + current.path;
                    }

                    files.push(obj);
                });

                if (this.isSmartSort) {
                    files = sortBy(files, [function (o) {
                        return o.url;
                    }]);
                }

                if (files.length > this.max) {
                    Notice.info({
                        title: '提示',
                        desc: '图片最多选择' + this.max + '张,多选部分将被舍弃',
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

                this.objectList = this.fileList.filter(this.filterChecked).flatMap(this.flatMapKey);
            },
            flatMapKey(item) {
                return item[this.config.key];
            },
            filterChecked(item) {
                return item.checked;
            },
            filterFileChecked(item) {
                return item.checked && item.type === 'file';
            },
            filterUrl(item) {
                return item.url;
            },
            handleCut() {
                this.actionType = 'cut';

                this.objectList = this.fileList.filter(this.filterChecked).flatMap(this.flatMapKey);
            },
            handleStick() {
                let form = {
                    action: this.actionType,
                    ids: this.objectList,
                    folder_id: this.currentFolder[this.config.key],
                };

                API.postFiles(this.urls.paste, form).then(res => {
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
            handleRefresh() {
                this.getFiles();
                Notice.success({
                    title: '刷新成功',
                    desc: ' '
                });
            },
            handleDelete() {
                let res = this.fileList.filter(this.filterChecked).flatMap(this.flatMapKey);

                let form = {
                    ids: res,
                };

                API.delFiles(this.urls.delete, form).then(res => {
                    if (res.status === 200) {
                        Notice.success({
                            title: '删除成功',
                            desc: ' '
                        });
                        this.getFiles();
                    } else {
                        Notice.error({
                            title: '删除失败',
                            desc: res.msg,
                        });
                    }
                }).catch(error => {
                    console.error(error);
                });
            },
            handleReset() {
                this.fileList.map(function (o) {
                    o.checked = false;
                    o.order = 0;
                });
            },
            handleRenameSubmit() {
                this.rename.loading = true;

                this.$refs.renameForm.validate((valid) => {
                    if (valid) {
                        API.putFileName(this.urls.rename, this.rename.form).then(res => {
                            if (res.status === 200) {
                                this.$Notice.success({
                                    title: '操作成功',
                                    desc: ' ',
                                });

                                this.getFiles();
                            } else {
                                this.$Notice.error({
                                    title: '操作失败',
                                    desc: res.msg,
                                });
                            }

                            this.rename.loading = false;
                        }).catch(error => {
                            this.rename.loading = false;
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
            handleSubmitFolder() {
                this.createFolder.loading = true;

                this.$refs.createFolderForm.validate((valid) => {
                    if (valid) {
                        API.postFolder(this.urls.create, this.createFolder.form).then(res => {
                            if (res.status === 200) {
                                Notice.success({
                                    title: '目录创建成功',
                                    desc: ' '
                                });

                                this.getFiles();
                            } else {
                                Notice.error({
                                    title: '目录创建失败',
                                    desc: res.msg,
                                });
                            }

                            this.createFolder.loading = false;
                        }).catch(error => {
                            this.createFolder.loading = false;
                            console.error(error);
                        });
                    } else {
                        this.createFolder.loading = false;

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

    .xayah-upload-list {
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

    .xayah-object-list {
        display: inline-block;
        width: 100px;
        height: 100px;
        text-align: center;
        border: 1px solid transparent;
        border-radius: 4px;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
        margin-right: 4px;
    }

    .xayah-upload-list img {
        width: 100%;
        height: 100%;
    }

    .xayah-object-list img {
        width: 100%;
        height: 98px;
    }

    .xayah-upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
    }

    .xayah-upload-list:hover .xayah-upload-list-cover {
        display: block;
    }

    .xayah-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }

    .xayah-drag-active {
        display: none !important;
    }

    .xayah-help-icon {
        font-size: 20px;
        color: #999;
        -webkit-transition: color .2s ease;
        transition: color .2s ease;
        position: relative;
        top: 1px;
    }

    .xayah-display-inline {
        display: inline;
    }

    .xayah-display-none {
        display: none;
    }

    .xayah-create-folder {
        height: 100px;
        width: 100px;
        line-height: 100px;
    }

    .xayah-file-list {
        overflow: visible;
        vertical-align: top;
        margin-bottom: 30px;
    }

</style>