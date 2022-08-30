package com.xll.data.stream.manager.domain.aggregate.system.mapper;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xll.data.stream.manager.domain.aggregate.system.dao.SysUserDao;
import com.xll.data.stream.manager.domain.aggregate.system.entity.SysUser;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 功能描述: <br>
 * <p>
 * 〈〉
 * </p>
 * @Author: xuliangliang
 * @Date: 2022/8/27 19:23
 */
@Service
public class SysUserRepository extends ServiceImpl<SysUserMapper, SysUser> {

    
    public List<SysUser> selectUserList(SysUser sysUser) {
        return baseMapper.selectUserList(sysUser);
    }

    
    public List<SysUser> selectAllocatedList(SysUser user) {
        return baseMapper.selectAllocatedList(user);
    }

    
    public List<SysUser> selectUnallocatedList(SysUser user) {
        return baseMapper.selectUnallocatedList(user);
    }

    
    public SysUser selectUserByUserName(String userName) {
        return baseMapper.selectUserByUserName(userName);
    }

    
    public SysUser selectUserById(Long userId) {
        return baseMapper.selectUserById(userId);
    }

    
    public int insertUser(SysUser user) {
        return baseMapper.insertUser(user);
    }

    
    public int updateUser(SysUser user) {
        return baseMapper.updateUser(user);
    }

    
    public int updateUserAvatar(String userName, String avatar) {
        return baseMapper.updateUserAvatar(userName, avatar);
    }

    
    public int resetUserPwd(String userName, String password) {
        return baseMapper.resetUserPwd(userName, password);
    }

    
    public int deleteUserById(Long userId) {
        return baseMapper.deleteUserById(userId);
    }

    
    public int deleteUserByIds(Long[] userIds) {
        return baseMapper.deleteUserByIds(userIds);
    }

    
    public int checkUserNameUnique(String userName) {
        return baseMapper.checkUserNameUnique(userName);
    }

    
    public SysUser checkPhoneUnique(String phonenumber) {
        return baseMapper.checkPhoneUnique(phonenumber);
    }

    
    public SysUser checkEmailUnique(String email) {
        return baseMapper.checkEmailUnique(email);
    }
}
