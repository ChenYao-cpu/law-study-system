// AIService.java
package com.backend.com.minzu.service;

import java.util.List;
import java.util.Map;

public interface AIService {
    /**
     * 智能问答
     */
    Object askQuestion(Long userId, String question);

    /**
     * 获取聊天历史
     */
    Object getChatHistory(Long userId);

    /**
     * 法条解读
     */
    Object interpretLaw(Long userId, String keyword);

    /**
     * AI生成题目
     * @param userId 用户ID
     * @param questionCount 题目数量
     * @param questionType 题目类型（1:单选 2:多选）
     * @param difficulty 难度等级（1:简单 2:中等 3:困难）
     * @return 生成的题目列表
     */
    List<Map<String, Object>> generateQuestions(Long userId, Integer questionCount, Integer questionType, Integer difficulty);
}