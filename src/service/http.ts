import axios from 'axios';
import Nprogress from 'nprogress';
import store from '#/config/store';
import { isDev } from '#/config';
import storage from '#/utils/storage';
import { href } from '#/utils';
import NProgress from 'nprogress';

axios.defaults.baseURL = '/api';
axios.defaults.timeout = 30000;
axios.defaults.withCredentials = true;


Nprogress.configure({ showSpinner: false });

// 请求队列
let requestList: Array<Function> = [];

// token 是否刷新中
let isRefreshing: boolean = false;

// 忽略规则
const ignore = {
    Nprogress: [ '/sys/info/record' ],
    token: [ '/login', '/captcha' ]
};

// Request
axios.interceptors.request.use((config: any) => {
    const token = store.getters.token || '';
    if (config.url) {
        if (!ignore.token.some((e: string) => config.url.includes(e))) {
            config.headers['Authorization'] = token;
        }

        if (!ignore.Nprogress.some((e: string) => config.url.includes(e))) {
            Nprogress.start();
        }
    }

    // 请求信息
    if (!isDev) {
        console.group(config.url);
        console.log('method:', config.method);
        console.table('data:', config.method == 'get' ? config.params : config.data);
        console.groupEnd();
    }

    // 验证 token
    if (token) {
        if (config.url.includes('refreshToken')) {
            return config;
        }

        // 判断token是否过期
        if (storage.isExpired('token')) {
            // 判断refreshToken是否过期
            if (storage.isExpired('refreshToken')) {
                store.dispatch('userRemove');
                return href('/login');
            }

            // 是否在刷新中
            if (!isRefreshing) {
                isRefreshing = true;

                store.dispatch('refreshToken').then((token: string) => {
                    requestList.forEach((cb) => cb(token));
                    requestList = [];
                    isRefreshing = false;
                });
            }

            return new Promise(resolve => {
                // 继续请求
                requestList.push((token: string) => {
                    // 重新设置 token
                    config.headers['Authorization'] = token;
                    resolve(config);
                });
            });
        }
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Response
axios.interceptors.response.use(
    (res) => {
        NProgress.done();
        const { code, data, message } = res.data;

        if (!res.data) {
            return res;
        }

        switch (code) {
            case 200:
                return res.data;
            default:
                return Promise.reject(message);
        }
    },
    async (error) => {
        NProgress.done();

        if (error.response) {
            const { status, config } = error.response;

            switch (status) {
                case 401:
                    await store.dispatch('userRemove');
                    href('/login');
                    break;

                case 403:
                    if (isDev) {
                        ElMessage.error(`${config.url} 无权限访问！！`);
                    } else {
                        href('/403');
                    }
                    break;

                case 404:
                    break;

                case 500:
                    if (!isDev) {
                        href('/500');
                    }
                    break;

                case 502:
                    if (isDev) {
                        ElMessage.error(`${config.url} 服务异常！！`);
                    } else {
                        href('/502');
                    }
                    break;

                default:
                    console.error(status, config.url);
            }
        }

        return Promise.reject(error.message);
    }
);

export default axios;
