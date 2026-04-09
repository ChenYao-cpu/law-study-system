package com.lawstudy.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("question")
public class Question implements Serializable {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Integer type;
    private String title;
    private String options;
    private String answer;
    private String analysis;
    private Integer difficulty;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}
