package com.renting.RentThis.repository;

import com.renting.RentThis.entity.Vehicle;
import com.renting.RentThis.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByOwnerId(Long ownerId);


    List<Vehicle> findByName(String searchTerm);

    List<Vehicle> findByNameContainingIgnoreCase(String searchTerm);

    @Query(value = "SELECT * FROM vehicle v WHERE REPLACE(LOWER(v.name), ' ', '') LIKE CONCAT('%', REPLACE(LOWER(:searchTerm), ' ', ''), '%')", nativeQuery = true)
    List<Vehicle> findByNameIgnoringSpaces(@Param("searchTerm") String searchTerm);
}
