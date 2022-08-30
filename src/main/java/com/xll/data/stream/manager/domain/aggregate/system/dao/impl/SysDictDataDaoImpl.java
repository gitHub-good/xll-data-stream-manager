package com.xll.data.stream.manager.domain.aggregate.system.dao.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xll.data.stream.manager.domain.aggregate.system.dao.SysDictDataDao;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysDictData;
import com.xll.data.stream.manager.domain.aggregate.system.mapper.SysDictDataMapper;
import com.xll.data.stream.manager.infrastructure.common.constant.Constants;
import org.springframework.stereotype.Service;

import java.util.List;
/**
 * 功能描述: <br>
 * <p>
 * 〈〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 16:18
 */
@Service
public class SysDictDataDaoImpl extends ServiceImpl<SysDictDataMapper, SysDictData> implements SysDictDataDao {

    @Override
    public List<SysDictData> selectDictDataList(SysDictData dictData) {
        return list(Wrappers.lambdaQuery(SysDictData.class)
                .eq(StringUtils.isNotBlank(dictData.getDictType()), SysDictData::getDictType, dictData.getDictType())
                .eq(StringUtils.isNotBlank(dictData.getDictLabel()), SysDictData::getDictLabel, dictData.getDictLabel())
                .eq(StringUtils.isNotBlank(dictData.getStatus()), SysDictData::getStatus, dictData.getStatus())
                .orderByAsc(SysDictData::getDictSort)
        );
    }

    @Override
    public List<SysDictData> selectDictDataByType(String dictType) {
        return list(Wrappers.lambdaQuery(SysDictData.class)
                .eq(StringUtils.isNotBlank(dictType), SysDictData::getDictType, dictType)
                .eq(SysDictData::getStatus, Constants.DEL_FLAG_0)
                .orderByAsc(SysDictData::getDictSort)
        );
    }

    @Override
    public String selectDictLabel(String dictType, String dictValue) {
        LambdaQueryWrapper<SysDictData> wrapper = Wrappers.lambdaQuery();
        wrapper.select(SysDictData::getDictLabel).eq(SysDictData::getDictType, dictType).eq(SysDictData::getDictValue, dictValue);
        return baseMapper.selectOne(wrapper).getDictLabel();
    }

    @Override
    public SysDictData selectDictDataById(Long dictCode) {
        return getById(dictCode);
    }

    @Override
    public long countDictDataByType(String dictType) {
        return count(Wrappers.lambdaQuery(SysDictData.class).eq(SysDictData::getDictType, dictType));
    }

    @Override
    public boolean deleteDictDataById(Long dictCode) {
        return removeById(dictCode);
    }

    @Override
    public boolean deleteDictDataByIds(List<Long> dictCodes) {
        return removeBatchByIds(dictCodes);
    }

    @Override
    public boolean insertDictData(SysDictData dictData) {
        return save(dictData);
    }

    @Override
    public boolean updateDictData(SysDictData dictData) {
        return updateById(dictData);
    }

    @Override
    public boolean updateDictDataType(String oldDictType, String newDictType) {
        return update(
                Wrappers.lambdaUpdate(SysDictData.class)
                .set(SysDictData::getDictType, newDictType)
                .eq(SysDictData::getDictType, oldDictType)
        );
    }
}
