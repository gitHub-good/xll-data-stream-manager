package com.xll.data.stream.manager.domain.aggregate.system.dao.impl;

import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xll.data.stream.manager.domain.aggregate.system.dao.SysNoticeDao;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysNotice;
import com.xll.data.stream.manager.domain.aggregate.system.mapper.SysNoticeMapper;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 功能描述: <br>
 * <p>
 * 〈〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 18:24
 */
@Service
public class SysNoticeDaoImpl extends ServiceImpl<SysNoticeMapper, SysNotice> implements SysNoticeDao {
    @Override
    public SysNotice selectNoticeById(Long noticeId) {
        return getById(noticeId);
    }

    @Override
    public List<SysNotice> selectNoticeList(SysNotice notice) {
        return list(Wrappers.lambdaQuery(SysNotice.class)
                .eq(StringUtils.isNotBlank(notice.getNoticeType()), SysNotice::getNoticeType, notice.getNoticeType())
                .like(StringUtils.isNotBlank(notice.getCreateBy()), SysNotice::getCreateBy, notice.getCreateBy())
        );
    }

    @Override
    public boolean insertNotice(SysNotice notice) {
        return save(notice);
    }

    @Override
    public boolean updateNotice(SysNotice notice) {
        return updateById(notice);
    }

    @Override
    public boolean deleteNoticeById(Long noticeId) {
        return removeById(noticeId);
    }

    @Override
    public boolean deleteNoticeByIds(List<Long> noticeIds) {
        return removeBatchByIds(noticeIds);
    }
}
