package com.xll.data.stream.manager.infrastructure.common.filter;

import com.alibaba.fastjson2.filter.SimplePropertyPreFilter;

/**
 * 功能描述: <br>
 * <p>
 * 〈排除JSON敏感属性〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 14:39
 */
public class PropertyPreExcludeFilter extends SimplePropertyPreFilter {
    public PropertyPreExcludeFilter() {
    }

    public PropertyPreExcludeFilter addExcludes(String... filters) {
        for (int i = 0; i < filters.length; i++) {
            this.getExcludes().add(filters[i]);
        }
        return this;
    }
}
