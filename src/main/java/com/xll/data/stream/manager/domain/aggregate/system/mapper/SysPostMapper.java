package com.xll.data.stream.manager.domain.aggregate.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysPost;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 功能描述: <br>
 * <p>
 * 〈岗位信息 数据层〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 18:45
 */
@Repository
public interface SysPostMapper extends BaseMapper<SysPost> {

    /**
     * 根据用户ID获取岗位选择框列表
     *
     * @param userId 用户ID
     * @return 选中岗位ID列表
     */
    List<Long> selectPostListByUserId(Long userId);

    /**
     * 查询用户所属岗位组
     *
     * @param userName 用户名
     * @return 结果
     */
    List<SysPost> selectPostsByUserName(String userName);
}
