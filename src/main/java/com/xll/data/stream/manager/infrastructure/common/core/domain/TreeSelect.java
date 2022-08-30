package com.xll.data.stream.manager.infrastructure.common.core.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysDept;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysMenu;
import lombok.Data;

import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 功能描述: <br>
 * <p>
 * 〈Treeselect树结构实体类〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 14:29
 */
@Data
public class TreeSelect implements Serializable {
    /** 节点ID */
    private Long id;

    /** 节点名称 */
    private String label;

    /** 子节点 */
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private List<TreeSelect> children;

    public TreeSelect() {

    }

    public TreeSelect(SysDept dept) {
        this.id = dept.getDeptId();
        this.label = dept.getDeptName();
        this.children = dept.getChildren().stream().map(TreeSelect::new).collect(Collectors.toList());
    }

    public TreeSelect(SysMenu menu) {
        this.id = menu.getMenuId();
        this.label = menu.getMenuName();
        this.children = menu.getChildren().stream().map(TreeSelect::new).collect(Collectors.toList());
    }
}
