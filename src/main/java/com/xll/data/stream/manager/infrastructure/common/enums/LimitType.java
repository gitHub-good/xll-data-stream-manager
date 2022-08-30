package com.xll.data.stream.manager.infrastructure.common.enums;

/**
 * 功能描述: <br>
 * <p>
 * 〈限流类型〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 14:34
 */
public enum LimitType {
    /**
     * 默认策略全局限流
     */
    DEFAULT,

    /**
     * 根据请求者IP进行限流
     */
    IP
}
