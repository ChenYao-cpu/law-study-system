package com.minzu.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.minzu.entity.Course;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CourseMapper extends BaseMapper<Course> {
}