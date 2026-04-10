// AIServiceImpl.java
package com.minzu.service.impl;
import com.minzu.service.AIService;
import org.springframework.stereotype.Service;

@Service
public class AIServiceImpl implements AIService {
    @Override
    public String askQuestion(String userQuestion) {
        // 模拟AI回答，实际可接入OpenAI API
        if (userQuestion.contains("民族团结")) {
            return "民族团结是指各民族在社会生活和交往中平等相待、友好相处、互相尊重、互相帮助。中华人民共和国各民族一律平等。";
        } else if (userQuestion.contains("促进法")) {
            return "《中华人民共和国民族团结促进法》旨在维护国家统一和民族团结，促进各民族共同繁荣发展。";
        } else {
            return "您好，我是AI助教，可以为您解答民族团结促进法的相关问题。请提出具体问题。";
        }
    }
}