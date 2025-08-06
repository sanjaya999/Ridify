package com.renting.RentThis.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class VehicleResponse {

    private Long id;
    private String name;
    private String model;
    private String type;
    private String plateNum;
    private String string;
    private BigDecimal price;
    private String photoUrl;
    private UserResponse ownerName;
    private double latitude;
    private double longitude;
    private boolean isSuspended;
    private boolean is_listed;


}
