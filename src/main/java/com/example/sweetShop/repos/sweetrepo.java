package com.example.sweetShop.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.sweetShop.models.Sweet;


@Repository
public interface sweetrepo  extends JpaRepository<Sweet,Integer>{

}
