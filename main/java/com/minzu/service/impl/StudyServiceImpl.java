package com.minzu.service.impl;

import com.minzu.entity.StudyRecord;
import com.minzu.mapper.StudyRecordMapper;
import com.minzu.service.StudyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;

@Service
public class StudyServiceImpl implements StudyService {

    @Autowired
    private StudyRecordMapper studyRecordMapper;

    @Override
    public void saveStudyRecord(Integer userId, Integer courseId, Integer duration) {
        StudyRecord record = new StudyRecord();
        record.setUserId(userId);
        record.setCourseId(courseId);
        record.setStudyDuration(duration);
        record.setStudyDate(new Date());
        studyRecordMapper.insert(record);
    }

    @Override
    public int getTotalStudyTime(Integer userId) {
        // 实际应 sum 查询，这里简化返回模拟值
        return 120;
    }
}