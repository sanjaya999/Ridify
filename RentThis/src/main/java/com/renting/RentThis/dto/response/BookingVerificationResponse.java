// in dto/response/BookingVerificationResponse.java
package com.renting.RentThis.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class BookingVerificationResponse {
    private String token;
    private BigDecimal amount;
}
