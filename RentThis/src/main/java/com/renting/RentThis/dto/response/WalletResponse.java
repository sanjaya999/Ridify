package com.renting.RentThis.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WalletResponse {
    private String message;
    private String status;
    private String balance;


}
