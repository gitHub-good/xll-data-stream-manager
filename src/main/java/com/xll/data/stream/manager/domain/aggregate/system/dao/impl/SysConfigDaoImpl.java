package com.xll.data.stream.manager.domain.aggregate.system.dao.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xll.data.stream.manager.domain.aggregate.system.dao.SysConfigDao;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysConfig;
import com.xll.data.stream.manager.domain.aggregate.system.mapper.SysConfigMapper;
import org.springframework.stereotype.Service;

import java.util.List;
/**
 * 功能描述: <br>
 * <p>
 * 〈配置 - Dao实现〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 14:55
 */

@Service
public class SysConfigDaoImpl extends ServiceImpl<SysConfigMapper, SysConfig> implements SysConfigDao {
    @Override
    public SysConfig selectConfig(SysConfig config) {
        LambdaQueryWrapper<SysConfig> wrapper = Wrappers.lambdaQuery();
        wrapper.eq(config.getConfigId() != null, SysConfig::getConfigId, config.getConfigId());
        wrapper.eq(config.getConfigKey() != null, SysConfig::getConfigKey, config.getConfigKey());
        return getOne(wrapper);
    }

    @Override
    public List<SysConfig> selectConfigList(SysConfig config) {
        LambdaQueryWrapper<SysConfig> wrapper = Wrappers.lambdaQuery();
        wrapper.eq(config.getConfigId() != null, SysConfig::getConfigId, config.getConfigId());
        wrapper.like(config.getConfigKey() != null, SysConfig::getConfigKey, config.getConfigKey());
        wrapper.like(config.getConfigName() != null, SysConfig::getConfigName, config.getConfigName());
        wrapper.lt(config.getParams().get("beginTime") != null, SysConfig::getCreateTime, config.getParams().get("beginTime"));
        wrapper.gt(config.getParams().get("endTime") != null, SysConfig::getCreateTime, config.getParams().get("endTime"));
        return list(wrapper);
    }

    @Override
    public SysConfig checkConfigKeyUnique(String configKey) {
        return getOne(Wrappers.lambdaQuery(SysConfig.class).eq(configKey != null, SysConfig::getConfigKey, configKey));
    }

    @Override
    public boolean insertConfig(SysConfig config) {
        return save(config);
    }

    @Override
    public boolean updateConfig(SysConfig config) {
        return updateById(config);
    }

    @Override
    public boolean deleteConfigById(Long configId) {
        return removeById(configId);
    }

    @Override
    public boolean deleteConfigByIds(List<Long> configIds) {
        return removeBatchByIds(configIds);
    }
}
