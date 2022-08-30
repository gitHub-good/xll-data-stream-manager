package com.xll.data.stream.manager.domain.service.system.impl;

import com.xll.data.stream.manager.domain.aggregate.system.dao.SysDictDataDao;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysDictData;
import com.xll.data.stream.manager.domain.service.system.ISysDictDataService;
import com.xll.data.stream.manager.infrastructure.common.utils.DictUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 字典 业务层处理
 * 
 * @author ruoyi
 */
@Service
public class SysDictDataServiceImpl implements ISysDictDataService {
    @Autowired
    private SysDictDataDao sysDictDataDao;

    /**
     * 根据条件分页查询字典数据
     * 
     * @param dictData 字典数据信息
     * @return 字典数据集合信息
     */
    @Override
    public List<SysDictData> selectDictDataList(SysDictData dictData) {
        return sysDictDataDao.selectDictDataList(dictData);
    }

    /**
     * 根据字典类型和字典键值查询字典数据信息
     * 
     * @param dictType 字典类型
     * @param dictValue 字典键值
     * @return 字典标签
     */
    @Override
    public String selectDictLabel(String dictType, String dictValue) {
        return sysDictDataDao.selectDictLabel(dictType, dictValue);
    }

    /**
     * 根据字典数据ID查询信息
     * 
     * @param dictCode 字典数据ID
     * @return 字典数据
     */
    @Override
    public SysDictData selectDictDataById(Long dictCode) {
        return sysDictDataDao.selectDictDataById(dictCode);
    }

    /**
     * 批量删除字典数据信息
     * 
     * @param dictCodes 需要删除的字典数据ID
     */
    @Override
    public void deleteDictDataByIds(Long[] dictCodes) {
        for (Long dictCode : dictCodes) {
            SysDictData data = selectDictDataById(dictCode);
            sysDictDataDao.deleteDictDataById(dictCode);
            List<SysDictData> dictDatas = sysDictDataDao.selectDictDataByType(data.getDictType());
            DictUtils.setDictCache(data.getDictType(), dictDatas);
        }
    }

    /**
     * 新增保存字典数据信息
     * 
     * @param data 字典数据信息
     * @return 结果
     */
    @Override
    public boolean insertDictData(SysDictData data) {
        if (sysDictDataDao.insertDictData(data)){
            List<SysDictData> dictDatas = sysDictDataDao.selectDictDataByType(data.getDictType());
            DictUtils.setDictCache(data.getDictType(), dictDatas);
        }
        return true;
    }

    /**
     * 修改保存字典数据信息
     * 
     * @param data 字典数据信息
     * @return 结果
     */
    @Override
    public boolean updateDictData(SysDictData data) {
        if (sysDictDataDao.updateDictData(data)) {
            List<SysDictData> dictDatas = sysDictDataDao.selectDictDataByType(data.getDictType());
            DictUtils.setDictCache(data.getDictType(), dictDatas);
        }
        return true;
    }
}
