package com.renting.RentThis.service;

import com.renting.RentThis.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service

public class WalletData {


    @Autowired
    UserService userService;


    public BigDecimal getBalance() {
        User user =  userService.getCurrentUser();

        return user.getBalance();
    }
}
