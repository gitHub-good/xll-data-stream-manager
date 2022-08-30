package com.xll.data.stream.manager.infrastructure.common.exception.user;

/**
 * 功能描述: <br>
 * <p>
 * 〈用户错误最大次数异常类〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 14:37
 */
public class UserPasswordRetryLimitExceedException extends UserException {
    public UserPasswordRetryLimitExceedException(int retryLimitCount, int lockTime) {
        super("user.password.retry.limit.exceed", new Object[] { retryLimitCount, lockTime });
    }
}
