package com.xll.data.stream.manager.domain.service.system.impl;

import com.google.common.collect.Lists;
import com.xll.data.stream.manager.domain.aggregate.system.dao.SysDeptDao;
import com.xll.data.stream.manager.domain.aggregate.system.dao.SysRoleDao;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysDept;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysRole;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysUser;
import com.xll.data.stream.manager.domain.service.system.ISysDeptService;
import com.xll.data.stream.manager.infrastructure.common.annotation.DataScope;
import com.xll.data.stream.manager.infrastructure.common.constant.UserConstants;
import com.xll.data.stream.manager.infrastructure.common.core.domain.TreeSelect;
import com.xll.data.stream.manager.infrastructure.common.core.text.Convert;
import com.xll.data.stream.manager.infrastructure.common.exception.ServiceException;
import com.xll.data.stream.manager.infrastructure.common.utils.SecurityUtils;
import com.xll.data.stream.manager.infrastructure.common.utils.StringUtils;
import com.xll.data.stream.manager.infrastructure.common.utils.spring.SpringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 功能描述: <br>
 * <p>
 * 〈部门管理 服务实现〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 22:28
 */
@Service
public class SysDeptServiceImpl implements ISysDeptService {
    @Autowired
    private SysDeptDao sysDeptDao;

    @Autowired
    private SysRoleDao sysRoleDao;

    /**
     * 查询部门管理数据
     *
     * @param dept 部门信息
     * @return 部门信息集合
     */
    @Override
    @DataScope(deptAlias = "d")
    public List<SysDept> selectDeptList(SysDept dept) {
        return sysDeptDao.selectDeptList(dept);
    }

    /**
     * 查询部门树结构信息
     *
     * @param dept 部门信息
     * @return 部门树信息集合
     */
    @Override
    public List<TreeSelect> selectDeptTreeList(SysDept dept) {
        List<SysDept> depts = SpringUtils.getAopProxy(this).selectDeptList(dept);
        return buildDeptTreeSelect(depts);
    }

    /**
     * 构建前端所需要树结构
     *
     * @param depts 部门列表
     * @return 树结构列表
     */
    @Override
    public List<SysDept> buildDeptTree(List<SysDept> depts) {
        List<SysDept> returnList = new ArrayList<>();
        List<Long> tempList = new ArrayList<>();
        for (SysDept dept : depts) {
            tempList.add(dept.getDeptId());
        }
        for (SysDept dept : depts) {
            // 如果是顶级节点, 遍历该父节点的所有子节点
            if (!tempList.contains(dept.getParentId())) {
                recursionFn(depts, dept);
                returnList.add(dept);
            }
        }
        if (returnList.isEmpty()) {
            returnList = depts;
        }
        return returnList;
    }

    /**
     * 构建前端所需要下拉树结构
     *
     * @param depts 部门列表
     * @return 下拉树结构列表
     */
    @Override
    public List<TreeSelect> buildDeptTreeSelect(List<SysDept> depts) {
        List<SysDept> deptTrees = buildDeptTree(depts);
        return deptTrees.stream().map(TreeSelect::new).collect(Collectors.toList());
    }

    /**
     * 根据角色ID查询部门树信息
     *
     * @param roleId 角色ID
     * @return 选中部门列表
     */
    @Override
    public List<Long> selectDeptListByRoleId(Long roleId) {
        SysRole role = sysRoleDao.selectRoleById(roleId);
        return sysDeptDao.selectDeptListByRoleId(roleId, role.isDeptCheckStrictly());
    }

    /**
     * 根据角色ID查询选中状态部门树信息
     *
     * @param roleId 角色ID
     * @return 选中状态部门列表
     */
    @Override
    public List<Long> selectDeptCheckedListByRoleId(Long roleId) {
        return sysDeptDao.selectDeptCheckedListByRoleId(roleId);
    }

    /**
     * 根据角色ID查询半选中状态部门树信息
     *
     * @param roleId 角色ID
     * @return 半选中状态部门列表
     */
    @Override
    public List<Long> selectDeptHalfCheckedListByRoleId(Long roleId) {
        return sysDeptDao.selectDeptHalfCheckedListByRoleId(roleId);
    }

    /**
     * 根据部门ID查询信息
     *
     * @param deptId 部门ID
     * @return 部门信息
     */
    @Override
    public SysDept selectDeptById(Long deptId) {
        return sysDeptDao.selectDeptById(deptId);
    }

    /**
     * 根据ID查询所有子部门（正常状态）
     *
     * @param deptId 部门ID
     * @return 子部门数
     */
    @Override
    public int selectNormalChildrenDeptById(Long deptId) {
        return sysDeptDao.selectNormalChildrenDeptById(deptId);
    }

    /**
     * 是否存在子节点
     *
     * @param deptId 部门ID
     * @return 结果
     */
    @Override
    public boolean hasChildByDeptId(Long deptId) {
        return sysDeptDao.hasChildByDeptId(deptId);
    }

    /**
     * 查询部门是否存在用户
     *
     * @param deptId 部门ID
     * @return 结果 true 存在 false 不存在
     */
    @Override
    public boolean checkDeptExistUser(Long deptId) {
        return sysDeptDao.checkDeptExistUser(deptId);
    }

    /**
     * 校验部门名称是否唯一
     *
     * @param dept 部门信息
     * @return 结果
     */
    @Override
    public String checkDeptNameUnique(SysDept dept) {
        Long deptId = StringUtils.isNull(dept.getDeptId()) ? -1L : dept.getDeptId();
        SysDept info = sysDeptDao.checkDeptNameUnique(dept.getDeptName(), dept.getParentId());
        if (StringUtils.isNotNull(info) && info.getDeptId().longValue() != deptId.longValue()) {
            return UserConstants.NOT_UNIQUE;
        }
        return UserConstants.UNIQUE;
    }

    /**
     * 校验部门是否有数据权限
     *
     * @param deptId 部门id
     */
    @Override
    public void checkDeptDataScope(Long deptId) {
        if (!SysUser.isAdmin(SecurityUtils.getUserId())) {
            SysDept dept = new SysDept();
            dept.setDeptId(deptId);
            List<SysDept> depts = SpringUtils.getAopProxy(this).selectDeptList(dept);
            if (StringUtils.isEmpty(depts)) {
                throw new ServiceException("没有权限访问部门数据！");
            }
        }
    }

    /**
     * 新增保存部门信息
     *
     * @param dept 部门信息
     * @return 结果
     */
    @Override
    public boolean insertDept(SysDept dept) {
        if (UserConstants.ORG_PARENT_ID.equals(dept.getParentId())) {
            dept.setAncestors("" + dept.getParentId());
        } else {
            SysDept info = sysDeptDao.selectDeptById(dept.getParentId());
            // 如果父节点不为正常状态,则不允许新增子节点
            if (!UserConstants.DEPT_NORMAL.equals(info.getStatus())) {
                throw new ServiceException("部门停用，不允许新增");
            }
            dept.setAncestors(info.getAncestors() + "," + dept.getParentId());
        }
        return sysDeptDao.insertDept(dept);
    }

    /**
     * 修改保存部门信息
     *
     * @param dept 部门信息
     * @return 结果
     */
    @Override
    public boolean updateDept(SysDept dept)
    {
        SysDept newParentDept = sysDeptDao.selectDeptById(dept.getParentId());
        SysDept oldDept = sysDeptDao.selectDeptById(dept.getDeptId());
        if (StringUtils.isNotNull(newParentDept) && StringUtils.isNotNull(oldDept)) {
            String newAncestors = newParentDept.getAncestors() + "," + newParentDept.getDeptId();
            String oldAncestors = oldDept.getAncestors();
            dept.setAncestors(newAncestors);
            updateDeptChildren(dept.getDeptId(), newAncestors, oldAncestors);
        }
        if (UserConstants.DEPT_NORMAL.equals(dept.getStatus()) && StringUtils.isNotEmpty(dept.getAncestors())
                && !StringUtils.equals("0", dept.getAncestors())) {
            // 如果该部门是启用状态，则启用该部门的所有上级部门
            updateParentDeptStatusNormal(dept);
        }
        return sysDeptDao.updateDept(dept);
    }

    /**
     * 修改该部门的父级部门状态
     *
     * @param dept 当前部门
     */
    private void updateParentDeptStatusNormal(SysDept dept) {
        String ancestors = dept.getAncestors();
        Long[] deptIds = Convert.toLongArray(ancestors);
        sysDeptDao.updateDeptStatusNormal(Lists.newArrayList(deptIds));
    }

    /**
     * 修改子元素关系
     *
     * @param deptId 被修改的部门ID
     * @param newAncestors 新的父ID集合
     * @param oldAncestors 旧的父ID集合
     */
    public void updateDeptChildren(Long deptId, String newAncestors, String oldAncestors) {
        List<SysDept> children = sysDeptDao.selectChildrenDeptById(deptId);
        for (SysDept child : children) {
            child.setAncestors(child.getAncestors().replaceFirst(oldAncestors, newAncestors));
        }
        if (children.size() > 0) {
            sysDeptDao.updateDeptChildren(children);
        }
    }

    /**
     * 删除部门管理信息
     *
     * @param deptId 部门ID
     * @return 结果
     */
    @Override
    public boolean deleteDeptById(Long deptId) {
        return sysDeptDao.deleteDeptById(deptId);
    }

    /**
     * 递归列表
     */
    private void recursionFn(List<SysDept> list, SysDept t) {
        // 得到子节点列表
        List<SysDept> childList = getChildList(list, t);
        t.setChildren(childList);
        for (SysDept tChild : childList) {
            if (hasChild(list, tChild)) {
                recursionFn(list, tChild);
            }
        }
    }

    /**
     * 得到子节点列表
     */
    private List<SysDept> getChildList(List<SysDept> list, SysDept t) {
        List<SysDept> tlist = new ArrayList<>();
        Iterator<SysDept> it = list.iterator();
        while (it.hasNext()) {
            SysDept n = it.next();
            if (StringUtils.isNotNull(n.getParentId()) && n.getParentId().longValue() == t.getDeptId().longValue()) {
                tlist.add(n);
            }
        }
        return tlist;
    }

    /**
     * 判断是否有子节点
     */
    private boolean hasChild(List<SysDept> list, SysDept t) {
        return getChildList(list, t).size() > 0;
    }
}
