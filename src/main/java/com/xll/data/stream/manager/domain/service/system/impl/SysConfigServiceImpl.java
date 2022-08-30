package com.xll.data.stream.manager.domain.service.system.impl;

import com.xll.data.stream.manager.domain.aggregate.system.dao.SysConfigDao;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysConfig;
import com.xll.data.stream.manager.domain.service.system.ISysConfigService;
import com.xll.data.stream.manager.infrastructure.common.constant.CacheConstants;
import com.xll.data.stream.manager.infrastructure.common.constant.UserConstants;
import com.xll.data.stream.manager.infrastructure.common.core.redis.RedisCache;
import com.xll.data.stream.manager.infrastructure.common.core.text.Convert;
import com.xll.data.stream.manager.infrastructure.common.exception.ServiceException;
import com.xll.data.stream.manager.infrastructure.common.utils.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Collection;
import java.util.List;
/**
 * 功能描述: <br>
 * <p>
 * 〈配置 - 业务〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 21:22
 */
@Component
public class SysConfigServiceImpl implements ISysConfigService {
    @Autowired
    private SysConfigDao sysConfigDao;

    @Autowired
    private RedisCache redisCache;

    /**
     * 项目启动时，初始化参数到缓存
     */
    @PostConstruct
    public void init() {
        loadingConfigCache();
    }

    /**
     * 查询参数配置信息
     *
     * @param configId 参数配置ID
     * @return 参数配置信息
     */
    @Override
    public SysConfig selectConfigById(Long configId) {
        SysConfig config = new SysConfig();
        config.setConfigId(configId);
        return sysConfigDao.selectConfig(config);
    }

    /**
     * 根据键名查询参数配置信息
     *
     * @param configKey 参数key
     * @return 参数键值
     */
    @Override
    public String selectConfigByKey(String configKey) {
        String configValue = Convert.toStr(redisCache.getCacheObject(getCacheKey(configKey)));
        if (StringUtils.isNotEmpty(configValue)) {
            return configValue;
        }
        SysConfig config = new SysConfig();
        config.setConfigKey(configKey);
        SysConfig retConfig = sysConfigDao.selectConfig(config);
        if (StringUtils.isNotNull(retConfig)) {
            redisCache.setCacheObject(getCacheKey(configKey), retConfig.getConfigValue());
            return retConfig.getConfigValue();
        }
        return StringUtils.EMPTY;
    }

    /**
     * 获取验证码开关
     *
     * @return true开启，false关闭
     */
    @Override
    public boolean selectCaptchaEnabled() {
        String captchaEnabled = selectConfigByKey("sys.account.captchaEnabled");
        if (StringUtils.isEmpty(captchaEnabled)) {
            return true;
        }
        return Convert.toBool(captchaEnabled);
    }

    /**
     * 查询参数配置列表
     *
     * @param config 参数配置信息
     * @return 参数配置集合
     */
    @Override
    public List<SysConfig> selectConfigList(SysConfig config) {
        return sysConfigDao.selectConfigList(config);
    }

    /**
     * 新增参数配置
     *
     * @param config 参数配置信息
     * @return 结果
     */
    @Override
    public boolean insertConfig(SysConfig config) {
        if (sysConfigDao.insertConfig(config)) {
            redisCache.setCacheObject(getCacheKey(config.getConfigKey()), config.getConfigValue());
        }
        return true;
    }

    /**
     * 修改参数配置
     *
     * @param config 参数配置信息
     * @return 结果
     */
    @Override
    public boolean updateConfig(SysConfig config) {
        if (sysConfigDao.updateConfig(config)) {
            redisCache.setCacheObject(getCacheKey(config.getConfigKey()), config.getConfigValue());
        }
        return true;
    }

    /**
     * 批量删除参数信息
     *
     * @param configIds 需要删除的参数ID
     */
    @Override
    public void deleteConfigByIds(Long[] configIds) {
        for (Long configId : configIds) {
            SysConfig config = selectConfigById(configId);
            if (StringUtils.equals(UserConstants.YES, config.getConfigType())) {
                throw new ServiceException(String.format("内置参数【%1$s】不能删除 ", config.getConfigKey()));
            }
            sysConfigDao.deleteConfigById(configId);
            redisCache.deleteObject(getCacheKey(config.getConfigKey()));
        }
    }

    /**
     * 加载参数缓存数据
     */
    @Override
    public void loadingConfigCache() {
        List<SysConfig> configsList = sysConfigDao.selectConfigList(new SysConfig());
        for (SysConfig config : configsList) {
            redisCache.setCacheObject(getCacheKey(config.getConfigKey()), config.getConfigValue());
        }
    }

    /**
     * 清空参数缓存数据
     */
    @Override
    public void clearConfigCache() {
        Collection<String> keys = redisCache.keys(CacheConstants.SYS_CONFIG_KEY + "*");
        redisCache.deleteObject(keys);
    }

    /**
     * 重置参数缓存数据
     */
    @Override
    public void resetConfigCache() {
        clearConfigCache();
        loadingConfigCache();
    }

    /**
     * 校验参数键名是否唯一
     *
     * @param config 参数配置信息
     * @return 结果
     */
    @Override
    public String checkConfigKeyUnique(SysConfig config) {
        Long configId = StringUtils.isNull(config.getConfigId()) ? -1L : config.getConfigId();
        SysConfig info = sysConfigDao.checkConfigKeyUnique(config.getConfigKey());
        if (StringUtils.isNotNull(info) && info.getConfigId().longValue() != configId.longValue()) {
            return UserConstants.NOT_UNIQUE;
        }
        return UserConstants.UNIQUE;
    }

    /**
     * 设置cache key
     *
     * @param configKey 参数键
     * @return 缓存键key
     */
    private String getCacheKey(String configKey) {
        return CacheConstants.SYS_CONFIG_KEY + configKey;
    }
}
