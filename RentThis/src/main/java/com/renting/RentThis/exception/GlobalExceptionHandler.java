package com.renting.RentThis.exception;

import com.renting.RentThis.dto.response.ApiResponse;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Object>> handleResponseStatusException(ResponseStatusException ex) {
        return ResponseEntity
                .status(ex.getStatusCode())
                .body(ApiResponse.builder()
                        .success(false)
                        .status(ex.getStatusCode().value())
                        .message(ex.getReason()) // This contains available time slots
                        .data(null)
                        .build());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.<Object>builder()
                        .success(false)
                        .data(errors)
                        .message("Validation failed")
                        .build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleAllOtherExceptions(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.<Object>builder()
                        .success(false)
                        .message(ex.getMessage())
                        .data(null)
                        .build());
    }

    @ExceptionHandler(UserSuspendedException.class)
    public ResponseEntity<ApiResponse<String>> handleUserSuspendedException(UserSuspendedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.<String>builder()
                        .success(false)
                        .status(HttpStatus.FORBIDDEN.value())
                        .message(ex.getMessage())
                        .build());
    }

    @ExceptionHandler({ExpiredJwtException.class,
            MalformedJwtException.class})
    public ResponseEntity<ApiResponse<Object>> handleJwtExceptions
            (Exception ex) {
        String message;
        if (ex instanceof ExpiredJwtException) {
            message = "JWT token has expired";
        } else if (ex instanceof MalformedJwtException) {
            message = "JWT token is malformed or invalid";
        } else {
            message = "Invalid JWT token";
        }

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.builder()
                        .success(false)
                        .status(HttpStatus.UNAUTHORIZED.value())
                        .message(message)
                        .build());
    }

    @ExceptionHandler(UserNotAuthenticatedException.class)
    public ResponseEntity<ApiResponse<Object>> handleUserNotAuthenticatedException(UserNotAuthenticatedException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.builder()
                        .success(false)
                        .status(HttpStatus.UNAUTHORIZED.value())
                        .message("You are not logged in. Please log in to access this resource.")
                        .build());
    }


}