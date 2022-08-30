package com.xll.data.stream.manager.domain.aggregate.system.dao.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xll.data.stream.manager.domain.aggregate.system.dao.SysRoleDao;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysRole;
import com.xll.data.stream.manager.domain.aggregate.system.mapper.SysRoleMapper;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 功能描述: <br>
 * <p>
 * 〈〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 19:08
 */
@Service
public class SysRoleDaoImpl extends ServiceImpl<SysRoleMapper, SysRole> implements SysRoleDao {

    @Override
    public List<SysRole> selectRoleList(SysRole role) {
        return baseMapper.selectRoleList(role);
    }

    @Override
    public List<SysRole> selectRolePermissionByUserId(Long userId) {
        return baseMapper.selectRolePermissionByUserId(userId);
    }

    @Override
    public List<SysRole> selectRoleAll() {
        return baseMapper.selectRoleAll();
    }

    @Override
    public List<Long> selectRoleListByUserId(Long userId) {
        return baseMapper.selectRoleListByUserId(userId);
    }

    @Override
    public SysRole selectRoleById(Long roleId) {
        return baseMapper.selectRoleById(roleId);
    }

    @Override
    public List<SysRole> selectRolesByUserName(String userName) {
        return baseMapper.selectRolesByUserName(userName);
    }

    @Override
    public SysRole checkRoleNameUnique(String roleName) {
        return baseMapper.checkRoleNameUnique(roleName);
    }

    @Override
    public SysRole checkRoleKeyUnique(String roleKey) {
        return baseMapper.checkRoleKeyUnique(roleKey);
    }

    @Override
    public int updateRole(SysRole role) {
        return baseMapper.updateRole(role);
    }

    @Override
    public int insertRole(SysRole role) {
        return baseMapper.insertRole(role);
    }

    @Override
    public int deleteRoleById(Long roleId) {
        return baseMapper.deleteRoleById(roleId);
    }

    @Override
    public int deleteRoleByIds(Long[] roleIds) {
        return baseMapper.deleteRoleByIds(roleIds);
    }
}
