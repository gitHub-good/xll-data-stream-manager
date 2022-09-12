package com.xll.data.stream.manager.domain.aggregate.system.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xll.data.stream.manager.infrastructure.common.core.domain.BasePO;
import lombok.Data;

/**
 * 功能描述: <br>
 * <p>
 * 〈参数配置表 sys_config〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/9/12 21:04
 */
@Data
@TableName("t_sys_config")
public class SysConfig extends BasePO {
    /**
     * 参数主键
     */
    @TableId
    private Long configId;
    /**
     * 参数名称
     */
    private String configName;
    /**
     * 参数键名
     */
    private String configKey;
    /**
     * 参数键值
     */
    private String configValue;
    /**
     * 系统内置（Y是 N否）
     */
    private String configType;
}
