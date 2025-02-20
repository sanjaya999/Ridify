package com.renting.RentThis.service;

import com.renting.RentThis.entity.User;
import com.renting.RentThis.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User createUser(User user){
        return userRepository.save(user);

    }
}
