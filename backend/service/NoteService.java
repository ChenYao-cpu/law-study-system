package com.lawstudy.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.lawstudy.entity.StudyNote;

import java.util.List;

public interface NoteService extends IService<StudyNote> {
    List<StudyNote> getNotesByUser(Long userId, Long courseId);
    void saveNote(StudyNote note);
}
