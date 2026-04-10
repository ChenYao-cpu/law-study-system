package com.minzu.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.util.Date;

@Data
@TableName("exam")
public class Exam {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private Integer userId;
    private Integer score;
    private String answers;   // 用户答案 JSON
    private Date examTime;
}