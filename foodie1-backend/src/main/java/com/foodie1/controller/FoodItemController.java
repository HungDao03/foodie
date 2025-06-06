package com.foodie1.controller;

import com.foodie1.model.FoodItem;

import com.foodie1.service.fooditem.FoodItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food-items")

public class FoodItemController {
    @Autowired
    private FoodItemService foodItemService;

    @GetMapping
    public ResponseEntity<List<FoodItem>> getFoodItems(@RequestParam(required = false) Long categoryId) {
        if (categoryId != null) {
            return ResponseEntity.ok(foodItemService.getFoodItemsByCategory(categoryId));
        }
        return ResponseEntity.ok(foodItemService.getAllFoodItems());
    }

    @GetMapping("/search")
    public ResponseEntity<List<FoodItem>> searchFoodItems(@RequestParam String keyword) {
        return ResponseEntity.ok(foodItemService.searchFoodItems(keyword));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FoodItem> addFoodItem(@RequestBody FoodItem foodItem) {
        return ResponseEntity.ok(foodItemService.saveFoodItem(foodItem));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFoodItem(@PathVariable Long id) {
        foodItemService.deleteFoodItem(id);
        return ResponseEntity.ok().build();
    }
}