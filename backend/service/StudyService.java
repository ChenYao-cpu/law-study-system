package com.lawstudy.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.lawstudy.entity.StudyRecord;

import java.util.List;
import java.util.Map;

public interface StudyService extends IService<StudyRecord> {
    void recordStudy(StudyRecord record);
    Map<String, Object> getStudyOverview(Long userId);
    List<Map<String, Object>> getCourseProgress(Long userId);
    Map<String, Object> getStudyStats(Long userId);
}
