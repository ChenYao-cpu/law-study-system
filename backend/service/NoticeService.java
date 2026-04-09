package com.lawstudy.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.lawstudy.entity.Notice;

import java.util.List;

public interface NoticeService extends IService<Notice> {
    List<Notice> getLatestNotices(Integer count);
}
