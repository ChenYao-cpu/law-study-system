package com.lawstudy.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lawstudy.common.Result;
import com.lawstudy.entity.Notice;
import com.lawstudy.service.NoticeService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/notice")
public class NoticeController {
    
    @Resource
    private NoticeService noticeService;
    
    @GetMapping("/list")
    public Result<List<Notice>> list(@RequestParam(defaultValue = "1") Integer page,
                                     @RequestParam(defaultValue = "10") Integer size) {
        Page<Notice> noticePage = new Page<>(page, size);
        noticeService.page(noticePage);
        return Result.success(noticePage);
    }
    
    @GetMapping("/latest")
    public Result<List<Notice>> latest(@RequestParam(defaultValue = "5") Integer count) {
        return Result.success(noticeService.getLatestNotices(count));
    }
    
    @GetMapping("/detail/{id}")
    public Result<Notice> detail(@PathVariable Long id) {
        return Result.success(noticeService.getById(id));
    }
}
