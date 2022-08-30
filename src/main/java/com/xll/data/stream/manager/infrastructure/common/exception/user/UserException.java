package com.xll.data.stream.manager.infrastructure.common.exception.user;

import com.xll.data.stream.manager.infrastructure.common.exception.base.BaseException;

/**
 * 功能描述: <br>
 * <p>
 * 〈用户信息异常类〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 14:36
 */
public class UserException extends BaseException {
    public UserException(String code, Object[] args) {
        super("user", code, args, null);
    }
}
