package com.xll.data.stream.manager.domain.aggregate.system.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.xll.data.stream.manager.infrastructure.common.core.domain.BasePO;
import lombok.Data;

import java.util.Date;

/**
 * 功能描述: <br>
 * <p>
 * 〈系统访问记录表 sys_logininfor〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 17:49
 */
@Data
@TableName("t_sys_login_info")
public class SysLoginInfo extends BasePO {

    /** ID */
    @TableId
    private Long infoId;

    /** 用户账号 */
    private String userName;

    /** 登录状态 0成功 1失败 */
    private String status;

    /** 登录IP地址 */
    private String ipaddr;

    /** 登录地点 */
    private String loginLocation;

    /** 浏览器类型 */
    private String browser;

    /** 操作系统 */
    private String os;

    /** 提示消息 */
    private String msg;

    /** 访问时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date loginTime;
}
