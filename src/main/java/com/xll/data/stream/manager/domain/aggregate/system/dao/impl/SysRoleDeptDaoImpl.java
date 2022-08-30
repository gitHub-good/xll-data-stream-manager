package com.xll.data.stream.manager.domain.aggregate.system.dao.impl;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xll.data.stream.manager.domain.aggregate.system.dao.SysRoleDeptDao;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysRoleDept;
import com.xll.data.stream.manager.domain.aggregate.system.mapper.SysRoleDeptMapper;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 功能描述: <br>
 * <p>
 * 〈〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 18:58
 */
@Service
public class SysRoleDeptDaoImpl extends ServiceImpl<SysRoleDeptMapper, SysRoleDept> implements SysRoleDeptDao {
    @Override
    public boolean deleteRoleDeptByRoleId(Long roleId) {
        return remove(Wrappers.lambdaQuery(SysRoleDept.class).eq(SysRoleDept::getRoleId, roleId));
    }

    @Override
    public boolean deleteRoleDept(List<Long> ids) {
        return remove(Wrappers.lambdaQuery(SysRoleDept.class).in(SysRoleDept::getRoleId, ids));
    }

    @Override
    public long selectCountRoleDeptByDeptId(Long deptId) {
        return count(Wrappers.lambdaQuery(SysRoleDept.class).eq(SysRoleDept::getDeptId, deptId));
    }

    @Override
    public boolean batchRoleDept(List<SysRoleDept> roleDeptList) {
        return saveBatch(roleDeptList);
    }
}
