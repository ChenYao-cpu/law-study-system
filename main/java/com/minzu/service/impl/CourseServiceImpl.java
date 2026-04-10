package com.minzu.service.impl;

import com.minzu.entity.Course;
import com.minzu.mapper.CourseMapper;   // 导入
import com.minzu.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseMapper courseMapper;   // 注入

    @Override
    public List<Course> getAllCourses() {
        return courseMapper.selectList(null);
    }
}