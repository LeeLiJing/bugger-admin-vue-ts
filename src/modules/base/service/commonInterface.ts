import { BaseService, Service } from '@/core';

@Service('comm')
class CommonInterface extends BaseService {
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

    /**
     * 权限信息
     *
     * @returns
     * @memberof CommonService
     */
    permMenu() {
        return this.request({
            url: '/permmenu'
        });
    }
}

export default CommonInterface;
