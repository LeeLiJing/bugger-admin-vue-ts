// 开发模式
import store from 'store';

export const isDev: boolean = import.meta.env.MODE === 'development';

// 程序配置参数
export const app: any = store.get('__app__') || {
    name: '前端日志收集后台管理系统',
    conf: {
        showAMenu: false, // 是否显示一级菜单栏
        showRouteNav: true, // 是否显示路由导航栏
        showProcess: true, // 是否显示页面进程栏
        customMenu: false // 自定义菜单
    }
};
