package com.renting.RentThis.service;

import com.renting.RentThis.dto.request.BookingRequest;
import com.renting.RentThis.dto.response.BookingResponse;
import com.renting.RentThis.entity.Booking;
import com.renting.RentThis.entity.User;
import com.renting.RentThis.entity.Vehicle;
import com.renting.RentThis.repository.BookingRespository;
import com.renting.RentThis.repository.UserRepository;
import com.renting.RentThis.repository.VehicleRepository;
import com.renting.RentThis.util.ResponseMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.awt.print.Book;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private BookingRespository bookingRespository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private IntervalSchedulingService intervalSchedulingService;

    public BookingResponse addBooking(BookingRequest request ){

        if (request.getStartTime().isAfter(request.getEndTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start time must be before end time");
        }

        Long vehicleId = request.getVehicleId();
        Optional<Vehicle> vehicleOpt = vehicleRepository.findById(vehicleId);

        if (vehicleOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle not found");
        }

        Vehicle vehicle = vehicleOpt.get();

        List<Booking> existingBooking = bookingRespository.findByVehicleId(vehicleId);
        List<IntervalSchedulingService.TimeSlot> overlappingSlots = intervalSchedulingService
                .findOverlappingSlots(existingBooking , request.getStartTime() , request.getEndTime());

        if (!overlappingSlots.isEmpty()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

            List<IntervalSchedulingService.TimeSlot> availableSlots = intervalSchedulingService
                    .findAvailableTimeSlots(existingBooking,
                            request.getStartTime().minusHours(6),
                            request.getEndTime().plusHours(6));

            String availableTimes = availableSlots.stream()
                    .map(slot -> String.format(
                            "%s - %s",
                            slot.getStart().format(formatter),
                            slot.getEnd().format(formatter)
                    ))
                    .collect(Collectors.joining(", "));

            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Requested time unavailable. Nearby availability: " + availableTimes
            );
        }
        Booking booking = new Booking();
        String currentUserEmail = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(()-> new RuntimeException("User not found with email "+ currentUserEmail));

        booking.setUser(currentUser);
        booking.setVehicle(vehicle);
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setStatus("Confirmed");

        Booking saveBooking = bookingRespository.save(booking);

        return BookingResponse.builder()
                .id(booking.getId())
                .startDate(booking.getStartTime())
                .endDate(booking.getEndTime())
                .vehicle(ResponseMapper.toVehicleMap(saveBooking.getVehicle()))
                .bookedUser(ResponseMapper.toUserMap(saveBooking.getUser()))
                .status(booking.getStatus())
                .build();

    }



}