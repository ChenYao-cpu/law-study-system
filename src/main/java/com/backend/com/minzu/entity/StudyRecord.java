package com.minzu.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.util.Date;

@Data
@TableName("study_record")
public class StudyRecord {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private Long courseId;
    private Integer studyDuration;
    private Integer progress;
    private Integer currentPosition;
    private Integer status;
    private Date studyTime;
    private Date updateTime;
}
