package com.renting.RentThis.controller;

import com.renting.RentThis.dto.request.VehicleRequest;
import com.renting.RentThis.dto.response.ApiResponse;
import com.renting.RentThis.dto.response.UserResponse;
import com.renting.RentThis.dto.response.VehicleResponse;
import com.renting.RentThis.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/admin/vehicles")
@RequiredArgsConstructor
public class VehicleController {
    private final VehicleService vehicleService;

    @PreAuthorize("hasRole('admin')")
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<VehicleResponse>> addVehicle(@ModelAttribute VehicleRequest request , @RequestParam("photo")MultipartFile photo){
            VehicleResponse vehicleResponse = vehicleService.addVehicle(request , photo);
        return ResponseEntity.ok(ApiResponse.<VehicleResponse>builder()
                .success(true)
                .data(vehicleResponse)
                .status(200)
                .build()
        );
    }


}
