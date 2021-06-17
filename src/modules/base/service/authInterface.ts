import { BaseService, Service } from '#/service';

@Service('public')
class AuthInterface extends BaseService {
    /**
     * 图片验证码 svg
     *
     * @param {*} { height, width }
     * @returns
     * @memberof CommonService
     */
    captcha({ height, width }: any) {
        return this.request({
            url: '/captcha',
            params: {
                height,
                width
            }
        });
    }

    /**
     * 用户登录
     *
     * @param {*} { username, password, captchaId, verifyCode }
     * @returns
     * @memberof CommonService
     */

    userLogin({ username, password, captchaId, verifyCode }: any) {
        return this.request({
            url: '/login',
            method: 'POST',
            data: {
                username,
                password,
                captchaId,
                verifyCode
            }
        });
    }
}

export default AuthInterface;
