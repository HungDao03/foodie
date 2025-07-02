package com.foodie1.dto.request;

import jakarta.validation.constraints.NotBlank;

public class CategoryRequest {
    @NotBlank(message = "Tên danh mục không được để trống")
    private String name;
    // getter, setter
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
} 