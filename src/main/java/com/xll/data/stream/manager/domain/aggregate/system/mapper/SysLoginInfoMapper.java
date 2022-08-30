package com.xll.data.stream.manager.domain.aggregate.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysLoginInfo;
import org.springframework.stereotype.Repository;


/**
 * 功能描述: <br>
 * <p>
 * 〈系统访问日志情况信息 数据层〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 17:48
 */
public interface SysLoginInfoMapper extends BaseMapper<SysLoginInfo> {
    /**
     * 清空系统登录日志
     *
     * @return 结果
     */
    int cleanLoginInfo();
}
