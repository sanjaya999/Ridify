package com.renting.RentThis.entity;

import jakarta.persistence.*;
import lombok.Data;

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
    private String password;

    private  String role;

    @Override
    public String toString() {
        return "User(id=" + id + ", name=" + name + ", email=" + email + ", role=" + role + ")";
    }



}
