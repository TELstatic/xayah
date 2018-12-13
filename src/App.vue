<template>
    <div id="app">
        <div>
            <x-media
                    v-model="images"
                    :urls="urls"
                    :config="config"
            ></x-media>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'app',
        data() {
            return {
                urls: {
                    index: null,    //获取文件地址
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
                    max: 1,         //插入图片限制
                    id: null,       //dom ID
                },
                max: 1,
                random: true,
                id: null,
                images: [],
                msg: 'Welcome to Your Vue.js App'
            }
        }
    }
</script>

<style>

</style>
