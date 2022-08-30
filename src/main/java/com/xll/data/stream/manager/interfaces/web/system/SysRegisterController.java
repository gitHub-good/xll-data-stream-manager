package com.xll.data.stream.manager.interfaces.web.system;

import com.xll.data.stream.manager.domain.service.system.ISysConfigService;
import com.xll.data.stream.manager.infrastructure.common.core.controller.BaseController;
import com.xll.data.stream.manager.infrastructure.common.core.domain.AjaxResult;
import com.xll.data.stream.manager.infrastructure.common.core.domain.model.RegisterBody;
import com.xll.data.stream.manager.infrastructure.common.utils.StringUtils;
import com.xll.data.stream.manager.infrastructure.framework.web.service.SysRegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * 功能描述: <br>
 * <p>
 * 〈注册验证〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 23:28
 */
@RestController
public class SysRegisterController extends BaseController {
    @Autowired
    private SysRegisterService registerService;

    @Autowired
    private ISysConfigService configService;

    @PostMapping("/register")
    public AjaxResult register(@RequestBody RegisterBody user) {
        if (!("true".equals(configService.selectConfigByKey("sys.account.registerUser")))) {
            return error("当前系统没有开启注册功能！");
        }
        String msg = registerService.register(user);
        return StringUtils.isEmpty(msg) ? success() : error(msg);
    }
}
