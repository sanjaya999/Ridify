package com.renting.RentThis.controller;

import com.renting.RentThis.dto.response.ApiResponse;
import com.renting.RentThis.dto.response.UserResponse;
import com.renting.RentThis.service.SuperAdminAccess;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/v1/s")
public class SuperAdminUser {
    @Autowired
    private SuperAdminAccess superAdminAccess;


    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        // Get users from the service
        List<UserResponse> userResponses = superAdminAccess.getAllUsers();

        // Create the structured API response
        ApiResponse<List<UserResponse>> apiResponse = ApiResponse.<List<UserResponse>>builder()
                .success(true)
                .status(200)
                .data(userResponses)
                .build();

        // Return with proper HTTP status
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/sus/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> suspendUser(@PathVariable Long id) {
        UserResponse userResponse = superAdminAccess.suspendUser(id);
        ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder()
                .success(true)
                .status(200)
                .data(userResponse)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/unsus/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> unSuspendUser(@PathVariable Long id) {
        UserResponse userResponse = superAdminAccess.unSuspendUser(id);
        ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder()
                .success(true)
                .status(200)
                .data(userResponse)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

}