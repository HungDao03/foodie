package com.foodie1.controller;

import com.foodie1.dto.request.FoodItemRequest;
import com.foodie1.dto.response.FoodItemResponse;
import com.foodie1.model.FoodItem;
import com.foodie1.model.Category;
import com.foodie1.service.fooditem.FoodItemService;
import com.foodie1.service.category.CategoryService;
import com.foodie1.service.file.FileStorageService;
import com.foodie1.dto.mapper.EntityDtoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/food-items")
public class FoodItemController {

    @Autowired
    private FoodItemService foodItemService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private EntityDtoMapper mapper;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    @GetMapping
    public ResponseEntity<List<FoodItemResponse>> getFoodItems(@RequestParam(required = false) Long categoryId) {
        List<FoodItem> items = (categoryId != null)
                ? foodItemService.getFoodItemsByCategory(categoryId)
                : foodItemService.getAllFoodItems();
        List<FoodItemResponse> responses = items.stream().map(mapper::toFoodItemResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/search")
    public ResponseEntity<List<FoodItemResponse>> searchFoodItems(@RequestParam String keyword) {
        List<FoodItem> items = foodItemService.searchFoodItems(keyword);
        List<FoodItemResponse> responses = items.stream().map(mapper::toFoodItemResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FoodItemResponse> addFoodItem(
            @RequestParam("name") String name,
            @RequestParam("price") double price,
            @RequestParam(value = "discountPrice", required = false) Double discountPrice,
            @RequestParam("restaurant") String restaurant,
            @RequestParam("deliveryTime") int deliveryTime,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        FoodItemRequest req = new FoodItemRequest();
        req.setName(name);
        req.setPrice(price);
        req.setDiscountPrice(discountPrice != null ? discountPrice : 0.0);
        req.setRestaurant(restaurant);
        req.setDeliveryTime(deliveryTime);
        req.setCategoryId(categoryId);

        Category category = categoryService.findById(categoryId);
        FoodItem foodItem = mapper.toFoodItem(req, category);

        if (image != null && !image.isEmpty()) {
            String filename = fileStorageService.saveFile(image, "food"); // ✅ Đã sửa: thêm "food"
            foodItem.setImageUrl(baseUrl + "/uploads/food/" + filename);  // ✅ Đã sửa: thư mục food
        }

        FoodItem saved = foodItemService.saveFoodItem(foodItem);
        return ResponseEntity.ok(mapper.toFoodItemResponse(saved));
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FoodItemResponse> updateFoodItem(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("price") double price,
            @RequestParam(value = "discountPrice", required = false) Double discountPrice,
            @RequestParam("restaurant") String restaurant,
            @RequestParam("deliveryTime") int deliveryTime,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        FoodItem existingFood = foodItemService.findById(id);
        if (existingFood == null) return ResponseEntity.notFound().build();

        existingFood.setName(name);
        existingFood.setPrice(price);
        existingFood.setDiscountPrice(discountPrice != null ? discountPrice : 0.0);
        existingFood.setRestaurant(restaurant);
        existingFood.setDeliveryTime(deliveryTime);

        Category category = categoryService.findById(categoryId);
        if (category != null) existingFood.setCategory(category);

        if (image != null && !image.isEmpty()) {
            if (existingFood.getImageUrl() != null) {
                String oldFilename = existingFood.getImageUrl().substring(existingFood.getImageUrl().lastIndexOf("/") + 1);
                fileStorageService.deleteFile(oldFilename, "food"); // ✅ Đã sửa: thêm "food"
            }

            String filename = fileStorageService.saveFile(image, "food"); // ✅ Đã sửa: thêm "food"
            existingFood.setImageUrl(baseUrl + "/uploads/food/" + filename); // ✅ Đã sửa: thư mục food
        }

        FoodItem updated = foodItemService.saveFoodItem(existingFood);
        return ResponseEntity.ok(mapper.toFoodItemResponse(updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteFoodItem(@PathVariable Long id) {
        try {
            FoodItem foodItem = foodItemService.findById(id);
            if (foodItem != null && foodItem.getImageUrl() != null) {
                String filename = foodItem.getImageUrl().substring(foodItem.getImageUrl().lastIndexOf("/") + 1);
                fileStorageService.deleteFile(filename, "food"); // ✅ Đã sửa: thêm "food"
            }

            foodItemService.deleteFoodItem(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
