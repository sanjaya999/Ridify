package com.renting.RentThis.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    private Long id;
    private String name;
    private String email;
    private String accessToken;
    private String refreshToken;
    private String role;

}
