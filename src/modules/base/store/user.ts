import storage from '#/utils/storage';
import store from '#/config/store';
import { Token } from '@/modules/base/types';

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
                    console.log(res);
                    commit('SET_TOKEN', res.data);
                    return res;
                });
        },
        // 用户信息
        userInfo({ commit }: any): Promise<any> {
            return store.service.commonInterface.userInfo().then((res: any) => {
                console.log(res);
                commit('SET_USERINFO', res.data);
                return res;
            });
        }
    }
};

export default userStore;
