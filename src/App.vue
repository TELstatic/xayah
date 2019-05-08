<template>
    <div id="app">
        <Form ref="form" :model="form" :rules="rules" :label-width="100">
            <FormItem label="商品标题" prop="title">
                <Input type="text" v-model="form.title" placeholder="请输入商品标题"></Input>
            </FormItem>
            <FormItem label="商品图片" prop="images">
                <x-media v-model="form.images"
                         :urls="urls"
                         :max="5"
                         :config="config">
                </x-media>
            </FormItem>
            <div>
                <Row>
                    <Col span="24">
                        <FormItem style="height: 10px;" label="规格参数">
                            <Row :gutter="10">　
                                <Col span="2">
                                    型号
                                </Col>
                                <Col span="2">
                                    规格
                                </Col>
                                <Col span="2">
                                    价格
                                </Col>
                                <Col span="2">
                                    库存
                                </Col>
                                <Col span="3">
                                    货号
                                </Col>
                                <Col span="3">
                                    缩略图
                                </Col>
                                <Col span="3">
                                    操作
                                </Col>
                            </Row>
                        </FormItem>
                    </Col>
                </Row>
                <FormItem
                        v-for="(item, index) in form.items"
                        :key="index"
                        :label="'单品 ' + (index+1) ">
                    <Row :gutter="10">
                        <Col span="2">
                            <Poptip trigger="focus">
                                <Input type="text" v-model="item.module"
                                       placeholder="请输入型号"></Input>
                                <div slot="content">{{ formatText(item.module) }}</div>
                            </Poptip>
                        </Col>
                        <Col span="2">
                            <Poptip trigger="focus">
                                <Input type="text" v-model="item.standard"
                                       placeholder="请输入规格"></Input>
                                <div slot="content">{{ formatText(item.standard) }}</div>
                            </Poptip>
                        </Col>
                        <Col span="2">
                            <Poptip trigger="focus">
                                <Input type="text" v-model="item.price"
                                       placeholder="请输入价格"></Input>
                                <div slot="content">{{ formatText(item.price) }}</div>
                            </Poptip>
                        </Col>
                        <Col span="2">
                            <Poptip trigger="focus">
                                <Input type="text" v-model="item.reserve"
                                       placeholder="请输入库存"></Input>
                                <div slot="content">{{ formatText(item.reserve) }}</div>
                            </Poptip>
                        </Col>
                        <Col span="2">
                            <Poptip trigger="focus">
                                <Input type="text" v-model="item.sku"
                                       placeholder="请输入货号"></Input>
                                <div slot="content">{{ formatText(item.sku) }}</div>
                            </Poptip>
                        </Col>
                        <Col span="3">
                            <x-media v-model="item.images"
                                     :urls="urls"
                                     :max="1"
                                     type="string"
                                     :config="config">
                            </x-media>
                        </Col>
                        <Col span="3">
                            <Button :disabled="!index" @click="handleRemove(index)">删除</Button>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem>
                    <Row>
                        <Col span="12">
                            <Button type="dashed" long @click="handleAdd" icon="plus-round">新增单品</Button>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit">创建</Button>
                    <Button @click="handleReset" style="margin-left: 8px">重置</Button>
                </FormItem>
            </div>
        </Form>
    </div>
</template>

<script>

    export default {
        name: 'app',
        data() {
            return {
                visable: false,
                form: {
                    title: null,
                    images: [
                        {
                            url: '//delii.oss-cn-shanghai.aliyuncs.com/rakan/default/NJGDZQ/San%20Francisco.jpg'
                        }
                    ],
                    items: [
                        {
                            sku: null,
                            module: null,
                            standard: null,
                            price: null,
                            reserve: null,
                            images: '//delii.oss-cn-shanghai.aliyuncs.com/rakan/default/NJGDZQ/San%20Francisco.jpg',
                        }, {
                            sku: null,
                            module: null,
                            standard: null,
                            price: null,
                            reserve: null,
                            images: '//delii.oss-cn-shanghai.aliyuncs.com/rakan/default/NJGDZQ/San%20Francisco.jpg',
                        }
                    ]
                },
                urls: {
                    index: 'test.json',    //获取文件地址
                    upload: '//delii.oss-cn-shanghai.aliyuncs.com/',   //上传地址
                    create: null,   //创建目录地址
                    check: null,    //检查文件唯一
                    policy: '1',   //获取上传策略地址
                    delete: null,   //删除文件或目录地址
                    return: null,   //本地回调地址,
                    remote: null,
                },
                config: {
                    format: [
                        'jpg', 'png', 'jpeg'
                    ],     //上传类型限制
                    size: 0,        //上传大小限制
                    random: true,  //是否启用随机文件名
                    key: 'id',
                    style: '',
                    gateway: 'oss',
                },
                rules: {
                    title: {
                        required: true,
                        message: '请输入商品名称',
                        trigger: 'change'
                    },
                    images: {
                        required: true,
                        type: 'array',
                        message: '请选择商品图片',
                        trigger: 'change'
                    }
                },
                max: 1,
                random: true,
                id: null,
                images1: '',
                images2: [],
                images3: [
                    {
                        url: '//sds'
                    }
                ],

                msg: 'Welcome to Your Vue.js App'
            }
        },
        methods: {
            callback(val) {
                console.log(val)
            },
            handleCreate() {
                this.clear();
                this.visable = true;
            },
            handleSubmit() {
                console.log(this.form)

                this.$refs.form.validate((valid) => {
                    if (valid) {
                        console.log('Success!');
                    } else {
                        console.error('Fail!');
                    }
                });
            },
            handleReset() {
                console.log('重置')
                this.form = {
                    images: [],
                    items: [
                        {
                            sku: null,
                            module: null,
                            standard: null,
                            price: null,
                            reserve: null,
                            images: null,
                        }, {
                            sku: null,
                            module: null,
                            standard: null,
                            price: null,
                            reserve: null,
                            images: null,
                        }
                    ]
                };
            },
            clear() {
                this.form = {
                    id: null,
                    title: null,
                    sort: 0,
                    images: ''
                };
            },
            formatText(val) {
                if (!val) {
                    return 'Enter value';
                }
                return val;
            },
            handleRemove(index) {
                this.form.items.splice(index, 1);
            },
            handleAdd() {
                this.form.items.push({
                    sku: null,
                    module: null,
                    standard: null,
                    price: null,
                    reserve: null,
                    images: null,
                });
            },
        }
    }
</script>

<style>

</style>
