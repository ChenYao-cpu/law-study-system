package com.lawstudy.controller;

import com.lawstudy.common.Result;
import com.lawstudy.entity.WrongQuestion;
import com.lawstudy.service.WrongService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wrong")
public class WrongController {
    
    @Resource
    private WrongService wrongService;
    
    @GetMapping("/list")
    public Result<List<Map<String, Object>>> list(@RequestParam Long userId) {
        return Result.success(wrongService.getWrongQuestionsWithDetail(userId));
    }
    
    @PostMapping("/add")
    public Result<Void> addWrong(@RequestBody Map<String, Object> params) {
        WrongQuestion wrong = new WrongQuestion();
        wrong.setUserId(Long.valueOf(params.get("userId").toString()));
        wrong.setQuestionId(Long.valueOf(params.get("questionId").toString()));
        wrongService.addWrongQuestion(wrong);
        return Result.success();
    }
    
    @DeleteMapping("/remove/{userId}/{questionId}")
    public Result<Void> removeWrong(@PathVariable Long userId, @PathVariable Long questionId) {
        wrongService.removeWrongQuestion(userId, questionId);
        return Result.success();
    }
}
