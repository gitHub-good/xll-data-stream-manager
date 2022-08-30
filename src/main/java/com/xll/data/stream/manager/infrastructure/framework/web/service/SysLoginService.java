package com.xll.data.stream.manager.infrastructure.framework.web.service;

import com.xll.data.stream.manager.domain.aggregate.system.dao.SysUserDao;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysUser;
import com.xll.data.stream.manager.domain.aggregate.system.mapper.SysUserRepository;
import com.xll.data.stream.manager.domain.service.system.ISysConfigService;
import com.xll.data.stream.manager.infrastructure.common.constant.CacheConstants;
import com.xll.data.stream.manager.infrastructure.common.constant.Constants;
import com.xll.data.stream.manager.infrastructure.common.core.domain.model.LoginUser;
import com.xll.data.stream.manager.infrastructure.common.core.redis.RedisCache;
import com.xll.data.stream.manager.infrastructure.common.exception.ServiceException;
import com.xll.data.stream.manager.infrastructure.common.exception.user.CaptchaException;
import com.xll.data.stream.manager.infrastructure.common.exception.user.CaptchaExpireException;
import com.xll.data.stream.manager.infrastructure.common.exception.user.UserPasswordNotMatchException;
import com.xll.data.stream.manager.infrastructure.common.utils.DateUtils;
import com.xll.data.stream.manager.infrastructure.common.utils.MessageUtils;
import com.xll.data.stream.manager.infrastructure.common.utils.ServletUtils;
import com.xll.data.stream.manager.infrastructure.common.utils.StringUtils;
import com.xll.data.stream.manager.infrastructure.common.utils.ip.IpUtils;
import com.xll.data.stream.manager.infrastructure.framework.manager.AsyncManager;
import com.xll.data.stream.manager.infrastructure.framework.manager.factory.AsyncFactory;
import com.xll.data.stream.manager.infrastructure.framework.security.context.AuthenticationContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

/**
 * 功能描述: <br>
 * <p>
 * 〈登录校验方法〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 19:39
 */
@Component
public class SysLoginService {
    @Autowired
    private TokenService tokenService;

    @Resource
    private AuthenticationManager authenticationManager;

    @Autowired
    private RedisCache redisCache;
    
    @Autowired
    private SysUserRepository sysUserRepository;

    @Autowired
    private ISysConfigService configService;

    /**
     * 登录验证
     * 
     * @param username 用户名
     * @param password 密码
     * @param code 验证码
     * @param uuid 唯一标识
     * @return 结果
     */
    public String login(String username, String password, String code, String uuid) {
        boolean captchaEnabled = configService.selectCaptchaEnabled();
        // 验证码开关
        if (captchaEnabled) {
            validateCaptcha(username, code, uuid);
        }
        // 用户验证
        Authentication authentication ;
        try {
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password);
            AuthenticationContextHolder.setContext(authenticationToken);
            // 该方法会去调用UserDetailsServiceImpl.loadUserByUsername
            authentication = authenticationManager.authenticate(authenticationToken);
        } catch (Exception e) {
            if (e instanceof BadCredentialsException) {
                AsyncManager.me().execute(AsyncFactory.recordLoginInfo(username, Constants.LOGIN_FAIL, MessageUtils.message("user.password.not.match")));
                throw new UserPasswordNotMatchException();
            } else {
                AsyncManager.me().execute(AsyncFactory.recordLoginInfo(username, Constants.LOGIN_FAIL, e.getMessage()));
                throw new ServiceException(e.getMessage());
            }
        } finally {
            AuthenticationContextHolder.clearContext();
        }
        AsyncManager.me().execute(AsyncFactory.recordLoginInfo(username, Constants.LOGIN_SUCCESS, MessageUtils.message("user.login.success")));
        LoginUser loginUser = (LoginUser) authentication.getPrincipal();
        recordLoginInfo(loginUser.getUserId());
        // 生成token
        return tokenService.createToken(loginUser);
    }

    /**
     * 校验验证码
     * 
     * @param username 用户名
     * @param code 验证码
     * @param uuid 唯一标识
     * @return 结果
     */
    public void validateCaptcha(String username, String code, String uuid) {
        String verifyKey = CacheConstants.CAPTCHA_CODE_KEY + StringUtils.nvl(uuid, "");
        String captcha = redisCache.getCacheObject(verifyKey);
        redisCache.deleteObject(verifyKey);
        if (captcha == null) {
            AsyncManager.me().execute(AsyncFactory.recordLoginInfo(username, Constants.LOGIN_FAIL, MessageUtils.message("user.jcaptcha.expire")));
            throw new CaptchaExpireException();
        }
        if (!code.equalsIgnoreCase(captcha)) {
            AsyncManager.me().execute(AsyncFactory.recordLoginInfo(username, Constants.LOGIN_FAIL, MessageUtils.message("user.jcaptcha.error")));
            throw new CaptchaException();
        }
    }

    /**
     * 记录登录信息
     *
     * @param userId 用户ID
     */
    public void recordLoginInfo(Long userId) {
        SysUser sysUser = new SysUser();
        sysUser.setUserId(userId);
        sysUser.setLoginIp(IpUtils.getIpAddr(ServletUtils.getRequest()));
        sysUser.setLoginDate(DateUtils.getNowDate());
        sysUserRepository.updateUser(sysUser);
    }
}
