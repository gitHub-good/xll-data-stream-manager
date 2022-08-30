package com.xll.data.stream.manager.domain.aggregate.system.dao.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xll.data.stream.manager.domain.aggregate.system.dao.SysUserPostDao;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysUserPost;
import com.xll.data.stream.manager.domain.aggregate.system.mapper.SysUserPostMapper;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 功能描述: <br>
 * <p>
 * 〈〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 22:09
 */
@Service
public class SysUserPostDaoImpl extends ServiceImpl<SysUserPostMapper, SysUserPost> implements SysUserPostDao {
    @Override
    public int deleteUserPostByUserId(Long userId) {
        return baseMapper.deleteUserPostByUserId(userId);
    }

    @Override
    public int countUserPostById(Long postId) {
        return baseMapper.countUserPostById(postId);
    }

    @Override
    public int deleteUserPost(Long[] ids) {
        return baseMapper.deleteUserPost(ids);
    }

    @Override
    public int batchUserPost(List<SysUserPost> userPostList) {
        return baseMapper.batchUserPost(userPostList);
    }
}
