package com.lawstudy.controller;

import com.lawstudy.common.Result;
import com.lawstudy.entity.User;
import com.lawstudy.service.UserService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@RestController
@RequestMapping("/api/user")
public class UserController {
    
    @Resource
    private UserService userService;
    
    @PostMapping("/login")
    public Result<User> login(@RequestBody User user) {
        return Result.success(userService.login(user.getUsername(), user.getPassword()));
    }
    
    @PostMapping("/register")
    public Result<Void> register(@RequestBody User user) {
        userService.register(user);
        return Result.success();
    }
    
    @GetMapping("/info")
    public Result<User> getUserInfo(@RequestParam Long userId) {
        return Result.success(userService.getById(userId));
    }
    
    @PutMapping("/update")
    public Result<Void> updateUserInfo(@RequestBody User user) {
        userService.updateById(user);
        return Result.success();
    }
}
