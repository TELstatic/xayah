<template>
    <div id="app">
        <div>
            <x-media v-model="images3"
                     :urls="urls"
                     :max="1"
                     type="object"
                     :config="config"
                     @callback="callback">
            </x-media>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'app',
        data() {
            return {
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
                images1: '',
                images2: [],
                images3: [
                    {
                        url:'//sds'
                    }
                ],
                msg: 'Welcome to Your Vue.js App'
            }
        },
        methods: {
            callback(val) {
                console.log(val)
            }
        }
    }
</script>

<style>

</style>
