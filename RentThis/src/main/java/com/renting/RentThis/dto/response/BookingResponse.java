package com.renting.RentThis.dto.response;

import com.renting.RentThis.entity.User;
import com.renting.RentThis.entity.Vehicle;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BookingResponse {

    private long id;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private VehicleResponse vehicle;
    private UserResponse bookedUser;
    private String status;
    private String paymentMethod;
    private long phoneNumber;

    private String startingAddress;
    private String endingAddress;



}
