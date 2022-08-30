package com.xll.data.stream.manager.domain.aggregate.system.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.xll.data.stream.manager.infrastructure.common.core.domain.BaseEntity;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

/**
 * 功能描述: <br>
 * <p>
 * 〈菜单权限表 sys_menu〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 18:03
 */
@Data
@TableName("t_sys_menu")
public class SysMenu extends BaseEntity {

    /** 菜单ID */
    @TableId
    private Long menuId;

    /** 菜单名称 */
    private String menuName;

    /** 父菜单名称 */
    private String parentName;

    /** 父菜单ID */
    private Long parentId;

    /** 显示顺序 */
    private Integer orderNum;

    /** 路由地址 */
    private String path;

    /** 组件路径 */
    private String component;

    /** 路由参数 */
    private String query;

    /** 是否为外链（0是 1否） */
    private String isFrame;

    /** 是否缓存（0缓存 1不缓存） */
    private String isCache;

    /** 类型（M目录 C菜单 F按钮） */
    private String menuType;

    /** 显示状态（0显示 1隐藏） */
    private String visible;
    
    /** 菜单状态（0显示 1隐藏） */
    private String status;

    /** 权限字符串 */
    private String perms;

    /** 菜单图标 */
    private String icon;

    /** 子菜单 */
    private List<SysMenu> children = new ArrayList<>();
}
