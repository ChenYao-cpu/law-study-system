package com.minzu.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.minzu.entity.Note;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface NoteMapper extends BaseMapper<Note> {
}