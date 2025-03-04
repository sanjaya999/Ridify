package com.renting.RentThis.service;

import com.renting.RentThis.dto.request.VehicleRequest;
import com.renting.RentThis.dto.response.VehicleResponse;
import com.renting.RentThis.entity.User;
import com.renting.RentThis.entity.Vehicle;
import com.renting.RentThis.repository.UserRepository;
import com.renting.RentThis.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class VehicleService {

    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private VehicleRepository vehicleRepository;
    @Autowired
    private UserRepository userRepository;

    @PreAuthorize("hasRole('admin')") //not working ??
    public VehicleResponse addVehicle(VehicleRequest request, MultipartFile photo){

        Vehicle vehicle = new Vehicle();
        vehicle.setName(request.getName());
        vehicle.setModel(request.getModel());
        vehicle.setPlate_num(request.getPlateNum());
        vehicle.setType(request.getType());
        vehicle.setStatus(request.getStatus());


            String photoUrl = fileStorageService.saveFile(photo);
            vehicle.setPhotoUrl(photoUrl);




        String currentUserEmail = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User owner = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(()-> new RuntimeException("User not found with email "+ currentUserEmail));

        vehicle.setOwner_id(owner);
        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        return VehicleResponse.builder()
                .id(savedVehicle.getId())
                .name(savedVehicle.getName())
                .model(savedVehicle.getModel())
                .type(savedVehicle.getType())
                .plateNum(savedVehicle.getPlate_num())
                .photoUrl(savedVehicle.getPhotoUrl())
                .build();


    }

}
