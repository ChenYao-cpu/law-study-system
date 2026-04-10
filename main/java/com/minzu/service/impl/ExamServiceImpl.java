package com.minzu.service.impl;

import com.minzu.entity.Exam;
import com.minzu.entity.Question;
import com.minzu.mapper.ExamMapper;
import com.minzu.mapper.QuestionMapper;
import com.minzu.service.ExamService;
import com.minzu.service.WrongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;          // 必须导入 List

@Service
public class ExamServiceImpl implements ExamService {

    @Autowired
    private QuestionMapper questionMapper;
    @Autowired
    private ExamMapper examMapper;
    @Autowired
    private WrongService wrongService;

    @Override
    public List<Question> generateExamPaper(Integer category, int size) {
        // 简化实现：实际应随机抽取，这里返回所有题目的前 size 条
        List<Question> all = questionMapper.selectList(null);
        return all.size() > size ? all.subList(0, size) : all;
    }

    @Override
    @Transactional
    public int submitExam(Integer userId, List<Integer> questionIds, List<String> userAnswers) {
        int score = 0;
        for (int i = 0; i < questionIds.size(); i++) {
            Integer qid = questionIds.get(i);
            String userAns = userAnswers.get(i);
            Question q = questionMapper.selectById(qid);
            if (q != null && q.getAnswer().equalsIgnoreCase(userAns)) {
                score += 10; // 每题10分
            } else {
                wrongService.addWrong(userId, qid);
            }
        }
        // 保存考试记录
        Exam exam = new Exam();
        exam.setUserId(userId);
        exam.setScore(score);
        exam.setExamTime(new Date());
        examMapper.insert(exam);

        return score;   // 必须有 return 语句
    }
}