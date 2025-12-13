package com.example.sweetShop.repos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.sweetShop.models.User;

@Repository
public interface userRepo extends JpaRepository<User,Integer> {

	Optional<User> findByEmail(String email);
}
