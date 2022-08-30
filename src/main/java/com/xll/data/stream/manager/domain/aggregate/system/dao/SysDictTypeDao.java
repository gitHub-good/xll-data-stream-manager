package com.xll.data.stream.manager.domain.aggregate.system.dao;

import com.baomidou.mybatisplus.extension.service.IService;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysDictType;

import java.util.List;

/**
 * 功能描述: <br>
 * <p>
 * 〈〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 16:33
 */
public interface SysDictTypeDao extends IService<SysDictType> {
    /**
     * 根据条件分页查询字典类型
     *
     * @param dictType 字典类型信息
     * @return 字典类型集合信息
     */
    List<SysDictType> selectDictTypeList(SysDictType dictType);

    /**
     * 根据所有字典类型
     *
     * @return 字典类型集合信息
     */
    List<SysDictType> selectDictTypeAll();

    /**
     * 根据字典类型ID查询信息
     *
     * @param dictId 字典类型ID
     * @return 字典类型
     */
    SysDictType selectDictTypeById(Long dictId);

    /**
     * 根据字典类型查询信息
     *
     * @param dictType 字典类型
     * @return 字典类型
     */
    SysDictType selectDictTypeByType(String dictType);

    /**
     * 通过字典ID删除字典信息
     *
     * @param dictId 字典ID
     * @return 结果
     */
    boolean deleteDictTypeById(Long dictId);

    /**
     * 批量删除字典类型信息
     *
     * @param dictIds 需要删除的字典ID
     * @return 结果
     */
    boolean deleteDictTypeByIds(List<Long> dictIds);

    /**
     * 新增字典类型信息
     *
     * @param dictType 字典类型信息
     * @return 结果
     */
    boolean insertDictType(SysDictType dictType);

    /**
     * 修改字典类型信息
     *
     * @param dictType 字典类型信息
     * @return 结果
     */
    boolean updateDictType(SysDictType dictType);

    /**
     * 校验字典类型称是否唯一
     *
     * @param dictType 字典类型
     * @return 结果
     */
    SysDictType checkDictTypeUnique(String dictType);
}
