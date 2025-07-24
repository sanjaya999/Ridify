package com.renting.RentThis.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.renting.RentThis.dto.response.ApiResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAuthenticationEntryPoint implements org.springframework.security.web.AuthenticationEntryPoint {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType("application/json");

        ApiResponse<Object> apiResponse = ApiResponse.builder()
                .success(false)
                .status(HttpStatus.UNAUTHORIZED.value())
                .message("You are not logged in. Please log in to access this resource.")
                .build();

        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
    }
}