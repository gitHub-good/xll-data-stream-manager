package com.xll.data.stream.manager.domain.aggregate.system.mapper;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysOperateLog;

/**
 * 功能描述: <br>
 * <p>
 * 〈操作日志 数据层〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 18:44
 */
public interface SysOperateLogMapper extends BaseMapper<SysOperateLog> {

    /**
     * 清空操作日志
     */
    void cleanOperateLog();
}
