package com.lawstudy.service.impl;

import cn.hutool.http.HttpUtil;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.lawstudy.entity.AiChat;
import com.lawstudy.mapper.AiChatMapper;
import com.lawstudy.service.AIService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIServiceImpl implements AIService {
    
    @Value("${law-study.ai.api-url}")
    private String apiUrl;
    
    @Value("${law-study.ai.api-key}")
    private String apiKey;
    
    @Resource
    private AiChatMapper aiChatMapper;
    
    @Override
    public String askQuestion(Long userId, String question) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-3.5-turbo");
        JSONArray messages = new JSONArray();
        JSONObject systemMsg = new JSONObject();
        systemMsg.put("role", "system");
        systemMsg.put("content", "你是民族团结促进法学习系统的AI助教，专门回答关于民族团结促进法的问题。请用简洁易懂的语言回答。");
        messages.add(systemMsg);
        JSONObject userMsg = new JSONObject();
        userMsg.put("role", "user");
        userMsg.put("content", question);
        messages.add(userMsg);
        requestBody.put("messages", messages);
        requestBody.put("max_tokens", 1000);
        
        String response = HttpUtil.createPost(apiUrl)
                                  .header("Authorization", "Bearer " + apiKey)
                                  .header("Content-Type", "application/json")
                                  .body(JSON.toJSONString(requestBody))
                                  .execute()
                                  .body();
        
        JSONObject respJson = JSON.parseObject(response);
        String answer = respJson.getJSONArray("choices")
                                .getJSONObject(0)
                                .getJSONObject("message")
                                .getString("content");
        
        AiChat chat = new AiChat();
        chat.setUserId(userId);
        chat.setQuestion(question);
        chat.setAnswer(answer);
        aiChatMapper.insert(chat);
        
        return answer;
    }
    
    @Override
    public List<AiChat> getChatHistory(Long userId) {
        return aiChatMapper.selectList(new LambdaQueryWrapper<AiChat>()
                                               .eq(AiChat::getUserId, userId)
                                               .orderByDesc(AiChat::getCreateTime)
                                               .last("LIMIT 50"));
    }
}
