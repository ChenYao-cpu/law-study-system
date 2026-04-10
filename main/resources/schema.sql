CREATE TABLE IF NOT EXISTS `user` (
                                      `id` INT PRIMARY KEY AUTO_INCREMENT,
                                      `username` VARCHAR(50) UNIQUE NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `nickname` VARCHAR(50),
    `avatar` VARCHAR(200),
    `total_score` INT DEFAULT 0,
    `create_time` TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS `question` (
                                          `id` INT PRIMARY KEY AUTO_INCREMENT,
                                          `content` TEXT NOT NULL,
                                          `option_a` VARCHAR(200),
    `option_b` VARCHAR(200),
    `option_c` VARCHAR(200),
    `option_d` VARCHAR(200),
    `answer` CHAR(1) NOT NULL,
    `explanation` TEXT,
    `category` INT
    );

CREATE TABLE IF NOT EXISTS `wrong_question` (
                                                `id` INT PRIMARY KEY AUTO_INCREMENT,
                                                `user_id` INT,
                                                `question_id` INT,
                                                `wrong_time` TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `exam` (
                                      `id` INT PRIMARY KEY AUTO_INCREMENT,
                                      `user_id` INT,
                                      `score` INT,
                                      `answers` TEXT,
                                      `exam_time` TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `course` (
                                        `id` INT PRIMARY KEY AUTO_INCREMENT,
                                        `title` VARCHAR(100),
    `video_url` VARCHAR(200),
    `cover` VARCHAR(200),
    `description` TEXT,
    `duration` INT
    );

CREATE TABLE IF NOT EXISTS `study_record` (
                                              `id` INT PRIMARY KEY AUTO_INCREMENT,
                                              `user_id` INT,
                                              `course_id` INT,
                                              `study_duration` INT,
                                              `study_date` DATE
);

CREATE TABLE IF NOT EXISTS `note` (
                                      `id` INT PRIMARY KEY AUTO_INCREMENT,
                                      `user_id` INT,
                                      `question_id` INT,
                                      `content` TEXT,
                                      `create_time` TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `notice` (
                                        `id` INT PRIMARY KEY AUTO_INCREMENT,
                                        `title` VARCHAR(100),
    `content` TEXT,
    `publish_time` TIMESTAMP
    );