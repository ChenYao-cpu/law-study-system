package com.minzu.service;

import com.minzu.entity.Exam;
import com.minzu.entity.Question;
import java.util.List;
import java.util.Map;

public interface ExamService {
    List<Question> generateExamPaper(Integer category, int size);
    
    int submitExam(Long userId, List<Integer> questionIds, List<String> userAnswers);
    
    Map<String, Object> startExam(Long userId, String type, int size);
    
    Map<String, Object> submitExam(Long examId, String userAnswers, Integer timeUsed);
    
    List<Exam> getExamHistory(Long userId);
}
