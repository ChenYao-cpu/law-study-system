package com.minzu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.minzu.entity.User;
import com.minzu.mapper.UserMapper;        // 导入 UserMapper
import com.minzu.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;         // 注入

    @Override
    public User login(String username, String password) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, username).eq(User::getPassword, password);
        return userMapper.selectOne(wrapper);
    }

    @Override
    public boolean register(User user) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, user.getUsername());
        if (userMapper.selectCount(wrapper) > 0) return false;
        user.setCreateTime(new Date());
        user.setTotalScore(0);
        return userMapper.insert(user) > 0;
    }

    @Override
    public User getUserById(Long userId) {
        return userMapper.selectById(userId);
    }
    @Override
    public boolean updateUser(User user) {
        return userMapper.updateById(user) > 0;
    }
}