package com.lawstudy.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lawstudy.common.Result;
import com.lawstudy.entity.Course;
import com.lawstudy.service.CourseService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/course")
public class CourseController {
    
    @Resource
    private CourseService courseService;
    
    @GetMapping("/list")
    public Result<List<Course>> list(@RequestParam(defaultValue = "1") Integer page,
                                     @RequestParam(defaultValue = "10") Integer size) {
        Page<Course> coursePage = new Page<>(page, size);
        courseService.page(coursePage, new LambdaQueryWrapper<Course>()
                                               .eq(Course::getStatus, 1)
                                               .orderByAsc(Course::getSortOrder));
        return Result.success(coursePage);
    }
    
    @GetMapping("/detail/{id}")
    public Result<Course> detail(@PathVariable Long id) {
        return Result.success(courseService.getById(id));
    }
    
    @GetMapping("/recommend")
    public Result<List<Course>> recommend() {
        return Result.success(courseService.list(new LambdaQueryWrapper<Course>()
                                                         .eq(Course::getStatus, 1)
                                                         .orderByAsc(Course::getSortOrder)
                                                         .last("LIMIT 6")));
    }
}
