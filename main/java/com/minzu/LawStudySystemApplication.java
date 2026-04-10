package com.minzu;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.minzu.mapper")   // 改为您实际的 mapper 包路径
public class LawStudySystemApplication {
    public static void main(String[] args) {
        SpringApplication.run(LawStudySystemApplication.class, args);
    }
}