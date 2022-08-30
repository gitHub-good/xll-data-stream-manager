package com.xll.data.stream.manager.domain.aggregate.system.dao.impl;

import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xll.data.stream.manager.domain.aggregate.system.dao.SysMenuDao;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysMenu;
import com.xll.data.stream.manager.domain.aggregate.system.mapper.SysMenuMapper;
import org.springframework.stereotype.Service;

import java.util.List;
/**
 * 功能描述: <br>
 * <p>
 * 〈〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 18:06
 */
@Service
public class SysMenuDaoImpl extends ServiceImpl<SysMenuMapper, SysMenu> implements SysMenuDao {
    @Override
    public List<SysMenu> selectMenuList(SysMenu menu) {
        return baseMapper.selectMenuList(menu);
    }

    @Override
    public List<String> selectMenuPerms() {
        return baseMapper.selectMenuPerms();
    }

    @Override
    public List<SysMenu> selectMenuListByUserId(SysMenu menu) {
       return baseMapper.selectMenuListByUserId(menu);
    }

    @Override
    public List<String> selectMenuPermsByRoleId(Long roleId) {
        return baseMapper.selectMenuPermsByRoleId(roleId);
    }

    @Override
    public List<String> selectMenuPermsByUserId(Long userId) {
        return baseMapper.selectMenuPermsByUserId(userId);
    }

    @Override
    public List<SysMenu> selectMenuTreeAll() {
        return baseMapper.selectMenuTreeAll();
    }

    @Override
    public List<SysMenu> selectMenuTreeByUserId(Long userId) {
        return baseMapper.selectMenuTreeByUserId(userId);
    }

    @Override
    public List<Long> selectMenuListByRoleId(Long roleId, boolean menuCheckStrictly) {
        return baseMapper.selectMenuListByRoleId(roleId, menuCheckStrictly);
    }

    @Override
    public List<Long> selectMenuCheckedListByRoleId(Long roleId) {
        return baseMapper.selectMenuCheckedListByRoleId(roleId);
    }

    @Override
    public List<Long> selectMenuHalfCheckedListByRoleId(Long roleId) {
        return baseMapper.selectMenuCheckedListByRoleId(roleId);
    }

    @Override
    public SysMenu selectMenuById(Long menuId) {
        return baseMapper.selectMenuById(menuId);
    }

    @Override
    public boolean hasChildByMenuId(Long menuId) {
        return baseMapper.hasChildByMenuId(menuId) > 0;
    }

    @Override
    public boolean insertMenu(SysMenu menu) {
        return baseMapper.insertMenu(menu) > 0;
    }

    @Override
    public boolean updateMenu(SysMenu menu) {
        return updateById(menu);
    }

    @Override
    public boolean deleteMenuById(Long menuId) {
        return removeById(menuId);
    }

    @Override
    public SysMenu checkMenuNameUnique(String menuName, Long parentId) {
        return getOne(Wrappers.lambdaQuery(SysMenu.class).eq(SysMenu::getMenuName, menuName).eq(SysMenu::getParentId, parentId));
    }
}
