package com.renting.RentThis.exception;
import com.renting.RentThis.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<String>>handleRuntimeException(RuntimeException ex){
        ApiResponse<String> errorResponse = ApiResponse.<String>builder()
                .success(false)
                .data(null)
                .message(ex.getMessage())
                .build();

        return ResponseEntity
                .badRequest()
                .body(errorResponse);
    }
}
