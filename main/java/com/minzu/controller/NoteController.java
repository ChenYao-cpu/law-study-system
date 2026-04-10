package com.minzu.controller;
import com.minzu.entity.Note;
import com.minzu.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/note")
public class NoteController {
    @Autowired
    private NoteService noteService;

    @GetMapping("/list")
    public Map<String, Object> list(@RequestAttribute("userId") Integer userId) {
        List<Note> list = noteService.getUserNotes(userId);
        Map<String, Object> res = new HashMap<>();
        res.put("code", 200);
        res.put("data", list);
        return res;
    }

    @PostMapping("/add")
    public Map<String, Object> add(@RequestAttribute("userId") Integer userId,
                                   @RequestBody Note note) {
        note.setUserId(userId);
        boolean ok = noteService.addNote(note);
        Map<String, Object> res = new HashMap<>();
        res.put("code", ok ? 200 : 400);
        return res;
    }

    @PutMapping("/update")
    public Map<String, Object> update(@RequestBody Note note) {
        boolean ok = noteService.updateNote(note);
        Map<String, Object> res = new HashMap<>();
        res.put("code", ok ? 200 : 400);
        return res;
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Integer id) {
        noteService.deleteNote(id);
        Map<String, Object> res = new HashMap<>();
        res.put("code", 200);
        return res;
    }
}