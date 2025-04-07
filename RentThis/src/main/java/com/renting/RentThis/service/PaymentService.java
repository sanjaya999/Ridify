package com.renting.RentThis.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.renting.RentThis.entity.Transaction;
import com.renting.RentThis.entity.User;
import com.renting.RentThis.exception.InsufficientBalanceException;
import com.renting.RentThis.repository.TransactionRepository;
import com.renting.RentThis.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {
    private static final Logger log =  LoggerFactory.getLogger(PaymentService.class);

    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private UserRepository userRepository;

    @Value("${khaltiSecretKey}")
    private String khaltiSecretKey;

    private String khaltiApiUrl = "https://dev.khalti.com/api/v2";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public void processInternalPayment(User payer , User reciever , BigDecimal amount , String bookingReference){
        log.info("Processing internal payment: {} from user {} to {} for booking {}", amount, payer.getId(), reciever.getId(), bookingReference);

        if (payer.getBalance().compareTo(amount)<0){
            log.error("Insufficient balance for user {} to {} for booking {}" ,
                    payer.getId() , payer.getBalance() , amount);
            throw new InsufficientBalanceException("Insufficient balance to complete the transaction");

        }
        payer.setBalance(payer.getBalance().subtract(amount));
        userRepository.save(payer);

        reciever.setBalance(reciever.getBalance().add(amount));
        userRepository.save(reciever);

        createTransactionRecord(payer.getId(), reciever.getId(), amount, bookingReference, "INTERNAL");


        log.info("Payment processed successfully for booking {}" , bookingReference);
    }

    public Map<String , Object> initiateKhaltiPayment(
            BigDecimal amount,
            String orderId,
            String productName,
            Long currentUserId ,
            String customerName,
            String customerEmail,
            String customerPhone,
            String returnUrl,
            Long vehicleOwnerId
    ){
        log.info("Initiating khalti Payment for order:{} , amount: {}" , orderId , amount);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization" , "Key " + khaltiSecretKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("return_url", returnUrl);
            requestBody.put("website_url" , returnUrl);
            System.out.println("amount" + amount);
            requestBody.put("amount" , amount);
            requestBody.put("purchase_order_id" , orderId);
            requestBody.put("purchase_order_name" , productName);


            Map<String , Object> customerInfo = new HashMap<>();
            customerInfo.put("name" , customerName);
            customerInfo.put("email" , customerEmail);
            customerInfo.put("phone" , customerPhone);
            requestBody.put("customer_info" , customerInfo);

            HttpEntity<Map<String , Object>> entity = new HttpEntity<>(requestBody , headers);

            Map<String, Object> response = restTemplate.postForObject(
                    khaltiApiUrl + "/epayment/initiate/",
                    entity,
                    Map.class
            );

            log.info("Khalti payment initiated successfully with pidx: {}", response.get("pidx"));


            return response;


        } catch (Exception e) {
            log.error("Failed to initiate Khalti payment: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to initiate payment: " + e.getMessage(), e);
        }
    }



    public  Map<String , Object> verifyKhaltiPayment(String pidx){
        log.info("Verifying Khalti payment with pidx: {}", pidx);

        try{
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Key " + khaltiSecretKey);

            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("pidx", pidx);

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

            Map<String, Object> response = restTemplate.postForObject(
                    khaltiApiUrl + "/epayment/lookup/",
                    entity,
                    Map.class
            );

            log.info("Khalti payment verification result for pidx {}: status={}",
                    pidx, response.get("status"));

            return response;



        } catch (Exception e) {
            log.error("Failed to verify Khalti payment: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to verify payment: " + e.getMessage(), e);
        }
    }




    public void createTransactionRecord(Long payerId, Long receiverId, BigDecimal amount,
                                         String reference, String paymentMethod) {
        Transaction transaction = new Transaction();
        transaction.setPayerId(payerId);
        transaction.setReceiverId(receiverId);
        transaction.setAmount(amount);
        transaction.setReference(reference);
        transaction.setPaymentMethod(paymentMethod);
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setStatus("COMPLETED");

        transactionRepository.save(transaction);
        log.info("Transaction record created: {}", transaction.getId());
    }
}




