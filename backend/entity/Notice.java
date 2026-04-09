package com.lawstudy.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("notice")
public class Notice implements Serializable {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String title;
    private String content;
    private Integer type;
    private Integer isTop;
    private LocalDateTime publishTime;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}
