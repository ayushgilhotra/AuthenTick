package com.authentick;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AuthenTickApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuthenTickApplication.class, args);
    }
}
