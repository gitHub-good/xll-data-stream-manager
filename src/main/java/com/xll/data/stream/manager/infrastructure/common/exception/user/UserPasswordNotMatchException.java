package com.xll.data.stream.manager.infrastructure.common.exception.user;

/**
 * 功能描述: <br>
 * <p>
 * 〈用户密码不正确或不符合规范异常类〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 14:37
 */
public class UserPasswordNotMatchException extends UserException {
    public UserPasswordNotMatchException() {
        super("user.password.not.match", null);
    }
}
