package com.lawstudy.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.lawstudy.entity.Question;

import java.util.List;
import java.util.Map;

public interface QuestionService extends IService<Question> {
    List<Question> getRandomQuestions(Integer type, Integer count);
    Map<String, Object> checkAnswer(Long userId, Long questionId, String userAnswer);
    List<Map<String, Object>> getQuestionNotes(Long userId, Long questionId);
    void saveQuestionNote(Long userId, Long questionId, String content);
}
