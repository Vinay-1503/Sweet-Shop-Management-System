package com.example.sweetShop.controllers;

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

	
		
		userRepo userrepo;
		
		public userController(userRepo userrepo) {
			super();
			this.userrepo = userrepo;
		}
		@PostMapping("create")
		private String userCreate(@RequestBody User user){
			
			userrepo.save(user);
			
			return "user created";
		}
		
	}







