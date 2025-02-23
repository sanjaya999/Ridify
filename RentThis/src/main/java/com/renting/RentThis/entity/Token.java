package com.renting.RentThis.entity;

import jakarta.persistence.*;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Token")
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String refreshToken;

    private boolean isValid;

    @ManyToOne  // ✅ Correct annotation
    @JoinColumn(name="user_id") // ✅ Creates a foreign key column in the Token table
    private User user;


    private LocalDateTime expiryDate;

}
