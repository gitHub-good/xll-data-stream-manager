package com.xll.data.stream.manager.domain.aggregate.system.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * 功能描述: <br>
 * <p>
 * 〈角色和部门关联 sys_role_dept〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 18:55
 */
@Data
@TableName("t_sys_role_dept")
public class SysRoleDept {
    /** 角色ID */
    private Long roleId;

    /** 部门ID */
    private Long deptId;

    /** 是否为半选中 */
    private boolean halfChecked;
}
