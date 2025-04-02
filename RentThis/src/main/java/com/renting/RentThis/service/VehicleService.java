package com.renting.RentThis.service;

import com.renting.RentThis.dto.request.VehicleRequest;
import com.renting.RentThis.dto.response.VehicleResponse;
import com.renting.RentThis.entity.User;
import com.renting.RentThis.entity.Vehicle;
import com.renting.RentThis.repository.UserRepository;
import com.renting.RentThis.repository.VehicleRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
        vehicle.setPrice(request.getPrice());
        vehicle.setStatus(request.getStatus());


            String photoUrl = fileStorageService.saveFile(photo);
            vehicle.setPhotoUrl(photoUrl);




        String currentUserEmail = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User owner = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(()-> new RuntimeException("User not found with email "+ currentUserEmail));

        vehicle.setOwner(owner);
        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        return VehicleResponse.builder()
                .id(savedVehicle.getId())
                .name(savedVehicle.getName())
                .model(savedVehicle.getModel())
                .type(savedVehicle.getType())
                .plateNum(savedVehicle.getPlate_num())
                .price(savedVehicle.getPrice())
                .photoUrl(savedVehicle.getPhotoUrl())
                .ownerName(savedVehicle.getOwner().getName())
                .build();


    }

    public List<VehicleResponse> getAllVehicle(){
        List<Vehicle> vehicles = vehicleRepository.findAll();

        List<VehicleResponse> responseList = vehicles.stream()
                .map(vehicle -> VehicleResponse.builder()
                        .id(vehicle.getId())
                        .name(vehicle.getName())
                        .model(vehicle.getModel())
                        .type(vehicle.getType())
                        .plateNum(vehicle.getPlate_num())
                        .photoUrl(vehicle.getPhotoUrl())
                        .price(vehicle.getPrice())
                        .ownerName(vehicle.getOwner().getName())
                        .build())
                .collect(Collectors.toList());


        return responseList;

    }

    public VehicleResponse getOneVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found with id: " + id));

        return VehicleResponse.builder()
                .id(vehicle.getId())
                .name(vehicle.getName())
                .model(vehicle.getModel())
                .type(vehicle.getType())
                .price(vehicle.getPrice())
                .plateNum(vehicle.getPlate_num())
                .photoUrl(vehicle.getPhotoUrl())
                .ownerName(vehicle.getOwner().getName())
                .build();
    }



    public List<VehicleResponse> getUserVehicles(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        List<Vehicle> vehicles = vehicleRepository.findByOwnerId(user.getId());

        List<VehicleResponse> responseList = vehicles.stream()
                .map(vehicle -> VehicleResponse.builder()
                        .id(vehicle.getId())
                        .name(vehicle.getName())
                        .model(vehicle.getModel())
                        .type(vehicle.getType())
                        .plateNum(vehicle.getPlate_num())
                        .price(vehicle.getPrice())
                        .photoUrl(vehicle.getPhotoUrl())
                        .ownerName(vehicle.getOwner().getName())
                        .build())
                .collect(Collectors.toList());

        return responseList;
    }

    public List<VehicleResponse> loggedInUserVehicles(){

        String currentUserEmail = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(()-> new RuntimeException("User not found with email "+ currentUserEmail));

        List<Vehicle> vehicles = vehicleRepository.findByOwnerId(currentUser.getId());

        List<VehicleResponse> responseList = vehicles.stream()
                .map(vehicle -> VehicleResponse.builder()
                        .id(vehicle.getId())
                        .name(vehicle.getName())
                        .model(vehicle.getModel())
                        .type(vehicle.getType())
                        .price(vehicle.getPrice())
                        .plateNum(vehicle.getPlate_num())
                        .photoUrl(vehicle.getPhotoUrl())
                        .ownerName(vehicle.getOwner().getName())
                        .build())
                .collect(Collectors.toList());

        return responseList;

    }
}
