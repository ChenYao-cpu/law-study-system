package com.minzu.controller;

import com.minzu.common.Result;
import com.minzu.dto.AIRequestDTO;
import com.minzu.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {
    
    @Autowired
    private AIService aiService;

    @PostMapping("/chat")
    public Result<Map<String, Object>> chat(@RequestBody AIRequestDTO request) {
        try {
            Map<String, Object> response = aiService.chat(request);
            return Result.success(response);
        } catch (Exception e) {
            return Result.error("AI服务异常：" + e.getMessage());
        }
    }
}
