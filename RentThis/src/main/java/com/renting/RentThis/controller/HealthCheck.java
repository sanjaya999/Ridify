package com.renting.RentThis.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheck {
    @Autowired
    private JavaMailSender mailSender;

    @GetMapping("/check")
    public String healthCheck(){


        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("poudelsanjaya12@gmail.com");
        message.setSubject("smtp Verification test");
        message.setText("click this to verify");
        message.setFrom("poudelsanjaya12@gmail.com");

        mailSender.send(message);
        return null;
    }
}
