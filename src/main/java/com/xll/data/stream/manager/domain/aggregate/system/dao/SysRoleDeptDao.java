package com.xll.data.stream.manager.domain.aggregate.system.dao;

import com.baomidou.mybatisplus.extension.service.IService;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysRoleDept;

import java.util.List;
/**
 * 功能描述: <br>
 * <p>
 * 〈〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 18:58
 */
public interface SysRoleDeptDao extends IService<SysRoleDept> {

    /**
     * 通过角色ID删除角色和部门关联
     *
     * @param roleId 角色ID
     * @return 结果
     */
    boolean deleteRoleDeptByRoleId(Long roleId);

    /**
     * 批量删除角色部门关联信息
     *
     * @param ids 需要删除的数据ID
     * @return 结果
     */
    boolean deleteRoleDept(List<Long> ids);

    /**
     * 查询部门使用数量
     *
     * @param deptId 部门ID
     * @return 结果
     */
    long selectCountRoleDeptByDeptId(Long deptId);

    /**
     * 批量新增角色部门信息
     *
     * @param roleDeptList 角色部门列表
     * @return 结果
     */
    boolean batchRoleDept(List<SysRoleDept> roleDeptList);
}
