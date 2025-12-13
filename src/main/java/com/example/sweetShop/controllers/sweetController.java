package com.example.sweetShop.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.sweetShop.models.Sweet;
import com.example.sweetShop.repos.Sweetrepo;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("api/sweets")
public class sweetController {

	
	Sweetrepo sweetrepo;

	
	public sweetController(Sweetrepo sweetrepo) {
		super();
		this.sweetrepo = sweetrepo;
	}
	
	
	
	@PostMapping("create")
	private String sweetCreate(@RequestBody Sweet sweet){
		
		sweetrepo.save(sweet);
		
		return "sweet created";
	}
	
	
	@GetMapping("getall")
    private List<Sweet> getsweets(){
		
		List<Sweet> allsweets = sweetrepo.findAll();
		
		
		return allsweets;
	 
	}
	
	@GetMapping("getbyid/{id}")
	private ResponseEntity<?> getbyId(@PathVariable int id) {
		Optional<Sweet>  sweet = sweetrepo.findById(id);
		
		if(sweet.isEmpty()) {
			return ResponseEntity.badRequest().build();
					
		
		}else {
			return ResponseEntity.ok(sweet.get());
		}
		
	}
	
	@PutMapping("updateByid/{id}")
	private Sweet updateSweet(@PathVariable int id, @RequestBody Sweet updated){
		
		Sweet exist = sweetrepo.findById(id).orElseThrow(null);
		
		exist.setSweetName(updated.getSweetName());
		exist.setCategory(updated.getCategory());
		exist.setPrice(updated.getPrice());
		exist.setStock(updated.getStock());
	
		return 	sweetrepo.save(exist);
		
		
		
	}
	
	@DeleteMapping("deletebyid/{id}")
private String deleteSwwt(@PathVariable int id){
		
		
		sweetrepo.deleteById(id);
	
	
		return 	"deleted successfully ";
		
		
		
	}
	
	

}
