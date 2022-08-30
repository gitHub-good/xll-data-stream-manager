package com.xll.data.stream.manager.domain.aggregate.system.dao.impl;

import com.baomidou.mybatisplus.core.toolkit.ObjectUtils;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xll.data.stream.manager.domain.aggregate.system.dao.SysDictTypeDao;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysDictType;
import com.xll.data.stream.manager.domain.aggregate.system.mapper.SysDictTypeMapper;
import org.springframework.stereotype.Service;

import java.util.List;
/**
 * 功能描述: <br>
 * <p>
 * 〈〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 16:34
 */
@Service
public class SysDictTypeDaoImpl extends ServiceImpl<SysDictTypeMapper, SysDictType> implements SysDictTypeDao {
    @Override
    public List<SysDictType> selectDictTypeList(SysDictType dictType) {
        return list(Wrappers.lambdaQuery(SysDictType.class)
                .like(StringUtils.isNotBlank(dictType.getDictName()),SysDictType::getDictName, dictType.getDictName())
                .eq(StringUtils.isNotBlank(dictType.getStatus()),SysDictType::getStatus, dictType.getStatus())
                .like(StringUtils.isNotBlank(dictType.getDictType()),SysDictType::getDictType, dictType.getDictType())
                .lt(ObjectUtils.isNotEmpty(dictType.getParams().get("beginTime")),SysDictType::getCreateTime, dictType.getParams().get("beginTime"))
                .gt(ObjectUtils.isNotEmpty(dictType.getParams().get("endTime")),SysDictType::getCreateTime, dictType.getParams().get("endTime"))
        );
    }

    @Override
    public List<SysDictType> selectDictTypeAll() {
        return list();
    }

    @Override
    public SysDictType selectDictTypeById(Long dictId) {
        return getById(dictId);
    }

    @Override
    public SysDictType selectDictTypeByType(String dictType) {
        return getOne(Wrappers.lambdaQuery(SysDictType.class).eq(SysDictType::getDictType, dictType));
    }

    @Override
    public boolean deleteDictTypeById(Long dictId) {
        return removeById(dictId);
    }

    @Override
    public boolean deleteDictTypeByIds(List<Long> dictIds) {
        return removeBatchByIds(dictIds);
    }

    @Override
    public boolean insertDictType(SysDictType dictType) {
        return save(dictType);
    }

    @Override
    public boolean updateDictType(SysDictType dictType) {
        return updateById(dictType);
    }

    @Override
    public SysDictType checkDictTypeUnique(String dictType) {
        return getOne(Wrappers.lambdaQuery(SysDictType.class).eq(SysDictType::getDictType, dictType));
    }
}
