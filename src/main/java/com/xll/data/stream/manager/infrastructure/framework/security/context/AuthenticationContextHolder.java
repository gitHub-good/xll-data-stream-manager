package com.xll.data.stream.manager.infrastructure.framework.security.context;

import org.springframework.security.core.Authentication;

/**
 * 功能描述: <br>
 * <p>
 * 〈身份验证信息〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 21:15
 */
public class AuthenticationContextHolder {
    private static final ThreadLocal<Authentication> contextHolder = new ThreadLocal<>();

    public static Authentication getContext()
    {
        return contextHolder.get();
    }

    public static void setContext(Authentication context)
    {
        contextHolder.set(context);
    }

    public static void clearContext() {
        contextHolder.remove();
    }
}
