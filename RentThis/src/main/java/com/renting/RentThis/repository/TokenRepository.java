package com.renting.RentThis.repository;

import com.renting.RentThis.entity.Token;
import com.renting.RentThis.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token , Long>{
    Optional<Token> findByRefreshToken(String refreshToken);
    void deleteByUser(User user);

}

