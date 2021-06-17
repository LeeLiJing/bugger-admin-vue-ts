import { BaseService, Service } from '@/core';

@Service('comm')
class Common extends BaseService {
    /**
     * 用户信息
     *
     * @returns
     * @memberof CommonService
     */
    userInfo() {
        return this.request({
            url: '/person'
        });
    }
}

export default Common;
