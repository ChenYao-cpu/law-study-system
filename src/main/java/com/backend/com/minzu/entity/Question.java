package com.minzu.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.util.Date;

@Data
@TableName("question")
public class Question {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Integer type;
    private Integer category;
    private String title;
    private String options;
    private String answer;
    private String analysis;
    private String explanation;
    private Integer difficulty;
    private String knowledgePoint;
    private Date createTime;
}
