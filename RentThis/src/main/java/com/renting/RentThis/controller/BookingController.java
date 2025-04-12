package com.renting.RentThis.controller;

import com.renting.RentThis.dto.request.BookingConfirmRequest;
import com.renting.RentThis.dto.request.BookingRequest;
import com.renting.RentThis.dto.response.ApiResponse;
import com.renting.RentThis.dto.response.BookingResponse;
import com.renting.RentThis.dto.response.BookingVerificationResponse;
import com.renting.RentThis.dto.response.VehicleResponse;
import com.renting.RentThis.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/book")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/confirmBooking")
    public ResponseEntity<ApiResponse<BookingResponse>> bookVehicle(@RequestBody BookingRequest request) {
        System.out.println(request.getStartTime() + " end time : " + request.getEndTime());
        BookingResponse bookingResponse = bookingService.addBooking(request);

        return ResponseEntity.ok(ApiResponse.<BookingResponse>builder()
                .success(true)
                .status(200)
                .data(bookingResponse)
                .build());
    }

    @GetMapping("/currentUserBooking")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> currentUserBookings() {
        List<BookingResponse> bookingResponse = bookingService.getCurrentUserBooking();

        return ResponseEntity.ok(ApiResponse.<List<BookingResponse>>builder()
                .success(true)
                .status(200)
                .data(bookingResponse)
                .message("success")
                .build());

    }

    @GetMapping("/{vehicleId}/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> allBookingOfOneVehicle(@PathVariable Long vehicleId) {

        List<BookingResponse> bookingResponse = bookingService.allBookingOfOneVehicle(vehicleId);

        return ResponseEntity.ok(ApiResponse.<List<BookingResponse>>builder()
                .success(true)
                .status(200)
                .data(bookingResponse)
                .message("success")
                .build());
    }

    @PostMapping("/verify")
    public ResponseEntity<BookingVerificationResponse> verifyBooking(@RequestBody BookingRequest request) {
        BookingVerificationResponse response = bookingService.verifyTime(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/confirm")
    public ResponseEntity<BookingResponse> confirmBooking(@RequestBody BookingConfirmRequest confirmRequest) {
        BookingResponse booking = bookingService.confirmBooking(confirmRequest.getToken());
        return ResponseEntity.ok(booking);
    }

}
