<template>
    <div id="app">
        <div>
            <x-media
                    :size="5120"
                    v-model="images"
                    :max="5"
                    upload_url=""
                    createDir="1"
                    deleteDir=""
                    deleteFile=""
                    checkFile=""
                    getFile=""
            ></x-media>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'app',
        data() {
            return {
                upload: true,   //上传功能
                root: true,  //回首页功能
                refresh: true, //刷新功能
                reset: true,//重置功
                back: true,   //返回功能
                insert: true,   //插入功能
                create: true,  //创建目录功能
                policy: true, //获取上传策略地址
                readonly: false,  //是否只读
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
