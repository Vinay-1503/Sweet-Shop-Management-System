package com.example.sweetShop.controllers;

import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.example.sweetShop.models.Credentails;
import com.example.sweetShop.security.JwtProvider;

@RestController
@RequestMapping("/api/login")
public class LoginController {

    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;

    public LoginController(AuthenticationManager authenticationManager,
                           JwtProvider jwtProvider) {
        this.authenticationManager = authenticationManager;
        this.jwtProvider = jwtProvider;
    }

    @PostMapping
    public String login(@RequestBody Credentails request) {

    	System.out.println("hi ");
        Authentication authentication =
                authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                    )
                );

        // ✅ Get authenticated user
        UserDetails userDetails =
                (UserDetails) authentication.getPrincipal();

        // ✅ Generate token correctly
        return jwtProvider.generateToken(userDetails);
    }

}
