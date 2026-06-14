package com.minzu.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import java.io.Serializable;

@Data
public class AIRequestDTO implements Serializable {
    
    @NotBlank(message = "问题不能为空")
    private String question;
}
