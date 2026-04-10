package com.minzu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.minzu.entity.Question;
import com.minzu.mapper.QuestionMapper;   // 导入
import com.minzu.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuestionMapper questionMapper;   // 注入

    @Override
    public List<Question> getQuestionsByCategory(Integer category) {
        LambdaQueryWrapper<Question> wrapper = new LambdaQueryWrapper<>();
        if (category != null) {
            wrapper.eq(Question::getCategory, category);
        }
        return questionMapper.selectList(wrapper);
    }

    @Override
    public Question getQuestionById(Integer id) {
        return questionMapper.selectById(id);
    }

    @Override
    public boolean checkAnswer(Integer questionId, String userAnswer) {
        Question q = questionMapper.selectById(questionId);
        return q != null && q.getAnswer().equalsIgnoreCase(userAnswer);
    }
}