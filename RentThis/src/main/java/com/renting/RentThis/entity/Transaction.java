package com.renting.RentThis.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long payerId;
    private Long receiverId;
    private BigDecimal amount;
    private String reference;
    private LocalDateTime timestamp;
    private String paymentMethod;
    private String status;
    private String transactionId;

}
