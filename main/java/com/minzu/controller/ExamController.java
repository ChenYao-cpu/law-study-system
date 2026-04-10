package com.minzu.controller;
import com.minzu.entity.Question;
import com.minzu.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exam")
public class ExamController {
    @Autowired
    private ExamService examService;

    @GetMapping("/start")
    public Map<String, Object> start(@RequestParam(defaultValue = "10") int size) {
        List<Question> paper = examService.generateExamPaper(null, size);
        Map<String, Object> res = new HashMap<>();
        res.put("code", 200);
        res.put("paper", paper);
        return res;
    }

    @PostMapping("/submit")
    public Map<String, Object> submit(@RequestAttribute("userId") Integer userId,
                                      @RequestBody SubmitRequest req) {
        int score = examService.submitExam(userId, req.getQuestionIds(), req.getAnswers());
        Map<String, Object> res = new HashMap<>();
        res.put("code", 200);
        res.put("score", score);
        return res;
    }
}

class SubmitRequest {
    private List<Integer> questionIds;
    private List<String> answers;
    // getter/setter
    public List<Integer> getQuestionIds() { return questionIds; }
    public void setQuestionIds(List<Integer> questionIds) { this.questionIds = questionIds; }
    public List<String> getAnswers() { return answers; }
    public void setAnswers(List<String> answers) { this.answers = answers; }
}