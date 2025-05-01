package com.renting.RentThis.controller;

import com.renting.RentThis.dto.response.ApiResponse;
import com.renting.RentThis.dto.response.UserResponse;
import com.renting.RentThis.dto.response.VehicleResponse; // Added import
import com.renting.RentThis.service.SuperAdminAccess;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/v")
public class SuperAdminVehicle {

    @Autowired
    private SuperAdminAccess superAdminAccess;


    /**
     * Endpoint for Super Admin to get a list of all vehicles.
     *
     * @return ResponseEntity containing ApiResponse with a list of all vehicles.
     */
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> getAllVehicles() {
        // Get vehicles from the service
        List<VehicleResponse> vehicleResponses = superAdminAccess.getAllVehicle();

        // Create the structured API response
        ApiResponse<List<VehicleResponse>> apiResponse = ApiResponse.<List<VehicleResponse>>builder()
                .success(true)
                .status(200)
                .data(vehicleResponses)
                .message("Successfully retrieved all vehicles.") // Optional: Add a message
                .build();

        // Return with proper HTTP status
        return ResponseEntity.ok(apiResponse);
    }

    /**
     * Endpoint for Super Admin to suspend a specific vehicle by its ID.
     *
     * @param id The ID of the vehicle to suspend.
     * @return ResponseEntity containing ApiResponse with the details of the suspended vehicle.
     */
    @PostMapping("/sus/{id}")
    public ResponseEntity<ApiResponse<VehicleResponse>> suspendVehicle(@PathVariable Long id) {
        // Suspend vehicle using the service
        VehicleResponse vehicleResponse = superAdminAccess.suspendVehicle(id);

        // Create the structured API response
        ApiResponse<VehicleResponse> apiResponse = ApiResponse.<VehicleResponse>builder()
                .success(true)
                .status(200)
                .data(vehicleResponse)
                .message("Vehicle suspended successfully.") // Optional: Add a message
                .build();

        // Return with proper HTTP status
        return ResponseEntity.ok(apiResponse);
    }


    /**
     * Endpoint for Super Admin to unsuspend a specific vehicle by its ID.
     *
     * @param id The ID of the vehicle to unsuspend.
     * @return ResponseEntity containing ApiResponse with the details of the unsuspended vehicle.
     */
    @PostMapping("/unsus/{id}")
    public ResponseEntity<ApiResponse<VehicleResponse>> unSuspendVehicle(@PathVariable Long id) {
        // Unsuspend vehicle using the service
        VehicleResponse vehicleResponse = superAdminAccess.unSuspendVehicle(id);

        // Create the structured API response
        ApiResponse<VehicleResponse> apiResponse = ApiResponse.<VehicleResponse>builder()
                .success(true)
                .status(200)
                .data(vehicleResponse)
                .message("Vehicle unsuspended successfully.") // Optional: Add a message
                .build();

        // Return with proper HTTP status
        return ResponseEntity.ok(apiResponse);
    }
}