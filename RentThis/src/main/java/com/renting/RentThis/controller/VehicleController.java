package com.renting.RentThis.controller;

import com.renting.RentThis.CustomAnnotation.CheckSuspention;
import com.renting.RentThis.dto.request.VehicleRequest;
import com.renting.RentThis.dto.response.ApiResponse;
import com.renting.RentThis.dto.response.UserResponse;
import com.renting.RentThis.dto.response.VehicleResponse;
import com.renting.RentThis.entity.Vehicle;
import com.renting.RentThis.service.VehicleService;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/vehicles")
@RequiredArgsConstructor
public class VehicleController {
    private final VehicleService vehicleService;

    @PreAuthorize("hasRole('admin')")
    @PostMapping("/admin/add")
    public ResponseEntity<ApiResponse<VehicleResponse>> addVehicle(@ModelAttribute VehicleRequest request , @RequestParam("photo")MultipartFile photo){
            VehicleResponse vehicleResponse = vehicleService.addVehicle(request , photo);
        return ResponseEntity.ok(ApiResponse.<VehicleResponse>builder()
                .success(true)
                .data(vehicleResponse)
                .status(200)
                .build()
        );
    }
    @GetMapping("/getAll")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>>getAllVehicle(){
        List<VehicleResponse> vehicles = vehicleService.getAllVehicle();
        return ResponseEntity.ok(ApiResponse.<List<VehicleResponse>>builder()
                .success(true)
                .data(vehicles)
                .status(200)
                .build()
        );
    }


    @CheckSuspention
    @GetMapping("/getOne")
    public ResponseEntity<ApiResponse<VehicleResponse>> getOneVehicle(
            @ModelAttribute VehicleRequest request,
            @RequestParam("id") Long id) {

        VehicleResponse vehicle = vehicleService.getOneVehicle(id);  // Return single object, not a list

        return ResponseEntity.ok(ApiResponse.<VehicleResponse>builder()
                .success(true)
                .status(200)
                .data(vehicle)
                .message("Fetch successful")
                .build());
    }

    @CheckSuspention
    @GetMapping("/userVehicle")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> getUserVehicle(@ModelAttribute VehicleRequest request, @RequestParam("id") Long id){
        List<VehicleResponse> vehicles = vehicleService.getUserVehicles(id);
        return ResponseEntity.ok(ApiResponse.<List<VehicleResponse>>builder()
                .success(true)
                .status(200)
                .data(vehicles)
                .message("these are the users vehicles")
                .build());
    }

    @CheckSuspention
    @GetMapping("/currentUserVehicles")
    @PreAuthorize("isAuthenticated")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> loggedInUserVehicles(@ModelAttribute VehicleRequest request ){
        List<VehicleResponse> vehicleResponses = vehicleService.loggedInUserVehicles();

        return ResponseEntity.ok(ApiResponse.<List<VehicleResponse>>builder()
                .success(true)
                .status(200)
                .data(vehicleResponses)
                .message("these are the users vehicles")
                .build());


    }



}
