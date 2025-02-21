package com.renting.RentThis.repository;

import com.renting.RentThis.entity.User;
import jakarta.validation.constraints.Email;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User , Long> {

    boolean existsByEmail(String email);
}
