// WrongMapper.java
package com.minzu.mapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.minzu.entity.WrongQuestion;
import org.apache.ibatis.annotations.Mapper;   // 正确包名
// 不要使用 import org.springframework.stereotype.Repository;

@Mapper
public interface WrongMapper extends BaseMapper<WrongQuestion> {
}