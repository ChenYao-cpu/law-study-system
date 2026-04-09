package com.lawstudy.service.impl;

import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lawstudy.entity.Question;
import com.lawstudy.entity.UserAnswer;
import com.lawstudy.mapper.QuestionMapper;
import com.lawstudy.mapper.UserAnswerMapper;
import com.lawstudy.service.QuestionService;
import com.lawstudy.service.WrongService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

@Service
public class QuestionServiceImpl extends ServiceImpl<QuestionMapper, Question> implements QuestionService {
    
    @Resource
    private UserAnswerMapper userAnswerMapper;
    
    @Resource
    private WrongService wrongService;
    
    @Override
    public List<Question> getRandomQuestions(Integer type, Integer count) {
        return list(new LambdaQueryWrapper<Question>()
                            .eq(Question::getType, type)
                            .last("ORDER BY RAND() LIMIT " + count));
    }
    
    @Override
    public Map<String, Object> checkAnswer(Long userId, Long questionId, String userAnswer) {
        Question question = getById(questionId);
        boolean isCorrect = question.getAnswer().equalsIgnoreCase(userAnswer);
        
        UserAnswer userAnswerEntity = new UserAnswer();
        userAnswerEntity.setUserId(userId);
        userAnswerEntity.setQuestionId(questionId);
        userAnswerEntity.setUserAnswer(userAnswer);
        userAnswerEntity.setIsCorrect(isCorrect ? 1 : 0);
        userAnswerMapper.insert(userAnswerEntity);
        
        if (!isCorrect) {
            wrongService.addWrongQuestion(new com.lawstudy.entity.WrongQuestion() {{
                setUserId(userId);
                setQuestionId(questionId);
            }});
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("isCorrect", isCorrect);
        result.put("analysis", question.getAnalysis());
        return result;
    }
    
    @Override
    public List<Map<String, Object>> getQuestionNotes(Long userId, Long questionId) {
        return null;
    }
    
    @Override
    public void saveQuestionNote(Long userId, Long questionId, String content) {
    }
}
