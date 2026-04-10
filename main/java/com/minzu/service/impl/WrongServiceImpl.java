package com.minzu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.minzu.entity.WrongQuestion;
import com.minzu.mapper.WrongMapper;   // 导入
import com.minzu.service.WrongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;

@Service
public class WrongServiceImpl implements WrongService {

    @Autowired
    private WrongMapper wrongMapper;   // 注入

    @Override
    public void addWrong(Integer userId, Integer questionId) {
        LambdaQueryWrapper<WrongQuestion> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(WrongQuestion::getUserId, userId)
                .eq(WrongQuestion::getQuestionId, questionId);
        if (wrongMapper.selectCount(wrapper) == 0) {
            WrongQuestion wq = new WrongQuestion();
            wq.setUserId(userId);
            wq.setQuestionId(questionId);
            wq.setWrongTime(new Date());
            wrongMapper.insert(wq);
        }
    }

    @Override
    public List<WrongQuestion> getUserWrongs(Integer userId) {
        LambdaQueryWrapper<WrongQuestion> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(WrongQuestion::getUserId, userId);
        return wrongMapper.selectList(wrapper);
    }

    @Override
    public void removeWrong(Integer id) {
        wrongMapper.deleteById(id);
    }
}