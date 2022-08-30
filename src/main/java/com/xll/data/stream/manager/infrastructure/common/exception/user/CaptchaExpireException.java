package com.xll.data.stream.manager.infrastructure.common.exception.user;

/**
 * 功能描述: <br>
 * <p>
 * 〈验证码失效异常类〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 14:37
 */
public class CaptchaExpireException extends UserException {

    public CaptchaExpireException()
    {
        super("user.jcaptcha.expire", null);
    }
}
