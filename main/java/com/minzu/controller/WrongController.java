package com.minzu.controller;
import com.minzu.entity.WrongQuestion;
import com.minzu.service.WrongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wrong")
public class WrongController {
    @Autowired
    private WrongService wrongService;

    @GetMapping("/list")
    public Map<String, Object> list(@RequestAttribute("userId") Integer userId) {
        List<WrongQuestion> list = wrongService.getUserWrongs(userId);
        Map<String, Object> res = new HashMap<>();
        res.put("code", 200);
        res.put("data", list);
        return res;
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Integer id) {
        wrongService.removeWrong(id);
        Map<String, Object> res = new HashMap<>();
        res.put("code", 200);
        return res;
    }
}