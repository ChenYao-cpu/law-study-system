package com.lawstudy.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.lawstudy.entity.Exam;

import java.util.List;
import java.util.Map;

public interface ExamService extends IService<Exam> {
    Exam startExam(Long userId, Integer questionCount);
    Map<String, Object> submitExam(Long examId, String userAnswers);
    List<Exam> getExamHistory(Long userId);
}
