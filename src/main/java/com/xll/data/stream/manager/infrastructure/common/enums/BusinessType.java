package com.xll.data.stream.manager.infrastructure.common.enums;

/**
 * 功能描述: <br>
 * <p>
 * 〈业务操作类型〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 14:33
 */
public enum BusinessType {
    /**
     * 其它
     */
    OTHER,

    /**
     * 新增
     */
    INSERT,

    /**
     * 修改
     */
    UPDATE,

    /**
     * 删除
     */
    DELETE,

    /**
     * 授权
     */
    GRANT,

    /**
     * 导出
     */
    EXPORT,

    /**
     * 导入
     */
    IMPORT,

    /**
     * 强退
     */
    FORCE,

    /**
     * 生成代码
     */
    GENCODE,
    
    /**
     * 清空数据
     */
    CLEAN,
}
