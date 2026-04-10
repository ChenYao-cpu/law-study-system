package com.minzu.controller;
import com.minzu.entity.User;
import com.minzu.service.UserService;
import com.minzu.utils.TokenUtil;
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
    public Map<String, Object> login(@RequestBody Map<String, String> params) {
        String username = params.get("username");
        String password = params.get("password");
        User user = userService.login(username, password);
        Map<String, Object> res = new HashMap<>();
        if (user != null) {
            String token = TokenUtil.generateToken(user.getId());
            res.put("code", 200);
            res.put("token", token);
            res.put("user", user);
        } else {
            res.put("code", 401);
            res.put("msg", "用户名或密码错误");
        }
        return res;
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody User user) {
        boolean ok = userService.register(user);
        Map<String, Object> res = new HashMap<>();
        if (ok) {
            res.put("code", 200);
            res.put("msg", "注册成功");
        } else {
            res.put("code", 400);
            res.put("msg", "用户名已存在");
        }
        return res;
    }

    @GetMapping("/info")
    public Map<String, Object> getUserInfo(@RequestAttribute("userId") Integer userId) {
        User user = userService.getUserById(userId);
        Map<String, Object> res = new HashMap<>();
        res.put("code", 200);
        res.put("data", user);
        return res;
    }
}