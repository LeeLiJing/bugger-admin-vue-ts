import allModules from '@/modules';
import store from '#/config/store';
import { deepMerge, isArray, isFunction, isObject, isString } from '#/utils';
import router from '#/config/router';

// 模块列表
const modules: any[] = [];

const install = (app: any, mod: any) => {
    const { store: _store, components, service, directives, pages, views, name } = mod;

    try {
        // 注册状态管理模块
        if (_store) {
            for (const i in _store) {
                store.registerModule(`${name}-${i}`, _store[i]);
            }
        }

        // 注册组件
        if (components) {
            for (const i in components) {
                if (components[i].name) {
                    app.component(components[i].name, components[i]);
                } else {
                    console.error(`组件 ${i} 缺少 name 参数`);
                }
            }
        }

        // 注册请求服务
        if (service) {
            deepMerge(store.service, service);
        }

        // 注册指令
        if (directives) {
            for (const i in directives) {
                app.directive(i, directives[i]);
            }
        }

        // 注册页面
        if (pages) {
            pages.forEach((e: any) => {
                router.addRoute(e);
            });
        }

        // 注册视图
        if (views) {
            views.forEach((e: any) => {
                if (!e.meta) {
                    e.meta = {};
                }

                if (e.path) {
                    router.$plugin?.addViews([ e ]);
                } else {
                    console.error(`[${name}-views]：缺少 path 参数`);
                }
            });
        }
    } catch (e) {
        console.error(`模块 ${name} 异常`, e);
    }
};


export default (app: any) => {
    const files = import.meta.globEager('/src/modules/*/index.ts');
    // 本地模块
    const local: any[] = [];

    for (const item in files) {
        const [ , , , name, , error ] = item.split('/');
        if (!error) {
            local.push({
                name,
                value: files[item].default
            });
        }
    }

    // 解析模块
    allModules.modules.map((e: any) => {
        if (!e) return null;
        let mod: any = null;

        //解析格式
        if (isString(e)) {
            mod = {
                name: e
            };
        } else if (isObject(e)) {
            mod = e;
        } else if (isArray(e)) {
            mod = {
                name: e[0],
                value: e[1],
                options: e[2]
            };
        } else {
            console.error(e, '格式错误');
        }

        // 匹配本地模块
        if (!mod.value) {
            const item = local.find((m: any) => m.name === mod.name);
            if (item) {
                mod.value = item.value;
            } else {
                console.error(mod.name, '不是一个有效的模块');
            }
        }

        // 兼容其他 vue 插件模式
        if (mod.value) {
            if (isFunction(mod.value.install)) {
                mod.value = mod.value.install(app, mod.options);
            }
        }

        // 是否开启
        if (mod.options && mod.options.enable === false) {
            return null;
        }

        if (mod) {
            mod = {
                name: mod.name,
                options: mod.options || {},
                ...mod.value
            };

            modules.push(mod);
            install(app, mod);
        }
    });
}
