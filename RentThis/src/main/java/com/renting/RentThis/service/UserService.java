package com.renting.RentThis.service;

import com.renting.RentThis.dto.request.UserRegistrationRequest;
import com.renting.RentThis.dto.response.UserResponse;
import com.renting.RentThis.entity.User;
import com.renting.RentThis.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private  final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public  UserResponse registerUser(UserRegistrationRequest request){

        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already exist");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(encodedPassword);
        User savedUser = userRepository.save(user);

        return UserResponse.builder()
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .name(savedUser.getName())
                .build();
    }

}
