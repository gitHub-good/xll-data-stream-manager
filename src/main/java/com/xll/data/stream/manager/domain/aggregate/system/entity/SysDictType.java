package com.xll.data.stream.manager.domain.aggregate.system.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xll.data.stream.manager.infrastructure.common.core.domain.BaseEntity;
import lombok.Data;

/**
 * 字典类型表 sys_dict_type
 * 
 * @author ruoyi
 */
@Data
@TableName("t_sys_dict_type")
public class SysDictType extends BaseEntity {

    /** 字典主键 */
    @TableId
    private Long dictId;

    /** 字典名称 */
    private String dictName;

    /** 字典类型 */
    private String dictType;

    /** 状态（0正常 1停用） */
    private String status;
}
