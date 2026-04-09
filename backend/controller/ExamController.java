package com.lawstudy.controller;

import com.lawstudy.common.Result;
import com.lawstudy.entity.Exam;
import com.lawstudy.service.ExamService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exam")
public class ExamController {
    
    @Resource
    private ExamService examService;
    
    @PostMapping("/start")
    public Result<Exam> startExam(@RequestBody Map<String, Object> params) {
        Long userId = Long.valueOf(params.get("userId").toString());
        Integer questionCount = Integer.valueOf(params.get("questionCount").toString());
        return Result.success(examService.startExam(userId, questionCount));
    }
    
    @PostMapping("/submit")
    public Result<Map<String, Object>> submitExam(@RequestBody Map<String, Object> params) {
        Long examId = Long.valueOf(params.get("examId").toString());
        String userAnswers = params.get("userAnswers").toString();
        return Result.success(examService.submitExam(examId, userAnswers));
    }
    
    @GetMapping("/history")
    public Result<List<Exam>> history(@RequestParam Long userId) {
        return Result.success(examService.getExamHistory(userId));
    }
}

