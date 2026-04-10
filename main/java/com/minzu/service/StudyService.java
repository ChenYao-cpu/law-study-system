package com.minzu.service;

public interface StudyService {
    void saveStudyRecord(Integer userId, Integer courseId, Integer duration);  // 参数类型 Integer
    int getTotalStudyTime(Integer userId);                                      // 参数类型 Integer
}