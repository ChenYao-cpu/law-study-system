package com.minzu.service;

import com.minzu.entity.Question;
import java.util.List;   // 也需要导入

public interface ExamService {
    List<Question> generateExamPaper(Integer category, int size);
    int submitExam(Integer userId, List<Integer> questionIds, List<String> userAnswers);
}