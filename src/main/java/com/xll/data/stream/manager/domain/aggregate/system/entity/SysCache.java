package com.xll.data.stream.manager.domain.aggregate.system.entity;

import lombok.Data;
import org.springframework.util.StringUtils;

/**
 * 功能描述: <br>
 * <p>
 * 〈缓存信息〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 13:58
 */
@Data
public class SysCache {
    /** 缓存名称 */
    private String cacheName = "";

    /** 缓存键名 */
    private String cacheKey = "";

    /** 缓存内容 */
    private String cacheValue = "";

    /** 备注 */
    private String remark = "";

    public SysCache() {
    }

    public SysCache(String cacheName, String remark) {
        this.cacheName = cacheName;
        this.remark = remark;
    }

    public SysCache(String cacheName, String cacheKey, String cacheValue) {
        this.cacheName = StringUtils.replace(cacheName, ":", "");
        this.cacheKey = StringUtils.replace(cacheKey, cacheName, "");
        this.cacheValue = cacheValue;
    }
}
