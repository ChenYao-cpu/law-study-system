package com.lawstudy.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lawstudy.entity.Exam;
import com.lawstudy.entity.Question;
import com.lawstudy.mapper.ExamMapper;
import com.lawstudy.mapper.QuestionMapper;
import com.lawstudy.service.ExamService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExamServiceImpl extends ServiceImpl<ExamMapper, Exam> implements ExamService {
    
    @Resource
    private QuestionMapper questionMapper;
    
    @Override
    public Exam startExam(Long userId, Integer questionCount) {
        List<Long> questionIds = questionMapper.selectList(
                new LambdaQueryWrapper<Question>()
                        .last("ORDER BY RAND() LIMIT " + questionCount)
        ).stream().map(Question::getId).collect(Collectors.toList());
        
        Exam exam = new Exam();
        exam.setUserId(userId);
        exam.setTitle("模拟考试 " + LocalDateTime.now());
        exam.setQuestions(JSON.toJSONString(questionIds));
        exam.setStatus(0);
        exam.setStartTime(LocalDateTime.now());
        save(exam);
        return exam;
    }
    
    @Override
    public Map<String, Object> submitExam(Long examId, String userAnswers) {
        Exam exam = getById(examId);
        exam.setUserAnswers(userAnswers);
        exam.setStatus(1);
        exam.setFinishTime(LocalDateTime.now());
        
        List<Long> questionIds = JSON.parseArray(exam.getQuestions(), Long.class);
        Map<String, String> answers = JSON.parseObject(userAnswers, Map.class);
        
        int correctCount = 0;
        List<Question> questions = questionMapper.selectBatchIds(questionIds);
        for (Question q : questions) {
            if (q.getAnswer().equalsIgnoreCase(answers.getOrDefault(q.getId().toString(), ""))) {
                correctCount++;
            }
        }
        
        int score = questions.size() > 0 ? (correctCount * 100 / questions.size()) : 0;
        exam.setScore(score);
        exam.setTotalScore(100);
        updateById(exam);
        
        Map<String, Object> result = new HashMap<>();
        result.put("exam", exam);
        result.put("correctCount", correctCount);
        result.put("totalQuestions", questions.size());
        return result;
    }
    
    @Override
    public List<Exam> getExamHistory(Long userId) {
        return list(new LambdaQueryWrapper<Exam>()
                            .eq(Exam::getUserId, userId)
                            .eq(Exam::getStatus, 1)
                            .orderByDesc(Exam::getFinishTime));
    }
}
