package com.minzu.controller;
import com.minzu.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {
    @Autowired
    private AIService aiService;

    @PostMapping("/ask")
    public Map<String, Object> ask(@RequestBody Map<String, String> param) {
        String question = param.get("question");
        String answer = aiService.askQuestion(question);
        Map<String, Object> res = new HashMap<>();
        res.put("code", 200);
        res.put("answer", answer);
        return res;
    }
}