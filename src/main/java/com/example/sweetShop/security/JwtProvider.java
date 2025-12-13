package com.example.sweetShop.security;

import java.util.Date;
import javax.crypto.SecretKey;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtProvider {

    private final SecretKey key =
            Keys.hmacShaKeyFor(JwtConstant.SECRETKEY.getBytes());

    public String generateToken(UserDetails userDetails) {

        String role = userDetails.getAuthorities()
                .iterator().next().getAuthority();

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + 604800000)
                )
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getEmailFromToken(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(key)
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            throw new BadCredentialsException("Invalid token");
        }
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        return getEmailFromToken(token)
                .equals(userDetails.getUsername());
    }
}
