CREATE DATABASE law_study_system DEFAULT CHARACTER SET utf8mb4;

USE law_study_system;

CREATE TABLE user (
                      id BIGINT PRIMARY KEY AUTO_INCREMENT,
                      username VARCHAR(50) NOT NULL UNIQUE,
                      password VARCHAR(100) NOT NULL,
                      nickname VARCHAR(50),
                      avatar VARCHAR(255),
                      phone VARCHAR(20),
                      email VARCHAR(100),
                      total_score INT DEFAULT 0,
                      create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                      update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE course (
                        id BIGINT PRIMARY KEY AUTO_INCREMENT,
                        title VARCHAR(100) NOT NULL,
                        description TEXT,
                        video_url VARCHAR(500),
                        content TEXT,
                        duration INT COMMENT '视频时长(分钟)',
                        cover VARCHAR(255),
                        sort_order INT DEFAULT 0,
                        status TINYINT DEFAULT 1,
                        create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE study_record (
                              id BIGINT PRIMARY KEY AUTO_INCREMENT,
                              user_id BIGINT NOT NULL,
                              course_id BIGINT NOT NULL,
                              study_duration INT DEFAULT 0 COMMENT '学习时长(分钟)',
                              progress INT DEFAULT 0 COMMENT '进度百分比',
                              study_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                              UNIQUE KEY uk_user_course (user_id, course_id)
);

CREATE TABLE question (
                          id BIGINT PRIMARY KEY AUTO_INCREMENT,
                          type TINYINT NOT NULL COMMENT '1单选 2多选 3判断',
                          title TEXT NOT NULL,
                          options JSON COMMENT '选项',
                          answer VARCHAR(100) NOT NULL,
                          analysis TEXT,
                          difficulty TINYINT DEFAULT 1 COMMENT '1简单 2中等 3困难',
                          create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_answer (
                             id BIGINT PRIMARY KEY AUTO_INCREMENT,
                             user_id BIGINT NOT NULL,
                             question_id BIGINT NOT NULL,
                             user_answer VARCHAR(100),
                             is_correct TINYINT COMMENT '1正确 0错误',
                             answer_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wrong_question (
                                id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                user_id BIGINT NOT NULL,
                                question_id BIGINT NOT NULL,
                                wrong_count INT DEFAULT 1,
                                last_wrong_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                                UNIQUE KEY uk_user_question (user_id, question_id)
);

CREATE TABLE exam (
                      id BIGINT PRIMARY KEY AUTO_INCREMENT,
                      user_id BIGINT NOT NULL,
                      title VARCHAR(100),
                      questions JSON NOT NULL COMMENT '题目ID列表',
                      user_answers JSON COMMENT '用户答案',
                      score INT,
                      total_score INT,
                      status TINYINT DEFAULT 0 COMMENT '0进行中 1已完成',
                      start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                      finish_time DATETIME
);

CREATE TABLE study_note (
                            id BIGINT PRIMARY KEY AUTO_INCREMENT,
                            user_id BIGINT NOT NULL,
                            course_id BIGINT NOT NULL,
                            content TEXT NOT NULL,
                            title VARCHAR(100),
                            create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                            update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE notice (
                        id BIGINT PRIMARY KEY AUTO_INCREMENT,
                        title VARCHAR(100) NOT NULL,
                        content TEXT,
                        type TINYINT DEFAULT 1 COMMENT '1公告 2通知',
                        is_top TINYINT DEFAULT 0,
                        publish_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                        create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE score_record (
                              id BIGINT PRIMARY KEY AUTO_INCREMENT,
                              user_id BIGINT NOT NULL,
                              score INT NOT NULL,
                              type VARCHAR(50) COMMENT 'course_complete/answer_correct/exam_pass',
                              remark VARCHAR(255),
                              create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE regulation (
                            id BIGINT PRIMARY KEY AUTO_INCREMENT,
                            title VARCHAR(100) NOT NULL,
                            content TEXT NOT NULL,
                            sort_order INT DEFAULT 0,
                            create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_chat (
                         id BIGINT PRIMARY KEY AUTO_INCREMENT,
                         user_id BIGINT NOT NULL,
                         question TEXT NOT NULL,
                         answer TEXT,
                         create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);
