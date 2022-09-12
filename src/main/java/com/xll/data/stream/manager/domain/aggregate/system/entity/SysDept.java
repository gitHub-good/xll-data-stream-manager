package com.xll.data.stream.manager.domain.aggregate.system.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xll.data.stream.manager.infrastructure.common.core.domain.BasePO;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

/**
 * 功能描述: <br>
 * <p>
 * 〈部门表 sys_dept〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 15:18
 */
@Data
@TableName("t_sys_dept")
public class SysDept extends BasePO {
    /** 部门ID */
    @TableId
    private Long deptId;

    /** 父部门ID */
    private Long parentId;

    /** 祖级列表 */
    private String ancestors;

    /** 部门名称 */
    private String deptName;

    /** 显示顺序 */
    private Integer orderNum;

    /** 负责人 */
    private String leader;

    /** 联系电话 */
    private String phone;

    /** 邮箱 */
    private String email;

    /** 部门状态:0正常,1停用 */
    private String status;

    /** 删除标志（0代表存在 2代表删除） */
    private String delFlag;

    /** 父部门名称 */
    private String parentName;
    
    /** 子部门 */
    private List<SysDept> children = new ArrayList<>();
}
