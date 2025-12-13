package com.example.sweetShop.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.sweetShop.models.Sweet;
import com.example.sweetShop.repos.Sweetrepo;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("api/sweets")
public class sweetController {

    private final Sweetrepo sweetrepo;

    public sweetController(Sweetrepo sweetrepo) {
        this.sweetrepo = sweetrepo;
    }

    // ✅ ADMIN ONLY
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("create")
    public String sweetCreate(@RequestBody Sweet sweet) {
        sweetrepo.save(sweet);
        return "sweet created";
    }

    // ✅ USER + ADMIN
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("getall")
    public List<Sweet> getsweets() {
        return sweetrepo.findAll();
    }

    // ✅ USER + ADMIN
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("getbyid/{id}")
    public ResponseEntity<?> getbyId(@PathVariable int id) {

        Optional<Sweet> sweet = sweetrepo.findById(id);

        if (sweet.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(sweet.get());
    }

    // ✅ ADMIN ONLY
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("updateByid/{id}")
    public Sweet updateSweet(
            @PathVariable int id,
            @RequestBody Sweet updated) {

        Sweet exist = sweetrepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Sweet not found"));

        exist.setSweetName(updated.getSweetName());
        exist.setCategory(updated.getCategory());
        exist.setPrice(updated.getPrice());
        exist.setStock(updated.getStock());

        return sweetrepo.save(exist);
    }

    // ✅ ADMIN ONLY
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("deletebyid/{id}")
    public String deleteSweet(@PathVariable int id) {
        sweetrepo.deleteById(id);
        return "deleted successfully";
    }
}
