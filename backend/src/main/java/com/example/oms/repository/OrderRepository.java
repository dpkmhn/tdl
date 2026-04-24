package com.example.oms.repository;

import com.example.oms.model.Order;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository {
    Order save(Order order);

    List<Order> findAll();

    Optional<Order> findById(UUID id);
}
