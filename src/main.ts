import { createApp } from 'vue';
import App from './App.vue';
import { bootstrap } from '@/core';

// router
import router from '#/config/router';

// store
import store from '#/config/store';

// element-plus
import ElementPlus from 'element-plus';
import './assets/css/element-variables.scss';
import locale from 'element-plus/lib/locale/lang/zh-cn';

const app = createApp(App);
bootstrap(app)
    .then(() => {
        app.use(store).use(router).use(ElementPlus, { locale }).mount('#app');
    })
    .catch((err: string) => {
        console.error('启动失败', err);
    });
// @ts-ignore
window.__app__ = app;
