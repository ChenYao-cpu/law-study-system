package com.minzu.dto;

public class UserAnswerDTO {
    private Long id;      // 题目ID
    private String answer; // 用户答案（根据你的业务，也可以是其他字段）

    // 必须提供 getter 和 setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }
}