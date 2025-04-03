package com.vehicle.service;

import com.vehicle.dto.CreateOrderRequest;
import com.vehicle.dto.OrderItemRequest;
import com.vehicle.dto.OrderItemResponse;
import com.vehicle.dto.OrderResponse;
import com.vehicle.entity.*;
import com.vehicle.repository.OrderRepository;
import com.vehicle.repository.VehicleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final VehicleRepository vehicleRepository;

    @Transactional
    public OrderResponse createOrder(User user, CreateOrderRequest request) {
        // Create new order
        Order order = Order.builder()
                .user(user)
                .shippingAddress(request.getShippingAddress())
                .status(OrderStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        // Process each order item
        for (OrderItemRequest itemRequest : request.getItems()) {
            Vehicle vehicle = vehicleRepository.findById(itemRequest.getVehicleId())
                    .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + itemRequest.getVehicleId()));

            // Check if enough quantity is available
            if (vehicle.getQuantityAvailable() < itemRequest.getQuantity()) {
                throw new RuntimeException("Not enough vehicles available. Available: " + 
                        vehicle.getQuantityAvailable() + ", Requested: " + itemRequest.getQuantity());
            }

            // Update vehicle quantity
            vehicle.setQuantityAvailable(vehicle.getQuantityAvailable() - itemRequest.getQuantity());
            vehicleRepository.save(vehicle);

            // Create order item
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .vehicle(vehicle)
                    .quantity(itemRequest.getQuantity())
                    .pricePerUnit(vehicle.getPrice())
                    .totalPrice(vehicle.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())))
                    .build();

            orderItems.add(orderItem);
            totalAmount = totalAmount.add(orderItem.getTotalPrice());
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);
        
        Order savedOrder = orderRepository.save(order);
        return mapToOrderResponse(savedOrder);
    }

    @Transactional
    public Page<OrderResponse> getUserOrders(User user, Pageable pageable) {
        List<Order> orders = orderRepository.findByUserWithItems(user);
        
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), orders.size());
        
        List<OrderResponse> orderResponses = orders.subList(start, end)
                .stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
                
        return new PageImpl<>(orderResponses, pageable, orders.size());
    }

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .vehicleId(item.getVehicle().getId())
                        .vehicleName(item.getVehicle().getName())
                        .quantity(item.getQuantity())
                        .pricePerUnit(item.getPricePerUnit())
                        .totalPrice(item.getTotalPrice())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .userEmail(order.getUser().getEmail())
                .shippingAddress(order.getShippingAddress())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .items(itemResponses)
                .build();
    }
} 