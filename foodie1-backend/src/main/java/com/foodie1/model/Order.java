package com.foodie1.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "orders")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private FoodItem foodItem;

    private Integer quantity;

    private String status;
    
    @Column(name = "order_time")
    private String orderTime;
    
    @Column(name = "delivery_address")
    private String deliveryAddress;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Column(name = "total_amount")
    private Double totalAmount;
    
    @Column(name = "payment_status")
    private String paymentStatus;
    
    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "notes")
    private String notes;
}