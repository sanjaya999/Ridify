package com.renting.RentThis.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;


    private String name;

    @Column(name = "email" , nullable = false , unique = true )
    private String email;

    @JsonIgnore
    private String password;

    private  String role;

    @Override
    public String toString() {
        return "User(id=" + id + ", name=" + name + ", email=" + email + ", role=" + role + ")";
    }

    private BigDecimal balance;



}
