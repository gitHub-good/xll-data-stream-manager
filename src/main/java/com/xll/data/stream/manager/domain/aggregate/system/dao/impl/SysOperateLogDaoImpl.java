package com.xll.data.stream.manager.domain.aggregate.system.dao.impl;

import com.baomidou.mybatisplus.core.toolkit.CollectionUtils;
import com.baomidou.mybatisplus.core.toolkit.ObjectUtils;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.google.common.collect.Lists;
import com.xll.data.stream.manager.domain.aggregate.system.dao.SysOperateLogDao;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysOperateLog;
import com.xll.data.stream.manager.domain.aggregate.system.mapper.SysOperateLogMapper;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 功能描述: <br>
 * <p>
 * 〈〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 18:34
 */
@Service
public class SysOperateLogDaoImpl extends ServiceImpl<SysOperateLogMapper, SysOperateLog> implements SysOperateLogDao {
    @Override
    public void insertOperateLog(SysOperateLog operateLog) {
        save(operateLog);
    }

    @Override
    public List<SysOperateLog> selectOperateLogList(SysOperateLog operateLog) {
        return list(Wrappers.lambdaQuery(SysOperateLog.class)
                .like(StringUtils.isNotBlank(operateLog.getTitle()), SysOperateLog::getTitle, operateLog.getTitle())
                .like(StringUtils.isNotBlank(operateLog.getOperName()), SysOperateLog::getOperName, operateLog.getOperName())
                .eq(operateLog.getStatus() != null, SysOperateLog::getStatus, operateLog.getStatus())
                .in(CollectionUtils.isNotEmpty(Lists.newArrayList(operateLog.getBusinessTypes())), SysOperateLog::getBusinessType, Lists.newArrayList(operateLog.getBusinessTypes()))
                .lt(ObjectUtils.isNotEmpty(operateLog.getParams().get("beginTime")), SysOperateLog::getCreateTime, operateLog.getParams().get("beginTime"))
                .gt(ObjectUtils.isNotEmpty(operateLog.getParams().get("endTime")), SysOperateLog::getCreateTime, operateLog.getParams().get("endTime"))
        );
    }

    @Override
    public boolean deleteOperateLogByIds(List<Long> operateIds) {
        return removeBatchByIds(operateIds);
    }

    @Override
    public SysOperateLog selectOperateLogById(Long operateId) {
        return getById(operateId);
    }

    @Override
    public void cleanOperateLog() {
        baseMapper.cleanOperateLog();
    }
}
