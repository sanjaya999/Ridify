package com.renting.RentThis.service;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {
    @Value("${jwt.access.secret}")
    private  String accessSecret;

    @Value("${jwt.access.expiration}")
    private Long accessExpiration;

    @Value("${jwt.refresh.secret}")
    private  String refreshSecret;

    @Value("${jwt.refresh.expiration}")
    private Long refreshExpiration;

    public String generateAccessToken(Long userId, String email) {
        return generateToken(userId, email, accessSecret, accessExpiration);
    }

    public String generateRefreshToken(Long userId, String email) {
        return generateToken(userId, email, refreshSecret, refreshExpiration);
    }

    public String generateToken(Long userId, String email , String secret, Long expiration) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("email", email);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)  // use email as subject
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(secret), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSignInKey(String secret){
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public boolean validateToken (String token ,String Secret){
        try{
            Jwts.parserBuilder()
                    .setSigningKey(getSignInKey(Secret))
                    .build()
                    .parseClaimsJws(token);
            return true;

        }catch (JwtException | IllegalArgumentException e){
            return false;
        }
    }
}
