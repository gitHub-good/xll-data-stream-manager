package com.xll.data.stream.manager.domain.aggregate.system.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

/**
 * 功能描述: <br>
 * <p>
 * 〈 角色和菜单关联 sys_role_menu〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 19:13
 */
@Data
@TableName("t_sys_role_menu")
public class SysRoleMenu {
    /** 角色ID */
    private Long roleId;

    /** 菜单ID */
    private Long menuId;

    /** 是否为半选中 */
    private boolean halfChecked;
}
