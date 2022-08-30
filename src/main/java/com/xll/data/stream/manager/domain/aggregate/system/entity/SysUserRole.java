package com.xll.data.stream.manager.domain.aggregate.system.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

/**
 * 功能描述: <br>
 * <p>
 * 〈用户和角色关联 sys_user_role〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 21:39
 */
@Data
@TableName("t_sys_user_role")
public class SysUserRole {
    /** 用户ID */
    private Long userId;
    
    /** 角色ID */
    private Long roleId;
}
