//package com.xll.data.stream.manager.domain.aggregate.system.dao.impl;
//
//import com.baomidou.mybatisplus.core.toolkit.Wrappers;
//import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
//import com.xll.data.stream.manager.domain.aggregate.system.dao.SysUserDao;
//import com.xll.data.stream.manager.domain.aggregate.system.entity.SysUser;
//import com.xll.data.stream.manager.domain.aggregate.system.mapper.SysUserMapper;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
///**
// * 功能描述: <br>
// * <p>
// * 〈〉
// * </p>
// * @Author: xuliangliang
// * @Date: 2022/8/27 19:23
// */
//@Service
//public class SysUserDaoImpl extends ServiceImpl<SysUserMapper, SysUser> implements SysUserDao {
//
//    @Override
//    public List<SysUser> selectUserList(SysUser sysUser) {
//        return baseMapper.selectUserList(sysUser);
//    }
//
//    @Override
//    public List<SysUser> selectAllocatedList(SysUser user) {
//        return baseMapper.selectAllocatedList(user);
//    }
//
//    @Override
//    public List<SysUser> selectUnallocatedList(SysUser user) {
//        return baseMapper.selectUnallocatedList(user);
//    }
//
//    @Override
//    public SysUser selectUserByUserName(String userName) {
//        return baseMapper.selectUserByUserName(userName);
//    }
//
//    @Override
//    public SysUser selectUserById(Long userId) {
//        return baseMapper.selectUserById(userId);
//    }
//
//    @Override
//    public int insertUser(SysUser user) {
//        return baseMapper.insertUser(user);
//    }
//
//    @Override
//    public int updateUser(SysUser user) {
//        return baseMapper.updateUser(user);
//    }
//
//    @Override
//    public int updateUserAvatar(String userName, String avatar) {
//        return baseMapper.updateUserAvatar(userName, avatar);
//    }
//
//    @Override
//    public int resetUserPwd(String userName, String password) {
//        return baseMapper.resetUserPwd(userName, password);
//    }
//
//    @Override
//    public int deleteUserById(Long userId) {
//        return baseMapper.deleteUserById(userId);
//    }
//
//    @Override
//    public int deleteUserByIds(Long[] userIds) {
//        return baseMapper.deleteUserByIds(userIds);
//    }
//
//    @Override
//    public int checkUserNameUnique(String userName) {
//        return baseMapper.checkUserNameUnique(userName);
//    }
//
//    @Override
//    public SysUser checkPhoneUnique(String phonenumber) {
//        return baseMapper.checkPhoneUnique(phonenumber);
//    }
//
//    @Override
//    public SysUser checkEmailUnique(String email) {
//        return baseMapper.checkEmailUnique(email);
//    }
//}
