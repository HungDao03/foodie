package com.foodie1.controller;

import com.foodie1.dto.request.CategoryRequest;
import com.foodie1.dto.response.CategoryResponse;
import com.foodie1.model.Category;
import com.foodie1.service.category.CategoryService;
import com.foodie1.dto.mapper.EntityDtoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @Autowired
    private EntityDtoMapper mapper;

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getCategories() {
        List<Category> categories = categoryService.getAllCategories();
        List<CategoryResponse> responses = categories.stream().map(mapper::toCategoryResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> addCategory(@Valid @RequestBody CategoryRequest request) {
        Category category = mapper.toCategory(request);
        Category saved = categoryService.saveCategory(category);
        return ResponseEntity.ok(mapper.toCategoryResponse(saved));
    }
}