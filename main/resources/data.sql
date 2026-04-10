INSERT INTO `question` (`content`, `option_a`, `option_b`, `option_c`, `option_d`, `answer`, `explanation`, `category`) VALUES
                                                                                                                            ('民族团结是指什么？', '各民族互相排斥', '各民族平等相待、友好互助', '单一民族优先', '民族隔离', 'B', '民族团结是指各民族在社会生活和交往中平等相待、友好相处、互相尊重、互相帮助。', 1),
                                                                                                                            ('中华人民共和国各民族关系是？', '压迫与被压迫', '一律平等', '汉族优先', '自治独立', 'B', '宪法规定中华人民共和国各民族一律平等。', 1);

INSERT INTO `course` (`title`, `video_url`, `cover`, `description`, `duration`) VALUES
    ('民族团结促进法概论', 'http://example.com/video1.mp4', 'http://example.com/cover1.jpg', '学习民族团结促进法的基本内容', 30);

INSERT INTO `notice` (`title`, `content`, `publish_time`) VALUES
    ('欢迎使用民族团结学习系统', '本系统提供法律法规学习、趣味答题、模拟考试等功能', NOW());
