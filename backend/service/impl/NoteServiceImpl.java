package com.lawstudy.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lawstudy.entity.StudyNote;
import com.lawstudy.mapper.StudyNoteMapper;
import com.lawstudy.service.NoteService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteServiceImpl extends ServiceImpl<StudyNoteMapper, StudyNote> implements NoteService {
    
    @Override
    public List<StudyNote> getNotesByUser(Long userId, Long courseId) {
        LambdaQueryWrapper<StudyNote> wrapper = new LambdaQueryWrapper<StudyNote>()
                                                        .eq(StudyNote::getUserId, userId)
                                                        .orderByDesc(StudyNote::getUpdateTime);
        if (courseId != null) {
            wrapper.eq(StudyNote::getCourseId, courseId);
        }
        return list(wrapper);
    }
    
    @Override
    public void saveNote(StudyNote note) {
        if (note.getId() == null) {
            save(note);
        } else {
            updateById(note);
        }
    }
}

