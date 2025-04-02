package com.renting.RentThis.repository;

import com.renting.RentThis.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRespository extends JpaRepository<Booking , Long>{

    List<Booking> findByVehicleId(Long vehicleId);
}
