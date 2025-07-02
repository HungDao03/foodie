package com.foodie1.dto.mapper;

import com.foodie1.dto.request.*;
import com.foodie1.dto.response.*;
import com.foodie1.model.*;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class EntityDtoMapper {
    private final ModelMapper modelMapper = new ModelMapper();

    // Category
    public CategoryResponse toCategoryResponse(Category entity) {
        return modelMapper.map(entity, CategoryResponse.class);
    }
    public Category toCategory(CategoryRequest dto) {
        return modelMapper.map(dto, Category.class);
    }

    // FoodItem
    public FoodItemResponse toFoodItemResponse(FoodItem entity) {
        FoodItemResponse res = modelMapper.map(entity, FoodItemResponse.class);
        if (entity.getCategory() != null) {
            res.setCategoryName(entity.getCategory().getName());
        }
        return res;
    }
    public FoodItem toFoodItem(FoodItemRequest dto, Category category) {
        FoodItem food = modelMapper.map(dto, FoodItem.class);
        food.setCategory(category);
        return food;
    }

    // User
    public UserResponse toUserResponse(User entity) {
        UserResponse res = modelMapper.map(entity, UserResponse.class);
        if (entity.getRoles() != null) {
            res.setRoles(entity.getRoles().stream().map(Role::getName).collect(java.util.stream.Collectors.toSet()));
        }
        return res;
    }
    public User toUser(UserRegisterRequest dto) {
        return modelMapper.map(dto, User.class);
    }

    // Order
    public OrderResponse toOrderResponse(Order entity) {
        OrderResponse res = modelMapper.map(entity, OrderResponse.class);
        if (entity.getFoodItem() != null) {
            res.setFoodName(entity.getFoodItem().getName());
        }
        if (entity.getUser() != null) {
            res.setUserName(entity.getUser().getUsername());
        }
        return res;
    }
    // Không mapping OrderRequest -> Order trực tiếp vì cần set user, foodItem từ service
} 