package com.lawstudy.controller;

import com.lawstudy.common.Result;
import com.lawstudy.entity.StudyNote;
import com.lawstudy.service.NoteService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/note")
public class NoteController {
    
    @Resource
    private NoteService noteService;
    
    @GetMapping("/list")
    public Result<List<StudyNote>> list(@RequestParam Long userId,
                                        @RequestParam(required = false) Long courseId) {
        return Result.success(noteService.getNotesByUser(userId, courseId));
    }
    
    @PostMapping("/save")
    public Result<Void> save(@RequestBody StudyNote note) {
        noteService.saveNote(note);
        return Result.success();
    }
    
    @DeleteMapping("/delete/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        noteService.removeById(id);
        return Result.success();
    }
    
    @GetMapping("/detail/{id}")
    public Result<StudyNote> detail(@PathVariable Long id) {
        return Result.success(noteService.getById(id));
    }
}
