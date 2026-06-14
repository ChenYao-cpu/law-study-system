package com.minzu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.minzu.entity.Question;
import com.minzu.mapper.QuestionMapper;
import com.minzu.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuestionMapper questionMapper;

    @Override
    public List<Question> getQuestionsByCategory(Integer category) {
        LambdaQueryWrapper<Question> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(Question::getId);
        return questionMapper.selectList(wrapper);
    }

    @Override
    public Question getQuestionById(Long id) {
        return questionMapper.selectById(id);
    }

    @Override
    public boolean checkAnswer(Long questionId, String userAnswer) {
        Question q = questionMapper.selectById(questionId);
        return q != null && q.getAnswer().equalsIgnoreCase(userAnswer);
    }
}
