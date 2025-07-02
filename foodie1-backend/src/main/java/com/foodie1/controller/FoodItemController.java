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

/**
 * Controller xử lý các request liên quan đến món ăn
 * - Thêm, sửa, xóa món ăn
 * - Tìm kiếm món ăn
 * - Upload ảnh món ăn
 */
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

    /**
     * Lấy danh sách món ăn
     * - Nếu có categoryId: lấy món ăn theo danh mục
     * - Nếu không có categoryId: lấy tất cả món ăn
     */
    @GetMapping
    public ResponseEntity<List<FoodItemResponse>> getFoodItems(@RequestParam(required = false) Long categoryId) {
        List<FoodItem> items = (categoryId != null) ? foodItemService.getFoodItemsByCategory(categoryId) : foodItemService.getAllFoodItems();
        List<FoodItemResponse> responses = items.stream().map(mapper::toFoodItemResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    /**
     * Tìm kiếm món ăn theo từ khóa
     */
    @GetMapping("/search")
    public ResponseEntity<List<FoodItemResponse>> searchFoodItems(@RequestParam String keyword) {
        List<FoodItem> items = foodItemService.searchFoodItems(keyword);
        List<FoodItemResponse> responses = items.stream().map(mapper::toFoodItemResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    /**
     * Thêm món ăn mới
     * - Nhận dữ liệu dạng multipart/form-data
     * - Cho phép upload ảnh kèm theo thông tin món ăn
     * - Chỉ ADMIN mới có quyền thêm
     */
    @PostMapping(consumes = {"multipart/form-data"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FoodItemResponse> addFoodItem(
            @RequestParam("name") String name,                    // Tên món ăn
            @RequestParam("price") double price,                  // Giá gốc
            @RequestParam(value = "discountPrice", required = false) Double discountPrice,  // Giá khuyến mãi (không bắt buộc)
            @RequestParam("restaurant") String restaurant,        // Tên nhà hàng
            @RequestParam("deliveryTime") int deliveryTime,      // Thời gian giao hàng
            @RequestParam("categoryId") Long categoryId,         // ID danh mục
            @RequestParam(value = "image", required = false) MultipartFile image  // File ảnh (không bắt buộc)
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
            String filename = fileStorageService.saveFile(image);
            foodItem.setImageUrl(baseUrl + "/uploads/" + filename);
        }
        FoodItem saved = foodItemService.saveFoodItem(foodItem);
        return ResponseEntity.ok(mapper.toFoodItemResponse(saved));
    }

    /**
     * Cập nhật thông tin món ăn
     * - Nhận dữ liệu dạng multipart/form-data
     * - Cho phép upload ảnh mới
     * - Chỉ ADMIN mới có quyền sửa
     */
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FoodItemResponse> updateFoodItem(
            @PathVariable Long id,                               // ID món ăn cần sửa
            @RequestParam("name") String name,                    // Tên món ăn
            @RequestParam("price") double price,                  // Giá gốc
            @RequestParam(value = "discountPrice", required = false) Double discountPrice,  // Giá khuyến mãi
            @RequestParam("restaurant") String restaurant,        // Tên nhà hàng
            @RequestParam("deliveryTime") int deliveryTime,      // Thời gian giao hàng
            @RequestParam("categoryId") Long categoryId,         // ID danh mục
            @RequestParam(value = "image", required = false) MultipartFile image  // File ảnh mới (không bắt buộc)
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
                fileStorageService.deleteFile(oldFilename);
            }
            String filename = fileStorageService.saveFile(image);
            existingFood.setImageUrl(baseUrl + "/uploads/" + filename);
        }
        FoodItem updated = foodItemService.saveFoodItem(existingFood);
        return ResponseEntity.ok(mapper.toFoodItemResponse(updated));
    }

    /**
     * Xóa món ăn
     * - Xóa cả ảnh của món ăn
     * - Chỉ ADMIN mới có quyền xóa
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteFoodItem(@PathVariable Long id) {
        try {
            // Lấy thông tin món ăn trước khi xóa
            FoodItem foodItem = foodItemService.findById(id);
            if (foodItem != null && foodItem.getImageUrl() != null) {
                // Xóa file ảnh
                String filename = foodItem.getImageUrl().substring(foodItem.getImageUrl().lastIndexOf("/") + 1);
                fileStorageService.deleteFile(filename);
            }
            
            foodItemService.deleteFoodItem(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}