package com.renting.RentThis.controller;

import com.renting.RentThis.dto.request.BookingConfirmRequest;
import com.renting.RentThis.dto.request.BookingRequest;
import com.renting.RentThis.dto.request.KhaltiCheckStatusRequest;
import com.renting.RentThis.dto.request.TopupRequest;
import com.renting.RentThis.dto.response.TransactionResponse;
import com.renting.RentThis.entity.User;
import com.renting.RentThis.entity.Vehicle;
import com.renting.RentThis.repository.VehicleRepository;
import com.renting.RentThis.service.*;
import io.jsonwebtoken.Claims;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
public class KhaltiController {

    @Value("${callbackURL}")
    private String callbackURL;

    private static final Logger log = LoggerFactory.getLogger(KhaltiController.class);


    @Autowired
    private PaymentService paymentService;


    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private UserService userService;

    @Autowired
    JwtService jwtService;

    @Autowired
    BookingService bookingService;



    @PostMapping("/khalti")
    public ResponseEntity<?> initateKhaltiPaymet(@RequestBody BookingConfirmRequest request) {
        Claims claims = jwtService.extractBookingVerificationClaims(request.getToken());
        Long vehicleId = Long.parseLong(claims.get("vehicleId").toString());
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));

        Long userId = Long.parseLong(claims.get("userId").toString());
        User currentUser = userService.getCurrentUser();
        if(!userId.equals(currentUser.getId())){
            throw new RuntimeException("you are not the user ");
        }
        LocalDateTime startTime = LocalDateTime.parse(claims.get("startTime").toString());

        LocalDateTime endTime = LocalDateTime.parse(claims.get("endTime").toString());
        String startingAddress = claims.get("startingAddress").toString();
        String endingAddress = claims.get("endingAddress").toString();

        BigDecimal dbAmount =bookingService.calculateAmount(vehicle, startTime, endTime);
        BigDecimal multiplier = new BigDecimal("100");
        BigDecimal amount = dbAmount.multiply(multiplier);
        String rentId = "veh" + currentUser.getId() + "-" + vehicle.getId();
        String vehicleName = vehicle.getName();
        Long vehicleOwnerId = vehicle.getOwner().getId();
        Long currentUserId = currentUser.getId();

        String returnUrl =  callbackURL + "/khalti-callback";
        String customerName = currentUser.getName();
        String customerEmail = currentUser.getEmail();
        String cusotmerPhone = "1234567891";
        System.out.println("amount in controller " + amount);

        Map<String, Object> response = paymentService.initiateKhaltiPayment(
                amount, rentId, vehicleName,currentUserId , customerName, customerEmail, cusotmerPhone, returnUrl ,vehicleOwnerId
        );
        return ResponseEntity.ok(response);

    }

    @PostMapping("/khalti/topup")
    public ResponseEntity<?> topupKhalti(@RequestBody TopupRequest request) {

        User currentUser = userService.getCurrentUser();

        BigDecimal amountToTopup = request.getAmount().multiply(new BigDecimal("100"));

        String topupid = "top" + currentUser.getId() + "-" + amountToTopup;

        String returnUrl = callbackURL + "/topup-callback";
        String customerName = currentUser.getName();
        String customerEmail = currentUser.getEmail();
        String cusotmerPhone = "1234567891";
        System.out.println("amount in controller " + amountToTopup);

        Map<String, Object> response = paymentService.topupKhalti(amountToTopup ,topupid,"topup" , customerName, customerEmail, cusotmerPhone, returnUrl );
        return ResponseEntity.ok(response);

    }
//    @GetMapping("/khaltiCall/callback")
//    public ResponseEntity<?> handleKhaltiCallback(@RequestParam Map<String, String> params) {
//
//
//        String status = params.get("status");
//        String pidx = params.get("pidx");
//        String amountStr = params.getOrDefault("amount", params.get("total_amount"));
//        String transactionId = params.get("transaction_id");
//        String purchaseOrderId = params.get("purchase_order_id");
//        String purchaseOrderName = params.get("purchase_order_name");
//
//        Map<String, Object> response = new HashMap<>();
//        response.put("pidx", pidx);
//        response.put("status", status);
//        response.put("amount", amountStr);
//        response.put("purchase_order_id", purchaseOrderId);
//        response.put("purchase_order_name", purchaseOrderName);
//
//        if ("User canceled".equalsIgnoreCase(status) ||"Unhandled status.".equalsIgnoreCase(status) ) {
//            response.put("message", "Payment canceled by user.");
//            return ResponseEntity.ok(response);
//        }
//
//        if ("Completed".equalsIgnoreCase(status)) {
//            //verifying pidx
//            if(pidx != null && !pidx.isEmpty()){
//                Map<String , Object> verificationResponse = paymentService.verifyKhaltiPayment(pidx );
//            }else {
//                return ResponseEntity.badRequest().body("Payment was cancelled or invalid.");
//            }
//
//            // Save to DB, update order status, etc.
//            response.put("transaction_id", transactionId);
//            response.put("message", "Payment successful.");
//
//            return ResponseEntity.ok(response);
//        }
//        response.put("message", "Unhandled status.");
//        return ResponseEntity.badRequest().body(response);
//
//}

    @PostMapping("/khalti/check-status")
    public ResponseEntity<?> checkKhaltiPaymentStatus(@RequestBody KhaltiCheckStatusRequest request) {
        String pidx = request.getPidx();
        String token = request.getToken();

        log.info("Received Khalti status check request for pidx: {}", pidx);

        // Basic input validation
        if (pidx == null || pidx.isBlank()) {
            log.warn("Status check request missing pidx.");
            return ResponseEntity.badRequest().body(Map.of("message", "Missing pidx for status check."));
        }

        try {
            Map<String, Object> verificationResponse = paymentService.verifyKhaltiPayment(pidx , token);

            log.info("Returning Khalti verification status for pidx {}: {}", pidx, verificationResponse.get("status"));
            return ResponseEntity.ok(verificationResponse);

        } catch (RuntimeException e) {
            log.error("Khalti status check failed for pidx {} due to runtime exception: {}", pidx, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to verify Khalti payment status due to an internal error.", "pidx", pidx));
        } catch (Exception e) {
            log.error("Unexpected error during Khalti status check for pidx {}: {}", pidx, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An unexpected error occurred while checking payment status.", "pidx", pidx));
        }
    }

    @PostMapping("/khalti/topup/check-status")
    public ResponseEntity<?> topupPaymentStatus(@RequestBody KhaltiCheckStatusRequest request) {
        String pidx = request.getPidx();

        log.info("Received Khalti status check request for pidx: {}", pidx);

        if (pidx == null || pidx.isBlank()) {
            log.warn("Status check request missing pidx.");
            return ResponseEntity.badRequest().body(Map.of("message", "Missing pidx for status check."));
        }

        try {
            TransactionResponse verificationResponse = paymentService.khaltiTopup(pidx );

            return ResponseEntity.ok(verificationResponse);

        } catch (RuntimeException e) {
            log.error("Khalti status check failed for pidx {} due to runtime exception: {}", pidx, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to verify Khalti payment status due to an internal error.", "pidx", pidx));
        } catch (Exception e) {
            log.error("Unexpected error during Khalti status check for pidx {}: {}", pidx, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An unexpected error occurred while checking payment status.", "pidx", pidx));
        }
    }



}

