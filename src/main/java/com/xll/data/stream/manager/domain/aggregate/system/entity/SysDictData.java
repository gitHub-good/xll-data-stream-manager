package com.xll.data.stream.manager.domain.aggregate.system.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xll.data.stream.manager.infrastructure.common.core.domain.BasePO;
import lombok.Data;


/**
 * 功能描述: <br>
 * <p>
 * 〈字典数据表 sys_dict_data〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 16:13
 */
@Data
@TableName("t_sys_dict_data")
public class SysDictData extends BasePO {

    /** 字典编码 */
    @TableId
    private Long dictCode;

    /** 字典排序 */
    private Long dictSort;

    /** 字典标签 */
    private String dictLabel;

    /** 字典键值 */
    private String dictValue;

    /** 字典类型 */
    private String dictType;

    /** 样式属性（其他样式扩展） */
    private String cssClass;

    /** 表格字典样式 */
    private String listClass;

    /** 是否默认（Y是 N否） */
    private String isDefault;

    /** 状态（0正常 1停用） */
    private String status;
}
