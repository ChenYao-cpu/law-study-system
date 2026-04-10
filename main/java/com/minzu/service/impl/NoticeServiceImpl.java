package com.minzu.service.impl;

import com.minzu.entity.Notice;
import com.minzu.mapper.NoticeMapper;
import com.minzu.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NoticeServiceImpl implements NoticeService {

    @Autowired
    private NoticeMapper noticeMapper;

    @Override
    public List<Notice> getAllNotices() {
        return noticeMapper.selectList(null);
    }
}