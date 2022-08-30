package com.xll.data.stream.manager.infrastructure.framework.web.service;

import com.xll.data.stream.manager.domain.aggregate.system.entity.SysUser;
import com.xll.data.stream.manager.infrastructure.common.constant.CacheConstants;
import com.xll.data.stream.manager.infrastructure.common.constant.Constants;
import com.xll.data.stream.manager.infrastructure.common.core.redis.RedisCache;
import com.xll.data.stream.manager.infrastructure.common.exception.user.UserPasswordNotMatchException;
import com.xll.data.stream.manager.infrastructure.common.exception.user.UserPasswordRetryLimitExceedException;
import com.xll.data.stream.manager.infrastructure.common.utils.MessageUtils;
import com.xll.data.stream.manager.infrastructure.common.utils.SecurityUtils;
import com.xll.data.stream.manager.infrastructure.framework.manager.AsyncManager;
import com.xll.data.stream.manager.infrastructure.framework.manager.factory.AsyncFactory;
import com.xll.data.stream.manager.infrastructure.framework.security.context.AuthenticationContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

/**
 * 功能描述: <br>
 * <p>
 * 〈登录密码方法〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 21:34
 */
@Component
public class SysPasswordService {
    @Autowired
    private RedisCache redisCache;

    @Value(value = "${user.password.maxRetryCount}")
    private int maxRetryCount;

    @Value(value = "${user.password.lockTime}")
    private int lockTime;

    /**
     * 登录账户密码错误次数缓存键名
     * 
     * @param username 用户名
     * @return 缓存键key
     */
    private String getCacheKey(String username) {
        return CacheConstants.PWD_ERR_CNT_KEY + username;
    }

    public void validate(SysUser user) {
        Authentication usernamePasswordAuthenticationToken = AuthenticationContextHolder.getContext();
        String username = usernamePasswordAuthenticationToken.getName();
        String password = usernamePasswordAuthenticationToken.getCredentials().toString();

        Integer retryCount = redisCache.getCacheObject(getCacheKey(username));

        if (retryCount == null) {
            retryCount = 0;
        }

        if (retryCount >= Integer.valueOf(maxRetryCount).intValue()) {
            AsyncManager.me().execute(AsyncFactory.recordLoginInfo(username, Constants.LOGIN_FAIL,
                    MessageUtils.message("user.password.retry.limit.exceed", maxRetryCount, lockTime)));
            throw new UserPasswordRetryLimitExceedException(maxRetryCount, lockTime);
        }

        if (!matches(user, password)) {
            retryCount = retryCount + 1;
            AsyncManager.me().execute(AsyncFactory.recordLoginInfo(username, Constants.LOGIN_FAIL,
                    MessageUtils.message("user.password.retry.limit.count", retryCount)));
            redisCache.setCacheObject(getCacheKey(username), retryCount, lockTime, TimeUnit.MINUTES);
            throw new UserPasswordNotMatchException();
        } else {
            clearLoginRecordCache(username);
        }
    }

    public boolean matches(SysUser user, String rawPassword) {
        return SecurityUtils.matchesPassword(rawPassword, user.getPassword());
    }

    public void clearLoginRecordCache(String loginName) {
        if (redisCache.hasKey(getCacheKey(loginName))) {
            redisCache.deleteObject(getCacheKey(loginName));
        }
    }
}
