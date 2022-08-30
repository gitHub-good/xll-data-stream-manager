package com.xll.data.stream.manager.infrastructure.common.enums;

import org.springframework.lang.Nullable;

import java.util.HashMap;
import java.util.Map;

/**
 * 功能描述: <br>
 * <p>
 * 〈请求方式〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 14:34
 */
public enum HttpMethod {
    GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS, TRACE;

    private static final Map<String, HttpMethod> mappings = new HashMap<>(16);

    static {
        for (HttpMethod httpMethod : values()) {
            mappings.put(httpMethod.name(), httpMethod);
        }
    }

    @Nullable
    public static HttpMethod resolve(@Nullable String method) {
        return (method != null ? mappings.get(method) : null);
    }

    public boolean matches(String method) {
        return (this == resolve(method));
    }
}
