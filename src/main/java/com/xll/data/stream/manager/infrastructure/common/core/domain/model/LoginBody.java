package com.xll.data.stream.manager.infrastructure.common.core.domain.model;

import lombok.Data;

/**
 * 功能描述: <br>
 * <p>
 * 〈用户登录对象〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 14:22
 */
@Data
public class LoginBody {
    /**
     * 用户名
     */
    private String username;

    /**
     * 用户密码
     */
    private String password;

    /**
     * 验证码
     */
    private String code;

    /**
     * 唯一标识
     */
    private String uuid;
}
