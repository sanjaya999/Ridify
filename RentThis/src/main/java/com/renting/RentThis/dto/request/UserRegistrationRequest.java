package com.renting.RentThis.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserRegistrationRequest {
    @NotBlank(message = "Name is required")
    private  String name;

    @Email(message = "Please provide valid email")
    private String email;

    @NotBlank(message = "password")
    private String password;
}
