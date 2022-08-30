package com.xll.data.stream.manager.domain.aggregate.system.dao;

import com.baomidou.mybatisplus.extension.service.IService;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysOperateLog;

import java.util.List;

/**
 * 功能描述: <br>
 * <p>
 * 〈〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 18:33
 */
public interface SysOperateLogDao extends IService<SysOperateLog> {
    /**
     * 新增操作日志
     *
     * @param operateLog 操作日志对象
     */
    void insertOperateLog(SysOperateLog operateLog);

    /**
     * 查询系统操作日志集合
     *
     * @param operateLog 操作日志对象
     * @return 操作日志集合
     */
    List<SysOperateLog> selectOperateLogList(SysOperateLog operateLog);

    /**
     * 批量删除系统操作日志
     *
     * @param operateIds 需要删除的操作日志ID
     * @return 结果
     */
    boolean deleteOperateLogByIds(List<Long> operateIds);

    /**
     * 查询操作日志详细
     *
     * @param operateId 操作ID
     * @return 操作日志对象
     */
    SysOperateLog selectOperateLogById(Long operateId);

    /**
     * 清空操作日志
     */
    void cleanOperateLog();
}
