package com.xll.data.stream.manager.infrastructure.common.exception.user;

/**
 * 功能描述: <br>
 * <p>
 * 〈验证码错误异常类〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 14:37
 */
public class CaptchaException extends UserException {

    public CaptchaException() {
        super("user.jcaptcha.error", null);
    }
}
