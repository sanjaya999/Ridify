package com.renting.RentThis.repository;

import com.renting.RentThis.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction , Long> {
    List<Transaction> findByPayerId(Long payerId);
    List<Transaction> findByReceiverId(Long receiverId);
    List<Transaction> findByReference(String reference);
    List<Transaction> findByPaymentMethod(String paymentMethod);
}
