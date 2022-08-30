package com.xll.data.stream.manager.infrastructure.framework.security.handle;

import com.alibaba.fastjson2.JSON;
import com.xll.data.stream.manager.infrastructure.common.constant.Constants;
import com.xll.data.stream.manager.infrastructure.common.constant.HttpStatus;
import com.xll.data.stream.manager.infrastructure.common.core.domain.AjaxResult;
import com.xll.data.stream.manager.infrastructure.common.core.domain.model.LoginUser;
import com.xll.data.stream.manager.infrastructure.common.utils.ServletUtils;
import com.xll.data.stream.manager.infrastructure.common.utils.StringUtils;
import com.xll.data.stream.manager.infrastructure.framework.manager.AsyncManager;
import com.xll.data.stream.manager.infrastructure.framework.manager.factory.AsyncFactory;
import com.xll.data.stream.manager.infrastructure.framework.web.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 功能描述: <br>
 * <p>
 * 〈自定义退出处理类 返回成功〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 23:38
 */
@Configuration
public class LogoutSuccessHandlerImpl implements LogoutSuccessHandler {
    @Autowired
    private TokenService tokenService;

    /**
     * 退出处理
     * 
     * @return
     */
    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {
        LoginUser loginUser = tokenService.getLoginUser(request);
        if (StringUtils.isNotNull(loginUser)) {
            String userName = loginUser.getUsername();
            // 删除用户缓存记录
            tokenService.delLoginUser(loginUser.getToken());
            // 记录用户退出日志
            AsyncManager.me().execute(AsyncFactory.recordLoginInfo(userName, Constants.LOGOUT, "退出成功"));
        }
        ServletUtils.renderString(response, JSON.toJSONString(AjaxResult.error(HttpStatus.SUCCESS, "退出成功")));
    }
}
