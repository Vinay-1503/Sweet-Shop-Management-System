package com.example.sweetShop.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.sweetShop.models.User;

@Repository
public interface userRepo extends JpaRepository<User,Integer> {

}
