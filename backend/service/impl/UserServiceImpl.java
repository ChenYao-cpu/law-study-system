package com.lawstudy.service.impl;

import cn.hutool.crypto.digest.DigestUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lawstudy.entity.User;
import com.lawstudy.mapper.UserMapper;
import com.lawstudy.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
    
    @Override
    public User login(String username, String password) {
        User user = getOne(new LambdaQueryWrapper<User>().eq(User::getUsername, username));
        if (user == null || !user.getPassword().equals(DigestUtil.md5Hex(password))) {
            throw new RuntimeException("用户名或密码错误");
        }
        user.setPassword(null);
        return user;
    }
    
    @Override
    public void register(User user) {
        if (getOne(new LambdaQueryWrapper<User>().eq(User::getUsername, user.getUsername())) != null) {
            throw new RuntimeException("用户名已存在");
        }
        user.setPassword(DigestUtil.md5Hex(user.getPassword()));
        user.setTotalScore(0);
        save(user);
    }
}
