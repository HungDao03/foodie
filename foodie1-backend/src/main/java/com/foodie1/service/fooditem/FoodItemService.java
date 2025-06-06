package com.foodie1.service.fooditem;

import com.foodie1.model.FoodItem;
import com.foodie1.repo.FoodItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodItemService {
    @Autowired
    private FoodItemRepository foodItemRepository;

    public List<FoodItem> getAllFoodItems() {
        return foodItemRepository.findAll();
    }

    public List<FoodItem> getFoodItemsByCategory(Long categoryId) {
        return foodItemRepository.findByCategoryId(categoryId);
    }

    public List<FoodItem> searchFoodItems(String keyword) {
        return foodItemRepository.findByNameContainingIgnoreCase(keyword);
    }

    public FoodItem saveFoodItem(FoodItem foodItem) {
        return foodItemRepository.save(foodItem);
    }

    public void deleteFoodItem(Long id) {
        foodItemRepository.deleteById(id);
    }
}