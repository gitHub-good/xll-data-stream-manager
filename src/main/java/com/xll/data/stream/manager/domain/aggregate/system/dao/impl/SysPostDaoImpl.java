package com.xll.data.stream.manager.domain.aggregate.system.dao.impl;

import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xll.data.stream.manager.domain.aggregate.system.dao.SysPostDao;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysPost;
import com.xll.data.stream.manager.domain.aggregate.system.mapper.SysPostMapper;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 功能描述: <br>
 * <p>
 * 〈〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 18:49
 */
@Service
public class SysPostDaoImpl extends ServiceImpl<SysPostMapper, SysPost> implements SysPostDao {
    @Override
    public List<SysPost> selectPostList(SysPost post) {
        return list(Wrappers.lambdaQuery(SysPost.class)
                .eq(StringUtils.isNotBlank(post.getStatus()), SysPost::getStatus, post.getStatus())
                .like(StringUtils.isNotBlank(post.getPostCode()), SysPost::getPostCode, post.getPostCode())
                .like(StringUtils.isNotBlank(post.getPostName()), SysPost::getPostName, post.getPostName())
        );
    }

    @Override
    public List<SysPost> selectPostAll() {
        return list();
    }

    @Override
    public SysPost selectPostById(Long postId) {
        return getById(postId);
    }

    @Override
    public List<Long> selectPostListByUserId(Long userId) {
        return baseMapper.selectPostListByUserId(userId);
    }

    @Override
    public List<SysPost> selectPostsByUserName(String userName) {
        return baseMapper.selectPostsByUserName(userName);
    }

    @Override
    public boolean deletePostById(Long postId) {
        return removeById(postId);
    }

    @Override
    public boolean deletePostByIds(List<Long> postIds) {
        return removeBatchByIds(postIds);
    }

    @Override
    public boolean updatePost(SysPost post) {
        return updateById(post);
    }

    @Override
    public boolean insertPost(SysPost post) {
        return save(post);
    }

    @Override
    public SysPost checkPostNameUnique(String postName) {
        return getOne(Wrappers.lambdaQuery(SysPost.class).eq(SysPost::getPostName, postName));
    }

    @Override
    public SysPost checkPostCodeUnique(String postCode) {
        return getOne(Wrappers.lambdaQuery(SysPost.class).eq(SysPost::getPostCode, postCode));
    }
}
