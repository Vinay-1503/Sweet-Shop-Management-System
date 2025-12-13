package com.example.sweetShop.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.sweetShop.models.Sweet;
import com.example.sweetShop.repos.Sweetrepo;
import com.example.sweetShop.repos.userRepo;
import com.example.sweetShop.models.User;


@RestController
@RequestMapping("api/users")
public class userController {

    private final userRepo userrepo;
    private final PasswordEncoder passwordencoder;

    public userController(userRepo userrepo,
                          PasswordEncoder passwordencoder) {
        this.userrepo = userrepo;
        this.passwordencoder = passwordencoder;
    }


    @PreAuthorize("permitAll()")
    @PostMapping("create")
    public String userCreate(@RequestBody User user) {

        user.setPassword(
                passwordencoder.encode(user.getPassword())
        );
        userrepo.save(user);

        return "user created";
    }
}



