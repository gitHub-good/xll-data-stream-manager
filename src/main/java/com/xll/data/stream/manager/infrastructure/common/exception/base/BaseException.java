package com.xll.data.stream.manager.infrastructure.common.exception.base;

import com.xll.data.stream.manager.infrastructure.common.utils.MessageUtils;
import lombok.Getter;
import org.springframework.util.StringUtils;

/**
 * 功能描述: <br>
 * <p>
 * 〈基础异常〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 14:35
 */
@Getter
public class BaseException extends RuntimeException {
    /**
     * 所属模块
     */
    private final String module;

    /**
     * 错误码
     */
    private final String code;

    /**
     * 错误码对应的参数
     */
    private final Object[] args;

    /**
     * 错误消息
     */
    private final String defaultMessage;

    public BaseException(String module, String code, Object[] args, String defaultMessage) {
        this.module = module;
        this.code = code;
        this.args = args;
        this.defaultMessage = defaultMessage;
    }

    public BaseException(String module, String code, Object[] args)
    {
        this(module, code, args, null);
    }

    public BaseException(String module, String defaultMessage)
    {
        this(module, null, null, defaultMessage);
    }

    public BaseException(String code, Object[] args)
    {
        this(null, code, args, null);
    }

    public BaseException(String defaultMessage)
    {
        this(null, null, null, defaultMessage);
    }

    @Override
    public String getMessage() {
        String message = null;
        if (!StringUtils.isEmpty(code)) {
            message = MessageUtils.message(code, args);
        }
        if (message == null) {
            message = defaultMessage;
        }
        return message;
    }
}
