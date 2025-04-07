package com.renting.RentThis.controller;

import com.renting.RentThis.entity.User;
import com.renting.RentThis.entity.Vehicle;
import com.renting.RentThis.repository.VehicleRepository;
import com.renting.RentThis.service.PaymentService;
import com.renting.RentThis.service.UserService;
import com.renting.RentThis.service.VehicleService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")

public class KhaltiController {

    private static final Logger log = LoggerFactory.getLogger(KhaltiController.class);


    @Autowired
    private PaymentService paymentService;


    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private UserService userService;


    @PostMapping("/khalti")
    public ResponseEntity<?> initateKhaltiPaymet(@RequestParam("id") Long vehicleId) {
        User currentUser = userService.getCurrentUser();
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found with id: " + vehicleId));
        BigDecimal amount = vehicle.getPrice();

        String rentId = "veh" + currentUser.getId() + "-" + vehicle.getId();
        String vehicleName = vehicle.getName();
        Long vehicleOwnerId = vehicle.getOwner().getId();
        Long currentUserId = currentUser.getId();

        String returnUrl = "http://localhost:8080/api/v1/payments/khaltiCall/callback";
        String customerName = currentUser.getName();
        String customerEmail = currentUser.getEmail();
        String cusotmerPhone = "1234567891";
        System.out.println("amount in controller " + amount);

        Map<String, Object> response = paymentService.initiateKhaltiPayment(
                amount, rentId, vehicleName,currentUserId , customerName, customerEmail, cusotmerPhone, returnUrl ,vehicleOwnerId
        );
        return ResponseEntity.ok(response);

    }
    @GetMapping("/khaltiCall/callback")
    public ResponseEntity<?> handleKhaltiCallback(@RequestParam Map<String, String> params) {


        String status = params.get("status");
        String pidx = params.get("pidx");
        String amountStr = params.getOrDefault("amount", params.get("total_amount"));
        String transactionId = params.get("transaction_id");
        String purchaseOrderId = params.get("purchase_order_id");
        String purchaseOrderName = params.get("purchase_order_name");

        Map<String, Object> response = new HashMap<>();
        response.put("pidx", pidx);
        response.put("status", status);
        response.put("amount", amountStr);
        response.put("purchase_order_id", purchaseOrderId);
        response.put("purchase_order_name", purchaseOrderName);

        if ("User canceled".equalsIgnoreCase(status) ||"Unhandled status.".equalsIgnoreCase(status) ) {
            response.put("message", "Payment canceled by user.");
            return ResponseEntity.ok(response);
        }

        if ("Completed".equalsIgnoreCase(status)) {
            //verifying pidx
            if(pidx != null && !pidx.isEmpty()){
                Map<String , Object> verificationResponse = paymentService.verifyKhaltiPayment(pidx);
            }else {
                return ResponseEntity.badRequest().body("Payment was cancelled or invalid.");
            }

            // Save to DB, update order status, etc.
            response.put("transaction_id", transactionId);
            response.put("message", "Payment successful.");

            return ResponseEntity.ok(response);
        }
        response.put("message", "Unhandled status.");
        return ResponseEntity.badRequest().body(response);

}



}