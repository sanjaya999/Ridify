package com.renting.RentThis.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    @Value("${jwt.access.secret}")
    private String accessSecret;

    @Value("${jwt.access.expiration}")
    private Long accessExpiration;

    @Value("${jwt.refresh.secret}")
    private String refreshSecret;

    @Value("${jwt.refresh.expiration}")
    private Long refreshExpiration;

    public String extractEmail(String token){
        return extractClaim(token , accessSecret , Claims::getSubject);
    }
    public <T>T extractClaim(String token , String secret , Function<Claims , T> claimsResolver){
        final Claims claims = extractAllClaims(token,secret);
        return claimsResolver.apply(claims);
    }

    public Claims extractAllClaims (String token , String secret){
        return  Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey(secret))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String generateAccessToken(Long userId, String email , String role) {
        return generateToken(userId, email,role, accessSecret, accessExpiration);
    }

    public String generateRefreshToken(Long userId, String email ,  String role) {
        return generateToken(userId, email,role, refreshSecret, refreshExpiration);
    }

    public String generateToken(Long userId, String email,String role, String secret, Long expiration) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("email", email);
        claims.put("role", role);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)  // use email as subject
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(secret), SignatureAlgorithm.HS256)
                .compact();
    }
    private Key getSignInKey(String secret) {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }


    public boolean validateToken(String token, UserDetails userDetails) {
        final  String  email = extractEmail(token);
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSignInKey(accessSecret))
                    .build()
                    .parseClaimsJws(token);
            return (email.equals(userDetails.getUsername()));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }


    public String generateBookingVerificationToken(Long userId , Long vehicleId,
                                                   String startTime , String endTime , long minutesToExpire){
        Map<String , Object> claims = new HashMap<>();
        claims.put("userId" , userId);
        claims.put("vehicleId" , vehicleId);
        claims.put("startTime" , startTime);
        claims.put("endTime" , endTime);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(String.valueOf(userId))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + minutesToExpire * 60 * 1000))
                .signWith(getSignInKey(accessSecret), SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims extractBookingVerificationClaims(String token) {
        return extractAllClaims(token, accessSecret);
    }

}