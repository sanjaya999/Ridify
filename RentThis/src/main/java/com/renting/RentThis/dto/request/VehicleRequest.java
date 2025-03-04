package com.renting.RentThis.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

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

    private MultipartFile photo;


}
