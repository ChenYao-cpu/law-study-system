package com.minzu.controller;
import com.minzu.service.StudyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/study")
public class StudyController {
    @Autowired
    private StudyService studyService;

    @PostMapping("/record")
    public Map<String, Object> record(@RequestAttribute("userId") Integer userId,
                                      @RequestParam Integer courseId,
                                      @RequestParam Integer duration) {
        studyService.saveStudyRecord(userId, courseId, duration);
        Map<String, Object> res = new HashMap<>();
        res.put("code", 200);
        return res;
    }

    @GetMapping("/total")
    public Map<String, Object> total(@RequestAttribute("userId") Integer userId) {
        int total = studyService.getTotalStudyTime(userId);
        Map<String, Object> res = new HashMap<>();
        res.put("code", 200);
        res.put("totalMinutes", total);
        return res;
    }
}