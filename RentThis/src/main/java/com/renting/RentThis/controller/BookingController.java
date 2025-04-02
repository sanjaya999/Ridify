package com.renting.RentThis.controller;

import com.renting.RentThis.dto.request.BookingRequest;
import com.renting.RentThis.dto.response.ApiResponse;
import com.renting.RentThis.dto.response.BookingResponse;
import com.renting.RentThis.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/book")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/confirmBooking")
    public ResponseEntity<ApiResponse<BookingResponse>> bookVehicle(@RequestBody BookingRequest request ){
        System.out.println(request.getStartTime() + " end time : "+request.getEndTime());
        BookingResponse bookingResponse = bookingService.addBooking(request);

        return ResponseEntity.ok(ApiResponse.<BookingResponse>builder()
                .success(true)
                .status(200)
                .data(bookingResponse)
                .build());
    }


}
