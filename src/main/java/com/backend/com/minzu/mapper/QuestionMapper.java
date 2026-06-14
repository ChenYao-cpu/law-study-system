package com.minzu.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.minzu.entity.Question;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface QuestionMapper extends BaseMapper<Question> {
}