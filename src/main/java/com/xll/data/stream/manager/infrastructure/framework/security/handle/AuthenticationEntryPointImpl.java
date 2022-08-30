package com.xll.data.stream.manager.infrastructure.framework.security.handle;

import com.alibaba.fastjson2.JSON;
import com.xll.data.stream.manager.infrastructure.common.constant.HttpStatus;
import com.xll.data.stream.manager.infrastructure.common.core.domain.AjaxResult;
import com.xll.data.stream.manager.infrastructure.common.utils.ServletUtils;
import com.xll.data.stream.manager.infrastructure.common.utils.StringUtils;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.Serializable;

/**
 * 功能描述: <br>
 * <p>
 * 〈认证失败处理类 返回未授权〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 23:38
 */
@Component
public class AuthenticationEntryPointImpl implements AuthenticationEntryPoint, Serializable {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException e)
            throws IOException {
        int code = HttpStatus.UNAUTHORIZED;
        String msg = StringUtils.format("请求访问：{}，认证失败，无法访问系统资源", request.getRequestURI());
        ServletUtils.renderString(response, JSON.toJSONString(AjaxResult.error(code, msg)));
    }
}
