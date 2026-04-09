package com.lawstudy.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("study_note")
public class StudyNote implements Serializable {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private Long courseId;
    private String title;
    private String content;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
