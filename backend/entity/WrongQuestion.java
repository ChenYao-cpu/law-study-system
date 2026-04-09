package com.lawstudy.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("wrong_question")
public class WrongQuestion implements Serializable {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private Long questionId;
    private Integer wrongCount;
    private LocalDateTime lastWrongTime;
}
