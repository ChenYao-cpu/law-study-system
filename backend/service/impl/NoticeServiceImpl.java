package com.lawstudy.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lawstudy.entity.Notice;
import com.lawstudy.mapper.NoticeMapper;
import com.lawstudy.service.NoticeService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoticeServiceImpl extends ServiceImpl<NoticeMapper, Notice> implements NoticeService {
    
    @Override
    public List<Notice> getLatestNotices(Integer count) {
        return list(new LambdaQueryWrapper<Notice>()
                            .orderByDesc(Notice::getIsTop)
                            .orderByDesc(Notice::getPublishTime)
                            .last("LIMIT " + count));
    }
}
