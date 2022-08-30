package com.xll.data.stream.manager.infrastructure.common.core.domain;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * 功能描述: <br>
 * <p>
 * 〈Entity基类〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 14:25
 */
@Data
public class BaseEntity implements Serializable {

    /** 创建者 */
    private String createBy;
    /** 创建时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @TableField(fill = FieldFill.INSERT)
    private Date createTime;
    /** 更新者 */
    private String updateBy;
    /** 更新时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @TableField(fill = FieldFill.UPDATE)
    private Date updateTime;
    /** 备注 */
    private String remark;
    /** 请求参数 */
    @TableField(exist = false)
    private Map<String, Object> params;

    public Map<String, Object> getParams() {
        if (params == null) {
            params = new HashMap<>();
        }
        return params;
    }
}
