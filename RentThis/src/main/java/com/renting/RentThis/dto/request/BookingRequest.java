package com.renting.RentThis.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class BookingRequest {

    @NotBlank(message =   "vehicle id cannot be empty ")
    private long vehicleId;

    @NotBlank(message =  "start time needed")
    private LocalDateTime startTime;

    @NotBlank(message =  "end time  needed")
    private LocalDateTime endTime;

    @NotBlank(message =  "starting address  needed")
    private String startingAddress;

    @NotBlank(message =  "ending address  needed")
    private String endingAddress;



}
