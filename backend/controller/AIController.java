package com.lawstudy.controller;

import com.lawstudy.common.Result;
import com.lawstudy.service.AIService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {
    
    @Resource
    private AIService aiService;
    
    @PostMapping("/ask")
    public Result<String> ask(@RequestBody Map<String, Object> params) {
        Long userId = Long.valueOf(params.get("userId").toString());
        String question = params.get("question").toString();
        return Result.success(aiService.askQuestion(userId, question));
    }
    
    @GetMapping("/history")
    public Result<?> history(@RequestParam Long userId) {
        return Result.success(aiService.getChatHistory(userId));
    }
}
