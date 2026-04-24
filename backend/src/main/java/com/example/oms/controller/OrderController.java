package com.example.oms.controller;

import com.example.oms.dto.CreateOrderRequest;
import com.example.oms.dto.OrderSummaryResponse;
import com.example.oms.model.Order;
import com.example.oms.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<Order> getOrders() {
        return orderService.getOrders();
    }

    @GetMapping("/summary")
    public OrderSummaryResponse getSummary() {
        return orderService.getSummary();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Order createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return orderService.createOrder(request);
    }

    @PatchMapping("/{id}/cancel")
    public Order cancelOrder(@PathVariable UUID id) {
        return orderService.cancelOrder(id);
    }

    @PatchMapping("/{id}/fill")
    public Order fillOrder(@PathVariable UUID id) {
        return orderService.fillOrder(id);
    }
}
