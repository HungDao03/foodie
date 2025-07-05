package com.foodie1.service.cart;

import com.foodie1.dto.request.CartItemRequest;
import com.foodie1.dto.response.CartItemResponse;
import com.foodie1.dto.response.CartResponse;
import com.foodie1.model.Cart;
import com.foodie1.model.CartItem;
import com.foodie1.model.FoodItem;
import com.foodie1.model.User;
import com.foodie1.repo.CartItemRepository;
import com.foodie1.repo.CartRepository;
import com.foodie1.repo.FoodItemRepository;
import com.foodie1.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartService implements ICartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Override
    public CartResponse getCartByUserId(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return convertToCartResponse(cart);
    }

    @Override
    public CartResponse addItemToCart(Long userId, CartItemRequest request) {
        Cart cart = getOrCreateCart(userId);
        FoodItem foodItem = foodItemRepository.findById(request.getFoodItemId())
                .orElseThrow(() -> new RuntimeException("Food item not found"));

        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndFoodItemId(cart.getId(), request.getFoodItemId());
        
        if (existingItem.isPresent()) {
            // Update quantity if item already exists
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            cartItemRepository.save(item);
        } else {
            // Add new item to cart
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setFoodItem(foodItem);
            cartItem.setQuantity(request.getQuantity());
            cartItemRepository.save(cartItem);
        }

        return convertToCartResponse(cart);
    }

    @Override
    public CartResponse updateCartItemQuantity(Long userId, Long foodItemId, Integer quantity) {
        Cart cart = getOrCreateCart(userId);
        CartItem cartItem = cartItemRepository.findByCartIdAndFoodItemId(cart.getId(), foodItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
        } else {
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }

        return convertToCartResponse(cart);
    }

    @Override
    public CartResponse removeItemFromCart(Long userId, Long foodItemId) {
        Cart cart = getOrCreateCart(userId);
        cartItemRepository.deleteByCartIdAndFoodItemId(cart.getId(), foodItemId);
        Cart updatedCart = cartRepository.findById(cart.getId()).orElse(cart);
        return convertToCartResponse(updatedCart);
    }

    @Override
    public CartResponse clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cartItemRepository.deleteByCartId(cart.getId());
        Cart updatedCart = cartRepository.findById(cart.getId()).orElse(cart);
        return convertToCartResponse(updatedCart);
    }

    @Override
    public CartResponse removeSelectedItems(Long userId, List<Long> foodItemIds) {
        Cart cart = getOrCreateCart(userId);
        for (Long foodItemId : foodItemIds) {
            cartItemRepository.deleteByCartIdAndFoodItemId(cart.getId(), foodItemId);
        }
        Cart updatedCart = cartRepository.findById(cart.getId()).orElse(cart);
        return convertToCartResponse(updatedCart);
    }

    private Cart getOrCreateCart(Long userId) {
        Optional<Cart> existingCart = cartRepository.findByUserId(userId);
        if (existingCart.isPresent()) {
            return existingCart.get();
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart newCart = new Cart();
        newCart.setUser(user);
        return cartRepository.save(newCart);
    }

    private CartResponse convertToCartResponse(Cart cart) {
        List<CartItemResponse> cartItemResponses = cart.getCartItems().stream()
                .map(this::convertToCartItemResponse)
                .collect(Collectors.toList());

        double totalAmount = cartItemResponses.stream()
                .mapToDouble(CartItemResponse::getSubtotal)
                .sum();

        int totalItems = cartItemResponses.stream()
                .mapToInt(CartItemResponse::getQuantity)
                .sum();

        return new CartResponse(
                cart.getId(),
                cart.getUser().getId(),
                cartItemResponses,
                totalAmount,
                totalItems
        );
    }

    private CartItemResponse convertToCartItemResponse(CartItem cartItem) {
        FoodItem foodItem = cartItem.getFoodItem();
        double subtotal = cartItem.getQuantity() * foodItem.getDiscountPrice();
        return new CartItemResponse(
                cartItem.getId(),
                foodItem.getId(),
                foodItem.getName(),
                foodItem.getImageUrl(),
                foodItem.getPrice(),
                foodItem.getDiscountPrice(),
                cartItem.getQuantity(),
                subtotal
        );
    }
} 