package com.renting.RentThis.exception;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class UserSuspendedException extends RuntimeException {
    public UserSuspendedException() {
        super("Your account has been suspended. Please contact support for assistance.");
    }
}