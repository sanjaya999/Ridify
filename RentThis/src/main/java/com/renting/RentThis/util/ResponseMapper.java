package com.renting.RentThis.util;

import com.renting.RentThis.dto.response.UserResponse;
import com.renting.RentThis.dto.response.VehicleResponse;
import com.renting.RentThis.entity.User;
import com.renting.RentThis.entity.Vehicle;

public class ResponseMapper {
    public static UserResponse toUserMap(User user){
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    public  static VehicleResponse toVehicleMap(Vehicle vehicle){
        return VehicleResponse.builder()
                .id(vehicle.getId())
                .name(vehicle.getName())
                .model(vehicle.getModel())
                .type(vehicle.getType())
                .plateNum(vehicle.getPlate_num())
                .price(vehicle.getPrice())
                .photoUrl(vehicle.getPhotoUrl())
                .ownerName(toUserMap(vehicle.getOwner()))
                .build();
    }
}
