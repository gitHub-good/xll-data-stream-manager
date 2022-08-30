package com.xll.data.stream.manager.domain.aggregate.system.dao;

import com.baomidou.mybatisplus.extension.service.IService;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysDept;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 功能描述: <br>
 * <p>
 * 〈部门管理〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 15:20
 */
public interface SysDeptDao extends IService<SysDept> {
    /**
     * 查询部门管理数据
     *
     * @param dept 部门信息
     * @return 部门信息集合
     */
    List<SysDept> selectDeptList(SysDept dept);

    /**
     * 根据角色ID查询部门树信息
     *
     * @param roleId 角色ID
     * @param deptCheckStrictly 部门树选择项是否关联显示
     * @return 选中部门列表
     */
    List<Long> selectDeptListByRoleId(@Param("roleId") Long roleId, @Param("deptCheckStrictly") boolean deptCheckStrictly);

    /**
     * 根据角色ID查询选中状态部门树信息
     *
     * @param roleId 角色ID
     * @return 选中状态部门列表
     */
    List<Long> selectDeptCheckedListByRoleId(@Param("roleId") Long roleId);

    /**
     * 根据角色ID查询半选中状态部门树信息
     *
     * @param roleId 角色ID
     * @return 半选中状态部门列表
     */
    List<Long> selectDeptHalfCheckedListByRoleId(@Param("roleId") Long roleId);

    /**
     * 根据部门ID查询信息
     *
     * @param deptId 部门ID
     * @return 部门信息
     */
    SysDept selectDeptById(Long deptId);

    /**
     * 根据ID查询所有子部门
     *
     * @param deptId 部门ID
     * @return 部门列表
     */
    List<SysDept> selectChildrenDeptById(Long deptId);

    /**
     * 根据ID查询所有子部门（正常状态）
     *
     * @param deptId 部门ID
     * @return 子部门数
     */
    int selectNormalChildrenDeptById(Long deptId);

    /**
     * 是否存在子节点
     *
     * @param deptId 部门ID
     * @return 结果
     */
    boolean hasChildByDeptId(Long deptId);

    /**
     * 查询部门是否存在用户
     *
     * @param deptId 部门ID
     * @return 结果
     */
    boolean checkDeptExistUser(Long deptId);

    /**
     * 校验部门名称是否唯一
     *
     * @param deptName 部门名称
     * @param parentId 父部门ID
     * @return 结果
     */
    SysDept checkDeptNameUnique(@Param("deptName") String deptName, @Param("parentId") Long parentId);

    /**
     * 新增部门信息
     *
     * @param dept 部门信息
     * @return 结果
     */
    boolean insertDept(SysDept dept);

    /**
     * 修改部门信息
     *
     * @param dept 部门信息
     * @return 结果
     */
    boolean updateDept(SysDept dept);

    /**
     * 修改所在部门正常状态
     *
     * @param deptIds 部门ID组
     */
    void updateDeptStatusNormal(List<Long> deptIds);

    /**
     * 修改子元素关系
     *
     * @param depts 子元素
     * @return 结果
     */
    int updateDeptChildren(@Param("depts") List<SysDept> depts);

    /**
     * 删除部门管理信息
     *
     * @param deptId 部门ID
     * @return 结果
     */
    boolean deleteDeptById(Long deptId);
}
