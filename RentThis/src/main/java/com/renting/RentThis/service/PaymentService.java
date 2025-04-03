package com.renting.RentThis.service;

import com.renting.RentThis.entity.User;
import com.renting.RentThis.exception.InsufficientBalanceException;
import com.renting.RentThis.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class PaymentService {
    private static final Logger log =  LoggerFactory.getLogger(PaymentService.class);

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void processInternalPayment(User payer , User reciever , BigDecimal amount , String bookingReference){    log.info("Processing internal payment: {} from user {} to {} for booking {}",
            amount, payer.getId(), reciever.getId(), bookingReference);
        System.out.println(amount);

        if (payer.getBalance().compareTo(amount)<0){
            log.error("Insufficient balance for user {} to {} for booking {}" ,
                    payer.getId() , payer.getBalance() , amount);
            throw new InsufficientBalanceException("Insufficient balance to complete the transaction");

        }
        payer.setBalance(payer.getBalance().subtract(amount));
        userRepository.save(payer);

        reciever.setBalance(reciever.getBalance().add(amount));
        userRepository.save(reciever);

        log.info("Payment processed successfully for booking {}" , bookingReference);
    }

    //for future esewa integration
    public String initiateEsewaTopup(User user, BigDecimal amount) {
        // This will be implemented when you integrate eSewa
        // Should return a redirect URL or payment ID
        throw new UnsupportedOperationException("eSewa topup not yet implemented");
    }


}
