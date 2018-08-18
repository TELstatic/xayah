<template>
    <div id="app">
        <div>


            <x-media
                    size="5"
                    v-model="images"
                    :debug="true"
                    url="//al8lshop.oss-cn-shanghai.aliyuncs.com/"
                    :max="5"
                    policyUrl=""
                    createDir=""
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
                images: [],
                msg: 'Welcome to Your Vue.js App'
            }
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
