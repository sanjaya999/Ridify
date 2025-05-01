package com.renting.RentThis.service;

import com.renting.RentThis.dto.response.UserResponse;
import com.renting.RentThis.dto.response.VehicleResponse;
import com.renting.RentThis.entity.User;
import com.renting.RentThis.entity.Vehicle;
import com.renting.RentThis.repository.UserRepository;
import com.renting.RentThis.repository.VehicleRepository;
import com.renting.RentThis.util.ResponseMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@PreAuthorize("@userSecurity.isSuperAdmin()")
public class SuperAdminAccess {

    @Autowired
    UserRepository userRepository;

    @Autowired
    VehicleRepository vehicleRepository;

    public List<UserResponse> getAllUsers() {
        List<User> userList = userRepository.findAll();

        return userList.stream()
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .isSuspended(user.getIsSuspended())
                        .build())
                .collect(Collectors.toList());
    }


    public UserResponse suspendUser(Long id){
        Optional<User> oneUser = userRepository.findById(id);
        if(oneUser.isEmpty()){
            throw new RuntimeException("No users found");
        }
        User user = oneUser.get();
        user.setIsSuspended(true);
        userRepository.save(user);
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .isSuspended(user.getIsSuspended())
                .message("user suspended successfully")
                .build();
    }


    public UserResponse unSuspendUser(Long id){
        Optional<User> oneUser = userRepository.findById(id);
        if(oneUser.isEmpty()){
            throw new RuntimeException("No users found");
        }
        User user = oneUser.get();
        user.setIsSuspended(false);
        userRepository.save(user);
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .isSuspended(user.getIsSuspended())
                .message("user unsuspended successfully")
                .build();
    }

    /**
     * Retrieves a list of all vehicles from the database and maps them to VehicleResponse objects.
     *
     * @return a list of VehicleResponse objects representing all vehicles in the system.
     */
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
                        .isSuspended(vehicle.isSuspended())
                        .ownerName(ResponseMapper.toUserMap(vehicle.getOwner()))
                        .build())
                .collect(Collectors.toList());


        return responseList;

    }

    /**
     * Suspends the specified vehicle by setting its suspension status to true.
     * Retrieves the vehicle by its ID, updates the suspension status, and saves
     * the changes back to the repository. If the vehicle with the given ID is not
     * found, a runtime exception is thrown.
     *
     * @param id the unique identifier of the vehicle to be suspended
     * @return a VehicleResponse object containing the updated details of the suspended vehicle
     * @throws RuntimeException if no vehicle is found with the given ID
     */
    public VehicleResponse suspendVehicle(Long id){
        Optional<Vehicle> oneVehicle = vehicleRepository.findById(id);
        if(oneVehicle.isEmpty()){
            throw new RuntimeException("No vehicles found");
        }
        Vehicle vehicle = oneVehicle.get();
        vehicle.setSuspended(true);
        vehicleRepository.save(vehicle);
        return VehicleResponse.builder()
                .id(vehicle.getId())
                .name(vehicle.getName())
                .model(vehicle.getModel())
                .type(vehicle.getType())
                .plateNum(vehicle.getPlate_num())
                .price(vehicle.getPrice())
                .photoUrl(vehicle.getPhotoUrl())
                .isSuspended(vehicle.isSuspended())
                .build();
    }

    /**
     * Unsuspends a vehicle by its ID. If the vehicle is suspended, this method sets its suspension status to false
     * and updates the corresponding record in the repository. If a vehicle with the given ID is not found,
     * a RuntimeException is thrown.
     *
     * @param id the ID of the vehicle to unsuspend
     * @return a VehicleResponse object containing the updated details of the vehicle
     * @throws RuntimeException if no vehicle is found with the given ID
     */
    public VehicleResponse unSuspendVehicle(Long id){
        Optional<Vehicle> oneVehicle = vehicleRepository.findById(id);

        if(oneVehicle.isEmpty()){
            throw new RuntimeException("No vehicles found");
        }
        Vehicle vehicle = oneVehicle.get();
        vehicle.setSuspended(false);
        vehicleRepository.save(vehicle);
        return VehicleResponse.builder()
                .id(vehicle.getId())
                .name(vehicle.getName())
                .model(vehicle.getModel())
                .type(vehicle.getType())
                .plateNum(vehicle.getPlate_num())
                .price(vehicle.getPrice())
                .photoUrl(vehicle.getPhotoUrl())
                .isSuspended(vehicle.isSuspended())
                .build();
    }

}
