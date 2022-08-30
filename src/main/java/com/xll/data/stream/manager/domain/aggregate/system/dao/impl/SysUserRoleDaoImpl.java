package com.xll.data.stream.manager.domain.aggregate.system.dao.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xll.data.stream.manager.domain.aggregate.system.dao.SysUserRoleDao;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysUserRole;
import com.xll.data.stream.manager.domain.aggregate.system.mapper.SysUserRoleMapper;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 功能描述: <br>
 * <p>
 * 〈〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 21:41
 */
@Service
public class SysUserRoleDaoImpl extends ServiceImpl<SysUserRoleMapper, SysUserRole> implements SysUserRoleDao {
    @Override
    public int deleteUserRoleByUserId(Long userId) {
        return baseMapper.deleteUserRoleByUserId(userId);
    }

    @Override
    public int deleteUserRole(Long[] ids) {
        return baseMapper.deleteUserRole(ids);
    }

    @Override
    public int countUserRoleByRoleId(Long roleId) {
        return baseMapper.countUserRoleByRoleId(roleId);
    }

    @Override
    public int batchUserRole(List<SysUserRole> userRoleList) {
        return baseMapper.batchUserRole(userRoleList);
    }

    @Override
    public int deleteUserRoleInfo(SysUserRole userRole) {
        return baseMapper.deleteUserRoleInfo(userRole);
    }

    @Override
    public int deleteUserRoleInfos(Long roleId, Long[] userIds) {
        return baseMapper.deleteUserRoleInfos(roleId, userIds);
    }
}
