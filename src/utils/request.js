import iView from 'iview';
import axios from 'axios';

let instance = axios.create();

let accessToken = document.head.querySelector('meta[name="access-token"]');

if (accessToken) {
    instance.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken.content;
} else {
    if (localStorage.getItem('access-token')) {
        instance.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access-token');
    } else {
        console.error('access token not found: https://kodos.cn/#/?id=其他');
    }
}

instance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

instance.defaults.baseURL = '/';
instance.defaults.timeout = 10000;

//请求拦截器
instance.interceptors.request.use(function (config) {
    iView.LoadingBar.start();

    if (eval(localStorage.getItem('debug_mode'))) {
        capsule();

        console.group(`%c${config.method.toUpperCase()}`, 'color:blue;font-size:18px;', config.url);

        console.log('Params::', config.params);
        console.log('Data::', config.data);
        console.groupEnd();
    }

    return config;
}, function (error) {
    capsule('red');

    console.group('Error::');
    console.error(error);
    console.groupEnd();

    return Promise.reject(error);
});

//响应拦截器
instance.interceptors.response.use(function (response) {
    iView.LoadingBar.finish();

    if (eval(localStorage.getItem('debug_mode'))) {
        capsule('green', 'response');

        console.group('%cSuccess', 'color:green;font-size:18px;', response.config.url);
        console.log('Code::', response.status);
        console.log('Data::', response.data);
        console.groupEnd();
    }

    return response;
}, function (error) {
    capsule('red', 'response');

    console.group('Error::');
    console.error(error);
    console.groupEnd();

    iView.LoadingBar.error();

    return Promise.reject(error);
});

function capsule(color = 'blue', log = 'request') {
    console.log(
        `%c xayah %c ${log} %c`,
        'background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;',
        `background:${color}; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;`,
        'background:transparent'
    );
}

export default {
    get(url, param) {
        return new Promise((resolve, reject) => {
            instance({
                method: 'get',
                url,
                params: param,
            }).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err);
            });
        });
    },
    head(url, param) {
        return new Promise((resolve, reject) => {
            instance({
                method: 'head',
                url,
                params: param,
            }).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err);
            });
        });
    },
    post(url, param) {
        return new Promise((resolve, reject) => {
            instance({
                method: 'post',
                url,
                data: param,
            }).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err);
            });
        });
    },
    put(url, param) {
        return new Promise((resolve, reject) => {
            instance({
                method: 'put',
                url,
                data: param,
            }).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err);
            });
        });
    },
    patch(url, param) {
        return new Promise((resolve, reject) => {
            instance({
                method: 'patch',
                url,
                data: param,
            }).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err);
            });
        });
    },
    del(url, param) {
        return new Promise((resolve, reject) => {
            instance({
                method: 'delete',
                url,
                data: param,
            }).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err);
            });
        });
    },
};
