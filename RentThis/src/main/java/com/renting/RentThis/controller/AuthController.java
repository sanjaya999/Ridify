package com.renting.RentThis.controller;

import com.renting.RentThis.dto.request.RefreshTokenRequest;
import com.renting.RentThis.dto.response.RefreshTokenResponse;
import com.renting.RentThis.repository.TokenRepository;
import com.renting.RentThis.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private  final AuthService authService;

    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> refreshToken(@RequestBody RefreshTokenRequest request){
        return  ResponseEntity.ok(authService.refreshToken(request));
    }
}
