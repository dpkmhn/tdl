package com.example.oms.service;

import com.example.oms.dto.CreateOrderRequest;
import com.example.oms.dto.OrderSummaryResponse;
import com.example.oms.model.Order;
import com.example.oms.model.OrderStatus;
import com.example.oms.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Order createOrder(CreateOrderRequest request) {
        Order order = new Order(
                UUID.randomUUID(),
                request.symbol().trim().toUpperCase(),
                request.side(),
                request.quantity(),
                request.price(),
                OrderStatus.NEW,
                Instant.now()
        );

        return orderRepository.save(order);
    }

    public List<Order> getOrders() {
        return orderRepository.findAll();
    }

    public Order cancelOrder(UUID id) {
        Order order = getOrderById(id);

        if (order.status() == OrderStatus.FILLED) {
            throw new IllegalStateException("Filled orders cannot be cancelled");
        }
        if (order.status() == OrderStatus.CANCELLED) {
            return order;
        }

        return orderRepository.save(withStatus(order, OrderStatus.CANCELLED));
    }

    public Order fillOrder(UUID id) {
        Order order = getOrderById(id);

        if (order.status() == OrderStatus.CANCELLED) {
            throw new IllegalStateException("Cancelled orders cannot be filled");
        }
        if (order.status() == OrderStatus.FILLED) {
            return order;
        }

        return orderRepository.save(withStatus(order, OrderStatus.FILLED));
    }

    public OrderSummaryResponse getSummary() {
        List<Order> orders = orderRepository.findAll();

        int openOrders = (int) orders.stream().filter(order -> order.status() == OrderStatus.NEW).count();
        int cancelledOrders = (int) orders.stream().filter(order -> order.status() == OrderStatus.CANCELLED).count();
        int filledOrders = (int) orders.stream().filter(order -> order.status() == OrderStatus.FILLED).count();

        BigDecimal openNotional = orders.stream()
                .filter(order -> order.status() == OrderStatus.NEW)
                .map(order -> order.price().multiply(BigDecimal.valueOf(order.quantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new OrderSummaryResponse(
                orders.size(),
                openOrders,
                cancelledOrders,
                filledOrders,
                openNotional
        );
    }

    private Order getOrderById(UUID id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + id));
    }

    private Order withStatus(Order order, OrderStatus status) {
        return new Order(
                order.id(),
                order.symbol(),
                order.side(),
                order.quantity(),
                order.price(),
                status,
                order.createdAt()
        );
    }
}
