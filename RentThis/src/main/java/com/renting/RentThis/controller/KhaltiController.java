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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
public class KhaltiController {


    @Autowired
    private PaymentService paymentService;


    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private UserService userService;


    @PostMapping("/khalti")
    public ResponseEntity<?> initateKhaltiPaymet(@RequestParam("id") Long vehicleId){
        User currentUser = userService.getCurrentUser();
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found with id: " + vehicleId));
        BigDecimal amount = vehicle.getPrice();

        String rentId =  "veh" + currentUser.getId() + "-" +  vehicle.getId();
        String vehicleName = vehicle.getName();

        String returnUrl = "http://localhost:5132";

        String customerName = currentUser.getName();
        String customerEmail = currentUser.getEmail();
        String cusotmerPhone = "1234567891";
        System.out.println("amount in controller " + amount);

        Map<String , Object> response = paymentService.initiateKhaltiPayment(
                amount , rentId , vehicleName , customerName , customerEmail , cusotmerPhone , returnUrl
        );
        return  ResponseEntity.ok(response);

    }


    public String handleKhaltiCallback(@RequestParam Map<String , String > params){
        String pidx= params.get("pidx");
        String status = params.get("status");
        String transactionId = params.get("transaction_id");
        String amount = params.get("amount");
        String purchaseOrderId = params.get("purchase_order_id");

        String resultStatus = "failed";
        String resultMessage = "Payment processing failed";

        Long userId = null;
        try {
            if (purchaseOrderId!= null && purchaseOrderId.startsWith("veh")){
                String[] parts = purchaseOrderId.split("-");
                if (parts.length>=2){
                    userId = Long.parseLong(parts[1]);
                }
            }
        }catch (NumberFormatException e) {
            resultMessage = "Invalid order Id format";
        }

        return  null;
    }


}
