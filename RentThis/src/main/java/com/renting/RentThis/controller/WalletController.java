package com.renting.RentThis.controller;

import com.renting.RentThis.dto.response.WalletResponse;
import com.renting.RentThis.service.WalletData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {
    @Autowired
    private WalletData walletData;

    @GetMapping("/balance")
    public ResponseEntity<WalletResponse> getBalance() {
        BigDecimal balance = walletData.getBalance();

        WalletResponse response = WalletResponse.builder()
                .message("Balance retrieved successfully")
                .status("success")
                .balance(balance.toString())
                .build();

        return ResponseEntity.ok(response);
    }
}