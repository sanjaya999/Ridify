package com.renting.RentThis.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Data
public class VehicleRequest {

    @NotBlank(message = "Vehicle name is required.")
    private String name;

    @NotBlank(message = "Model  is required.")
    private String model;

    @NotBlank(message = "Type  is required.")
    private String type;

    @NotBlank(message = "Vehicle Registration Number is required.")
    private String plateNum;

    @NotBlank(message = "Status should be updated")
    private String status;

    @NotBlank(message = "price cannot be blank")
    private BigDecimal price;

    private MultipartFile photo;

    private double longitude;
    private double latitude;


}
