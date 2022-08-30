package com.xll.data.stream.manager.infrastructure.common.exception;

/**
 * 功能描述: <br>
 * <p>
 * 〈工具类异常〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 14:39
 */
public class UtilException extends RuntimeException {

    public UtilException(Throwable e) {
        super(e.getMessage(), e);
    }

    public UtilException(String message) {
        super(message);
    }

    public UtilException(String message, Throwable throwable) {
        super(message, throwable);
    }
}
