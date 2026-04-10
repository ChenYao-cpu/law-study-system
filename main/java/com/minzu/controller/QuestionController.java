package com.minzu.controller;
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
    public Map<String, Object> list(@RequestParam(required = false) Integer category) {
        List<Question> list = questionService.getQuestionsByCategory(category);
        Map<String, Object> res = new HashMap<>();
        res.put("code", 200);
        res.put("data", list);
        return res;
    }

    @PostMapping("/answer")
    public Map<String, Object> answer(@RequestAttribute("userId") Integer userId,
                                      @RequestParam Integer questionId,
                                      @RequestParam String userAnswer) {
        boolean correct = questionService.checkAnswer(questionId, userAnswer);
        if (!correct) {
            wrongService.addWrong(userId, questionId);
        }
        Map<String, Object> res = new HashMap<>();
        res.put("code", 200);
        res.put("correct", correct);
        res.put("explanation", questionService.getQuestionById(questionId).getExplanation());
        return res;
    }
}