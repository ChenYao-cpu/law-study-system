package com.minzu.service;
import com.minzu.entity.Question;
import java.util.List;

public interface QuestionService {
    List<Question> getQuestionsByCategory(Integer category);
    Question getQuestionById(Long id);
    boolean checkAnswer(Long questionId, String userAnswer);
}
