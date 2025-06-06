package com.foodie1.repo;

import com.foodie1.model.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
    List<FoodItem> findByNameContainingIgnoreCase(String name);
    List<FoodItem> findByRestaurantContainingIgnoreCase(String restaurant);
    List<FoodItem> findByCategoryId(Long categoryId);
}