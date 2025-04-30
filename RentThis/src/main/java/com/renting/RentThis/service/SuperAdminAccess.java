package com.renting.RentThis.service;

import com.renting.RentThis.dto.response.UserResponse;
import com.renting.RentThis.entity.User;
import com.renting.RentThis.repository.UserRepository;
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
}
