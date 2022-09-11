package com.xll.data.stream.manager.infrastructure.framework.manager.factory;

import com.xll.data.stream.manager.domain.aggregate.system.dao.SysLoginInfoDao;
import com.xll.data.stream.manager.domain.aggregate.system.dao.SysOperateLogDao;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysLoginInfo;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysOperateLog;
import com.xll.data.stream.manager.infrastructure.common.constant.Constants;
import com.xll.data.stream.manager.infrastructure.common.utils.LogUtils;
import com.xll.data.stream.manager.infrastructure.common.utils.ServletUtils;
import com.xll.data.stream.manager.infrastructure.common.utils.StringUtils;
import com.xll.data.stream.manager.infrastructure.common.utils.ip.AddressUtils;
import com.xll.data.stream.manager.infrastructure.common.utils.ip.IpUtils;
import com.xll.data.stream.manager.infrastructure.common.utils.spring.SpringUtils;
import eu.bitwalker.useragentutils.UserAgent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.TimerTask;

/**
 * 功能描述: <br>
 * <p>
 * 〈异步工厂（产生任务用）〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 19:35
 */
public class AsyncFactory {
    private static final Logger sys_user_logger = LoggerFactory.getLogger("sys-user");

    /**
     * 记录登录信息
     * 
     * @param username 用户名
     * @param status 状态
     * @param message 消息
     * @param args 列表
     * @return 任务task
     */
    public static TimerTask recordLoginInfo(final String username, final String status, final String message,
            final Object... args) {
        final UserAgent userAgent = UserAgent.parseUserAgentString(ServletUtils.getRequest().getHeader("User-Agent"));
        final String ip = IpUtils.getIpAddr(ServletUtils.getRequest());
        return new TimerTask() {
            @Override
            public void run() {
                String address = AddressUtils.getRealAddressByIP(ip);
                StringBuilder s = new StringBuilder();
                s.append(LogUtils.getBlock(ip));
                s.append(address);
                s.append(LogUtils.getBlock(username));
                s.append(LogUtils.getBlock(status));
                s.append(LogUtils.getBlock(message));
                // 打印信息到日志
                sys_user_logger.info(s.toString(), args);
                // 获取客户端操作系统
                String os = userAgent.getOperatingSystem().getName();
                // 获取客户端浏览器
                String browser = userAgent.getBrowser().getName();
                // 封装对象
                SysLoginInfo loginInfo = new SysLoginInfo();
                loginInfo.setUserName(username);
                loginInfo.setIpaddr(ip);
                loginInfo.setLoginLocation(address);
                loginInfo.setBrowser(browser);
                loginInfo.setOs(os);
                loginInfo.setMsg(message);
                // 日志状态
                if (StringUtils.equalsAny(status, Constants.LOGIN_SUCCESS, Constants.LOGOUT, Constants.REGISTER)) {
                    loginInfo.setStatus(Constants.SUCCESS);
                } else if (Constants.LOGIN_FAIL.equals(status)) {
                    loginInfo.setStatus(Constants.FAIL);
                }
                // 插入数据
                SpringUtils.getBean(SysLoginInfoDao.class).insertLoginInfo(loginInfo);
            }
        };
    }

    /**
     * 操作日志记录
     * 
     * @param operateLog 操作日志信息
     * @return 任务task
     */
    public static TimerTask recordOperate(final SysOperateLog operateLog) {
        return new TimerTask() {
            @Override
            public void run() {
                // 远程查询操作地点
                operateLog.setOperLocation(AddressUtils.getRealAddressByIP(operateLog.getOperIp()));
                SpringUtils.getBean(SysOperateLogDao.class).insertOperateLog(operateLog);
            }
        };
    }
}
