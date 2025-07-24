package com.renting.RentThis.repository;

import com.renting.RentThis.entity.Token;
import com.renting.RentThis.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Repository
public interface TokenRepository extends JpaRepository<Token , Long>{
    @Query("SELECT t FROM Token t WHERE t.refreshToken = :refreshToken")
    Optional<Token> findByRefreshToken(@Param("refreshToken") String refreshToken);

    @Modifying
    @Transactional
    @Query("DELETE FROM Token t WHERE t.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);

}

