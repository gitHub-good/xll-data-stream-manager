package com.xll.data.stream.manager.domain.aggregate.system.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

/**
 * 用户和岗位关联 sys_user_post
 * 
 * @author ruoyi
 */
@Data
@TableName("t_sys_user_post")
public class SysUserPost {
    /** 用户ID */
    private Long userId;
    
    /** 岗位ID */
    private Long postId;

}
