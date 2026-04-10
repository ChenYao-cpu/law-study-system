// WrongService.java
package com.minzu.service;
import com.minzu.entity.WrongQuestion;
import java.util.List;

public interface WrongService {
    void addWrong(Integer userId, Integer questionId);
    List<WrongQuestion> getUserWrongs(Integer userId);
    void removeWrong(Integer id);
}