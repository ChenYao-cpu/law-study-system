package com.minzu.service;

import com.minzu.entity.Note;
import java.util.List;

public interface NoteService {
    List<Note> getUserNotes(Integer userId);   // 改为 Integer
    boolean addNote(Note note);
    boolean updateNote(Note note);
    void deleteNote(Integer id);
}