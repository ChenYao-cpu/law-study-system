package com.lawstudy.service;

import java.util.List;

public interface AIService {
    String askQuestion(Long userId, String question);
    List<?> getChatHistory(Long userId);
}
