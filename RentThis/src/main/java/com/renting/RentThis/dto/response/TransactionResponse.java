package com.renting.RentThis.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TransactionResponse {
    private String message;
    private String status;
    private String paymentMethod;
}
