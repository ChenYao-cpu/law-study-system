package com.minzu.controller;

import com.minzu.common.Result;
import com.minzu.entity.User;
import com.minzu.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {
    
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, String> params) {
        String username = params.get("username");
        String password = params.get("password");
        User user = userService.login(username, password);
        
        Map<String, Object> data = new HashMap<>();
        if (user != null) {
            String token = String.valueOf(user.getId());
            data.put("token", token);
            data.put("user", user);
            return Result.success(data);
        } else {
            return Result.error("用户名或密码错误");
        }
    }

    @PostMapping("/register")
    public Result<?> register(@RequestBody User user) {
        boolean ok = userService.register(user);
        if (ok) {
            return Result.success("注册成功");
        } else {
            return Result.error("用户名已存在");
        }
    }

    @GetMapping("/info")
    public Result<User> getUserInfo(@RequestParam Long userId) {
        User user = userService.getUserById(userId);
        return Result.success(user);
    }
}
