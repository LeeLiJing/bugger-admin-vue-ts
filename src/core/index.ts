import router from '#/config/router';
import store from '#/config/store';
import { useRefs } from '#/hook';
import { BaseService, Service, Permission } from './service';
import { SET_ROUTER, SET_MODULE, SET_SERVICE } from '#/setModules';

const bootstrap = async (app: any) => {
    SET_ROUTER();
    SET_SERVICE(app);
    SET_MODULE(app);

    router.$plugin?.addViews(store.getters.routes || []);
};

export { Service, Permission, BaseService, bootstrap, useRefs };
