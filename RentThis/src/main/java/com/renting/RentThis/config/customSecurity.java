package com.renting.RentThis.config;

import com.renting.RentThis.entity.User;
import com.renting.RentThis.entity.Vehicle;
import com.renting.RentThis.repository.VehicleRepository;
import com.renting.RentThis.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component("userSecurity")
public class customSecurity {

    @Autowired
    private UserService userService;

    @Autowired
    private VehicleRepository vehicleRepository;

    public  boolean isOwner(Long userId){
        User currentUser = userService.getCurrentUser();
        return currentUser.getId().equals(userId);
    }

    public  boolean isVehicleOwner(Long vehicleId){
        User currentUser = userService.getCurrentUser();
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(()->new RuntimeException("vehicle not found"));
        return  currentUser.getId().equals(vehicle.getOwner().getId());
    }

    public boolean isSuperAdmin(){
        User currentUser = userService.getCurrentUser();
        return currentUser.getRole().equals("superAdmin");
    }

    public boolean isSuspended(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if( authentication == null || !authentication.isAuthenticated()){
            return  false;
        }
        User currentUser = userService.getCurrentUser();
        return currentUser.getIsSuspended();
    }
}
