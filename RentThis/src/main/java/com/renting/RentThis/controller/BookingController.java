package com.renting.RentThis.controller;

import com.renting.RentThis.CustomAnnotation.CheckSuspention;
import com.renting.RentThis.dto.request.BookingConfirmRequest;
import com.renting.RentThis.dto.request.BookingRequest;
import com.renting.RentThis.dto.response.ApiResponse;
import com.renting.RentThis.dto.response.BookingResponse;
import com.renting.RentThis.dto.response.BookingVerificationResponse;
import com.renting.RentThis.dto.response.VehicleResponse;
import com.renting.RentThis.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("api/v1/book")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @CheckSuspention
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

    @CheckSuspention
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

    @CheckSuspention
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
    public ResponseEntity<?> verifyBooking(@RequestBody BookingRequest request) {
        try {
            BookingVerificationResponse response = bookingService.verifyTime(request);
            return ResponseEntity.ok(ApiResponse.<BookingVerificationResponse>builder()
                    .success(true)
                    .status(200)
                    .data(response)
                    .message("Time slot available")
                    .build());
        } catch (ResponseStatusException ex) {
            // Handle the conflict status exception specifically
            if (ex.getStatusCode() == HttpStatus.CONFLICT) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(ApiResponse.<BookingVerificationResponse>builder()
                                .success(false)
                                .status(409)
                                .message(ex.getReason())
                                .build());
            }
            // Re-throw other exceptions
            throw ex;
        }
    }

    @CheckSuspention
    @PostMapping("/confirm")
    public ResponseEntity<BookingResponse> confirmBooking(@RequestBody BookingConfirmRequest confirmRequest) {
        BookingResponse booking = bookingService.confirmBooking(confirmRequest.getToken());
        return ResponseEntity.ok(booking);
    }

}
