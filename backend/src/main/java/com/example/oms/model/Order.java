package com.example.oms.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record Order(
        UUID id,
        String symbol,
        OrderSide side,
        int quantity,
        BigDecimal price,
        OrderStatus status,
        Instant createdAt
) {
}
