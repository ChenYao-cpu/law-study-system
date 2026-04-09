package com.lawstudy.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.lawstudy.entity.User;

public interface UserService extends IService<User> {
    User login(String username, String password);
    void register(User user);
}
