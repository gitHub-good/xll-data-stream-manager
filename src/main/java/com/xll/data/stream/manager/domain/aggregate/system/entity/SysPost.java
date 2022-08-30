package com.xll.data.stream.manager.domain.aggregate.system.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xll.data.stream.manager.infrastructure.common.core.domain.BaseEntity;
import lombok.Data;

/**
 * 功能描述: <br>
 * <p>
 * 〈岗位表 sys_post〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 18:45
 */
@Data
@TableName("t_sys_post")
public class SysPost extends BaseEntity {

    /** 岗位序号 */
    @TableId
    private Long postId;

    /** 岗位编码 */
    private String postCode;

    /** 岗位名称 */
    private String postName;

    /** 岗位排序 */
    private String postSort;

    /** 状态（0正常 1停用） */
    private String status;

    /** 用户是否存在此岗位标识 默认不存在 */
    @TableField(exist = false)
    private boolean flag = false;
}
