import storage from '#/utils/storage';
import store from '#/config/store';
import { Token } from '@/modules/base/types';
import { href } from '#/utils';

const userStore = {
    state: {
        // 授权标识
        token: storage.get('token') || null,
        // 用户信息
        info: storage.get('userInfo') || {}
    },
    mutations: {
        // 设置用户信息
        SET_USERINFO(state: any, val: any) {
            state.info = val;
            storage.set('userInfo', val);
        },
        // 设置授权标识
        SET_TOKEN(state: any, { token, expire, refreshToken, refreshExpire }: Token) {
            // 请求的唯一标识
            state.token = token;
            storage.set('token', token, expire);

            // 刷新token的唯一标识
            storage.set('refreshToken', refreshToken, refreshExpire);
        },
        // 移除标识
        CLEAR_TOKEN(state: any) {
            state.token = null;
            storage.remove('token');
            storage.remove('refreshToken');
        },
        // 移除用户信息
        CLEAR_USER(state: any) {
            state.info = {};
            storage.remove('userInfo');
        }
    },
    getters: {
        userInfo: (state: any) => state.info,
        token: (state: any) => state.token
    },
    actions: {
        // 用户登录
        userSignIn({ commit }: any, form: any): Promise<any> {
            return store.service.authInterface.userLogin(form)
                .then((res: any) => {
                    commit('SET_TOKEN', res.data);
                    return res;
                });
        },
        // 用户信息
        userInfo({ commit }: any): Promise<any> {
            return store.service.commonInterface.userInfo().then((res: any) => {
                commit('SET_USERINFO', res.data);
                return res;
            });
        },

        // 刷新token
        refreshToken({ commit, dispatch }: any) {
            return new Promise((resolve, reject) => {
                store.service.authInterface
                    .refreshToken(storage.get('refreshToken'))
                    .then((res: any) => {
                        commit('SET_TOKEN', res);
                        resolve(res.token);
                    })
                    .catch((err: Error) => {
                        dispatch('userRemove');
                        href('/login');
                        reject(err);
                    });
            });
        },
        // 用户退出
        async userLogout({ dispatch }: any): Promise<any> {
            await store.service.common.userLogout();
            return dispatch('userRemove');
        },
        // 用户移除
        userRemove({ commit }: any) {
            commit('CLEAR_USER');
            commit('CLEAR_TOKEN');
            commit('RESET_PROCESS');
            commit('SET_MENU_GROUP', []);
            commit('SET_VIEW_ROUTES', []);
            commit('SET_MENU_LIST', 0);
        }
    }
};

export default userStore;
