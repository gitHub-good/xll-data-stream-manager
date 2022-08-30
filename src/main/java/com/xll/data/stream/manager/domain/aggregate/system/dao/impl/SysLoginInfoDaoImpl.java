package com.xll.data.stream.manager.domain.aggregate.system.dao.impl;

import com.baomidou.mybatisplus.core.toolkit.ObjectUtils;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xll.data.stream.manager.domain.aggregate.system.dao.SysLoginInfoDao;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysLoginInfo;
import com.xll.data.stream.manager.domain.aggregate.system.mapper.SysLoginInfoMapper;
import org.springframework.stereotype.Service;

import java.util.List;
/**
 * 功能描述: <br>
 * <p>
 * 〈〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 17:54
 */
@Service
public class SysLoginInfoDaoImpl extends ServiceImpl<SysLoginInfoMapper, SysLoginInfo> implements SysLoginInfoDao {
    @Override
    public void insertLoginInfo(SysLoginInfo loginInfo) {
        save(loginInfo);
    }

    @Override
    public List<SysLoginInfo> selectLoginInfoList(SysLoginInfo loginInfo) {
        return list(Wrappers.lambdaQuery(SysLoginInfo.class)
                .eq(StringUtils.isNotBlank(loginInfo.getStatus()), SysLoginInfo::getStatus, loginInfo.getStatus())
                .like(StringUtils.isNotBlank(loginInfo.getIpaddr()), SysLoginInfo::getIpaddr, loginInfo.getIpaddr())
                .like(StringUtils.isNotBlank(loginInfo.getUserName()), SysLoginInfo::getUserName, loginInfo.getUserName())
                .lt(ObjectUtils.isNotEmpty(loginInfo.getParams().get("beginTime")), SysLoginInfo::getCreateTime, loginInfo.getParams().get("beginTime"))
                .gt(ObjectUtils.isNotEmpty(loginInfo.getParams().get("endTime")), SysLoginInfo::getCreateTime, loginInfo.getParams().get("endTime"))
        );
    }

    @Override
    public boolean deleteLoginInfoByIds(List<Long> infoIds) {
        return removeBatchByIds(infoIds);
    }

    @Override
    public int cleanLoginInfo() {
        return baseMapper.cleanLoginInfo();
    }
}
