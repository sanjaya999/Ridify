package com.renting.RentThis.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TopupRequest {
    private BigDecimal amount;
}
