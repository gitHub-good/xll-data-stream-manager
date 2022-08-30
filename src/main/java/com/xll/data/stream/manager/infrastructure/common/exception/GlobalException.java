package com.xll.data.stream.manager.infrastructure.common.exception;

/**
 * 功能描述: <br>
 * <p>
 * 〈全局异常〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 14:38
 */
public class GlobalException extends RuntimeException {

    /**
     * 错误提示
     */
    private String message;

    /**
     * 错误明细，内部调试错误
     *
     * 一致的设计
     */
    private String detailMessage;

    /**
     * 空构造方法，避免反序列化问题
     */
    public GlobalException() {
    }

    public GlobalException(String message) {
        this.message = message;
    }

    public String getDetailMessage() {
        return detailMessage;
    }

    public GlobalException setDetailMessage(String detailMessage) {
        this.detailMessage = detailMessage;
        return this;
    }

    @Override
    public String getMessage() {
        return message;
    }

    public GlobalException setMessage(String message) {
        this.message = message;
        return this;
    }
}