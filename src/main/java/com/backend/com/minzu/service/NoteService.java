package com.minzu.service;

import com.minzu.entity.Note;
import java.util.List;

public interface NoteService {
    List<Note> getUserNotes(Long userId);
    boolean addNote(Note note);
    boolean updateNote(Note note);
    void deleteNote(Long id);
}
