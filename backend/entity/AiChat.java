package com.lawstudy.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("ai_chat")
public class AiChat implements Serializable {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private String question;
    private String answer;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}
