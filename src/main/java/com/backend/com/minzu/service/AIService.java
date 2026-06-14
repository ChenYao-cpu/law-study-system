// AIService.java
package com.minzu.service;

import java.util.Map;

public interface AIService {
    String askQuestion(String userQuestion);
    
    Map<String, Object> chat(com.minzu.dto.AIRequestDTO request);
}