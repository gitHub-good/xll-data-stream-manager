package com.xll.data.stream.manager.infrastructure.common.utils;

import com.xll.data.stream.manager.infrastructure.common.utils.spring.SpringUtils;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;

/**
 * 功能描述: <br>
 * <p>
 * 〈获取i18n资源文件〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 14:48
 */
public class MessageUtils {
    /**
     * 根据消息键和参数 获取消息 委托给spring messageSource
     *
     * @param code 消息键
     * @param args 参数
     * @return 获取国际化翻译值
     */
    public static String message(String code, Object... args) {
        MessageSource messageSource = SpringUtils.getBean(MessageSource.class);
        return messageSource.getMessage(code, args, LocaleContextHolder.getLocale());
    }
}
