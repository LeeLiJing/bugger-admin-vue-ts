import router, { ignore } from '#/config/router';
import store from '#/config/store';
import { cloneDeep } from '#/utils';
import storage from '#/utils/storage';
import { ElMessage } from 'element-plus';

const views = import.meta.globEager('/src/**/views/**/*.vue');

for (const item in views) {
    views[item.slice(5)] = views[item];
    delete views[item];
}
export default function () {
    router.$plugin = {
        addViews(list: Array<any>, options?: any) {
            if (!options) {
                options = {};
            }
            // parse route config
            list.forEach((e: any) => {
                const d: any = cloneDeep(e);

                // avoid router repeat
                d.name = d.router;
                if (!d.component) {
                    const url = d.viewPath;
                    if (!url) {
                        if (/^(http[s]?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i.test(url)) {
                            d.meta.iframeUrl = url;
                            d.component = () => import('#/pages/iframe/index.vue');
                        } else {
                            d.component = () => Promise.resolve(views[url]);
                        }
                    } else {
                        d.redirect = '/404';
                    }
                }

                // Batch add route
                router.addRoute('index', d);
            });
        }
    };

    router.beforeEach((to: any, from: any, next: any) => {
        const { token } = store.getters;
        if (token) {
            if (to.path.indexOf('/login') === 0) {
                // 登录成功且token未过期，回到首页
                if (!storage.isExpired('token')) {
                    return next('/');
                } else {
                    // 添加路由进程
                    store.commit('ADD_PROCESS', {
                        keepAlive: to.meta?.keepAlive,
                        label: to.meta?.label || to.name,
                        value: to.fullPath
                    });
                }
            }
        } else {
            if (!ignore.token.some((e: string) => to.path.indexOf(e) === 0)) {
                return next('/login');
            }
        }
        next();
    });

    let lock = false;

    router.onError((err: any) => {
        if (!lock) {
            if (err.code === 'MODULE_NOT_FOUND') {
                console.error(err.ELMessage.replace('Cannot find module ', ''), '路由组件不存在');

                ElMessage.error('路由组件路径错误');
            } else {
                console.error(err);
            }

            setTimeout(() => {
                lock = false;
            }, 0);
        }
    });
}
