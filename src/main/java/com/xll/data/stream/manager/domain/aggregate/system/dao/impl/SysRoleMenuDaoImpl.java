package com.xll.data.stream.manager.domain.aggregate.system.dao.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xll.data.stream.manager.domain.aggregate.system.dao.SysRoleMenuDao;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysRoleMenu;
import com.xll.data.stream.manager.domain.aggregate.system.mapper.SysRoleMenuMapper;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 功能描述: <br>
 * <p>
 * 〈〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 19:23
 */
@Service
public class SysRoleMenuDaoImpl extends ServiceImpl<SysRoleMenuMapper, SysRoleMenu> implements SysRoleMenuDao {
    @Override
    public int checkMenuExistRole(Long menuId) {
        return baseMapper.checkMenuExistRole(menuId);
    }

    @Override
    public int deleteRoleMenuByRoleId(Long roleId) {
        return baseMapper.deleteRoleMenuByRoleId(roleId);
    }

    @Override
    public int deleteRoleMenu(Long[] ids) {
        return baseMapper.deleteRoleMenu(ids);
    }

    @Override
    public int batchRoleMenu(List<SysRoleMenu> roleMenuList) {
        return baseMapper.batchRoleMenu(roleMenuList);
    }
}
