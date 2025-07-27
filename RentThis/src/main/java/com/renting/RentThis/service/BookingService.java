package com.renting.RentThis.service;

import com.renting.RentThis.dto.request.BookingRequest;
import com.renting.RentThis.dto.response.BookingResponse;
import com.renting.RentThis.dto.response.BookingVerificationResponse;
import com.renting.RentThis.entity.Booking;
import com.renting.RentThis.entity.User;
import com.renting.RentThis.entity.Vehicle;
import com.renting.RentThis.exception.InsufficientBalanceException;
import com.renting.RentThis.repository.BookingRespository;
import com.renting.RentThis.repository.UserRepository;
import com.renting.RentThis.repository.VehicleRepository;
import com.renting.RentThis.util.IntervalSchedulingService;
import com.renting.RentThis.util.ResponseMapper;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
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

    @Autowired
    private PaymentService paymentService;
    @Autowired
    private JwtService jwtService;

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



        try{
            String currentUserEmail = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
            User currentUser = userRepository.findByEmail(currentUserEmail)
                    .orElseThrow(()-> new RuntimeException("User not found with email "+ currentUserEmail));
            BigDecimal balance = currentUser.getBalance();
            BigDecimal vehiclePrice = vehicle.getPrice();
            User vehicleOwner = vehicle.getOwner();

            paymentService.processInternalPayment(currentUser , vehicleOwner
            ,vehiclePrice , "Booking" + LocalDateTime.now());
            Booking booking = new Booking();
            booking.setUser(currentUser);
            booking.setVehicle(vehicle);
            booking.setStartTime(request.getStartTime());
            booking.setEndTime(request.getEndTime());
            booking.setStatus("Confirmed");
            booking.setPaymentMethod("Internal");

            Booking saveBooking = bookingRespository.save(booking);
            return BookingResponse.builder()
                    .id(booking.getId())
                    .paymentMethod(booking.getPaymentMethod())
                    .startDate(booking.getStartTime())
                    .endDate(booking.getEndTime())
                    .vehicle(ResponseMapper.toVehicleMap(saveBooking.getVehicle()))
                    .bookedUser(ResponseMapper.toUserMap(saveBooking.getUser()))
                    .status(booking.getStatus())
                    .build();
        }catch (InsufficientBalanceException e){
            throw  new ResponseStatusException(HttpStatus.BAD_REQUEST , e.getMessage());
        }


    }


    public List<BookingResponse> getCurrentUserBooking(){
        String currentUserEmail = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User currentUser = userRepository.findByEmail(currentUserEmail).orElseThrow(()-> new RuntimeException("user not found"));

        List<Booking> bookings = bookingRespository.findByUserId(currentUser.getId());

        return bookings.stream()
                .map(booking -> BookingResponse.builder()
                        .id(booking.getId())
                        .startDate(booking.getStartTime())
                        .endDate(booking.getEndTime())
                        .vehicle(ResponseMapper.toVehicleMap(booking.getVehicle()))
                        .bookedUser(ResponseMapper.toUserMap(booking.getUser()))
                        .paymentMethod(booking.getPaymentMethod())
                        .status(booking.getStatus())
                        .build())
                .collect(Collectors.toList());

    }

    @PreAuthorize("@userSecurity.isVehicleOwner(#vehicleId)")
    public List<BookingResponse> allBookingOfOneVehicle(Long vehicleId){

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND , "vehicle not found"));

        List<Booking> bookings = bookingRespository.findByVehicleId(vehicleId);

        return bookings.stream()
                .map(booking -> BookingResponse.builder()
                        .id(booking.getId())
                        .paymentMethod(booking.getPaymentMethod())
                        .startDate(booking.getStartTime())
                        .endDate(booking.getEndTime())
                        .phoneNumber(booking.getUser().getPhoneNumber())
                        .bookedUser(ResponseMapper.toUserMap(booking.getUser()))
                        .status(booking.getStatus())
                        .build())
                .collect(Collectors.toList());
    }
    public BookingVerificationResponse verifyTime(BookingRequest request) {
        if (request.getStartTime().isAfter(request.getEndTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start time must be before end time");
        }

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle not found"));

        List<Booking> existingBooking = bookingRespository.findByVehicleId(vehicle.getId());
        List<IntervalSchedulingService.TimeSlot> overlappingSlots = intervalSchedulingService
                .findOverlappingSlots(existingBooking, request.getStartTime(), request.getEndTime());


        if (!overlappingSlots.isEmpty()) {
            List<IntervalSchedulingService.TimeSlot> availableSlots = intervalSchedulingService
                    .findAvailableTimeSlots(existingBooking,
                            request.getStartTime().minusHours(6),
                            request.getEndTime().plusHours(6));

            String availableTimes = availableSlots.stream()
                    .map(slot -> String.format("%s - %s",
                            slot.getStart().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")),
                            slot.getEnd().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))))
                    .collect(Collectors.joining(", "));

            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Requested time unavailable. Nearby availability: " + availableTimes);
        }

        String email = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        long totalHours = Duration.between(request.getStartTime(), request.getEndTime()).toHours();
        if (totalHours == 0) totalHours = 1;

        BigDecimal hourlyRate = vehicle.getPrice();
        BigDecimal totalAmount = hourlyRate.multiply(BigDecimal.valueOf(totalHours));

        // Generate booking verification token
        String token =  jwtService.generateBookingVerificationToken(
                user.getId(),
                vehicle.getId(),
                request.getStartTime().toString(),
                request.getEndTime().toString(),
                10 // token valid for 10 minutes
        );
        return BookingVerificationResponse.builder()
                .token(token)
                .hourlyRate(hourlyRate)
                .totalHours(totalHours)
                .totalAmount(totalAmount)
                .build();    }


    public BookingResponse confirmBooking(String jwtToken) {
        Claims claims = jwtService.extractBookingVerificationClaims(jwtToken);

        Long userId = Long.parseLong(claims.get("userId").toString());
        Long vehicleId = Long.parseLong(claims.get("vehicleId").toString());
        LocalDateTime startTime = LocalDateTime.parse(claims.get("startTime").toString());
        LocalDateTime endTime = LocalDateTime.parse(claims.get("endTime").toString());

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // ⛔ Check again if someone else booked in the meantime
        List<Booking> existingBookings = bookingRespository.findByVehicleId(vehicleId);
        if (!intervalSchedulingService.findOverlappingSlots(existingBookings, startTime, endTime).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Slot already booked");
        }

        // ✅ Recalculate amount
        BigDecimal amount = calculateAmount(vehicle, startTime, endTime);

        try {
            paymentService.processInternalPayment(user, vehicle.getOwner(), amount, "Booking " + LocalDateTime.now());
        } catch (InsufficientBalanceException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setVehicle(vehicle);
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);
        booking.setStatus("Confirmed");
        booking.setPaymentMethod("Internal");

        Booking saved = bookingRespository.save(booking);

        return BookingResponse.builder()
                .id(saved.getId())
                .paymentMethod(saved.getPaymentMethod())
                .startDate(saved.getStartTime())
                .endDate(saved.getEndTime())
                .vehicle(ResponseMapper.toVehicleMap(saved.getVehicle()))
                .bookedUser(ResponseMapper.toUserMap(saved.getUser()))
                .status(saved.getStatus())
                .build();
    }


    public BigDecimal calculateAmount(Vehicle vehicle, LocalDateTime start, LocalDateTime end) {
        long hours = Duration.between(start, end).toHours();
        if (hours == 0) hours = 1; // Minimum 1 hour
        return vehicle.getPrice().multiply(BigDecimal.valueOf(hours));
    }






}