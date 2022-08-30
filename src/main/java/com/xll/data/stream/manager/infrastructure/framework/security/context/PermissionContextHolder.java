package com.xll.data.stream.manager.infrastructure.framework.security.context;

import com.xll.data.stream.manager.infrastructure.common.core.text.Convert;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

/**
 * 功能描述: <br>
 * <p>
 * 〈权限信息〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 21:16
 */
public class PermissionContextHolder {
    private static final String PERMISSION_CONTEXT_ATTRIBUTES = "PERMISSION_CONTEXT";

    public static void setContext(String permission) {
        RequestContextHolder.currentRequestAttributes().setAttribute(PERMISSION_CONTEXT_ATTRIBUTES, permission,
                RequestAttributes.SCOPE_REQUEST);
    }

    public static String getContext() {
        return Convert.toStr(RequestContextHolder.currentRequestAttributes().getAttribute(PERMISSION_CONTEXT_ATTRIBUTES,
                RequestAttributes.SCOPE_REQUEST));
    }
}
