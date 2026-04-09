package com.lawstudy.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lawstudy.entity.Course;
import com.lawstudy.entity.StudyRecord;
import com.lawstudy.mapper.CourseMapper;
import com.lawstudy.mapper.StudyRecordMapper;
import com.lawstudy.service.StudyService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StudyServiceImpl extends ServiceImpl<StudyRecordMapper, StudyRecord> implements StudyService {
    
    @Resource
    private CourseMapper courseMapper;
    
    @Override
    public void recordStudy(StudyRecord record) {
        StudyRecord exist = getOne(new LambdaQueryWrapper<StudyRecord>()
                                           .eq(StudyRecord::getUserId, record.getUserId())
                                           .eq(StudyRecord::getCourseId, record.getCourseId()));
        if (exist != null) {
            exist.setStudyDuration(exist.getStudyDuration() + record.getStudyDuration());
            exist.setProgress(Math.max(exist.getProgress(), record.getProgress()));
            updateById(exist);
        } else {
            save(record);
        }
    }
    
    @Override
    public Map<String, Object> getStudyOverview(Long userId) {
        List<StudyRecord> records = list(new LambdaQueryWrapper<StudyRecord>()
                                                 .eq(StudyRecord::getUserId, userId));
        Map<String, Object> overview = new HashMap<>();
        overview.put("totalCourses", records.size());
        overview.put("totalDuration", records.stream().mapToInt(StudyRecord::getStudyDuration).sum());
        overview.put("avgProgress", records.isEmpty() ? 0 :
                                            records.stream().mapToInt(StudyRecord::getProgress).sum() / records.size());
        return overview;
    }
    
    @Override
    public List<Map<String, Object>> getCourseProgress(Long userId) {
        List<StudyRecord> records = list(new LambdaQueryWrapper<StudyRecord>()
                                                 .eq(StudyRecord::getUserId, userId));
        return records.stream().map(record -> {
            Map<String, Object> map = new HashMap<>();
            Course course = courseMapper.selectById(record.getCourseId());
            map.put("course", course);
            map.put("progress", record.getProgress());
            map.put("duration", record.getStudyDuration());
            return map;
        }).collect(Collectors.toList());
    }
    
    @Override
    public Map<String, Object> getStudyStats(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        List<StudyRecord> records = list(new LambdaQueryWrapper<StudyRecord>()
                                                 .eq(StudyRecord::getUserId, userId));
        stats.put("completedCourses", records.stream()
                                              .filter(r -> r.getProgress() >= 100).count());
        stats.put("totalStudyTime", records.stream()
                                            .mapToInt(StudyRecord::getStudyDuration).sum());
        return stats;
    }
}
