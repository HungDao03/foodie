package com.foodie1.controller;

import com.foodie1.dto.request.OrderRequest;
import com.foodie1.dto.response.OrderResponse;
import com.foodie1.model.Order;
import com.foodie1.model.User;
import com.foodie1.model.FoodItem;
import com.foodie1.service.order.OrderService;
import com.foodie1.service.user.IUserService;
import com.foodie1.service.fooditem.FoodItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import jakarta.validation.Valid;
import com.foodie1.dto.mapper.EntityDtoMapper;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;
    @Autowired
    private IUserService userService;
    @Autowired
    private FoodItemService foodItemService;
    @Autowired
    private EntityDtoMapper mapper;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<OrderResponse> placeOrder(@Valid @RequestBody OrderRequest orderRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.findByUsername(username);
        FoodItem foodItem = foodItemService.findById(orderRequest.getFoodItemId());
        if (user == null || foodItem == null) {
            return ResponseEntity.badRequest().build();
        }
        Order order = new Order();
        order.setUser(user);
        order.setFoodItem(foodItem);
        order.setQuantity(orderRequest.getQuantity());
        order.setDeliveryAddress(orderRequest.getDeliveryAddress());
        order.setPhoneNumber(orderRequest.getPhoneNumber());
        order.setPaymentMethod(orderRequest.getPaymentMethod());
        order.setNotes(orderRequest.getNotes());
        order.setTotalAmount(orderRequest.getTotalAmount());
        Order saved = orderService.placeOrder(order);
        return ResponseEntity.ok(mapper.toOrderResponse(saved));
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<OrderResponse>> getUserOrders(@PathVariable Long userId) {
        List<Order> orders = orderService.getUserOrders(userId);
        List<OrderResponse> responses = orders.stream().map(mapper::toOrderResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        Order order = orderService.updateOrderStatus(id, status);
        if (order == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(mapper.toOrderResponse(order));
    }
}