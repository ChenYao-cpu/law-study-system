package com.lawstudy.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.lawstudy.entity.WrongQuestion;

import java.util.List;
import java.util.Map;

public interface WrongService extends IService<WrongQuestion> {
    void addWrongQuestion(WrongQuestion wrongQuestion);
    void removeWrongQuestion(Long userId, Long questionId);
    List<Map<String, Object>> getWrongQuestionsWithDetail(Long userId);
}
