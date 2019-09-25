window.Vue = require('vue');

window.moment = require('moment');
window.moment.locale('zh-cn');
window._ = require('lodash');
window.axios = require('axios');

import Vue from 'vue';
import App from './App.vue';

import iView from 'iview';

Vue.use(iView);


import xMedia from './lib/Media/index.vue';

Vue.component('xMedia', xMedia);

new Vue({
    el: '#app',
    render: h => h(App)
})
