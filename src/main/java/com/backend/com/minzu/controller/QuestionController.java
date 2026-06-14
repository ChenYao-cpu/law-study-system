package com.minzu.controller;

import com.minzu.common.Result;
import com.minzu.entity.Question;
import com.minzu.service.QuestionService;
import com.minzu.service.WrongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/question")
public class QuestionController {
    
    @Autowired
    private QuestionService questionService;
    
    @Autowired
    private WrongService wrongService;

    @GetMapping("/list")
    public Result<List<Question>> list(@RequestParam(required = false) Integer category) {
        List<Question> list = questionService.getQuestionsByCategory(category);
        return Result.success(list);
    }

    @PostMapping("/answer")
    public Result<Map<String, Object>> answer(@RequestParam Long userId,
                                               @RequestParam Long questionId,
                                               @RequestParam String userAnswer) {
        boolean correct = questionService.checkAnswer(questionId, userAnswer);
        if (!correct) {
            wrongService.addWrong(userId, questionId);
        }
        
        Question q = questionService.getQuestionById(questionId);
        Map<String, Object> data = new HashMap<>();
        data.put("correct", correct);
        data.put("analysis", q != null ? q.getAnalysis() : "");
        
        return Result.success(data);
    }
}
