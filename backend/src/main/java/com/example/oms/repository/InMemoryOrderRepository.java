package com.example.oms.repository;

import com.example.oms.model.Order;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryOrderRepository implements OrderRepository {

    private final ConcurrentHashMap<UUID, Order> orders = new ConcurrentHashMap<>();

    @Override
    public Order save(Order order) {
        orders.put(order.id(), order);
        return order;
    }

    @Override
    public List<Order> findAll() {
        return orders.values().stream()
                .sorted(Comparator.comparing(Order::createdAt).reversed())
                .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
    }

    @Override
    public Optional<Order> findById(UUID id) {
        return Optional.ofNullable(orders.get(id));
    }
}
