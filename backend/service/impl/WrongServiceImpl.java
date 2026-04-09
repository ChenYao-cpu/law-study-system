package com.lawstudy.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lawstudy.entity.Question;
import com.lawstudy.entity.WrongQuestion;
import com.lawstudy.mapper.QuestionMapper;
import com.lawstudy.mapper.WrongQuestionMapper;
import com.lawstudy.service.WrongService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class WrongServiceImpl extends ServiceImpl<WrongQuestionMapper, WrongQuestion> implements WrongService {
    
    @Resource
    private QuestionMapper questionMapper;
    
    @Override
    public void addWrongQuestion(WrongQuestion wrongQuestion) {
        LambdaQueryWrapper<WrongQuestion> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(WrongQuestion::getUserId, wrongQuestion.getUserId())
                .eq(WrongQuestion::getQuestionId, wrongQuestion.getQuestionId());
        WrongQuestion exist = getOne(wrapper);
        if (exist != null) {
            exist.setWrongCount(exist.getWrongCount() + 1);
            exist.setLastWrongTime(LocalDateTime.now());
            updateById(exist);
        } else {
            wrongQuestion.setWrongCount(1);
            wrongQuestion.setLastWrongTime(LocalDateTime.now());
            save(wrongQuestion);
        }
    }
    
    @Override
    public void removeWrongQuestion(Long userId, Long questionId) {
        remove(new LambdaQueryWrapper<WrongQuestion>()
                       .eq(WrongQuestion::getUserId, userId)
                       .eq(WrongQuestion::getQuestionId, questionId));
    }
    
    @Override
    public List<Map<String, Object>> getWrongQuestionsWithDetail(Long userId) {
        List<WrongQuestion> wrongQuestions = list(new LambdaQueryWrapper<WrongQuestion>()
                                                          .eq(WrongQuestion::getUserId, userId)
                                                          .orderByDesc(WrongQuestion::getLastWrongTime));
        
        return wrongQuestions.stream().map(wq -> {
            Map<String, Object> map = new HashMap<>();
            Question question = questionMapper.selectById(wq.getQuestionId());
            map.put("wrongQuestion", wq);
            map.put("question", question);
            return map;
        }).collect(Collectors.toList());
    }
}
