package com.xll.data.stream.manager.domain.aggregate.system.dao;

import com.baomidou.mybatisplus.extension.service.IService;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysConfig;

import java.util.List;

/**
 * 功能描述: <br>
 * <p>
 * 〈配置 dao〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 14:53
 */
public interface SysConfigDao extends IService<SysConfig> {

    /**
     * 查询参数配置信息
     *
     * @param config 参数配置信息
     * @return 参数配置信息
     */
    SysConfig selectConfig(SysConfig config);

    /**
     * 查询参数配置列表
     *
     * @param config 参数配置信息
     * @return 参数配置集合
     */
    List<SysConfig> selectConfigList(SysConfig config);

    /**
     * 根据键名查询参数配置信息
     *
     * @param configKey 参数键名
     * @return 参数配置信息
     */
    SysConfig checkConfigKeyUnique(String configKey);

    /**
     * 新增参数配置
     *
     * @param config 参数配置信息
     * @return 结果
     */
    boolean insertConfig(SysConfig config);

    /**
     * 修改参数配置
     *
     * @param config 参数配置信息
     * @return 结果
     */
    boolean updateConfig(SysConfig config);

    /**
     * 删除参数配置
     *
     * @param configId 参数ID
     * @return 结果
     */
    boolean deleteConfigById(Long configId);

    /**
     * 批量删除参数信息
     *
     * @param configIds 需要删除的参数ID
     * @return 结果
     */
    boolean deleteConfigByIds(List<Long> configIds);
}
