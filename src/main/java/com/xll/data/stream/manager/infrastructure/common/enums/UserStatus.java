package com.xll.data.stream.manager.infrastructure.common.enums;

import lombok.Getter;

/**
 * 功能描述: <br>
 * <p>
 * 〈用户状态〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 14:34
 */
@Getter
public enum UserStatus {
    /**
     * 正常
     */
    OK("0", "正常"),
    /**
     * 停用
     */
    DISABLE("1", "停用"),
    /**
     * 删除
     */
    DELETED("2", "删除"),
    ;

    private final String code;
    private final String info;

    UserStatus(String code, String info) {
        this.code = code;
        this.info = info;
    }
}
