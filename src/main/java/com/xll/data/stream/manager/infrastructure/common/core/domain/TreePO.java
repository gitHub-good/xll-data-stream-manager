package com.xll.data.stream.manager.infrastructure.common.core.domain;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * 功能描述: <br>
 * <p>
 * 〈Tree基类〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 14:28
 */
@Data
public class TreePO extends BasePO {
    /** 父菜单名称 */
    private String parentName;

    /** 父菜单ID */
    private Long parentId;

    /** 显示顺序 */
    private Integer orderNum;

    /** 祖级列表 */
    private String ancestors;

    /** 子部门 */
    private List<?> children = new ArrayList<>();
}
