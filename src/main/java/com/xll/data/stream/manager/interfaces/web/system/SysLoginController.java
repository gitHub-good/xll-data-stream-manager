package com.xll.data.stream.manager.interfaces.web.system;

import com.xll.data.stream.manager.domain.aggregate.system.entity.SysMenu;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysUser;
import com.xll.data.stream.manager.domain.service.system.ISysMenuService;
import com.xll.data.stream.manager.infrastructure.common.constant.Constants;
import com.xll.data.stream.manager.infrastructure.common.core.domain.AjaxResult;
import com.xll.data.stream.manager.infrastructure.common.core.domain.model.LoginBody;
import com.xll.data.stream.manager.infrastructure.common.utils.SecurityUtils;
import com.xll.data.stream.manager.infrastructure.framework.web.service.SysLoginService;
import com.xll.data.stream.manager.infrastructure.framework.web.service.SysPermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;

/**
 * 功能描述: <br>
 * <p>
 * 〈登录验证〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 23:04
 */
@RestController
public class SysLoginController {
    @Autowired
    private SysLoginService loginService;

    @Autowired
    private ISysMenuService menuService;

    @Autowired
    private SysPermissionService permissionService;

    /**
     * 登录方法
     * 
     * @param loginBody 登录信息
     * @return 结果
     */
    @PostMapping("/login")
    public AjaxResult login(@RequestBody LoginBody loginBody) {
        AjaxResult ajax = AjaxResult.success();
        // 生成令牌
        String token = loginService.login(loginBody.getUsername(), loginBody.getPassword(), loginBody.getCode(),
                loginBody.getUuid());
        ajax.put(Constants.TOKEN, token);
        return ajax;
    }

    /**
     * 获取用户信息
     * 
     * @return 用户信息
     */
    @GetMapping("getInfo")
    public AjaxResult getInfo() {
        SysUser user = SecurityUtils.getLoginUser().getUser();
        // 角色集合
        Set<String> roles = permissionService.getRolePermission(user);
        // 权限集合
        Set<String> permissions = permissionService.getMenuPermission(user);
        AjaxResult ajax = AjaxResult.success();
        ajax.put("user", user);
        ajax.put("roles", roles);
        ajax.put("permissions", permissions);
        return ajax;
    }

    /**
     * 获取路由信息
     * 
     * @return 路由信息
     */
    @GetMapping("getRouters")
    public AjaxResult getRouters() {
        Long userId = SecurityUtils.getUserId();
        List<SysMenu> menus = menuService.selectMenuTreeByUserId(userId);
        return AjaxResult.success(menuService.buildMenus(menus));
    }
}
