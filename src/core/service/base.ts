import $http from '../../service/http';

export default class BaseService {
    permission: any;
    namespace: any;
    url: any;

    constructor() {
        const crud: any = {
            page: 'page',
            list: 'list',
            info: 'info',
            add: 'add',
            delete: 'delete',
            update: 'update'
        };

        if (!this.permission) this.permission = {};

        for (const i in crud) {
            if (this.namespace) {
                this.permission[i] = this.namespace.replace(/\//g, ':') + ':' + crud[i];
            } else {
                this.permission[i] = crud[i];
            }
        }
    }

    request(options: any = {}) {
        if (!options.params) options.params = {};

        let ns = '';

        // 拼接前缀
        if (this.namespace) {
            ns += '/admin/' + this.namespace;
        }

        // 处理http
        if (options.url.indexOf('http') !== 0) {
            options.url = ns + options.url;
        }
        return $http(options);
    }

    list(params: any) {
        return this.request({
            url: '/list',
            method: 'POST',
            data: {
                ...params
            }
        });
    }

    page(params: any) {
        return this.request({
            url: '/page',
            method: 'POST',
            data: {
                ...params
            }
        });
    }

    info(params: any) {
        return this.request({
            url: '/info',
            params: {
                ...params
            }
        });
    }

    update(params: any) {
        return this.request({
            url: '/update',
            method: 'POST',
            data: {
                ...params
            }
        });
    }

    delete(params: any) {
        return this.request({
            url: '/delete',
            method: 'POST',
            data: {
                ...params
            }
        });
    }

    add(params: any) {
        return this.request({
            url: '/add',
            method: 'POST',
            data: {
                ...params
            }
        });
    }
}
