package com.lawstudy.controller;

import com.lawstudy.common.Result;
import com.lawstudy.entity.Question;
import com.lawstudy.service.QuestionService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/question")
public class QuestionController {
    
    @Resource
    private QuestionService questionService;
    
    @GetMapping("/list")
    public Result<List<Question>> list(@RequestParam(defaultValue = "1") Integer type,
                                       @RequestParam(defaultValue = "10") Integer size) {
        return Result.success(questionService.getRandomQuestions(type, size));
    }
    
    @PostMapping("/answer")
    public Result<Map<String, Object>> submitAnswer(@RequestBody Map<String, Object> params) {
        Long userId = Long.valueOf(params.get("userId").toString());
        Long questionId = Long.valueOf(params.get("questionId").toString());
        String userAnswer = params.get("userAnswer").toString();
        return Result.success(questionService.checkAnswer(userId, questionId, userAnswer));
    }
    
    @GetMapping("/notes")
    public Result<List<Map<String, Object>>> getQuestionNotes(@RequestParam Long userId,
                                                              @RequestParam Long questionId) {
        return Result.success(questionService.getQuestionNotes(userId, questionId));
    }
    
    @PostMapping("/notes")
    public Result<Void> saveQuestionNote(@RequestBody Map<String, Object> params) {
        questionService.saveQuestionNote(
                Long.valueOf(params.get("userId").toString()),
                Long.valueOf(params.get("questionId").toString()),
                params.get("content").toString()
        );
        return Result.success();
    }
}
