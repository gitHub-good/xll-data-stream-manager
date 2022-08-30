package com.xll.data.stream.manager.domain.aggregate.system.dao.impl;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xll.data.stream.manager.domain.aggregate.system.dao.SysDeptDao;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysDept;
import com.xll.data.stream.manager.domain.aggregate.system.mapper.SysDeptMapper;
import com.xll.data.stream.manager.infrastructure.common.constant.Constants;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 功能描述: <br>
 * <p>
 * 〈〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 15:21
 */
@Service
public class SysDeptDaoImpl extends ServiceImpl<SysDeptMapper, SysDept> implements SysDeptDao {
    @Override
    public List<SysDept> selectDeptList(SysDept dept) {
        return baseMapper.selectDeptList(dept);
    }

    @Override
    public List<Long> selectDeptListByRoleId(Long roleId, boolean deptCheckStrictly) {
        return baseMapper.selectDeptListByRoleId(roleId, deptCheckStrictly);
    }

    @Override
    public List<Long> selectDeptCheckedListByRoleId(Long roleId) {
        return baseMapper.selectDeptCheckedListByRoleId(roleId);
    }

    @Override
    public List<Long> selectDeptHalfCheckedListByRoleId(Long roleId) {
        return baseMapper.selectDeptHalfCheckedListByRoleId(roleId);
    }

    @Override
    public SysDept selectDeptById(Long deptId) {
        return getById(deptId);
    }

    @Override
    public List<SysDept> selectChildrenDeptById(Long deptId) {
        return baseMapper.selectChildrenDeptById(deptId);
    }

    @Override
    public int selectNormalChildrenDeptById(Long deptId) {
        return baseMapper.selectNormalChildrenDeptById(deptId);
    }

    @Override
    public boolean hasChildByDeptId(Long deptId) {
        return count(Wrappers.lambdaQuery(SysDept.class)
                .eq(SysDept::getDelFlag, Constants.DEL_FLAG_0)
                .eq(SysDept::getParentId, deptId)
        ) > 0;
    }

    @Override
    public boolean checkDeptExistUser(Long deptId) {
        return baseMapper.checkDeptExistUser(deptId) > 0;
    }

    @Override
    public SysDept checkDeptNameUnique(String deptName, Long parentId) {
        return getOne(Wrappers.lambdaQuery(SysDept.class)
                .eq(SysDept::getDelFlag, Constants.DEL_FLAG_0)
                .eq(SysDept::getParentId, parentId)
                .eq(SysDept::getDeptName, deptName)
        );
    }

    @Override
    public boolean insertDept(SysDept dept) {
        return save(dept);
    }

    @Override
    public boolean updateDept(SysDept dept) {
        return updateById(dept);
    }

    @Override
    public void updateDeptStatusNormal(List<Long> deptIds) {
        update(Wrappers.lambdaUpdate(SysDept.class)
                .set(SysDept::getStatus, Constants.DEL_FLAG_0)
                .eq(SysDept::getDeptId, deptIds)
        );
    }

    @Override
    public int updateDeptChildren(List<SysDept> depts) {
        return baseMapper.updateDeptChildren(depts);
    }

    @Override
    public boolean deleteDeptById(Long deptId) {
        return removeById(deptId);
    }
}
