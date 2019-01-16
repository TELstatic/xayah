<template>
    <div id="app">
        <div>

            <Button type="success" @click="handleCreate">新增</Button>
            <Modal :transfer="false"
                   :z-index="1"
                   v-model="visable"
                   title="品牌">
                <Form ref="form" :model="form" :label-width="80">
                    <FormItem label="名称" prop="title">
                        <Input v-model="form.title" size="large" placeholder="请输入名称"></Input>
                    </FormItem>
                    <FormItem label="排序" prop="sort">
                        <Tooltip content="品牌排序,值越小越靠前" placement="right">
                            <Icon type="help-circled"></Icon>
                        </Tooltip>
                        <InputNumber :max="255" :min="0" v-model="form.sort"></InputNumber>
                    </FormItem>
                    <FormItem label="商标" prop="images">
                        <x-media v-model="form.images"
                                 :urls="urls"
                                 :max="1"
                                 type="string"
                                 :config="config"
                                 @callback="callback">
                        </x-media>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary" v-if="!form.id" @click="handleSubmit">保存</Button>
                    <Button type="warning" v-else @click="handleSubmit">更新</Button>
                    <Button @click="handleReset" style="margin-left: 8px">重置</Button>
                </div>
            </Modal>

        </div>
    </div>
</template>

<script>

    export default {
        name: 'app',
        data() {
            return {
                visable: false,
                form: {
                    id: null,
                    title: null,
                    sort: 0,
                    images: ''
                },
                urls: {
                    index: 'test.json',    //获取文件地址
                    upload: '',   //上传地址
                    create: null,   //创建目录地址
                    check: null,    //检查文件唯一
                    policy: null,   //获取上传策略地址
                    delete: null,   //删除文件或目录地址
                    return: null,   //本地回调地址
                },
                config: {
                    format: [
                        'jpg', 'png', 'jpeg'
                    ],     //上传类型限制
                    size: 0,        //上传大小限制
                    random: false,  //是否启用随机文件名
                    key: 'id',
                    style: ''
                },
                max: 1,
                random: true,
                id: null,
                images1: '//delii.oss-cn-shanghai.aliyuncs.com/rakan/default/NJGDZQ/test/Paris.jpg',
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
            },
            handleReset() {

            },
            clear() {
                this.form = {
                    id: null,
                    title: null,
                    sort: 0,
                    images: ''
                };
            }
        }
    }
</script>

<style>

</style>
