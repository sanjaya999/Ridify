package com.renting.RentThis.repository;

import com.renting.RentThis.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User , Long> {

}
