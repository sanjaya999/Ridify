package com.renting.RentThis.service;

import com.renting.RentThis.dto.request.RefreshTokenRequest;
import com.renting.RentThis.dto.response.RefreshTokenResponse;
import com.renting.RentThis.entity.Token;
import com.renting.RentThis.entity.User;
import com.renting.RentThis.repository.TokenRepository;
import com.renting.RentThis.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final TokenRepository tokenRepository;
    private final JwtService jwtService;
    private  final UserRepository userRepository;
    @Value("${jwt.refresh.expiration}")
    private long refreshTokenExpiry;

    public RefreshTokenResponse refreshToken(RefreshTokenRequest request){

        Token refreshToken = tokenRepository.findByRefreshToken(request.getRefreshToken()).orElseThrow(()->new RuntimeException("RefreshToken  not found"));

        if (!refreshToken.isValid() || refreshToken.getExpiryDate().isBefore(LocalDateTime.now())){
            throw new RuntimeException("Refresh token is invalid or expired");
        }

        User user = refreshToken.getUser();

        String newAccessToken = jwtService.generateAccessToken(user.getId() , user.getEmail() , user.getRole());
        refreshToken.setValid(false);
        tokenRepository.save(refreshToken);

        String newRefreshTokenString = jwtService.generateRefreshToken(user.getId(), user.getEmail(), user.getRole());
        Token newRefreshToken = new Token();
        newRefreshToken.setRefreshToken(newRefreshTokenString);
        newRefreshToken.setUser(user);
        newRefreshToken.setValid(true);
        newRefreshToken.setExpiryDate(LocalDateTime.now().plusNanos(refreshTokenExpiry*10000L));
        tokenRepository.save(newRefreshToken);
        return RefreshTokenResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshTokenString)
                .build();
    }


}
