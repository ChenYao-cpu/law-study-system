package com.minzu.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Map;

@Data
public class AnswerDTO implements Serializable {
    
    @NotNull(message = "题目ID不能为空")
    private Long questionId;
    
    @NotBlank(message = "答案不能为空")
    private String userAnswer;
}
