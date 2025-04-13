// in dto/response/BookingVerificationResponse.java
package com.renting.RentThis.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class BookingVerificationResponse {
    private String token;
    private BigDecimal hourlyRate;
    private long totalHours;
    private BigDecimal totalAmount;}
