package com.renting.RentThis.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "vehicle")
@Data
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    private  String name;

    private String model;

    private String  photoUrl;

    private String type;

    private String plate_num;

    private String status;

    @ManyToOne
    @JoinColumn(name = "owner_id" , referencedColumnName = "id")
    private User owner_id;


}
