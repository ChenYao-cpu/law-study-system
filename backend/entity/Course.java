package com.lawstudy.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("course")
public class Course implements Serializable {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String title;
    private String description;
    private String videoUrl;
    private String content;
    private Integer duration;
    private String cover;
    private Integer sortOrder;
    private Integer status;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}
