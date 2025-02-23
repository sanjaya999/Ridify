package com.renting.RentThis.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApiResponse <T> {
    private boolean success;
    private String message;
    private int status;
    private T data;

}
