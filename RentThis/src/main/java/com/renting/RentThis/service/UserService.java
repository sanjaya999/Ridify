package com.renting.RentThis.service;

import com.renting.RentThis.dto.request.LoginRequest;
import com.renting.RentThis.dto.request.UserRegistrationRequest;
import com.renting.RentThis.dto.response.LoginResponse;
import com.renting.RentThis.dto.response.UserResponse;
import com.renting.RentThis.entity.Token;
import com.renting.RentThis.entity.User;
import com.renting.RentThis.exception.UserNotAuthenticatedException;
import com.renting.RentThis.repository.TokenRepository;
import com.renting.RentThis.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class UserService {
    private  final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private  final JwtService jwtService;
    private final TokenRepository tokenRepository;

    @Value("${jwt.refresh.expiration}")
    private long refreshTokenExpiry;


    public  UserResponse registerUser(UserRegistrationRequest request){

        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already exist");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        user.setPhoneNumber(request.getPhoneNumber());
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(encodedPassword);
        User savedUser = userRepository.save(user);



        return UserResponse.builder()
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .name(savedUser.getName())
                .message("user created successfully")
                .build();
    }
    public LoginResponse loginUser(LoginRequest request){


        if (!userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email does not exist");
        }
        User user = userRepository.findByEmail(request.getEmail()).get();

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new RuntimeException("Invalid password");
        }
        if(user.getIsSuspended()){
            throw new RuntimeException("User is suspended");
        }

        tokenRepository.deleteByUserId(user.getId());

        var userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(),  // Using email instead of username
                user.getPassword(),
                new ArrayList<>()
        );

        String accessToken = jwtService.generateAccessToken(user.getId() , user.getEmail(), user.getRole());
        String refreshToken = jwtService.generateRefreshToken(user.getId(),  user.getEmail(), user.getRole());

       Token token = new Token();
       token.setRefreshToken(refreshToken);
       token.setUser(user);
       token.setValid(true);
       token.setExpiryDate(LocalDateTime.now().plusNanos(refreshTokenExpiry*10000L));
       tokenRepository.save(token);


        return LoginResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .balance(user.getBalance())
                .build();
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Check if authentication is null or not authenticated
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UserNotAuthenticatedException("User not authenticated");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetails) {
            String email = ((UserDetails) principal).getUsername();
            return userRepository.findByEmail(email)
                    .orElseThrow(() -> new UserNotAuthenticatedException("User not found with email " + email));
        } else {
            throw new UserNotAuthenticatedException("User not authenticated");
        }
    }


}
