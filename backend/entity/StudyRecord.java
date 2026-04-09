package com.lawstudy.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("study_record")
public class StudyRecord implements Serializable {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private Long courseId;
    private Integer studyDuration;
    private Integer progress;
    private LocalDateTime studyTime;
}
