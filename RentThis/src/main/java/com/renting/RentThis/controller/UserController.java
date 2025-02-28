package com.renting.RentThis.controller;
import com.renting.RentThis.dto.request.LoginRequest;
import com.renting.RentThis.dto.request.UserRegistrationRequest;
import com.renting.RentThis.dto.response.ApiResponse;
import com.renting.RentThis.dto.response.LoginResponse;
import com.renting.RentThis.dto.response.UserResponse;
import com.renting.RentThis.service.JwtService;
import com.renting.RentThis.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ApiResponse <UserResponse>> registerUser(@Valid @RequestBody UserRegistrationRequest request){
        UserResponse user = userService.registerUser(request);

        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .success(true)
                .data(user)
                .status(200)
                .build()
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse <LoginResponse>> loginUser(@RequestBody @Valid LoginRequest request){
        LoginResponse response = userService.loginUser(request);

        return ResponseEntity.ok(ApiResponse.<LoginResponse>builder()
                .success(true)
                .data(response)
                        .status(200)
                .build());
    }

}
