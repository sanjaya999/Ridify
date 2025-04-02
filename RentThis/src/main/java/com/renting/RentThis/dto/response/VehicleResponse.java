package com.renting.RentThis.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VehicleResponse {

    private Long id;
    private String name;
    private String model;
    private String type;
    private String plateNum;
    private String string;
    private Integer price;
    private String photoUrl;
    private String ownerName;


}
